import test from 'node:test'
import assert from 'node:assert/strict'
import {
  CATALOG,
  DEFAULT_MODEL_IDS,
  describeCatalog,
  normalizeModelIds,
  toProviderModels,
} from '../lib/catalog.js'

test('normalizeModelIds keeps known ids in catalog order and de-duplicates', () => {
  const ids = normalizeModelIds(['kimi-k3', 'qwen3.8-flash', 'kimi-k3', 'nope'])
  assert.deepEqual(ids, ['qwen3.8-flash', 'kimi-k3'])
})

test('normalizeModelIds falls back to defaults when nothing is selected', () => {
  assert.deepEqual(normalizeModelIds([]), DEFAULT_MODEL_IDS)
  assert.deepEqual(normalizeModelIds(undefined), DEFAULT_MODEL_IDS)
})

test('normalizeModelIds can keep models discovered from MoArk', () => {
  const ids = normalizeModelIds(['brand-new-model', 'qwen3.8-flash', 'brand-new-model'], {
    allowUnknown: true,
  })
  assert.deepEqual(ids, ['brand-new-model', 'qwen3.8-flash'])
})

test('toProviderModels names unknown ids by their id when allowed', () => {
  const models = toProviderModels(['brand-new-model'], { allowUnknown: true })
  assert.deepEqual(models, [{ id: 'brand-new-model', name: 'brand-new-model' }])
})

test('toProviderModels carries id, name and only known modalities', () => {
  const models = toProviderModels(['qwen3.8-flash', 'Qwen3-VL-32B-Thinking'])
  assert.equal(models.length, 2)
  assert.equal(models[0].id, 'qwen3.8-flash')
  assert.equal(models[0].input, undefined)
  assert.deepEqual(models[1].input, ['text', 'image'])
})

test('toProviderModels applies details edited in the settings page', () => {
  const models = toProviderModels(['qwen3.8-flash'], {
    details: {
      'qwen3.8-flash': {
        name: 'My Qwen',
        input: ['text', 'image'],
        contextWindow: 1048576,
        maxTokens: 131072,
      },
    },
  })
  assert.deepEqual(models, [
    {
      id: 'qwen3.8-flash',
      name: 'My Qwen',
      input: ['text', 'image'],
      contextWindow: 1048576,
      maxTokens: 131072,
    },
  ])
})

test('catalog entries are unique and have stable names', () => {
  const ids = CATALOG.map((model) => model.id)
  assert.equal(new Set(ids).size, ids.length)
  for (const model of CATALOG) {
    assert.equal(typeof model.name, 'string')
    assert.ok(model.name.length > 0)
  }
})

test('describeCatalog defaults input to text and exposes notes', () => {
  const described = describeCatalog()
  const flash = described.find((model) => model.id === 'qwen3.8-flash')
  assert.deepEqual(flash.input, ['text'])
  const auto = described.find((model) => model.id === 'auto')
  assert.ok(auto.note.includes('组织'))
})
