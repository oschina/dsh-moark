import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildProviderRoute,
  extractError,
  mergeModelMetadata,
  mergeProviderRoute,
  mergeProviders,
  normalizeBaseURL,
  removeProvider,
  routeEquals,
} from '../lib/provider-config.js'

test('normalizeBaseURL trims trailing slashes and rejects invalid values', () => {
  assert.equal(normalizeBaseURL('https://api.moark.com/v1/'), 'https://api.moark.com/v1')
  assert.throws(() => normalizeBaseURL(''), /不能为空/)
  assert.throws(() => normalizeBaseURL('api.moark.com'), /合法 URL/)
  assert.throws(() => normalizeBaseURL('ftp://api.moark.com'), /http/)
})

test('buildProviderRoute emits an openai-completions route', () => {
  const route = buildProviderRoute({
    baseURL: 'https://api.moark.com/v1',
    apiKeyEnv: 'MOARK_API_KEY',
    models: [
      { id: 'qwen3.8-flash', name: 'Qwen3.8 Flash' },
      { id: 'Qwen3-VL-32B-Thinking', name: 'Qwen3-VL', input: ['text', 'image'] },
    ],
  })
  assert.equal(route.api, 'openai-completions')
  assert.equal(route.apiKeyEnv, 'MOARK_API_KEY')
  assert.equal(route.baseURL, 'https://api.moark.com/v1')
  assert.equal(route.models.length, 2)
  assert.deepEqual(route.models[1].input, ['text', 'image'])
})

test('buildProviderRoute rejects an empty model list', () => {
  assert.throws(
    () =>
      buildProviderRoute({
        baseURL: 'https://api.moark.com/v1',
        apiKeyEnv: 'MOARK_API_KEY',
        models: [],
      }),
    /至少需要一个模型/,
  )
})

test('mergeProviders preserves unrelated providers', () => {
  const current = { magpie: { displayName: 'Magpie' }, openrouter: { displayName: 'OpenRouter' } }
  const merged = mergeProviders(current, 'moark', { displayName: 'MoArk' })
  assert.deepEqual(Object.keys(merged).sort(), ['magpie', 'moark', 'openrouter'])
  assert.deepEqual(merged.magpie, current.magpie)
})

test('removeProvider only removes the target provider', () => {
  const next = removeProvider({ a: 1, b: 2 }, 'a')
  assert.deepEqual(next, { b: 2 })
})

test('mergeModelMetadata preserves native-editor metadata the page omitted', () => {
  const previous = {
    models: [
      {
        id: 'qwen3.8-flash',
        name: 'My Qwen',
        contextWindow: 1048576,
        maxTokens: 131072,
        input: ['text', 'image'],
        reasoningEfforts: { high: 'high' },
        compat: { thinkingFormat: 'deepseek' },
      },
    ],
  }
  const next = {
    models: [{ id: 'qwen3.8-flash', name: 'Qwen3.8 Flash' }, { id: 'kimi-k3', name: 'Kimi K3' }],
  }
  const merged = mergeModelMetadata(next, previous)
  const qwen = merged.models.find((model) => model.id === 'qwen3.8-flash')
  assert.equal(qwen.name, 'Qwen3.8 Flash')
  assert.equal(qwen.contextWindow, 1048576)
  assert.equal(qwen.maxTokens, 131072)
  assert.deepEqual(qwen.input, ['text', 'image'])
  assert.deepEqual(qwen.reasoningEfforts, { high: 'high' })
  assert.deepEqual(qwen.compat, { thinkingFormat: 'deepseek' })
  assert.deepEqual(merged.models.find((model) => model.id === 'kimi-k3'), {
    id: 'kimi-k3',
    name: 'Kimi K3',
  })
})

test('mergeModelMetadata lets explicit page edits win', () => {
  const previous = {
    models: [{ id: 'qwen3.8-flash', name: 'My Qwen', contextWindow: 1048576, maxTokens: 131072 }],
  }
  const next = {
    models: [{ id: 'qwen3.8-flash', name: 'Edited Here', contextWindow: 262144, maxTokens: 32768 }],
  }
  const merged = mergeModelMetadata(next, previous).models[0]
  assert.equal(merged.name, 'Edited Here')
  assert.equal(merged.contextWindow, 262144)
  assert.equal(merged.maxTokens, 32768)
})

test('mergeProviderRoute keeps native provider options but lets the plugin own the route', () => {
  const previous = {
    displayName: 'Edited MoArk',
    baseURL: 'https://old.example/v1',
    retryPolicy: { mode: 'normal', maxRetries: 3 },
    compat: { thinkingFormat: 'deepseek' },
    models: [{ id: 'qwen3.8-flash', name: 'My Qwen', contextWindow: 1048576 }],
  }
  const route = {
    displayName: '模力方舟 (MoArk)',
    api: 'openai-completions',
    baseURL: 'https://api.moark.com/v1',
    apiKeyEnv: 'MOARK_API_KEY',
    models: [{ id: 'qwen3.8-flash', name: 'Qwen3.8 Flash' }],
  }
  const merged = mergeProviderRoute(route, previous)
  assert.equal(merged.baseURL, 'https://api.moark.com/v1')
  assert.equal(merged.displayName, '模力方舟 (MoArk)')
  assert.deepEqual(merged.retryPolicy, { mode: 'normal', maxRetries: 3 })
  assert.deepEqual(merged.compat, { thinkingFormat: 'deepseek' })
  assert.equal(merged.models[0].name, 'Qwen3.8 Flash')
  assert.equal(merged.models[0].contextWindow, 1048576)
})

test('mergeModelMetadata leaves a first-time route unchanged', () => {
  const route = { models: [{ id: 'qwen3.8-flash', name: 'Qwen3.8 Flash' }] }
  assert.deepEqual(mergeModelMetadata(route, undefined), route)
})

test('routeEquals is key-order independent', () => {
  assert.equal(routeEquals({ a: 1, b: { c: 2, d: 3 } }, { b: { d: 3, c: 2 }, a: 1 }), true)
  assert.equal(routeEquals({ a: 1 }, { a: 2 }), false)
})

test('extractError understands both MoArk error shapes', () => {
  assert.equal(
    extractError(JSON.stringify({ error: { code: '400', message: '参数无效' } })),
    '参数无效',
  )
  assert.equal(extractError(JSON.stringify({ error: 400, message: '请求参数错误' })), '请求参数错误')
  assert.equal(extractError('<html><body>Resource not found</body></html>'), 'Resource not found')
})
