/**
 * Client half of dsh-moark: a Provider onboarding page inside Settings.
 *
 * Plain browser module (no JSX): the loader provides React and the slot
 * registry. UI text goes through the Client locale service; styling uses only
 * theme tokens so light/dark and other themes keep working.
 */

const DICTS = {
  zh: {
    title: '模力方舟 · MoArk',
    desc: '把模力方舟接入为 DSH 模型提供商；填写令牌并选择模型即可使用。',
    baseURL: 'API 地址',
    token: '访问令牌',
    tokenPlaceholder: '粘贴 MoArk 访问令牌（只在 Host 内保存）',
    tokenConfigured: '已配置令牌；留空则沿用现有令牌',
    models: '模型',
    modelsHint: '默认勾选常用模型；MoArk 新增的模型可稍后补充。',
    nativeEditorHint: '展开模型行可编辑上下文、最大输出与输入类型；留空使用 llm-pi-ai 默认值。',
    modelId: '模型 ID',
    displayName: '显示名称',
    contextWindow: '上下文窗口',
    maxOutput: '最大输出 token',
    inputTypes: '输入类型',
    inputText: '文本',
    inputImage: '图片',
    editModel: '编辑模型',
    viewCards: '卡片视图',
    viewList: '列表视图',
    addModel: '添加模型',
    addModelTitle: '手动添加模型',
    addModelHint: '填写模型 ID；显示名称可选，留空则与 ID 相同。保存后可继续编辑上下文和输入类型。',
    customModelPlaceholder: '例如 qwen3.8-flash',
    customModelNamePlaceholder: '留空则与模型 ID 相同',
    modelAdded: '已添加模型',
    defaultModel: '设为默认首选',
    capVision: '多模态',
    capContext: '上下文',
    capOutput: '输出',
    capReasoning: '推理',
    capCode: '代码',
    capTools: '工具',
    defaultModelTitle: '设为默认首选（只影响新会话）',
    selectModel: '选择模型',
    copyModelId: '复制模型 ID',
    copied: '已复制模型 ID',
    copyFailed: '复制失败',
    test: '测试连接',
    fetchModels: '从 MoArk 获取模型',
    fetchModelsShort: '获取模型',
    fetching: '正在获取模型…',
    fetched: '已从 MoArk 获取模型',
    fetchedCount: '已从 MoArk 获取 {count} 个对话模型',
    fetchFailed: '获取模型失败',
    searchModels: '搜索模型',
    noResults: '没有匹配的模型',
    vision: '视觉',
    connectionTitle: '连接设置',
    connectionHint: '选择服务区域并填写访问令牌',
    region: '服务区域',
    regionCN: '国内',
    regionIntl: '海外',
    regionCustom: '自定义',
    regionHint: '国内 api.moark.com / 海外 api.moark.ai；切换区域后建议重新获取模型',
    cancel: '取消',
    configuredClick: '已配置，点击修改',
    modelsSection: '模型',
    selected: '已选',
    items: '个',
    statusDetails: '状态详情',
    statusDetailsSub: '配置、回滚快照与错误信息',
    onboard: '接入 / 更新',
    rollback: '回滚',
    selftest: '运行自测',
    status: '状态',
    credential: '访问令牌',
    credentialYes: '已配置',
    credentialNo: '未配置',
    providerConfigured: '模型提供商',
    providerRegistered: '运行时',
    settingsNs: '配置项',
    snapshot: '可回滚快照',
    yes: '有',
    no: '无',
    configured: '已接入',
    notConfigured: '未接入',
    registered: '已生效',
    notRegistered: '未生效',
    ok: '成功',
    failed: '失败',
    testing: '正在测试 MoArk 连接…',
    onboarding: '正在写入并验证 provider…',
    rollingBack: '正在回滚…',
    selftesting: '正在通过 DSH LLM 路由自测…',
    onboarded: '接入成功，已写入 provider 并通过自测。',
    autoOnboarded: '已自动接入默认模型，可在模型区调整或回滚。',
    testOk: '连接正常。',
    rollbackOk: '已回滚到接入前的配置。',
    selftestOk: '自测通过。',
    noModels: '至少选择一个模型。',
    noToken: '请填写访问令牌，或先配置 MOARK_API_KEY。',
    loadFailed: '读取状态失败',
    requestFailed: '请求失败',
  },
  en: {
    title: 'MoArk Provider',
    desc: 'Connect MoArk as a DSH model provider. Add a token and pick models to get started.',
    baseURL: 'API base URL',
    token: 'Access token',
    tokenPlaceholder: 'Paste a MoArk access token (stored in the Host only)',
    tokenConfigured: 'Token already configured; leave blank to keep it',
    models: 'Models',
    modelsHint: 'Common models are pre-selected. Add more later if needed.',
    nativeEditorHint: 'Expand a row to edit context, output limit and input modalities; leave blank to use llm-pi-ai defaults.',
    modelId: 'Model ID',
    displayName: 'Display name',
    contextWindow: 'Context window',
    maxOutput: 'Max output tokens',
    inputTypes: 'Input types',
    inputText: 'Text',
    inputImage: 'Image',
    editModel: 'Edit model',
    viewCards: 'Card view',
    viewList: 'List view',
    addModel: 'Add model',
    addModelTitle: 'Add a model manually',
    addModelHint: 'Enter the model id; the display name is optional and defaults to the id. Context and input modalities can be edited afterwards.',
    customModelPlaceholder: 'e.g. qwen3.8-flash',
    customModelNamePlaceholder: 'Defaults to the model id',
    modelAdded: 'Model added',
    defaultModel: 'Set as default',
    capVision: 'Multimodal',
    capContext: 'Context',
    capOutput: 'Output',
    capReasoning: 'Reasoning',
    capCode: 'Code',
    capTools: 'Tools',
    defaultModelTitle: 'Set as the preferred default (new sessions only)',
    selectModel: 'Select model',
    copyModelId: 'Copy model ID',
    copied: 'Model ID copied',
    copyFailed: 'Copy failed',
    test: 'Test connection',
    fetchModels: 'Fetch models from MoArk',
    fetchModelsShort: 'Fetch',
    fetching: 'Fetching models…',
    fetched: 'Fetched models from MoArk',
    fetchedCount: 'Fetched {count} chat models from MoArk',
    fetchFailed: 'Failed to fetch models',
    searchModels: 'Search models',
    noResults: 'No matching models',
    vision: 'vision',
    connectionTitle: 'Connection',
    connectionHint: 'Choose a region and enter an access token',
    region: 'Region',
    regionCN: 'China',
    regionIntl: 'International',
    regionCustom: 'Custom',
    regionHint: 'China: api.moark.com / International: api.moark.ai; re-fetch models after switching',
    cancel: 'Cancel',
    configuredClick: 'Configured · click to edit',
    modelsSection: 'Models',
    selected: 'Selected',
    items: 'items',
    statusDetails: 'Status details',
    statusDetailsSub: 'Configuration, snapshot and errors',
    onboard: 'Connect / update',
    rollback: 'Roll back',
    selftest: 'Run self-test',
    status: 'Status',
    credential: 'Access token',
    credentialYes: 'Configured',
    credentialNo: 'Not configured',
    providerConfigured: 'Model provider',
    providerRegistered: 'Runtime',
    settingsNs: 'Settings entry',
    snapshot: 'Rollback snapshot',
    yes: 'Yes',
    no: 'No',
    configured: 'Connected',
    notConfigured: 'Not connected',
    registered: 'Active',
    notRegistered: 'Not active',
    ok: 'Success',
    failed: 'Failed',
    testing: 'Testing the MoArk endpoint…',
    onboarding: 'Writing and verifying the provider…',
    rollingBack: 'Rolling back…',
    selftesting: 'Self-testing through the DSH LLM route…',
    onboarded: 'Provider written and self-test passed.',
    autoOnboarded: 'Default models auto-connected; adjust or roll back anytime.',
    testOk: 'Connection OK.',
    rollbackOk: 'Restored the pre-onboarding configuration.',
    selftestOk: 'Self-test passed.',
    noModels: 'Select at least one model.',
    noToken: 'Enter an access token, or configure MOARK_API_KEY first.',
    loadFailed: 'Failed to read status',
    requestFailed: 'Request failed',
  },
}

const MOARK_MARK_PATH = 'M25.132 24.3946C25.497 25.7526 25.8984 27.1412 26.3334 28.5833C26.7302 29.8991 25.5459 30.4166 25.0752 29.1757C24.571 27.8465 24.0885 26.5229 23.6347 25.1728C21.065 26.4653 18.5025 27.5423 15.5961 28.754C16.7581 33.0255 17.8309 36.5983 19.4952 39.9934C19.4953 39.9935 19.4953 39.9936 19.4954 39.9937C19.6631 39.9978 19.8313 39.9999 20 39.9999C31.0457 39.9999 40 31.0456 40 19.9999C40 16.0334 38.8453 12.3365 36.8537 9.22719C31.6585 9.69524 27.0513 10.4561 22.8185 11.4059C22.8882 12.2519 22.9677 13.0738 23.0555 13.8549C23.3824 16.7603 23.9112 19.528 24.6137 22.3835C27.0581 21.2847 29.084 20.3224 30.6816 19.5219C32.2154 18.7534 33.6943 18.7061 31.2018 20.6593C29.0388 22.1601 27.0644 23.3565 25.132 24.3946ZM36.1559 8.20836C33.0001 3.89175 28.1561 0.887364 22.5955 0.166785C22.4257 2.86224 22.4785 6.26334 22.681 9.50437C26.7473 8.8885 31.1721 8.46022 36.1559 8.20836ZM19.9369 0C19.7594 2.92684 19.8384 6.65653 20.19 9.91284C17.3748 10.4108 14.7225 11.0063 12.1592 11.7037C12.0486 10.4256 11.9927 9.25754 11.9927 8.24168C11.9927 7.5053 11.3957 6.90835 10.6593 6.90835C9.92296 6.90835 9.32601 7.5053 9.32601 8.24168C9.32601 9.47859 9.42873 10.8979 9.61402 12.4379C8.33567 12.8277 7.07397 13.2442 5.81918 13.6879C5.12493 13.9335 4.76118 14.6953 5.0067 15.3895C5.25223 16.0838 6.01406 16.4475 6.7083 16.202C7.7931 15.8184 8.88482 15.4387 9.98927 15.0658C10.5222 18.3343 11.3344 21.9427 12.2703 25.4155C12.4336 26.0217 12.6062 26.6261 12.7863 27.2262C9.34168 28.4134 5.82612 29.3781 2.61128 29.8878C0.949407 26.9715 0 23.5966 0 19.9999C0 8.97524 8.92023 0.0340134 19.9369 0ZM4.19152 32.2526C7.45069 36.4515 12.3458 39.3172 17.9204 39.8931C16.5916 37.4549 14.9338 33.7169 13.5405 29.59C10.4404 30.7761 7.25883 31.6026 4.19152 32.2526ZM22.9735 23.1134C22.1479 20.4099 21.4462 17.544 20.9225 14.2769C20.746 13.584 20.5918 12.8034 20.4593 11.9635C17.6508 12.6605 14.9992 13.4371 12.4356 14.2597C12.8479 17.4765 13.5448 21.1333 14.5118 24.7217C14.662 25.2791 14.8081 25.8247 14.9514 26.3593L14.9516 26.3602L14.9524 26.3633L14.9526 26.3638L14.973 26.44C16.1833 25.9871 17.3746 25.5122 18.53 25.0258C20.1235 24.3551 21.6051 23.7164 22.9735 23.1134Z'
const MOARK_NAV_PATH = 'M25.132 24.3947C25.497 25.7527 25.8984 27.1413 26.3334 28.5834C26.7302 29.8992 25.5459 30.4167 25.0752 29.1758C24.571 27.8466 24.0885 26.523 23.6347 25.1729C21.065 26.4654 18.5025 27.5424 15.5961 28.7541C16.7581 33.0256 17.8309 36.5984 19.4952 39.9935C19.4953 39.9936 19.4953 39.9937 19.4954 39.9938C19.6631 39.9979 19.8313 40 20 40C31.0457 40 40 31.0457 40 20C40 16.0335 38.8453 12.3366 36.8537 9.22729C31.6585 9.69534 27.0513 10.4562 22.8185 11.406C22.8882 12.252 22.9677 13.0739 23.0555 13.855C23.3824 16.7604 23.9112 19.5281 24.6137 22.3836C27.0581 21.2848 29.084 20.3225 30.6816 19.522C32.2154 18.7535 33.6943 18.7062 31.2018 20.6594C29.0388 22.1602 27.0644 23.3566 25.132 24.3947ZM36.1559 8.20846C33.0001 3.89184 28.1561 0.887462 22.5955 0.166882C22.4257 2.86234 22.4785 6.26344 22.681 9.50447C26.7473 8.88859 31.1721 8.46032 36.1559 8.20846ZM19.9369 9.73661e-05C19.7594 2.92694 19.8384 6.65663 20.19 9.91293C17.3748 10.4109 14.7225 11.0064 12.1592 11.7038C12.0486 10.4257 11.9927 9.25764 11.9927 8.24178C11.9927 7.5054 11.3957 6.90844 10.6593 6.90844C9.92296 6.90844 9.32601 7.5054 9.32601 8.24178C9.32601 9.47868 9.42873 10.898 9.61402 12.438C8.33567 12.8278 7.07397 13.2443 5.81918 13.688C5.12493 13.9336 4.76118 14.6954 5.0067 15.3896C5.25223 16.0839 6.01406 16.4476 6.7083 16.2021C7.7931 15.8185 8.88482 15.4388 9.98927 15.0659C10.5222 18.3344 11.3344 21.9428 12.2703 25.4156C12.4336 26.0218 12.6062 26.6262 12.7863 27.2263C9.34168 28.4135 5.82612 29.3782 2.61128 29.8879C0.949407 26.9716 0 23.5967 0 20C0 8.97534 8.92023 0.0341108 19.9369 9.73661e-05ZM4.19152 32.2527C7.45069 36.4516 12.3458 39.3173 17.9204 39.8932C16.5916 37.455 14.9338 33.717 13.5405 29.5901C10.4404 30.7762 7.25883 31.6027 4.19152 32.2527ZM22.9735 23.1135C22.1479 20.41 21.4462 17.5441 20.9225 14.277C20.746 13.5841 20.5918 12.8035 20.4593 11.9636C17.6508 12.6606 14.9992 13.4372 12.4356 14.2598C12.8479 17.4766 13.5448 21.1334 14.5118 24.7218C14.662 25.2792 14.8081 25.8248 14.9514 26.3594L14.9516 26.3603L14.9524 26.3634L14.9526 26.3639L14.973 26.4401C16.1833 25.9872 17.3746 25.5123 18.53 25.0259C20.1235 24.3552 21.6051 23.7165 22.9735 23.1135Z'

const MOARK_BASE_URL_CN = 'https://api.moark.com/v1'
const MOARK_BASE_URL_INTL = 'https://api.moark.ai/v1'

const PAGE_CSS = `
.moark-page { width: 100%; max-width: 940px; color: var(--dsw-alias-label-primary); }
.moark-heading { display: flex; align-items: center; gap: 10px; margin: 0 0 8px; }
.moark-heading-mark { width: 26px; height: 26px; flex: 0 0 auto; }
.moark-title { font-size: 20px; font-weight: 600; line-height: 1.35; margin: 0; }
.moark-desc { color: var(--dsw-alias-label-secondary); font-size: 14px; line-height: 1.65; margin: 0 0 16px; }
.moark-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px 16px; margin: 0 0 16px; }
.moark-status { display: flex; flex-wrap: wrap; gap: 6px 16px; margin: 0; color: var(--dsw-alias-label-secondary); font-size: 13px; }
.moark-status-item { display: inline-flex; align-items: center; gap: 6px; }
.moark-status-label { color: var(--dsw-alias-label-secondary); }
.moark-status-value { color: var(--dsw-alias-label-secondary); }
.moark-status-value.ok { color: var(--dsw-alias-state-success-primary); }
.moark-status-value.warn { color: var(--dsw-alias-state-warn-primary); }
.moark-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--dsw-alias-state-idle-primary); flex: 0 0 auto; }
.moark-dot.ok { background: var(--dsw-alias-state-success-primary); }
.moark-dot.warn { background: var(--dsw-alias-state-warn-primary); }
.moark-actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 0; }
.moark-btn.small { height: 30px; padding: 0 12px; font-size: 12px; background: var(--dsw-alias-interactive-bg-hover); border-color: transparent; }
.moark-btn.small:hover:not(:disabled) { background: var(--dsw-alias-bg-layer-2); border-color: var(--dsw-alias-border-l1); }
.moark-btn { appearance: none; display: inline-flex; align-items: center; justify-content: center; height: 34px; padding: 0 16px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); font: inherit; font-size: 13px; font-weight: 500; line-height: 1; cursor: pointer; transition: background .15s ease, border-color .15s ease, opacity .15s ease, transform .1s ease; box-shadow: 0 1px 2px rgba(0, 0, 0, .04); }
.moark-btn:hover:not(:disabled):not(.primary) { background: var(--dsw-alias-interactive-bg-hover); border-color: var(--dsw-alias-border-l2); }
.moark-btn:active:not(:disabled) { transform: translateY(0.5px); }
.moark-btn:disabled { opacity: .45; cursor: default; }
.moark-btn.primary { background: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-label-primary); color: var(--dsw-alias-bg-base); font-weight: 500; }
.moark-btn.primary:hover:not(:disabled) { opacity: .88; }
.moark-sections { border-top: 1px solid var(--dsw-alias-border-l1); }
.moark-section { border-bottom: 1px solid var(--dsw-alias-border-l1); }
.moark-section-header { width: 100%; display: flex; align-items: flex-start; gap: 10px; padding: 16px 0; background: transparent; border: 0; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.moark-section-titles { display: flex; flex-direction: column; gap: 4px; flex: 1 1 auto; min-width: 0; }
.moark-section-title { font-size: 16px; font-weight: 600; line-height: 1.35; }
.moark-section-sub { font-size: 13px; color: var(--dsw-alias-label-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.moark-chevron { width: 16px; height: 16px; flex: 0 0 auto; margin-top: 3px; color: var(--dsw-alias-label-secondary); transition: transform .15s ease; }
.moark-section-header:hover .moark-chevron { color: var(--dsw-alias-label-primary); }
.moark-section-header:focus-visible, .moark-btn:focus-visible, .moark-input:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
.moark-section-body { padding: 6px 0 22px; }
.moark-models-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px 0 8px; }
.moark-models-heading { display: flex; align-items: center; justify-content: flex-start; gap: 8px; flex: 1 1 auto; min-width: 140px; padding: 0; }
.moark-models-heading .moark-section-title { font-size: 15px; }
.moark-models-bar .moark-search { flex: 0 1 240px; margin-left: auto; }
.moark-models-bar .moark-btn { flex: 0 0 auto; }
.moark-view-toggle { flex: 0 0 auto; display: inline-flex; gap: 2px; padding: 2px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 9px; background: var(--dsw-alias-bg-layer-1); }
.moark-view-btn { width: 28px; height: 26px; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 6px; background: transparent; color: var(--dsw-alias-label-secondary); cursor: pointer; }
.moark-view-btn:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.moark-view-btn.active { background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-primary); }
.moark-view-btn svg { width: 15px; height: 15px; }
.moark-models-count { flex: 0 0 auto; color: var(--dsw-alias-label-secondary); font-size: 12px; font-weight: 400; line-height: 1.6; }
.moark-field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 18px; }
.moark-label { font-size: 13px; font-weight: 500; }
.moark-input { width: 100%; box-sizing: border-box; height: 34px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); font: inherit; font-size: 13px; outline: none; transition: border-color .15s ease, box-shadow .15s ease; }
.moark-input::placeholder { color: var(--dsw-alias-label-secondary); opacity: .8; }
.moark-input:hover:not(:focus) { border-color: var(--dsw-alias-border-l2); background: var(--dsw-alias-interactive-bg-hover); }
.moark-input:focus { border-color: transparent; outline: 2px solid var(--dsw-alias-brand-primary); outline: 2px solid -webkit-focus-ring-color; outline-offset: 1px; }
.moark-segmented { display: flex; width: 100%; gap: 2px; padding: 2px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 9px; background: var(--dsw-alias-bg-layer-1); }
.moark-segment { flex: 1 1 0; min-width: 0; height: 32px; border: 1px solid transparent; border-radius: 7px; background: transparent; color: var(--dsw-alias-label-secondary); font-size: 13px; cursor: pointer; transition: background .15s ease, color .15s ease, border-color .15s ease; }
.moark-segment:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.moark-segment:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 1px; }
.moark-segment.active { background: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-label-primary); color: var(--dsw-alias-bg-base); font-weight: 500; }
.moark-segment.active:hover { background: var(--dsw-alias-label-primary); color: var(--dsw-alias-bg-base); }
.moark-input.readonly { color: var(--dsw-alias-label-secondary); }
.moark-hint { font-size: 13px; color: var(--dsw-alias-label-secondary); line-height: 1.6; }
.moark-model-toolbar { display: flex; align-items: center; gap: 10px; margin: 0 0 10px; }
.moark-search { position: relative; flex: 1 1 auto; min-width: 0; }
.moark-search .moark-input { height: 32px; padding: 0 10px 0 30px; font-size: 13px; }
.moark-search-icon { position: absolute; left: 9px; top: 50%; width: 14px; height: 14px; transform: translateY(-50%); color: var(--dsw-alias-label-secondary); pointer-events: none; }
.moark-models { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); width: 100%; align-items: start; gap: 12px; margin: 0 0 14px; }
.moark-models > * { min-width: 0; }
.moark-model { position: relative; display: flex; flex-direction: column; gap: 0; min-width: 0; padding: 0; border: .5px solid var(--dsw-alias-settings-card-stroke); border-radius: var(--dsw-radius-xl); background: var(--dsw-alias-settings-card-fill); transition: background .16s ease, border-color .16s ease; }
.moark-model-row { display: flex; align-items: center; gap: 10px; }
.moark-model-expand { width: 28px; height: 28px; flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 6px; background: transparent; color: var(--dsw-alias-label-secondary); cursor: pointer; }
.moark-model-expand:hover { background: transparent; color: var(--dsw-alias-label-primary); }
.moark-model-expand .moark-chevron { width: 14px; height: 14px; transform: rotate(90deg); }
.moark-model-expand[aria-expanded='true'] .moark-chevron { transform: rotate(-90deg); }
.moark-model-editor { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--dsw-alias-border-l1); }
.moark-model-editor .moark-field { margin: 0; }
.moark-model-editor-types { grid-column: 1 / -1; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.moark-model-editor-types .moark-label { margin-right: 4px; }
.moark-model-editor-types label { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; color: var(--dsw-alias-label-primary); }
.moark-editor-check { accent-color: var(--dsw-alias-label-primary); width: 14px; height: 14px; margin: 0; }
.moark-model-main { display: flex; align-items: center; gap: 10px; flex: 1 1 auto; min-width: 0; cursor: pointer; }
.moark-model-default { display: flex; align-items: center; gap: 5px; padding: 5px 6px; border-radius: 5px; font-size: 12px; color: var(--dsw-alias-label-tertiary); cursor: pointer; white-space: nowrap; transition: color .15s ease; }
.moark-model-default:hover { color: var(--dsw-alias-label-primary); }
.moark-model-default.active { color: var(--dsw-alias-label-primary); }
.moark-default-input { accent-color: var(--dsw-alias-label-primary); width: 14px; height: 14px; margin: 0; }
.moark-model-text { min-width: 0; }
.moark-model-name-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
.moark-model-name-row .moark-model-name { flex: 0 0 auto; }
.moark-model-tags.inline { flex-wrap: nowrap; gap: 6px; }
.moark-model-name { display: block; overflow: hidden; font-size: 14px; line-height: 1.4; color: var(--dsw-alias-label-primary); text-overflow: ellipsis; white-space: nowrap; }
.moark-model-meta { display: block; overflow: hidden; margin-top: 3px; font-size: 12px; color: var(--dsw-alias-label-secondary); text-overflow: ellipsis; white-space: nowrap; }
.moark-model { height: auto; overflow: hidden; }
.moark-model-head { display: flex; align-items: center; gap: 8px; padding: 12px 14px 6px; }
.moark-model-main { gap: 8px; }
.moark-model-id { flex: 0 1 auto; max-width: 42%; overflow: hidden; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; color: var(--dsw-alias-label-secondary); text-overflow: ellipsis; white-space: nowrap; }
.moark-model-body { flex: 0 0 auto; min-height: 0; padding: 0 14px 10px; }
.moark-model-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.moark-model-tag { display: inline-flex; align-items: center; height: 22px; padding: 0 8px; border: 0; border-radius: var(--dsw-radius-xs); background: var(--dsw-alias-bg-module-platform); color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 22px; }
.moark-model-note { display: -webkit-box; overflow: hidden; margin: 6px 0 0; color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 1.5; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
.moark-model-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 14px; border-top: 1px solid var(--dsw-alias-border-l1); }
.moark-model-expand { width: auto; height: 26px; padding: 0 6px; gap: 4px; font: inherit; font-size: 12px; }
.moark-model-expand .moark-chevron { margin-top: 0; }
.moark-model-editor { margin: 0; padding: 12px 14px; border-top: 1px solid var(--dsw-alias-border-l1); }
.moark-model:hover:not(.checked):not(.editing) { background: var(--dsw-alias-interactive-bg-hover); }
.moark-model.checked, .moark-model.editing { background: var(--dsw-alias-bg-module-platform); border-color: var(--dsw-static-neutral-bluish-400); }
.moark-model-head { align-items: center; min-height: 64px; gap: 10px; }
.moark-model-icon { width: 30px; height: 30px; flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; color: #FFFFFF; font-size: 12px; font-weight: 600; line-height: 1; }
.moark-model-ident { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 1px; }
.moark-model-id-row { display: flex; align-items: center; gap: 2px; min-width: 0; margin-top: 2px; }
.moark-model-id { flex: 0 1 auto; max-width: 100%; overflow: hidden; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; color: var(--dsw-alias-label-secondary); text-overflow: ellipsis; white-space: nowrap; }
.moark-copy { width: 24px; height: 24px; flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 5px; background: transparent; color: var(--dsw-alias-label-secondary); cursor: pointer; opacity: .8; }
.moark-copy:hover { background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); opacity: 1; }
.moark-model { cursor: pointer; }
.moark-model:focus-visible { outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary)); outline-offset: -2px; }
.moark-model-expand:focus-visible, .moark-copy:focus-visible, .moark-model-default input:focus-visible { outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary)); outline-offset: 0; }

.moark-models { gap: 12px; }
.moark-model-head { padding: 14px 16px 8px; }
.moark-model-icon { width: 36px; height: 36px; font-size: 13px; }
.moark-model-icon-img { width: 36px; height: 36px; flex: 0 0 auto; border-radius: 8px; background: transparent; object-fit: cover; }
.moark-model-name { font-size: 15px; font-weight: 600; }
.moark-model-id { font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.moark-model-body { padding: 0 16px 12px; }
.moark-model-tags { gap: 6px; }

.moark-model-note { margin-top: 8px; font-size: 13px; }
.moark-model-foot { padding: 6px 10px; border-top: .5px solid var(--dsw-alias-border-l2); }
.moark-model-default { font-size: 13px; }
.moark-model-expand { height: 28px; font-size: 13px; }
.moark-model-editor { padding: 16px; }
.moark-model { box-sizing: border-box; }
.moark-model:not(.editing) { height: 220px; min-height: 220px; }
.moark-model-body { flex: 1 1 auto; min-height: 0; overflow: hidden; }
.moark-model.editing .moark-model-body { flex: 0 0 auto; overflow: visible; }
.moark-models.list { grid-template-columns: 1fr; gap: 8px; }
.moark-models.list .moark-model { display: grid; grid-template-columns: max-content 170px; grid-template-areas: 'head foot'; align-items: center; justify-content: space-between; column-gap: 16px; padding: 9px 12px; height: auto; min-height: 0; }
.moark-models.list .moark-model-head { grid-area: head; min-height: 0; padding: 0; flex-wrap: nowrap; }
.moark-models.list .moark-model-ident { min-width: max-content; }
.moark-models.list .moark-model-name, .moark-models.list .moark-model-id { overflow: visible; text-overflow: clip; }
.moark-models.list .moark-model-body { grid-area: body; height: auto; min-height: 0; overflow: hidden; padding: 0; }
.moark-models.list .moark-model-note { display: none; }
.moark-models.list .moark-model-tags { flex-wrap: nowrap; overflow: hidden; }
.moark-models.list .moark-model-foot { grid-area: foot; width: 170px; display: flex; flex-direction: column; align-items: flex-end; justify-content: center; gap: 4px; border-top: 0; padding: 0; }
.moark-models.list .moark-model-default { justify-content: flex-end; padding: 2px 4px; font-size: 12px; }
.moark-models.list .moark-model-expand { height: 22px; padding: 2px 4px; font-size: 12px; }
.moark-models.list .moark-model-editor { grid-column: 1 / -1; grid-row: 2; border-top: 1px solid var(--dsw-alias-border-l1); padding: 12px 0; }
.moark-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); font-size: 14px; }
.moark-row:last-child { border-bottom: 0; }
.moark-row-value { color: var(--dsw-alias-label-secondary); text-align: right; word-break: break-all; }
.moark-modal-backdrop { position: fixed; inset: 0; z-index: 2147483000; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgba(0, 0, 0, .42); }
.moark-modal.small { width: min(420px, 100%); }
.moark-modal { width: min(520px, 100%); max-height: calc(100vh - 48px); overflow: auto; border: 1px solid var(--dsw-alias-border-l1); border-radius: 14px; background: var(--dsw-alias-bg-layer-2); box-shadow: 0 24px 64px rgba(0, 0, 0, .28); }
.moark-modal-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 18px 8px; }
.moark-modal-title { margin: 0; font-size: 16px; font-weight: 600; color: var(--dsw-alias-label-primary); }
.moark-modal-close { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 6px; background: transparent; color: var(--dsw-alias-label-secondary); cursor: pointer; }
.moark-modal-close:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.moark-modal-body { display: flex; flex-direction: column; gap: 12px; padding: 6px 18px 16px; }
.moark-modal-body .moark-field { margin: 0; }
.moark-modal-foot { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 18px 16px; border-top: 1px solid var(--dsw-alias-border-l1); }
.moark-toast { position: fixed; left: 50%; top: 24px; transform: translateX(-50%); z-index: 2147483000; display: flex; align-items: center; gap: 8px; max-width: min(560px, calc(100vw - 48px)); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-primary); font-size: 13px; line-height: 1.5; box-shadow: 0 8px 24px rgba(0, 0, 0, .18); pointer-events: none; animation: moark-toast-in .16s ease-out; }
.moark-toast-icon { width: 16px; height: 16px; flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; }
.moark-toast.ok .moark-toast-icon { color: var(--dsw-alias-state-success-primary); }
.moark-toast.error .moark-toast-icon { color: var(--dsw-alias-state-error-primary); }
.moark-toast-text { min-width: 0; }
@keyframes moark-toast-in { from { opacity: 0; transform: translate(-50%, -6px); } to { opacity: 1; transform: translate(-50%, 0); } }
@media (max-width: 720px) { .moark-actions { gap: 8px; } .moark-section-body { padding-left: 0; } .moark-models { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { .moark-chevron, .moark-btn, .moark-model, .moark-input { transition: none; } .moark-toast { animation: none; } }
`
function makeIcon(h, paths) {
  return (props) => h(
    'svg',
    {
      className: props?.className,
      viewBox: '0 0 24 24',
      width: 18,
      height: 18,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.5,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': true,
    },
    paths.map((d, index) => h('path', { key: index, d })),
  )
}

function makeTranslator(ctx) {
  const locale = ctx.get('locale')
  if (!locale || typeof locale.bind !== 'function') {
    return (key) => (DICTS.zh[key] ?? key)
  }
  try {
    if (typeof locale.register === 'function') {
      ctx.effect(() => locale.register('moark', 'zh', DICTS.zh))
      ctx.effect(() => locale.register('moark', 'en', DICTS.en))
    }
    const bound = locale.bind('moark')
    return (key) => {
      try {
        const value = bound(key)
        return value || DICTS.zh[key] || key
      } catch {
        return DICTS.zh[key] || key
      }
    }
  } catch {
    return (key) => (DICTS.zh[key] ?? key)
  }
}

async function requestJson(path, options) {
  const response = await fetch(path, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const text = await response.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(text.slice(0, 200) || `HTTP ${response.status}`)
  }
  if (!response.ok && data?.ok !== false) {
    throw new Error(data?.error || `HTTP ${response.status}`)
  }
  return data
}

const AUTO_CONNECT_KEY = 'moark:auto-connect:disabled'

function autoConnectDisabled() {
  try {
    return window.localStorage.getItem(AUTO_CONNECT_KEY) === '1'
  } catch {
    return false
  }
}

function setAutoConnectDisabled(disabled) {
  try {
    if (disabled) window.localStorage.setItem(AUTO_CONNECT_KEY, '1')
    else window.localStorage.removeItem(AUTO_CONNECT_KEY)
  } catch {
    // localStorage may be unavailable; auto-connect simply retries next time
  }
}

function installSettingsNavIcon(ctx, label) {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return () => {}
  const marker = 'data-dsh-moark-settings-nav'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path fill-rule="evenodd" clip-rule="evenodd" d="${MOARK_NAV_PATH}" fill="black"/></svg>`
  const mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  const css = `[${marker}] > svg:first-child { display: none; }
[${marker}]::before { content: ''; flex: none; width: 16px; height: 16px; background: currentColor; -webkit-mask: ${mask} center / contain no-repeat; mask: ${mask} center / contain no-repeat; }`

  let disposeStyle
  const stylesApi = ctx.get?.('styles') ?? (typeof styles !== 'undefined' ? styles : undefined)
  if (stylesApi && typeof stylesApi.insert === 'function') {
    disposeStyle = stylesApi.insert(css)
  } else {
    const style = document.createElement('style')
    style.setAttribute('data-dsh-moark-nav-style', '')
    style.textContent = css
    document.head.appendChild(style)
    disposeStyle = () => style.remove()
  }

  let disposed = false
  const sync = () => {
    if (disposed) return
    const current = label().trim()
    const buttons = document.querySelectorAll('[role="dialog"] nav button')
    for (const button of buttons) {
      if (current && button.textContent?.trim() === current) button.setAttribute(marker, '')
      else button.removeAttribute(marker)
    }
  }
  sync()
  const observer = new MutationObserver(sync)
  observer.observe(document.body, { childList: true, subtree: true, characterData: true })
  return () => {
    disposed = true
    observer.disconnect()
    document.querySelectorAll(`[${marker}]`).forEach((element) => element.removeAttribute(marker))
    disposeStyle?.()
  }
}

function useColorScheme(React, ctx) {
  const theme = ctx?.get?.('theme')
  const read = () => {
    try {
      return theme?.getTheme?.()?.active?.colorScheme === 'light' ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  }
  const [scheme, setScheme] = React.useState(read)
  React.useEffect(() => {
    if (!theme || typeof ctx?.on !== 'function') return undefined
    const update = () => setScheme(read())
    update()
    return ctx.on('theme/change', update)
  }, [ctx, theme])
  return scheme
}

const DEFAULT_AVATARS = {
  "qwen3.8-flash": "data:image/webp;base64,UklGRhQFAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSBACAAABkCv/f9pI/xljkzojL+92l3RLLb7AMdYLXdKmX/Lybp3xAxwu874CM3QMLgMrj6SDgKz/XB8REwCSraqWL+6vvZuMEMHV9sLo+9ZaCxSufNW//MAY56Ig54w9bg69rFFEa+zf8IXUp61U3A5PfzF2yoT05123QQuJJI8DESo9SkTDMLpm8yL07Nc2TVqk91IoedptSiIzvlD0aZJIcTwqlKWeI8FJU6EwTTtlEY8KpalHyjAnqVCczkRK0rqfhPJ+r1FK26lAeNlVQvSrQDlLimiJLI58Ui/UcCSQHscK2C7FEoxp/8R3BdrTpn9Sz3hYPwDUbAnE65UAL58w+a/AGhKo+63aTVzLVa2PuB5a3jNc7MsoNneB4+K/trHtXQnkNwG2jPjvZ7AFN9iu9jguvj2LbcFluNjoF2zvWx5wPbZWLeParLX6cQ1Z8MrH9PQSoHId01YNAPQzPM8pAICmUzy78X+0sQALde1/IHaM5agBCurJPI5sQisEZBbH1ygU77rEcNoGJRp9vnp+t1YKRGaoanTShNKJR9WiHoFynTRViaYdKN/xqDrUc0AmmfRV8WcIyDW7T9W47IuAbK3taza8/GyXASFGE0c0nOA4SSBcrcHdfZbHTsdiOoRux1Nbvhx/vb9JAzVrXg5tPTLGeSHOGXtY7n9VCQpbta3vRxe2rwIhMjd7v9wvLVUWSAZWUDgg3gIAALAOAJ0BKkAAQAA+kUCaSqWjoiGmFVuwsBIJbACvP4BNETfJ/BW7y+YDztPRTvLW84o27cRqgho3lJ7ExmIzr6mVBu12spqKI/2wiG7lYiKwyzeUIbLVbuvHim8B9GATdt9m/OR95JTCBkscqnNnf3oZUo3sbz3hUaeYXhECAAD+8n//+/J//ynz//hk5//aklqlZG/8fUxXpmfXLKTQ6zV/Ogf6VI/ZmC5ALk95tqY3T9jjaRCKyka/6Gv92syRomIVUkOtEtFAQzQLBVeJzvBAoleh8ev76AhgwVp+iBSAiZrZT/ex8mzDUom661Frri2A9MNWuqmEPIQfT429gIWCvtRBN2yhYsFP57lPmwgyFIX+pvesEgoC+tUaZJmQEO7cNaFQRlb4y3HrbpTxCD2Nfb/E9ohiVEkknMvgAH/12649/BooN9n9vUkJj+N/FG4zG78MNpnOojXLociDce2DtkylgmCX/+fPREWDsJ8I0tmEwDr9TxOtrXktsBVXgKYbmkRvAplo/5NBhz4H1IwiQAttxpc6zTrQYjeKjXSX1oTSTPhREPVxFGizzKrueEB1TlMJLcE4AlS180puufOUfW864TLupzIX8bQoyl9XEPhO7CiCS9Dq5dTKCZbs3rTRQTzECHjsMcMjooUom7NIFiNjQPvwXpoawzPlfi1RbPHb14gyLG9bjqFbhoAjxQ+IxyIrEd/sZZBhKt4HuGBWgLJyrbMwJPGwNSPqQ06sMttfvNiO9r9lE8ECWDnKs1G8Y/aYAGSMd13Z3b2etNP0gPqa98F5q6klT0u2u0dvwsWAbVQOdaJtonniJH4/+aED7+1qVmMl8dp50lXq5COaLkilJsJhfdA5q3Pqm/vEb16MrAC2fMumpNUi4XtMOY/Y1dM4DSxZdspEA21unYcqbjK45QEp+LbJBaF3h6/wFRu2VHYwiWTGzpLT6jPV6EANMT0F31m7jPo1a2AA",
  "deepseek-v4.1-flash": "data:image/webp;base64,UklGRroEAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSBACAAABkCv/f9pI/xljkzojL+92l3RLLb7AMdYLXdKmX/Lybp3xAxwu874CM3QMLgMrj6SDgKz/XB8REwCSraqWL+6vvZuMEMHV9sLo+9ZaCxSufNW//MAY56Ig54w9bg69rFFEa+zf8IXUp61U3A5PfzF2yoT05123QQuJJI8DESo9SkTDMLpm8yL07Nc2TVqk91IoedptSiIzvlD0aZJIcTwqlKWeI8FJU6EwTTtlEY8KpalHyjAnqVCczkRK0rqfhPJ+r1FK26lAeNlVQvSrQDlLimiJLI58Ui/UcCSQHscK2C7FEoxp/8R3BdrTpn9Sz3hYPwDUbAnE65UAL58w+a/AGhKo+63aTVzLVa2PuB5a3jNc7MsoNneB4+K/trHtXQnkNwG2jPjvZ7AFN9iu9jguvj2LbcFluNjoF2zvWx5wPbZWLeParLX6cQ1Z8MrH9PQSoHId01YNAPQzPM8pAICmUzy78X+0sQALde1/IHaM5agBCurJPI5sQisEZBbH1ygU77rEcNoGJRp9vnp+t1YKRGaoanTShNKJR9WiHoFynTRViaYdKN/xqDrUc0AmmfRV8WcIyDW7T9W47IuAbK3taza8/GyXASFGE0c0nOA4SSBcrcHdfZbHTsdiOoRux1Nbvhx/vb9JAzVrXg5tPTLGeSHOGXtY7n9VCQpbta3vRxe2rwIhMjd7v9wvLVUWSAZWUDgghAIAAHAOAJ0BKkAAQAA+kTyYSSWjIiEqGZugsBIJbAC3AXFXflL+O81mvt6XpN0itsp5nvPH6JLqQPQA8tr2SP3B/YBjArQZZeliaJM4RiYOUK+J5iz+rV7D31/xLjYvxFU+0UOmzEAl+IgfRVxEIRism+bTbjsVD8hXIRRvAAAA/vAJP/8XL/+HI//8MFn+Oz34ood3f8dv5zbiUhH+9oIfLZY3mkMsdVi9EXB1Q2DYkN2MhP8SiRh7hzRMn9335LtUWl8adsLvZ2Bducc/b0Om+NSAcGeQ7zDn1qaKX3Q+fbXt88HT9F1s99iGf+LxCrfklbzAXEEf/1NP2myiwzy8Ft9Y0wTKR8WUv8CGw9TJhpeISl/CpSPLxo3uw8f+rS7sUwC+atYtyHP2s4kWz+GRRykxERQeMy1QIO3hSkY0DOwXx6lrk2MOqxQHlh2Ly8R/lvsdREZQKZTQ81XL88mIkpfIxRPWB93R1OwGzJvtJ5Gl7F3wcG2z4d+4gKqDNA7FGO5/xwIrbtP5kXkQZPQb/5Wwyquc3VPYTkoevOH66dktOhVEV9dHtx9WF1jdkJ9MMYszVeZd75cmoks+U4h8MolN9zoVVt4lYeNMLRvJTg77lEZBY4AnXRdAx2A5TvXhP4vKNw2Fjg3LCAX+8yQR5C/udTEpp1/kbJdYuSPBiXKg9GYtgWh3hzzOBYrXw+SY0KPkEJTqL+8BPYadmCNoz0TK4K2LHcR3WTT9a7/nLsBvH/6WP6H+WMM3koN8xQRP7/T7Dn/mLOZSCyf69GfQlvSlg6SONNdioaMMRnMxtpr6Yj2BLNdOAf69nn8W5/PdIs45aXlSbG7r4kiU2lMm18Me0sAA",
  "GLM-5.3-Flash": "data:image/webp;base64,UklGRlIDAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSPYBAAABkETbtmlH+yvJeynbtm3btm1bLdu2bdu2bdvW3a38e8ZpVisiJgD/jYa6jrAbCiDEdexdxxOcM3TbFuFNFYAUC7Zusd/W0htclAOUPp4Y7jxK3sqC4CPvlXpTHmjxTeJLA+gww33Ifo+SkwNKjiRA9A0M0kR0LDFsoxyQuV0Mnv5/gon4dVlYu1PPnLQ/OjMXUOolBf8N8tp53CiC4V4g/hFK7ogBtYFxxsqQD/JCb61PtDTG8GdH6E17kfaGS8L1OAtpb3glLfS2+WFn+Kk29Oa+z+ANSZoJIXqib6PkkfhQ6x30j6QJxpB8WQp6y76mrSH/DvDoSXyUkptiQG1gMiUf5IDeup8lvreD3vRXKTnf1RNpMSUvpILejr8kPtWA3vyPKGjGBPTE2k7Jg/Gh1jv4n8TzItBb9h0F//SF3uQnKbkuqp6QKbQ3vJMDeht/FeCP5tCb/jol54XpibKSkmdTQm/nXxLvq0JvoacUNCN8emLtouSeuFDrG2oknhWC3irvKPi7hwfwR44iGCaQ7Bwl10aGv/Kqk4JnOtuFzaDkzaxA648UHWvX7JvEt2ZAzvuUHW2V5SYlZziIspY6Iq+l5JmkQKdfOry9jcS7SkDeR5QeaxF/5rYt9tu6+eFtu22L8LZmFn7XkfQBHsd1hN2Axf+cVlA4IDYBAAAwCACdASpAAEAAPnUykUepoyGhPfd4ATAOiWoC4ZvoARCTGKpHa95/ks/MB0D94z3mEKHvNhmu1QbSfUDo9jgLAImtvj/0LLM1iAD+9sSe5sX+dZX3x/+Tf/Hd/K1F7kbV0YGT45Sfa/paO3/8NfMIS0uT53e0EHX+5OPXpM3F79vm+FQeGAPnnqyW2u/QiXw+BEoTw5NLdxrKkRwvUiBMzhJL4vye3kI2Le0G39/v/62//6Dp//syOfizu68U3+QolBZSM++9FL49cuT/fKmWiwYBKDv2th3plmgso4Ub/ukbpPNniR4zY6E4EG32h0TA/tzc8BP599FLeLTM1wf9YZm++ZT9FzwS4wUrmO2q5Rug8s4JZXv/8dQHGY48MlKRZpDRG/mcvaPQaO3b1Lzm8dAOJgAA",
  "kimi-k3": "data:image/webp;base64,UklGRjwEAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSGABAAABBri1tq1tzBNQ5wGsHaxWk/y1Si3gMCyhAUwL0ALhpJQql8zwhfPrfzPA/0aEA7eRFClZ5qOGe4LVtVJXt9270fJoObrr3qp6JWXSsnfVi7byq9uod+XREJlaMJyJlhwGtUxy0k7j7SDaHt7opBNS9J8kofSLSci67bUklm03q01BxWLEWBV0vyrnYzHkmBUtquFOjMmwqjM2xaj8e6iEYtiQf13tfGcanhd+v6sai3HHir/hxgIwdn/7trcFYrv487fmrzHQT3/HeRKQdL4HiobAZOaL2huON34RHHAcgpS15aEAHTJlvRkSeil7KVAvU5Uelh7rEZaIaotlq24FLLtoeIeGIzRcouERzREPfgV/CP5C+O8t/neD/93i4wY+bsHjJj5u4/MGPG/h8yY+b8PrBnzdAq+b4HUbvm6E163wuhlet8P7BnjfAu+b4H0bum+E963ovvkf9u3w/w0sVlA4ILYCAABQDgCdASpAAEAAPpE8mEelo6KhLhSdULASCWUAUwNQA3kzAFLLm0d7IZWfAfSLzUvJVqAdI9PTPIhYM6Se6TFmdV3cLo26PO+NGGoswue1vIZ3PyRJ8qjT+YiUWlrX8I7idTocRW1O4TNRgB9UAHo1ZOQIeHpdsM5fEMAA/vxc05pQeHIBePeKdwisNJ9Py/gMFWw+gZVJA9ji38XTCOZcS30ZT7p/lv6rBF9/bJxP+vPJ774hv4F/xc2Avo0/Q/P9L6GSqYQ3u/zbHH2O4WPATW5HelWxjxZcHLDGH9gKF/v+SefNf8NZ33IGCva5uKLSAAfgqMa4jC1p0wvgArzQBseC8Iq0VjeFXwqjU0snY5z3McjYlKlIDEK6XopHykWqKU/kfKRaX/SG/GhDNeTTZ2cZPjdFJYmvHEW2DPyORZ89OuLSvwJN39ebujENVd+xKE7b0tzcDe8Z+5lDmfvfMUaqGUIrh81j7TdiDYmARvP/ng+H8ctXjIsOY8BZvtlpPNohr5MQv4MEGTZwqtXanGopntbXLFySX6l/YuiG/YjsbeK5FUfuqUr33+GENQTCuGnqkd1FcN+bQO7NmWELwDqKO+UNDizi2izjNbi9MMO1HVH0OlOVqCektZjbxVYvTzsBPwKypxEo9Vwj8SQr/eacnI7/1DU3S7PS8ztiB11S5LhTaK04R3WClt5VwTVVX9d7VQf6LXpfOb4fvxKOSl6TLz6OP59YRsla0TIcnZbw0p1EHTJZhnNCb1ibfHY84gUHN5hKFn8lmAfC1+GtcUQjaiJehZG0ehxi6mwX6V2LMRPVALT/CLecS8P1KeV1q1on1XuNTTJgzGL2qI70LSLng1Zp8oSVjKPJnoLo4JXXGlt/8ZDDVarT0WxmkyixxiYxdpJGI0idci1bjqCd9GwSgAAA",
  "Kimi-K2.7-Code": "data:image/webp;base64,UklGRigEAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSDMBAAABgCJbexQrhsJSSJaQXbCBcTlhKanCtkKyCRQ4NNif7jdPfyp/z9Mnn4kINo4kxemGCOyIa/YJ6pqhLo3t+mlZ37/ZyQ0df7/TMvWdNZUO1V1GWTOSE++9PKD3XpiGJotuE6TtizzRlzYNbhDXszzZuY6vkthfebo/NrnWNywAeXPZYssCke35YFD/CsjfOjiRzgJzTpVSUStA20ip7AXJS6bCRqA2oR6wjLoiLFQaxuKMFbC281h816PpJzTTImAXQrO+o3n/RvPNaNihcfLvp4N3/LmFPzfx5/aKhvD3Fv7exN/b+HcD/t1iwAufTUngf1V6xDJo/LsV/m7Gv9vhuQGfW+C5CZ7bsLnx1ybw3ArPzXfl9oH4Gbnd0dhkkbrLUFfndQO6t26wntUN6vJ63UABAFZQOCDOAgAAcA4AnQEqQABAAD6ROphHpaMioTAYCwCwEgllACPAN5Jn1jYYkPf3lXcENKaz16AfSPaD/Kmt24mvieswjjXnZm1gbSgOSa5IBa2YHGFR/qKYUQyt9WL2ryj7IaOzb3LaNaV0YSITx76J/k0B2PWgzl6zPEeO0Jw1fT04AAD+/gM93JDcKZ6/9G8fHi4Pn+P+P/udcX1JWP3P32TpzaRF5ABJyHub+utgN+/aT/3Odc2cVv39snE/688MHPfO/dN/FzU9/X0/yefHfK895uKVEsvq/ijvw+v1CCs9vau142XZmjuDlin3fSXGO5AP3ex8//DVFQcurpzKS3EVgzLCmhkc6W3zAJAgm3LzQBseDL0F2P7MD1US8gZT2oDNhqzTi7aqKKaxyqfaPzMAzlHu+GczHbG6p5d/RBxQUVlLcMms6yfy+1wdPoXvrmupQWCoDlwy2Wx4CUqwSWYcrsShOe9Lc3A3tj+5lDmQ04nOlId4IfsOw8cl1nePQyl30TALQ//zweH7XN6MeQlFpE2ExeCOX4yMMCtH1OCIr02RHpjN6aXjQnGluSqCK4q90VwlgkWcHpTHTDQ6hvahF8sn40eljM6DUEJYu63W4QnqVurMCFl+5N+U2s2T3HRuP+nZFXcGvPMxolFjx/yVK/Q5c2E8itE9W94GmRWKExPOi0ycTjmx9lsTzF5JNKiSPvHzQGEGdCdj6iLHIQP/X5cU9DBAXulamaPktYieaXOk2BOZ1SgDcghk05jS+DysuTgImFYXb3AtET7AsPnECWShMjl8kom3uM0znqj2K9Z/rVKul9ANZLLR6rZ0X3HC3Akd8sBpgLiC2m43ri1UtH/dld8N1q6a7piDpuOWnx9ChOC8DKjU4ZllqKwYnl5wl3zctoKy56dkywfj2ZIaiLcEqj1CEtdkOghGouEMY5DiQMcbnkNX74xnVgGLQgJAAA==",
}

const VENDOR_COLORS = {
  Qwen: '#6E56CF',
  DeepSeek: '#4D6BFE',
  Zhipu: '#0E9F8E',
  Moonshot: '#6B7280',
  MiniMax: '#E8590C',
  MoArk: '#141519',
}

function vendorInitial(vendor) {
  const value = typeof vendor === 'string' ? vendor.trim() : ''
  return value ? value.charAt(0).toUpperCase() : 'M'
}

function vendorColor(vendor) {
  const value = typeof vendor === 'string' ? vendor.trim().toLowerCase() : ''
  const key = Object.keys(VENDOR_COLORS).find((name) => name.toLowerCase() === value)
  return key ? VENDOR_COLORS[key] : '#6B7280'
}

function formatTokenLimit(value) {
  if (!Number.isInteger(value) || value <= 0) return ''
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`
  return String(value)
}

function SettingsPage(props) {
  const React = props.react
  const h = React.createElement
  const t = props.t
  const colorScheme = useColorScheme(React, props.ctx)
  const IconChevron = makeIcon(h, ['m9 18 6-6-6-6'])
  const IconSearch = makeIcon(h, ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z', 'M21 21l-4.35-4.35'])
  const IconGrid = makeIcon(h, ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z'])
  const IconList = makeIcon(h, ['M8 6h12', 'M8 12h12', 'M8 18h12', 'M4 6h.01', 'M4 12h.01', 'M4 18h.01'])
  const IconCheck = (props) => h(
    'svg',
    {
      className: props?.className,
      viewBox: '0 0 24 24',
      width: 14,
      height: 14,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2.5,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': true,
    },
    h('path', { d: 'M20 6 9 17l-5-5' }),
  )
  const MoarkMark = (props) => {
    const light = props?.scheme === 'light'
    return h(
      'svg',
      {
        className: props?.className,
        viewBox: '0 0 40 40',
        width: 26,
        height: 26,
        'aria-hidden': true,
      },
      h('path', {
        d: light ? MOARK_NAV_PATH : MOARK_MARK_PATH,
        fill: light ? '#141519' : '#FFFFFF',
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }),
    )
  }
  const IconClose = () => h(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: 16,
      height: 16,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      'aria-hidden': true,
    },
    h('path', { d: 'M18 6 6 18M6 6l12 12' }),
  )
  const IconCopy = () => h(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: 14,
      height: 14,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': true,
    },
    h('rect', { x: 9, y: 9, width: 11, height: 11, rx: 2 }),
    h('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }),
  )
  const ModelIcon = ({ model }) => {
    const [failed, setFailed] = React.useState(0)
    const sources = [model.avatar, DEFAULT_AVATARS[model.id]].filter(Boolean)
    const source = sources[failed]
    if (source) {
      return h('img', {
        className: 'moark-model-icon-img',
        src: source,
        alt: '',
        loading: 'lazy',
        referrerPolicy: 'no-referrer',
        onError: () => setFailed((current) => current + 1),
      })
    }
    return h(
      'span',
      {
        className: 'moark-model-icon',
        style: { background: vendorColor(model.vendor) },
        title: model.vendor || 'MoArk',
      },
      vendorInitial(model.vendor),
    )
  }
  const [status, setStatus] = React.useState(null)
  const [baseURL, setBaseURL] = React.useState('https://api.moark.com/v1')
  const [token, setToken] = React.useState('')
  const [selected, setSelected] = React.useState([])
  const [defaultModelId, setDefaultModelId] = React.useState('')
  const [remoteModels, setRemoteModels] = React.useState([])
  const [remoteExpanded, setRemoteExpanded] = React.useState(false)
  const [details, setDetails] = React.useState({})
  const [expandedModel, setExpandedModel] = React.useState('')
  const [viewMode, setViewMode] = React.useState('cards')
  const [addModelOpen, setAddModelOpen] = React.useState(false)
  const [customModelId, setCustomModelId] = React.useState('')
  const [customModelName, setCustomModelName] = React.useState('')
  const [connectionOpen, setConnectionOpen] = React.useState(false)
  const [customRegion, setCustomRegion] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [busy, setBusy] = React.useState('')
  const [toast, setToast] = React.useState(null)
  const defaultInitialized = React.useRef(false)
  const detailsInitialized = React.useRef(false)
  const autoTried = React.useRef(false)
  const toastTimer = React.useRef(null)
  const pageRef = React.useRef(null)
  const avatarsTried = React.useRef(false)

  const toastBox = () => {
    const dialog = pageRef.current?.closest?.('[role="dialog"]')
    const rect = dialog?.getBoundingClientRect?.()
    if (rect && rect.width > 0) {
      return {
        left: rect.left + rect.width / 2,
        top: rect.top + 16,
        maxWidth: Math.max(240, rect.width - 48),
      }
    }
    return {
      left: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
      top: 24,
      maxWidth: Math.min(560, (typeof window !== 'undefined' ? window.innerWidth : 640) - 48),
    }
  }

  const showToast = React.useCallback((kind, text) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    const clean = typeof text === 'string' ? text.replace(/[。.]+\s*$/, '') : text
    setToast({ kind, text: clean, nonce: Date.now(), box: toastBox() })
    toastTimer.current = setTimeout(() => setToast(null), kind === 'error' ? 6000 : 3200)
  }, [])

  const copyModelId = async (id) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(id)
      } else {
        const area = document.createElement('textarea')
        area.value = id
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        document.execCommand('copy')
        area.remove()
      }
      showToast('ok', t('copied'))
    } catch {
      showToast('error', t('copyFailed'))
    }
  }

  React.useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    },
    [],
  )

  const refresh = React.useCallback(async () => {
    try {
      const data = await requestJson('/moark/api/status')
      setStatus(data)
      if (data.baseURL) setBaseURL(data.baseURL)
      if (Array.isArray(data.selectedModelIds) && data.selectedModelIds.length > 0) {
        setSelected(data.selectedModelIds)
      } else if (Array.isArray(data.defaultModelIds)) {
        setSelected(data.defaultModelIds)
      }
      if (!defaultInitialized.current) {
        defaultInitialized.current = true
        const globalDefault = data.defaultModel
        if (globalDefault && globalDefault.provider === data.providerId && typeof globalDefault.model === 'string') {
          setDefaultModelId(globalDefault.model)
        }
      }
      if (!detailsInitialized.current) {
        detailsInitialized.current = true
        const configured = new Map((data.configuredModels ?? []).map((model) => [model.id, model]))
        const next = {}
        for (const model of data.catalog ?? []) {
          const detail = configured.get(model.id)
          next[model.id] = {
            name: detail?.name || model.name,
            input: Array.isArray(detail?.input) && detail.input.length > 0 ? detail.input : model.input,
            contextWindow: detail?.contextWindow ?? '',
            maxTokens: detail?.maxTokens ?? '',
          }
        }
        for (const detail of data.configuredModels ?? []) {
          if (!detail?.id || next[detail.id]) continue
          next[detail.id] = {
            name: detail.name || detail.id,
            input: Array.isArray(detail.input) && detail.input.length > 0 ? detail.input : ['text'],
            contextWindow: detail.contextWindow ?? '',
            maxTokens: detail.maxTokens ?? '',
          }
        }
        setDetails(next)
      }
    } catch (error) {
      showToast('error', `${t('loadFailed')}: ${error.message}`)
    }
  }, [t, showToast])

  React.useEffect(() => {
    refresh()
  }, [refresh])

  React.useEffect(() => {
    if (!status?.credentialConfigured || avatarsTried.current) return
    avatarsTried.current = true
    void (async () => {
      try {
        const data = await requestJson('/moark/api/remote-models?silent=1')
        if (data?.ok && Array.isArray(data.models)) setRemoteModels(data.models)
      } catch {
        // icons/descriptions are optional; the monogram fallback stays
      }
    })()
  }, [status?.credentialConfigured])

  React.useEffect(() => {
    if (!connectionOpen && !addModelOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setConnectionOpen(false)
        setAddModelOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [connectionOpen, addModelOpen])

  React.useEffect(() => {
    if (!toast) return undefined
    const update = () => setToast((current) => (current ? { ...current, box: toastBox() } : current))
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [toast])


  const toggle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id))
      if (defaultModelId === id) setDefaultModelId('')
    } else {
      setSelected([...selected, id])
    }
  }

  const detailFor = (model) =>
    details[model.id] || {
      name: model.name,
      input: Array.isArray(model.input) && model.input.length > 0 ? model.input : ['text'],
      contextWindow: '',
      maxTokens: '',
    }

  const updateDetail = (id, patch) =>
    setDetails((current) => ({
      ...current,
      [id]: {
        name: id,
        input: ['text'],
        contextWindow: '',
        maxTokens: '',
        ...current[id],
        ...patch,
      },
    }))

  const toggleInputType = (model, type) => {
    const detail = detailFor(model)
    const current = Array.isArray(detail.input) && detail.input.length > 0 ? detail.input : ['text']
    const next = current.includes(type) ? current.filter((value) => value !== type) : [...current, type]
    if (next.length === 0) next.push('text')
    updateDetail(model.id, { input: next })
  }

  const addCustomModel = () => {
    const id = customModelId.trim()
    if (!id) return
    const name = customModelName.trim() || id
    if (selected.includes(id)) {
      setDetails((current) => ({ ...current, [id]: { ...(current[id] || {}), name } }))
      setAddModelOpen(false)
      setCustomModelId('')
      setCustomModelName('')
      showToast('ok', t('modelAdded'))
      return
    }
    setSelected([...selected, id])
    setDetails((current) => ({
      ...current,
      [id]: { name, input: current[id]?.input || ['text'], contextWindow: current[id]?.contextWindow || '', maxTokens: current[id]?.maxTokens || '' },
    }))
    setCustomModelId('')
    setCustomModelName('')
    setAddModelOpen(false)
    setExpandedModel(id)
    showToast('ok', t('modelAdded'))
  }

  const buildModelPayload = () =>
    selected.map((id) => {
      const model = catalog.find((item) => item.id === id) || { id, name: id, input: ['text'] }
      const detail = details[id] || {}
      const input =
        Array.isArray(detail.input) && detail.input.length > 0 ? detail.input : model.input
      const contextWindow = Number(detail.contextWindow)
      const maxTokens = Number(detail.maxTokens)
      return {
        id,
        name: typeof detail.name === 'string' && detail.name.trim() ? detail.name.trim() : model.name || id,
        input: Array.isArray(input) && input.length > 0 ? input.filter((value) => value === 'text' || value === 'image') : ['text'],
        ...(Number.isInteger(contextWindow) && contextWindow > 0 ? { contextWindow } : {}),
        ...(Number.isInteger(maxTokens) && maxTokens > 0 ? { maxTokens } : {}),
      }
    })

  const run = async (kind, path, body, successText) => {
    setBusy(kind)
    try {
      const data = await requestJson(path, {
        method: 'POST',
        body: JSON.stringify(body),
      })
      if (data.ok === false) {
        showToast('error', `${data.stage ? data.stage + ': ' : ''}${data.error || t('failed')}`)
      } else {
        showToast('ok', successText)
      }
      await refresh()
      return data
    } catch (error) {
      showToast('error', error.message)
      return null
    } finally {
      setBusy('')
    }
  }

  React.useEffect(() => {
    if (!status || autoTried.current) return
    if (status.providerConfigured || status.providerRegistered) return
    if (!status.credentialConfigured) return
    if (autoConnectDisabled()) return
    const modelIds =
      (status.selectedModelIds && status.selectedModelIds.length > 0
        ? status.selectedModelIds
        : status.defaultModelIds) || []
    if (modelIds.length === 0) return
    autoTried.current = true
    void run(
      'onboard',
      '/moark/api/onboard',
      { baseURL: status.baseURL || baseURL, modelIds },
      t('autoOnboarded'),
    )
  }, [status, baseURL, run, t])

  const baseCatalog = status?.catalog ?? []
  const remoteById = new Map(remoteModels.map((model) => [model.id, model]))
  const knownIds = new Set(baseCatalog.map((model) => model.id))
  const seenIds = new Set(knownIds)
  const extraModels = []
  for (const model of remoteModels) {
    if (!model?.id || seenIds.has(model.id)) continue
    if (!remoteExpanded && !selected.includes(model.id) && !(status?.selectedModelIds ?? []).includes(model.id)) continue
    seenIds.add(model.id)
    extraModels.push({
      id: model.id,
      name: model.name || model.id,
      vendor: model.vendor || 'MoArk',
      input: ['text'],
      note: model.description || null,
      avatar: model.avatar || null,
    })
  }
  for (const id of status?.selectedModelIds ?? []) {
    if (!id || seenIds.has(id)) continue
    seenIds.add(id)
    const detail = details[id] || {}
    extraModels.push({
      id,
      name: detail.name || id,
      vendor: 'MoArk',
      input: Array.isArray(detail.input) && detail.input.length > 0 ? detail.input : ['text'],
      note: null,
    })
  }
  for (const id of selected) {
    if (!id || seenIds.has(id)) continue
    seenIds.add(id)
    const detail = details[id] || {}
    extraModels.push({
      id,
      name: detail.name || id,
      vendor: 'MoArk',
      input: Array.isArray(detail.input) && detail.input.length > 0 ? detail.input : ['text'],
      note: null,
    })
  }
  const fetchRemote = async () => {
    setBusy('fetch')
    try {
      const data = await requestJson('/moark/api/remote-models')
      if (data.ok === false) {
        showToast('error', `${data.stage ? data.stage + ': ' : ''}${data.error || t('fetchFailed')}`)
        return
      }
      setRemoteModels(Array.isArray(data.models) ? data.models : [])
      setRemoteExpanded(true)
      showToast(
        'ok',
        t('fetchedCount').replace('{count}', String(data.count ?? data.models?.length ?? 0)),
      )
    } catch (error) {
      showToast('error', `${t('fetchFailed')}: ${error.message}`)
    } finally {
      setBusy('')
    }
  }

  const configuredById = new Map((status?.configuredModels ?? []).map((model) => [model.id, model]))
  const catalog = [...baseCatalog, ...extraModels].map((model) => {
    const detail = configuredById.get(model.id)
    const editing = details[model.id]
    const remote = remoteById.get(model.id)
    const merged = detail
      ? {
          ...model,
          ...detail,
          name: detail.name || model.name,
          input: Array.isArray(detail.input) && detail.input.length > 0 ? detail.input : model.input,
          avatar: model.avatar || remote?.avatar || null,
          note: model.note || remote?.description || null,
        }
      : { ...model, avatar: model.avatar || remote?.avatar || null, note: model.note || remote?.description || null }
    if (!editing) return merged
    const contextWindow = Number(editing.contextWindow)
    const maxTokens = Number(editing.maxTokens)
    return {
      ...merged,
      name: editing.name || merged.name,
      input: Array.isArray(editing.input) && editing.input.length > 0 ? editing.input : merged.input,
      ...(Number.isInteger(contextWindow) && contextWindow > 0 ? { contextWindow } : {}),
      ...(Number.isInteger(maxTokens) && maxTokens > 0 ? { maxTokens } : {}),
    }
  })
  const normalizedQuery = query.trim().toLowerCase()
  const visibleModels = normalizedQuery
    ? catalog.filter((model) => `${model.name} ${model.id} ${model.vendor}`.toLowerCase().includes(normalizedQuery))
    : catalog
  const credentialConfigured = Boolean(status?.credentialConfigured)
  const providerConfigured = Boolean(status?.providerConfigured)
  const providerRegistered = Boolean(status?.providerRegistered)
  const region = customRegion
    ? 'custom'
    : baseURL === MOARK_BASE_URL_CN
      ? 'cn'
      : baseURL === MOARK_BASE_URL_INTL
        ? 'intl'
        : 'custom'

  const selectedCountLabel = `${t('selected')} ${selected.length} ${t('items')}`

  const statusItem = (tone, label, value) =>
    h(
      'span',
      { className: 'moark-status-item' },
      h('span', { className: 'moark-status-label' }, label),
      h('span', { className: `moark-dot${tone ? ' ' + tone : ''}` }),
      h('span', { className: `moark-status-value${tone ? ' ' + tone : ''}` }, value),
    )

  const row = (label, value) =>
    h(
      'div',
      { className: 'moark-row' },
      h('span', null, label),
      h('span', { className: 'moark-row-value' }, value),
    )

  const action = (label, onClick, options = {}) =>
    h(
      'button',
      {
        type: 'button',
        className: `moark-btn${options.primary ? ' primary' : ''}`,
        disabled: Boolean(busy) || Boolean(options.disabled),
        onClick,
      },
      busy === options.busy ? options.busyLabel : label,
    )

  const doOnboard = async () => {
    if (selected.length === 0) {
      showToast('error', t('noModels'))
      document.getElementById('moark-models')?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      return
    }
    if (!token && !credentialConfigured) {
      showToast('error', t('noToken'))
      setConnectionOpen(true)
      return
    }
    const data = await run(
      'onboard',
      '/moark/api/onboard',
      { token: token || undefined, baseURL, modelIds: selected, models: buildModelPayload(), defaultModelId: defaultModelId || undefined },
      t('onboarded'),
    )
    if (data?.ok) {
      setToken('')
      setConnectionOpen(false)
      setAutoConnectDisabled(false)
    }
  }

  const openConnection = () => {
    if (selected.length === 0) {
      showToast('error', t('noModels'))
      document.getElementById('moark-models')?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      return
    }
    setConnectionOpen(true)
  }

  const doTest = async () => {
    if (!token && !credentialConfigured) {
      setConnectionOpen(true)
      return
    }
    await run('test', '/moark/api/test', { token: token || undefined, baseURL, modelIds: selected }, t('testOk'))
  }

  const doRollback = async () => {
    const data = await run('rollback', '/moark/api/rollback', {}, t('rollbackOk'))
    if (data?.ok) setAutoConnectDisabled(true)
  }

  const doSelftest = async () => {
    await run('selftest', '/moark/api/selftest', {}, t('selftestOk'))
  }

  return h(
    'div',
    { className: 'moark-page', ref: pageRef },
    h('style', null, PAGE_CSS),
    h(
      'div',
      { className: 'moark-heading' },
      h(MoarkMark, { className: 'moark-heading-mark', scheme: colorScheme }),
      h('h2', { className: 'moark-title' }, t('title')),
    ),
    h('p', { className: 'moark-desc' }, t('desc')),

    h(
      'div',
      { className: 'moark-toolbar' },
      h(
        'div',
        { className: 'moark-actions' },
        action(t('onboard'), openConnection, { primary: true, busy: 'onboard', busyLabel: t('onboarding') }),
        action(t('test'), doTest, { busy: 'test', busyLabel: t('testing') }),
        action(t('rollback'), doRollback, { busy: 'rollback', busyLabel: t('rollingBack'), disabled: !status?.snapshotAvailable }),
        action(t('selftest'), doSelftest, { busy: 'selftest', busyLabel: t('selftesting'), disabled: !providerRegistered }),
        h(
          'button',
          {
            type: 'button',
            className: 'moark-btn',
            disabled: Boolean(busy),
            onClick: fetchRemote,
            title: t('fetchModels'),
          },
          busy === 'fetch' ? t('fetching') : t('fetchModelsShort'),
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'moark-btn',
            disabled: Boolean(busy),
            onClick: () => setAddModelOpen(true),
          },
          t('addModel'),
        ),
      ),
      h(
        'div',
        { className: 'moark-status' },
        statusItem(credentialConfigured ? 'ok' : 'warn', t('credential'), credentialConfigured ? t('credentialYes') : t('credentialNo')),
        statusItem(providerConfigured ? 'ok' : '', t('providerConfigured'), providerConfigured ? t('configured') : t('notConfigured')),
        statusItem(providerRegistered ? 'ok' : '', t('providerRegistered'), providerRegistered ? t('registered') : t('notRegistered')),
      ),
    ),

    h(
      'div',
      { className: 'moark-sections' },
      h(
        'section',
        { id: 'moark-models', className: 'moark-section open' },
        h(
          'div',
          { className: 'moark-section-body' },
          h(
            'div',
            null,
        h(
          'div',
          { className: 'moark-models-bar' },
          h(
            'div',
            { className: 'moark-models-heading' },
            h('div', { className: 'moark-section-title' }, t('modelsSection')),
            h('span', { className: 'moark-models-count' }, selectedCountLabel),
          ),
          h(
            'div',
            { className: 'moark-search' },
            h(IconSearch, { className: 'moark-search-icon' }),
            h('input', {
              className: 'moark-input',
              value: query,
              placeholder: t('searchModels'),
              onChange: (event) => setQuery(event.target.value),
              spellCheck: false,
            }),
          ),
          h(
            'div',
            { className: 'moark-view-toggle', role: 'group', 'aria-label': t('viewCards') },
            h(
              'button',
              {
                type: 'button',
                className: `moark-view-btn${viewMode === 'cards' ? ' active' : ''}`,
                title: t('viewCards'),
                'aria-pressed': viewMode === 'cards',
                onClick: () => setViewMode('cards'),
              },
              h(IconGrid),
            ),
            h(
              'button',
              {
                type: 'button',
                className: `moark-view-btn${viewMode === 'list' ? ' active' : ''}`,
                title: t('viewList'),
                'aria-pressed': viewMode === 'list',
                onClick: () => setViewMode('list'),
              },
              h(IconList),
            ),
          ),
        ),
        h(
          'div',
          { className: `moark-models${viewMode === 'list' ? ' list' : ''}` },
          visibleModels.length > 0
            ? visibleModels.map((model) => {
                const checked = selected.includes(model.id)
                const context = formatTokenLimit(model.contextWindow)
                const output = formatTokenLimit(model.maxTokens)
                const note = model.note || ''
                const tags = [
                  model.input.includes('image') || /多模态|视觉/.test(note) ? t('capVision') : null,
                  context ? `${t('capContext')} ${context}` : /百万|100\s*万|1M/.test(note) ? '1M ctx' : null,
                  output ? `${t('capOutput')} ${output}` : null,
                  /推理|思考/.test(note) ? t('capReasoning') : null,
                  /编程|编码|代码|Code/i.test(model.id) || /编程|编码|代码/.test(note) ? t('capCode') : null,
                  /工具|Agent|函数调用|function calling/i.test(note) ? t('capTools') : null,
                ].filter(Boolean)
                const detail = detailFor(model)
                const editing = expandedModel === model.id
                return h(
                  'div',
                  {
                    key: model.id,
                    className: `moark-model${checked ? ' checked' : ''}${editing ? ' editing' : ''}`,
                    role: 'checkbox',
                    'aria-checked': checked,
                    'aria-label': `${t('selectModel')}: ${model.name}`,
                    tabIndex: 0,
                    onClick: (event) => {
                      toggle(model.id)
                      if (event.detail > 0) event.currentTarget.blur()
                    },
                    onKeyDown: (event) => {
                      if (event.target !== event.currentTarget) return
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        toggle(model.id)
                      }
                    },
                  },
                  h(
                    'div',
                    { className: 'moark-model-head' },
                    h(ModelIcon, { model }),
                    h(
                      'div',
                      { className: 'moark-model-ident' },
                      h(
                        'div',
                        { className: 'moark-model-name-row' },
                        h('span', { className: 'moark-model-name' }, model.name),
                        viewMode === 'list'
                          ? h(
                              'div',
                              { className: 'moark-model-tags inline' },
                              tags.map((tag) => h('span', { key: tag, className: 'moark-model-tag' }, tag)),
                            )
                          : null,
                      ),
                      h(
                        'div',
                        { className: 'moark-model-id-row' },
                        h('span', { className: 'moark-model-id', title: model.id }, model.id),
                        h(
                          'button',
                          {
                            type: 'button',
                            className: 'moark-copy',
                            title: t('copyModelId'),
                            'aria-label': t('copyModelId'),
                            onClick: (event) => {
                              event.stopPropagation()
                              void copyModelId(model.id)
                            },
                          },
                          h(IconCopy),
                        ),
                      ),
                    ),
                  ),
                  viewMode === 'list'
                    ? null
                    : h(
                        'div',
                        { className: 'moark-model-body' },
                        h(
                          'div',
                          { className: 'moark-model-tags' },
                          tags.map((tag) => h('span', { key: tag, className: 'moark-model-tag' }, tag)),
                        ),
                        model.note ? h('p', { className: 'moark-model-note' }, model.note) : null,
                      ),
                  editing
                    ? h(
                        'div',
                        {
                          className: 'moark-model-editor',
                          onClick: (event) => event.stopPropagation(),
                          onMouseDown: (event) => event.stopPropagation(),
                        },
                        h(
                          'div',
                          { className: 'moark-field' },
                          h('label', { className: 'moark-label' }, t('displayName')),
                          h('input', {
                            className: 'moark-input',
                            value: detail.name,
                            onChange: (event) => updateDetail(model.id, { name: event.target.value }),
                          }),
                        ),
                        h(
                          'div',
                          { className: 'moark-field' },
                          h('label', { className: 'moark-label' }, t('contextWindow')),
                          h('input', {
                            className: 'moark-input',
                            type: 'number',
                            min: 1,
                            placeholder: '262144',
                            value: detail.contextWindow,
                            onChange: (event) => updateDetail(model.id, { contextWindow: event.target.value }),
                          }),
                        ),
                        h(
                          'div',
                          { className: 'moark-field' },
                          h('label', { className: 'moark-label' }, t('maxOutput')),
                          h('input', {
                            className: 'moark-input',
                            type: 'number',
                            min: 1,
                            placeholder: '32768',
                            value: detail.maxTokens,
                            onChange: (event) => updateDetail(model.id, { maxTokens: event.target.value }),
                          }),
                        ),
                        h(
                          'div',
                          { className: 'moark-model-editor-types' },
                          h('span', { className: 'moark-label' }, t('inputTypes')),
                          h(
                            'label',
                            null,
                            h('input', {
                              className: 'moark-editor-check',
                              type: 'checkbox',
                              checked: detail.input.includes('text'),
                              onChange: () => toggleInputType(model, 'text'),
                            }),
                            t('inputText'),
                          ),
                          h(
                            'label',
                            null,
                            h('input', {
                              className: 'moark-editor-check',
                              type: 'checkbox',
                              checked: detail.input.includes('image'),
                              onChange: () => toggleInputType(model, 'image'),
                            }),
                            t('inputImage'),
                          ),
                        ),
                      )
                    : null,
                  h(
                    'div',
                    { className: 'moark-model-foot' },
                    h(
                      'label',
                      {
                        className: `moark-model-default${defaultModelId === model.id ? ' active' : ''}`,
                        title: t('defaultModelTitle'),
                        onClick: (event) => event.stopPropagation(),
                      },
                      h('input', {
                        className: 'moark-default-input',
                        type: 'radio',
                        name: 'moark-default-model',
                        checked: defaultModelId === model.id,
                        onChange: () => {
                          setDefaultModelId(model.id)
                          if (!checked) toggle(model.id)
                        },
                      }),
                      h('span', null, t('defaultModel')),
                    ),
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'moark-model-expand',
                        title: t('editModel'),
                        'aria-expanded': editing,
                        onClick: (event) => {
                          event.stopPropagation()
                          setExpandedModel(editing ? '' : model.id)
                          if (event.detail > 0) event.currentTarget.blur()
                        },
                      },
                      h('span', null, t('editModel')),
                      h(IconChevron, { className: 'moark-chevron' }),
                    ),
                  ),
                )              })
            : h('div', { className: 'moark-hint' }, t('noResults')),
        ),
      ),
      ),
      ),
    ),

    status?.settingsError
      ? h(
          'div',
          { className: 'moark-hint', style: { margin: '0 0 14px', color: 'var(--dsw-alias-state-warn-primary)' } },
          status.settingsError,
        )
      : null,

    addModelOpen
      ? h(
          'div',
          {
            className: 'moark-modal-backdrop',
            onMouseDown: (event) => {
              if (event.target === event.currentTarget) setAddModelOpen(false)
            },
          },
          h(
            'div',
            {
              className: 'moark-modal small',
              role: 'dialog',
              'aria-modal': 'true',
              'aria-labelledby': 'moark-add-model-title',
            },
            h(
              'div',
              { className: 'moark-modal-head' },
              h('h3', { id: 'moark-add-model-title', className: 'moark-modal-title' }, t('addModelTitle')),
              h(
                'button',
                {
                  type: 'button',
                  className: 'moark-modal-close',
                  'aria-label': t('cancel'),
                  onClick: () => setAddModelOpen(false),
                },
                h(IconClose),
              ),
            ),
            h(
              'div',
              { className: 'moark-modal-body' },
              h('div', { className: 'moark-hint' }, t('addModelHint')),
              h(
                'div',
                { className: 'moark-field' },
                h('label', { className: 'moark-label' }, t('displayName')),
                h('input', {
                  className: 'moark-input',
                  value: customModelName,
                  placeholder: t('customModelNamePlaceholder'),
                  spellCheck: false,
                  onChange: (event) => setCustomModelName(event.target.value),
                }),
              ),
              h(
                'div',
                { className: 'moark-field' },
                h('label', { className: 'moark-label' }, t('modelId')),
                h('input', {
                  className: 'moark-input',
                  value: customModelId,
                  placeholder: t('customModelPlaceholder'),
                  spellCheck: false,
                  onChange: (event) => setCustomModelId(event.target.value),
                  onKeyDown: (event) => {
                    if (event.key === 'Enter' && customModelId.trim()) {
                      event.preventDefault()
                      addCustomModel()
                    }
                  },
                }),
              ),
            ),
            h(
              'div',
              { className: 'moark-modal-foot' },
              h(
                'button',
                { type: 'button', className: 'moark-btn', onClick: () => setAddModelOpen(false) },
                t('cancel'),
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'moark-btn primary',
                  disabled: !customModelId.trim() || Boolean(busy),
                  onClick: addCustomModel,
                },
                t('addModel'),
              ),
            ),
          ),
        )
      : null,
    connectionOpen
      ? h(
          'div',
          {
            className: 'moark-modal-backdrop',
            onMouseDown: (event) => {
              if (event.target === event.currentTarget) setConnectionOpen(false)
            },
          },
          h(
            'div',
            {
              className: 'moark-modal',
              role: 'dialog',
              'aria-modal': 'true',
              'aria-labelledby': 'moark-connection-title',
            },
            h(
              'div',
              { className: 'moark-modal-head' },
              h('h3', { id: 'moark-connection-title', className: 'moark-modal-title' }, t('connectionTitle')),
              h(
                'button',
                {
                  type: 'button',
                  className: 'moark-modal-close',
                  'aria-label': t('cancel'),
                  onClick: () => setConnectionOpen(false),
                },
                h(IconClose),
              ),
            ),
            h(
              'div',
              { className: 'moark-modal-body' },
              h('div', { className: 'moark-hint' }, t('connectionHint')),
              h(
                'div',
                { className: 'moark-field' },
                h('label', { className: 'moark-label' }, t('region')),
                h(
                  'div',
                  { className: 'moark-segmented', role: 'group', 'aria-label': t('region') },
                  ['cn', 'intl', 'custom'].map((value) =>
                    h(
                      'button',
                      {
                        key: value,
                        type: 'button',
                        className: `moark-segment${region === value ? ' active' : ''}`,
                        'aria-pressed': region === value,
                        onClick: () => {
                          if (value === 'custom') {
                            setCustomRegion(true)
                            return
                          }
                          setCustomRegion(false)
                          if (value === 'cn') setBaseURL(MOARK_BASE_URL_CN)
                          else setBaseURL(MOARK_BASE_URL_INTL)
                          setRemoteModels([])
                        },
                      },
                      t(value === 'cn' ? 'regionCN' : value === 'intl' ? 'regionIntl' : 'regionCustom'),
                    ),
                  ),
                ),
                h('div', { className: 'moark-hint' }, t('regionHint')),
              ),
              h(
                'div',
                { className: 'moark-field' },
                h('label', { className: 'moark-label' }, t('baseURL')),
                h('input', {
                  className: `moark-input${region === 'custom' ? '' : ' readonly'}`,
                  value: baseURL,
                  spellCheck: false,
                  readOnly: region !== 'custom',
                  onChange: (event) => setBaseURL(event.target.value),
                }),
              ),
              h(
                'div',
                { className: 'moark-field' },
                h('label', { className: 'moark-label' }, t('token')),
                h('input', {
                  className: 'moark-input',
                  type: 'password',
                  value: token,
                  autoComplete: 'off',
                  placeholder: credentialConfigured ? t('tokenConfigured') : t('tokenPlaceholder'),
                  onChange: (event) => setToken(event.target.value),
                }),
                h(
                  'div',
                  { className: 'moark-hint' },
                  `${t('credential')}: ${credentialConfigured ? t('credentialYes') : t('credentialNo')}`,
                ),
              ),
            ),
            h(
              'div',
              { className: 'moark-modal-foot' },
              h(
                'button',
                { type: 'button', className: 'moark-btn', onClick: () => setConnectionOpen(false) },
                t('cancel'),
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'moark-btn primary',
                  disabled: Boolean(busy),
                  onClick: doOnboard,
                },
                busy === 'onboard' ? t('onboarding') : t('onboard'),
              ),
            ),
          ),
        )
      : null,
    toast
      ? h(
          'div',
          {
            className: `moark-toast ${toast.kind === 'ok' ? 'ok' : 'error'}`,
            role: toast.kind === 'error' ? 'alert' : 'status',
            'aria-live': toast.kind === 'error' ? 'assertive' : 'polite',
            style: toast.box
              ? { left: toast.box.left, top: toast.box.top, maxWidth: toast.box.maxWidth }
              : undefined,
          },
          h(
            'span',
            { className: 'moark-toast-icon' },
            toast.kind === 'ok'
              ? h(
                  'svg',
                  {
                    viewBox: '0 0 24 24',
                    width: 16,
                    height: 16,
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: 2.5,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    'aria-hidden': true,
                  },
                  h('path', { d: 'M20 6 9 17l-5-5' }),
                )
              : h(
                  'svg',
                  {
                    viewBox: '0 0 24 24',
                    width: 16,
                    height: 16,
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: 2.5,
                    strokeLinecap: 'round',
                    'aria-hidden': true,
                  },
                  h('path', { d: 'M18 6 6 18M6 6l12 12' }),
                ),
          ),
          h('span', { className: 'moark-toast-text' }, toast.text),
        )
      : null,
  )
}

function createClient(react) {
  if (!react) throw new Error('dsh-moark: React runtime missing')
  return {
    inject: ['slots'],
    apply(ctx) {
      const t = makeTranslator(ctx)
      const Page = (props) => react.createElement(SettingsPage, { ...props, react, t, ctx })
      ctx.slots.inject('settings.section', () =>
        ctx.slots.register(
          { name: 'settings.section', id: 'moark', order: 90, label: () => t('title') },
          Page,
        ),
      )
      ctx.effect(() => installSettingsNavIcon(ctx, () => t('title')))
    },
  }
}

// The loader calls the factory below.
window.__ModuleLoader__.load({
  id: 'dsh-moark',
  factory(require) {
    return createClient(require('react'))
  },
})
