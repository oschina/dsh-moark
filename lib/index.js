/**
 * Host half of dsh-moark.
 *
 * P1 scope: provider onboarding. The plugin never rewrites the llm-pi-ai row
 * from a bundle patch; it edits the existing row through the Host's config
 * editor / settings services after the user explicitly asks for it.
 */

import {
  DEFAULT_API_KEY_ENV,
  DEFAULT_BASE_URL,
  DISPLAY_NAME,
  PROVIDER_ID,
  describeCatalog,
  normalizeModelIds,
  toProviderModels,
} from './catalog.js'
import {
  applyProviderRoute,
  buildProviderRoute,
  directChat,
  extractError,
  llmSelfTest,
  normalizeBaseURL,
  readProviderState,
  resolveLlmSettings,
  rollbackProviderRoute,
  waitForProvider,
} from './provider-config.js'

const JSON_LIMIT = 96 * 1024

// Wait for the web server before applying: on a cold boot the plugin may
// otherwise load before the service exists and silently register no routes.
export const inject = ['webServer']

export function apply(ctx, config = {}) {
  const state = {
    baseURL: normalizeBaseURLOr(config.baseURL, DEFAULT_BASE_URL),
    apiKeyEnv: typeof config.apiKeyEnv === 'string' && config.apiKeyEnv ? config.apiKeyEnv : DEFAULT_API_KEY_ENV,
    providerId: typeof config.providerId === 'string' && config.providerId ? config.providerId : PROVIDER_ID,
    modelIds: normalizeModelIds(config.models),
    snapshot: null,
  }

  const webServer = ctx.webServer ?? ctx.get?.('webServer')
  if (!webServer || typeof webServer.register !== 'function') {
    return
  }

  const routes = [
    ['/moark/api/status', () => status(ctx, state), 'GET'],
    ['/moark/api/test', (body) => testConnection(ctx, state, body), 'POST'],
    ['/moark/api/onboard', (body) => onboard(ctx, state, body), 'POST'],
    ['/moark/api/rollback', () => rollback(ctx, state), 'POST'],
    ['/moark/api/selftest', (body) => selftest(ctx, state, body), 'POST'],
    ['/moark/api/remote-models', () => remoteModels(ctx, state), 'GET'],
  ]

  // Own every route through ctx.effect: Cordis disposes the effect when the
  // plugin fiber unloads or hot-reloads, which is what prevents duplicate
  // route registration on HMR (a plain returned disposer is not enough).
  ctx.effect(() => {
    const disposers = routes.map(([path, run, method]) =>
      webServer.register({
        kind: 'exact',
        path,
        handler: (req, res) => {
          handleRoute(req, res, method, run).catch((error) => {
            sendJson(res, 500, { ok: false, error: messageOf(error) })
          })
        },
      }),
    )
    return () => {
      for (const dispose of disposers) {
        try {
          dispose()
        } catch {
          // ignore teardown errors
        }
      }
    }
  })
}

async function handleRoute(req, res, method, run) {
  if (!isLoopback(req)) {
    sendJson(res, 403, { ok: false, error: '只允许本机访问' })
    return
  }
  if (req.method !== method) {
    sendJson(res, 405, { ok: false, error: `只支持 ${method}` })
    return
  }
  let body = {}
  if (method === 'POST') {
    try {
      body = await readJson(req)
    } catch (error) {
      sendJson(res, 400, { ok: false, error: messageOf(error) })
      return
    }
  }
  const result = await run(body)
  sendJson(res, result?.ok === false ? 400 : 200, result)
}

function isLoopback(req) {
  const address = req.socket?.remoteAddress
  if (!address) return true
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1'
}

async function readJson(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > JSON_LIMIT) throw new Error('请求体过大')
    chunks.push(chunk)
  }
  const text = Buffer.concat(chunks).toString('utf8').trim()
  if (!text) return {}
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('请求体不是合法 JSON')
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('请求体必须是对象')
  return data
}

function sendJson(res, status, data) {
  const text = JSON.stringify(data)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  })
  res.end(text)
}

async function status(ctx, state) {
  const result = {
    ok: true,
    providerId: state.providerId,
    displayName: DISPLAY_NAME,
    baseURL: state.baseURL,
    apiKeyEnv: state.apiKeyEnv,
    catalog: describeCatalog(),
    defaultModelIds: state.modelIds,
    selectedModelIds: state.modelIds,
    credentialConfigured: false,
    providerRegistered: false,
    providerConfigured: false,
    configuredModelIds: [],
    settingsNs: null,
    settingsError: null,
    snapshotAvailable: Boolean(state.snapshot),
    snapshotModelIds: state.snapshot?.route?.models?.map((model) => model.id) ?? [],
    credentialSource: null,
    providers: [],
    models: [],
    defaultModel: null,
  }

  try {
    const credentials = ctx.get?.('credentials')
    if (credentials && typeof credentials.describe === 'function') {
      const info = await credentials.describe(state.apiKeyEnv)
      result.credentialConfigured = Boolean(info?.configured)
      result.credentialSource = info?.source ?? null
    }
  } catch (error) {
    result.credentialError = messageOf(error)
  }

  try {
    const llm = ctx.get?.('llm')
    if (llm && typeof llm.listProviders === 'function') {
      const providers = await Promise.resolve(llm.listProviders())
      result.providerRegistered = Array.isArray(providers)
        ? providers.some((provider) => provider?.id === state.providerId)
        : false
    }
  } catch (error) {
    result.providerError = messageOf(error)
  }

  try {
    const providerState = await readProviderState(ctx, state.providerId)
    const route = providerState.providers?.[state.providerId]
    if (route) {
      result.providerConfigured = true
      result.configuredModelIds = Array.isArray(route.models)
        ? route.models.map((model) => model?.id).filter(Boolean)
        : []
      result.configuredModels = Array.isArray(route.models)
        ? route.models.map((model) => ({
            id: model?.id,
            name: model?.name ?? model?.id,
            contextWindow: Number.isInteger(model?.contextWindow) ? model.contextWindow : null,
            maxTokens: Number.isInteger(model?.maxTokens) ? model.maxTokens : null,
            input: Array.isArray(model?.input) ? [...model.input] : null,
          }))
        : []
      if (Array.isArray(route.models) && route.models.length > 0) {
        result.selectedModelIds = route.models.map((model) => model?.id).filter(Boolean)
      }
      if (route.baseURL) result.baseURL = route.baseURL
    }
    result.settingsNs = providerState.ns ?? null
    result.providers = Object.keys(providerState.providers ?? {})
  } catch (error) {
    result.settingsError = messageOf(error)
  }

  try {
    const resolved = await resolveLlmSettings(ctx)
    result.settingsNs = result.settingsNs ?? resolved.ns
  } catch (error) {
    result.settingsError = result.settingsError ?? messageOf(error)
  }

  try {
    const llm = ctx.get?.('llm')
    if (llm && typeof llm.listModels === 'function' && result.providerRegistered) {
      const models = await Promise.resolve(llm.listModels(state.providerId))
      result.models = Array.isArray(models) ? models.map((model) => model?.id).filter(Boolean) : []
    }
  } catch (error) {
    result.modelsError = messageOf(error)
  }

  try {
    const defaultModel = ctx.get?.('agentDefaultModel')
    if (defaultModel && typeof defaultModel.currentSelection === 'function') {
      result.defaultModel = defaultModel.currentSelection()
    }
  } catch {
    // ignore
  }

  return result
}

async function testConnection(ctx, state, body) {
  const baseURL = normalizeBaseURL(body.baseURL || state.baseURL)
  const modelIds = normalizeModelIds(body.modelIds?.length ? body.modelIds : state.modelIds)
  const token = await resolveToken(ctx, state, body.token)
  if (!token) {
    return { ok: false, stage: 'credential', error: `未配置 ${state.apiKeyEnv}，请先填写访问令牌` }
  }
  try {
    const ping = await directChat({ baseURL, token, model: modelIds[0] })
    return { ok: true, stage: 'moark-http', baseURL, model: modelIds[0], ping }
  } catch (error) {
    return { ok: false, stage: 'moark-http', error: messageOf(error) }
  }
}

async function onboard(ctx, state, body) {
  const baseURL = normalizeBaseURL(body.baseURL || state.baseURL)
  const requestedModels = Array.isArray(body.models)
    ? body.models.filter((model) => model && typeof model.id === 'string' && model.id.trim())
    : []
  const requestedIds = requestedModels.length > 0
    ? requestedModels.map((model) => model.id)
    : body.modelIds?.length
      ? body.modelIds
      : state.modelIds
  const modelIds = normalizeModelIds(requestedIds, { allowUnknown: true })
  const modelDetails = Object.fromEntries(
    requestedModels.map((model) => [
      model.id.trim(),
      {
        name: typeof model.name === 'string' ? model.name : undefined,
        input: Array.isArray(model.input)
          ? model.input.filter((value) => value === 'text' || value === 'image')
          : undefined,
        contextWindow: Number.isInteger(model.contextWindow) ? model.contextWindow : undefined,
        maxTokens: Number.isInteger(model.maxTokens) ? model.maxTokens : undefined,
      },
    ]),
  )
  const token = typeof body.token === 'string' ? body.token.trim() : ''
  if (token.length > 512) return { ok: false, stage: 'token', error: '访问令牌过长' }

  const credentials = ctx.get?.('credentials')
  if (token) {
    if (!credentials || typeof credentials.set !== 'function') {
      return { ok: false, stage: 'credential', error: 'DSH credentials service 不可用' }
    }
    await credentials.set(state.apiKeyEnv, token)
  }

  const resolved = await resolveToken(ctx, state)
  if (!resolved) {
    return { ok: false, stage: 'credential', error: `未配置 ${state.apiKeyEnv}，请先填写访问令牌` }
  }

  const primaryModel = modelIds[0]
  let ping
  try {
    ping = await directChat({ baseURL, token: resolved, model: primaryModel })
  } catch (error) {
    return { ok: false, stage: 'moark-http', error: messageOf(error) }
  }

  const route = buildProviderRoute({
    providerId: state.providerId,
    displayName: DISPLAY_NAME,
    baseURL,
    apiKeyEnv: state.apiKeyEnv,
    models: toProviderModels(modelIds, { allowUnknown: true, details: modelDetails }),
  })

  let snapshot
  try {
    snapshot = await applyProviderRoute(ctx, { providerId: state.providerId, route })
    state.snapshot = snapshot
  } catch (error) {
    return { ok: false, stage: 'config', error: messageOf(error) }
  }

  const registered = await waitForProvider(ctx, state.providerId, 20000)
  if (!registered) {
    await safeRollback(ctx, state)
    return { ok: false, stage: 'register', error: 'provider 未在 DSH 中注册，已回滚' }
  }

  let selftestResult
  try {
    selftestResult = await llmSelfTest(ctx, { providerId: state.providerId, model: primaryModel })
  } catch (error) {
    await safeRollback(ctx, state)
    return { ok: false, stage: 'selftest', error: `provider 已写入但自测失败，已回滚：${messageOf(error)}` }
  }

  const requestedDefault =
    typeof body.defaultModelId === 'string' && modelIds.includes(body.defaultModelId)
      ? body.defaultModelId
      : ''
  const defaultToUse = requestedDefault || (body.setDefault ? primaryModel : '')
  let defaultSet = false
  let defaultError = null
  if (defaultToUse) {
    const defaultModel = ctx.get?.('agentDefaultModel')
    if (defaultModel && typeof defaultModel.saveSelection === 'function') {
      try {
        await defaultModel.saveSelection({ provider: state.providerId, model: defaultToUse })
        defaultSet = true
      } catch (error) {
        defaultError = messageOf(error)
      }
    } else {
      defaultError = 'agentDefaultModel service 不可用'
    }
  }

  state.baseURL = baseURL
  state.modelIds = modelIds

  return {
    ok: true,
    providerId: state.providerId,
    baseURL,
    apiKeyEnv: state.apiKeyEnv,
    modelIds,
    attempts: snapshot.attempts,
    ping,
    selftest: selftestResult,
    defaultSet,
    defaultModelId: defaultSet ? defaultToUse : null,
    defaultError,
  }
}

async function rollback(ctx, state) {
  if (!state.snapshot) return { ok: false, stage: 'rollback', error: '没有可回滚的快照' }
  try {
    const restored = await rollbackProviderRoute(ctx, state.snapshot)
    state.snapshot = null
    return { ok: true, restored }
  } catch (error) {
    return { ok: false, stage: 'rollback', error: messageOf(error) }
  }
}

async function remoteModels(ctx, state) {
  const token = await resolveToken(ctx, state)
  if (!token) {
    return { ok: false, stage: 'credential', error: `未配置 ${state.apiKeyEnv}，请先填写访问令牌` }
  }
  const baseURL = normalizeBaseURL(state.baseURL)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 45000)
  try {
    const response = await fetch(`${baseURL}/models?include_details=true`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
    const text = await response.text()
    if (!response.ok) return { ok: false, stage: 'moark-http', error: `MoArk ${response.status}: ${extractError(text)}` }
    let data
    try {
      data = JSON.parse(text)
    } catch {
      return { ok: false, stage: 'moark-http', error: 'MoArk 返回了非 JSON 模型列表' }
    }
    const models = (Array.isArray(data?.data) ? data.data : [])
      .map((model) => {
        const operations = Array.isArray(model?.operations) ? model.operations : []
        const chat = operations.find((operation) => operation?.type === 'text2text')
        return {
          id: model?.id,
          name: model?.id,
          description: typeof model?.description === 'string' ? model.description : '',
          avatar: typeof model?.avatar === 'string' ? model.avatar : '',
          vendor: typeof model?.owned_by === 'string' ? model.owned_by : '',
          chat: Boolean(chat),
          operationTypes: operations.map((operation) => operation?.type).filter(Boolean),
        }
      })
      .filter((model) => typeof model.id === 'string' && model.chat)
    return { ok: true, baseURL, count: models.length, models }
  } catch (error) {
    return { ok: false, stage: 'moark-http', error: messageOf(error) }
  } finally {
    clearTimeout(timer)
  }
}

async function selftest(ctx, state, body) {
  const model = typeof body.model === 'string' && body.model ? body.model : state.modelIds[0]
  try {
    const result = await llmSelfTest(ctx, { providerId: state.providerId, model })
    return { ok: true, model, selftest: result }
  } catch (error) {
    return { ok: false, stage: 'selftest', model, error: messageOf(error) }
  }
}

async function resolveToken(ctx, state, inlineToken) {
  if (typeof inlineToken === 'string' && inlineToken.trim()) return inlineToken.trim()
  const credentials = ctx.get?.('credentials')
  if (!credentials || typeof credentials.resolve !== 'function') return undefined
  try {
    const resolved = await credentials.resolve(state.apiKeyEnv)
    return resolved?.value || undefined
  } catch {
    return undefined
  }
}

async function safeRollback(ctx, state) {
  if (!state.snapshot) return
  try {
    await rollbackProviderRoute(ctx, state.snapshot)
  } catch {
    // keep the original failure visible
  }
  state.snapshot = null
}

function normalizeBaseURLOr(value, fallback) {
  try {
    return normalizeBaseURL(value || fallback)
  } catch {
    return fallback
  }
}

function messageOf(error) {
  if (error instanceof Error) return error.message
  return String(error ?? 'unknown error')
}
