/**
 * Curated MoArk model catalog for the DSH provider.
 *
 * `GET /v1/models?include_details=true` supplies prices, interfaces and
 * descriptions, but not context windows or reasoning levels. This catalog is
 * deliberately conservative: unverified capacity fields are omitted so that
 * llm-pi-ai falls back to its route defaults (262,144 context / 32,768 output)
 * instead of sending wrong limits.
 */

export const PROVIDER_ID = 'moark'
export const DISPLAY_NAME = '模力方舟 (MoArk)'
export const DEFAULT_BASE_URL = 'https://api.moark.com/v1'
export const DEFAULT_API_KEY_ENV = 'MOARK_API_KEY'

/** Models pre-selected on first onboarding. */
export const DEFAULT_MODEL_IDS = [
  'qwen3.8-flash',
  'deepseek-v4.1-flash',
  'GLM-5.3-Flash',
  'kimi-k3',
  'Kimi-K2.7-Code',
]

/**
 * `input` is set only where the model is known to accept images; everything
 * else defaults to text. `note` is shown in the settings UI, not sent to the
 * provider.
 */
export const CATALOG = [
  { id: 'qwen3.8-flash', name: 'Qwen3.8 Flash', vendor: 'Qwen', recommended: true, note: '多模态模型，原生支持百万级上下文窗口' },
  { id: 'deepseek-v4.1-flash', name: 'DeepSeek V4.1 Flash', vendor: 'DeepSeek', recommended: true, note: '多模态模型，融合视觉理解、复杂推理与编程能力' },
  { id: 'GLM-5.3-Flash', name: 'GLM-5.3 Flash', vendor: 'Zhipu', recommended: true, note: '原生多模态模型' },
  { id: 'kimi-k3', name: 'Kimi K3', vendor: 'Moonshot', recommended: true, note: '多模态推理模型，支持视觉理解与 100 万 token 上下文' },
  { id: 'Kimi-K2.7-Code', name: 'Kimi K2.7 Code', vendor: 'Moonshot', recommended: true, note: '专注编码的代理模型，支持复杂软件工程任务' },
  { id: 'qwen3.8-max', name: 'Qwen3.8 Max', vendor: 'Qwen' },
  { id: 'DeepSeek-V4-Pro-0813', name: 'DeepSeek V4 Pro', vendor: 'DeepSeek' },
  { id: 'GLM-5.3', name: 'GLM-5.3', vendor: 'Zhipu' },
  { id: 'qwen3.8-27b', name: 'Qwen3.8 27B', vendor: 'Qwen' },
  { id: 'Step-3.7-Flash', name: 'Step 3.7 Flash', vendor: 'StepFun' },
  { id: 'Qwen3-VL-32B-Thinking', name: 'Qwen3-VL 32B Thinking', vendor: 'Qwen', input: ['text', 'image'] },
  { id: 'Qwen3.8-Omni-Flash', name: 'Qwen3.8 Omni Flash', vendor: 'Qwen', input: ['text', 'image'] },
  { id: 'auto', name: 'Auto（组织智能路由）', vendor: 'MoArk', note: '仅组织空间可用；个人空间请勿选择' },
]

const BY_ID = new Map(CATALOG.map((model) => [model.id, model]))

/**
 * Normalize a model-id selection.
 * - default: keep only known catalog ids, in catalog order (used for defaults);
 * - allowUnknown: keep any non-empty id in submission order (used when the
 *   user adopts models discovered from MoArk).
 */
export function normalizeModelIds(input, { allowUnknown = false } = {}) {
  const ids = (Array.isArray(input) ? input : [])
    .filter((value) => typeof value === 'string' && value.trim())
    .map((value) => value.trim())
  if (allowUnknown) {
    const seen = new Set()
    const kept = []
    for (const id of ids) {
      if (seen.has(id)) continue
      seen.add(id)
      kept.push(id)
    }
    return kept.length > 0 ? kept : DEFAULT_MODEL_IDS.slice()
  }
  const wanted = new Set(ids)
  const known = CATALOG.filter((model) => wanted.has(model.id)).map((model) => model.id)
  return known.length > 0 ? known : DEFAULT_MODEL_IDS.slice()
}

export function getCatalogModel(id) {
  return BY_ID.get(id)
}

/**
 * Project selected ids into the shape llm-pi-ai expects on a route.
 * Optional `details` (id -> { name, input, contextWindow, maxTokens })
 * carries values edited in the MoArk settings page itself.
 */
export function toProviderModels(ids, { allowUnknown = false, details } = {}) {
  return normalizeModelIds(ids, { allowUnknown })
    .map((id) => {
      const model = getCatalogModel(id) || (allowUnknown ? { id, name: id } : null)
      if (!model) return null
      const detail = details?.[id] && typeof details[id] === 'object' ? details[id] : undefined
      const entry = {
        id,
        name: typeof detail?.name === 'string' && detail.name.trim() ? detail.name.trim() : model.name,
      }
      const input = Array.isArray(detail?.input) && detail.input.length > 0 ? detail.input : model.input
      if (Array.isArray(input) && input.length > 0) entry.input = [...input]
      const contextWindow = Number(detail?.contextWindow)
      if (Number.isInteger(contextWindow) && contextWindow > 0) entry.contextWindow = contextWindow
      const maxTokens = Number(detail?.maxTokens)
      if (Number.isInteger(maxTokens) && maxTokens > 0) entry.maxTokens = maxTokens
      return entry
    })
    .filter(Boolean)
}

export function describeCatalog() {
  return CATALOG.map((model) => ({
    id: model.id,
    name: model.name,
    vendor: model.vendor,
    recommended: Boolean(model.recommended),
    input: Array.isArray(model.input) ? [...model.input] : ['text'],
    note: model.note ?? null,
  }))
}
