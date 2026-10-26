/**
 * Provider-config writer for llm-pi-ai.
 *
 * A bundle patch must not overwrite the user's `llm-pi-ai` config (Cordis
 * replaces the whole config of a matching row, and a second llm-pi-ai instance
 * collides on the configurable-provider directory). So this module edits the
 * existing row instead, through the Host's config-editor / settings services,
 * and verifies the route before reporting success.
 */

export const LLM_PACKAGE = '@deepseek-ai/dsh-llm-pi-ai'

export function normalizeBaseURL(value) {
  const url = String(value ?? '').trim().replace(/\/+$/, '')
  if (!url) throw new Error('baseURL 不能为空')
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    throw new Error('baseURL 不是合法 URL')
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error('baseURL 必须以 http(s):// 开头')
  }
  return url
}

export function buildProviderRoute({ providerId = 'moark', displayName, baseURL, apiKeyEnv, models }) {
  if (!Array.isArray(models) || models.length === 0) {
    throw new Error('provider 至少需要一个模型')
  }
  return {
    displayName: displayName || '模力方舟 (MoArk)',
    api: 'openai-completions',
    baseURL: normalizeBaseURL(baseURL),
    apiKeyEnv,
    models: models.map((model) => {
      const entry = { id: model.id, name: model.name }
      if (Array.isArray(model.input) && model.input.length > 0) entry.input = [...model.input]
      if (Number.isInteger(model.contextWindow) && model.contextWindow > 0) {
        entry.contextWindow = model.contextWindow
      }
      if (Number.isInteger(model.maxTokens) && model.maxTokens > 0) entry.maxTokens = model.maxTokens
      if (model.reasoningEfforts && typeof model.reasoningEfforts === 'object') {
        entry.reasoningEfforts = { ...model.reasoningEfforts }
      }
      return entry
    }),
  }
}

export function mergeProviders(current, providerId, route) {
  return { ...(current && typeof current === 'object' ? current : {}), [providerId]: route }
}

/**
 * Preserve metadata the user tuned in DSH's native provider editor
 * (contextWindow, maxTokens, input modalities, reasoning, compat, display name)
 * when this plugin re-writes the model list. The native editor is the advanced
 * surface; this plugin only owns which model ids are included.
 */
export function mergeModelMetadata(route, previous) {
  if (!previous || !Array.isArray(previous.models)) return route
  const byId = new Map(previous.models.filter((model) => model?.id).map((model) => [model.id, model]))
  return {
    ...route,
    models: route.models.map((model) => {
      const prior = byId.get(model.id)
      if (!prior) return model
      const merged = { ...prior, ...model }
      if (!model.name && prior.name) merged.name = prior.name
      for (const field of ['contextWindow', 'maxTokens', 'input', 'reasoningEfforts', 'compat']) {
        if (model[field] === undefined && prior[field] !== undefined) merged[field] = prior[field]
      }
      return merged
    }),
  }
}

/**
 * Merge a freshly built route with the existing one: keep provider-level
 * options the native editor may have added (retryPolicy, request budgets,
 * provider compat, ...) and per-model metadata, while the plugin's selection,
 * endpoint and credential reference stay authoritative.
 */
export function mergeProviderRoute(route, previous) {
  if (!previous || typeof previous !== 'object') return route
  return mergeModelMetadata({ ...previous, ...route }, previous)
}

export function removeProvider(current, providerId) {
  const next = { ...(current && typeof current === 'object' ? current : {}) }
  delete next[providerId]
  return next
}

export function routeEquals(left, right) {
  return stableStringify(left) === stableStringify(right)
}

function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(',')}}`
}

function isLlmEntry(entry) {
  const name = entry?.options?.name ?? entry?.name
  const id = String(entry?.options?.id ?? entry?.id ?? '')
  return name === LLM_PACKAGE || id.includes('llm-pi-ai')
}

function findLlmEntry(configEditor) {
  if (!configEditor || typeof configEditor.entries !== 'function') return undefined
  try {
    return (configEditor.entries() || []).find(isLlmEntry)
  } catch {
    return undefined
  }
}

function findConfigItem(configEditor) {
  if (!configEditor || typeof configEditor.configuration !== 'function') return undefined
  try {
    return (configEditor.configuration() || []).find((item) => isLlmEntry(item?.entry))
  } catch {
    return undefined
  }
}

export async function resolveLlmSettings(ctx) {
  const settings = ctx.get?.('settings')
  if (!settings || typeof settings.describe !== 'function') {
    throw new Error('DSH settings service 不可用')
  }
  const descriptors = (await settings.describe({ redactSecrets: true })) || []
  let descriptor = descriptors.find((item) => /llm-pi-ai/i.test(String(item?.ns ?? '')))
  if (!descriptor) {
    descriptor = descriptors.find(
      (item) =>
        item?.value &&
        typeof item.value === 'object' &&
        item.value.providers &&
        typeof item.value.providers === 'object',
    )
  }
  if (!descriptor) throw new Error('找不到 llm-pi-ai 的配置项')
  return {
    settings,
    descriptor,
    ns: descriptor.ns,
    revision: descriptor.revision,
    value: descriptor.value && typeof descriptor.value === 'object' ? descriptor.value : {},
  }
}

/**
 * Read the raw (unredacted) providers dictionary and the entry that owns it.
 * configEditor.configuration() is preferred because llm-pi-ai marks its
 * providers as volatile and settings forms may omit them.
 */
export async function readProviderState(ctx, providerId) {
  const configEditor = ctx.get?.('configEditor')
  const item = findConfigItem(configEditor)
  if (item) {
    const providers = {
      ...(item.inherited && typeof item.inherited === 'object' ? item.inherited.providers : {}),
      ...(item.override && typeof item.override === 'object' ? item.override.providers : {}),
    }
    return {
      source: 'configEditor',
      entry: item.entry,
      inherited: item.inherited ?? {},
      override: item.override ?? {},
      providers: providers && typeof providers === 'object' ? providers : {},
      current: providers?.[providerId],
    }
  }
  const resolved = await resolveLlmSettings(ctx)
  const providers =
    resolved.value.providers && typeof resolved.value.providers === 'object'
      ? resolved.value.providers
      : {}
  return {
    source: 'settings',
    ns: resolved.ns,
    revision: resolved.revision,
    providers,
    current: providers[providerId],
  }
}

async function routeApplied(ctx, providerId, route) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const state = await readProviderState(ctx, providerId)
      if (routeEquals(state.providers?.[providerId], route)) return true
    } catch {
      // fall through and retry
    }
    await sleep(200)
  }
  return false
}

/**
 * Apply `route` under `providerId` while preserving every other provider.
 * Returns a snapshot that rollbackProviderRoute() can restore.
 */
export async function applyProviderRoute(ctx, { providerId, route }) {
  const beforeState = await readProviderState(ctx, providerId)
  const before = beforeState.providers?.[providerId] ?? null
  const nextRoute = mergeProviderRoute(route, before)
  const registeredBefore = await providerRegistered(ctx, providerId)
  const attempts = []
  let lastError

  const applied = async () =>
    (await routeApplied(ctx, providerId, nextRoute)) ||
    (!registeredBefore && (await waitForProvider(ctx, providerId, 3000)))

  const configEditor = ctx.get?.('configEditor')
  const entry = beforeState.entry ?? findLlmEntry(configEditor)
  if (entry && configEditor && typeof configEditor.edit === 'function') {
    try {
      await configEditor.edit(entry, (current = {}, inherited = {}) => {
        const base = { ...(inherited && typeof inherited === 'object' ? inherited : {}), ...(current && typeof current === 'object' ? current : {}) }
        return { ...base, providers: mergeProviders(base.providers, providerId, nextRoute) }
      })
      attempts.push('configEditor.edit')
    } catch (error) {
      lastError = error
    }
  }

  if (!(await applied())) {
    try {
      const { settings, ns, revision } = await resolveLlmSettings(ctx)
      await settings.mutate(
        ns,
        [{ op: 'set', path: ['providers', providerId], value: nextRoute }],
        revision,
      )
      attempts.push('settings.mutate')
    } catch (error) {
      lastError = error
    }
  }

  if (!(await applied())) {
    try {
      const { settings, ns, revision } = await resolveLlmSettings(ctx)
      const state = await readProviderState(ctx, providerId)
      await settings.update(
        ns,
        { providers: mergeProviders(state.providers, providerId, nextRoute) },
        revision,
      )
      attempts.push('settings.update')
    } catch (error) {
      lastError = error
    }
  }

  if (!(await applied())) {
    const reason = lastError instanceof Error ? lastError.message : '未知错误'
    throw new Error(`无法写入 llm-pi-ai provider 配置：${reason}`)
  }

  return { providerId, before, route: nextRoute, attempts }
}

export async function rollbackProviderRoute(ctx, snapshot) {
  if (!snapshot) throw new Error('没有可回滚的快照')
  const { providerId, before } = snapshot
  const configEditor = ctx.get?.('configEditor')
  let entry = findLlmEntry(configEditor)
  let lastError

  if (entry && configEditor && typeof configEditor.edit === 'function') {
    try {
      await configEditor.edit(entry, (current = {}, inherited = {}) => {
        const base = { ...(inherited && typeof inherited === 'object' ? inherited : {}), ...(current && typeof current === 'object' ? current : {}) }
        const providers = { ...(base.providers && typeof base.providers === 'object' ? base.providers : {}) }
        if (before === null || before === undefined) delete providers[providerId]
        else providers[providerId] = before
        return { ...base, providers }
      })
    } catch (error) {
      lastError = error
    }
  }

  if (!(await rollbackApplied(ctx, providerId, before))) {
    try {
      const { settings, ns, revision } = await resolveLlmSettings(ctx)
      if (before === null || before === undefined) {
        await settings.mutate(ns, [{ op: 'unset', path: ['providers', providerId] }], revision)
      } else {
        await settings.mutate(
          ns,
          [{ op: 'set', path: ['providers', providerId], value: before }],
          revision,
        )
      }
    } catch (error) {
      lastError = error
    }
  }

  if (!(await rollbackApplied(ctx, providerId, before))) {
    const reason = lastError instanceof Error ? lastError.message : '未知错误'
    throw new Error(`回滚失败：${reason}`)
  }
  return { providerId, restored: before ?? null }
}

async function rollbackApplied(ctx, providerId, before) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const state = await readProviderState(ctx, providerId)
      const current = state.providers?.[providerId]
      if (before === null || before === undefined) {
        if (current === undefined) return true
      } else if (routeEquals(current, before)) {
        return true
      }
    } catch {
      // retry
    }
    await sleep(200)
  }
  return false
}

async function providerRegistered(ctx, providerId) {
  const llm = ctx.get?.('llm')
  if (!llm || typeof llm.listProviders !== 'function') return false
  try {
    const providers = await Promise.resolve(llm.listProviders())
    return Array.isArray(providers) && providers.some((provider) => provider?.id === providerId)
  } catch {
    return false
  }
}

export async function waitForProvider(ctx, providerId, timeoutMs = 15000) {
  const llm = ctx.get?.('llm')
  if (!llm || typeof llm.listProviders !== 'function') return false
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const providers = await Promise.resolve(llm.listProviders())
      if (Array.isArray(providers) && providers.some((provider) => provider?.id === providerId)) {
        return true
      }
    } catch {
      // retry
    }
    await sleep(300)
  }
  return false
}

/**
 * Call the model through DSH's own LLM service, which exercises the real
 * provider route, adapter, credential seam, streaming and tool pipeline.
 */
export async function llmSelfTest(ctx, { providerId, model, prompt = '只回复 OK', timeoutMs = 60000 }) {
  const llm = ctx.get?.('llm')
  if (!llm || typeof llm.stream !== 'function') throw new Error('DSH llm service 不可用')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  let text = ''
  let reasoning = ''
  let finish = null
  let failure = null
  try {
    const stream = llm.stream({
      provider: providerId,
      model,
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
      maxTokens: 256,
      signal: controller.signal,
    })
    for await (const chunk of stream) {
      if (chunk?.type === 'text-delta') text += chunk.text
      else if (chunk?.type === 'reasoning-delta') reasoning += chunk.text
      else if (chunk?.type === 'finish') {
        finish = chunk.reason?.kind ?? null
        if (chunk.reason?.kind === 'error') failure = chunk.reason.failure ?? null
      }
    }
  } finally {
    clearTimeout(timer)
  }
  if (failure) {
    const reason = failure.message || failure.code || 'provider 调用失败'
    throw new Error(reason)
  }
  if (!text && !reasoning) throw new Error('provider 返回为空')
  return { providerId, model, text, reasoning, finish }
}

/** Direct MoArk HTTP ping used to validate a token before writing config. */
export async function directChat({ baseURL, token, model, timeoutMs = 45000 }) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`${normalizeBaseURL(baseURL)}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: '只回复 OK' }],
        max_tokens: 8,
        stream: false,
      }),
      signal: controller.signal,
    })
    const body = await response.text()
    if (!response.ok) {
      throw new Error(`MoArk ${response.status}: ${extractError(body)}`)
    }
    let data = {}
    try {
      data = JSON.parse(body)
    } catch {
      // keep empty
    }
    return {
      model: data?.model ?? model,
      content: data?.choices?.[0]?.message?.content ?? '',
      usage: data?.usage ?? null,
    }
  } finally {
    clearTimeout(timer)
  }
}

export function extractError(body) {
  const text = String(body ?? '').trim()
  if (!text) return 'empty response'
  try {
    const data = JSON.parse(text)
    const error = data?.error
    if (error && typeof error === 'object') return String(error.message || error.code || text).slice(0, 300)
    if (typeof error === 'string') return error.slice(0, 300)
    if (typeof data?.message === 'string') return data.message.slice(0, 300)
  } catch {
    // plain text
  }
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300)
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
