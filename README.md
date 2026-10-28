<div>
  <h1 align="center">dsh-moark</h1>
  <p align="center">
  把 <a target="blank" href="https://moark.com">模力方舟 (MoArk)</a> 接入 <a target="blank" href="https://github.com/deepseek-ai">DeepSeek Harness</a>
  </p>
  <img src="./assets/banner.svg" />
</div>

<p align="center"><strong>简体中文</strong> | <a href="./README.en.md">English</a></p>

## 要求

- DeepSeek Harness `0.2.1-rc.2` 或兼容的 `0.2.x`
- MoArk 访问令牌（MoArk 控制台 → 设置 → 访问令牌）

## 安装

### DeepSeek Harness Desktop

打开 `设置 → 内置插件`，从 npm 安装 `dsh-moark`。

### DeepSeek Harness Web / CLI

```bash
dsh plugin --profile web add dsh-moark
```

安装后重启对应的 DSH profile，或刷新页面。

Desktop 如需使用 CLI，请先完全退出 Desktop：

```bash
dsh plugin --profile desktop add dsh-moark
```

> 不需要 `npm install -g dsh-moark`；插件由 DSH profile 管理。

## 快速开始

1. 在[模力方舟](https://moark.com)控制台创建访问令牌。
2. 打开 `设置 → 模力方舟 · MoArk`。
3. 选择服务区域：
   - 国内：`https://api.moark.com/v1`
   - 海外：`https://api.moark.ai/v1`
   - 或自定义 Endpoint
4. 填写访问令牌。已保存过令牌时可以留空。
5. 点击 `获取模型`，从 MoArk 拉取当前令牌可用的对话模型。
6. 选择要在 DSH 中使用的模型；可在卡片/列表视图间切换。
7. 点击 `接入 / 更新`。插件会写入 provider、等待 DSH 注册，并执行一次流式自测。
8. 在模型选择器中选择 **MoArk** 及对应模型。

如果访问令牌已配置、当前 profile 尚无 `providers.moark`，打开设置页时会自动用默认模型接入一次。

## 设置页

| 操作 | 说明 |
|---|---|
| 接入 / 更新 | 写入或更新 MoArk provider；失败自动回滚 |
| 测试连接 | 直接访问 MoArk API，检查 Endpoint 与令牌 |
| 回滚 | 恢复到本次接入前的 `llm-pi-ai` 配置 |
| 运行自测 | 通过 DSH 的 LLM 服务发起一次真实请求 |
| 获取模型 | 拉取当前令牌可用的对话模型 |
| 添加模型 | 手动填写显示名称与模型 ID |

模型卡片支持：

- 点击整卡切换是否启用；
- 卡片底部 `设为默认首选`：接入时将该模型设为 DSH 新会话的默认模型；
- `编辑模型`：修改显示名称、上下文窗口、最大输出 token、输入类型（文本/图片）；
- 复制模型 ID；
- 卡片/列表两种视图。

上下文与最大输出留空时，使用 `llm-pi-ai` 的默认值（262,144 / 32,768）。
也可以继续使用 DSH 原生的 `设置 → 模型 → 模力方舟` 编辑器；本插件再次更新时会保留原生编辑器里改过的 provider/model 元数据。

## 写入内容

| 位置 | 内容 |
|---|---|
| DSH 凭据 | `MOARK_API_KEY` |
| `llm-pi-ai` | `providers.moark` |
| 默认模型（可选） | `agentDefaultModel` |

插件只合并写入 `providers.moark`，不会覆盖其他 provider。

## 安全

- 访问令牌只保存在 DSH 凭据存储中，不写入 provider 配置、日志或页面存储；
- 插件 Host 路由只监听本机回环地址；
- 建议为 DSH 单独创建 MoArk 令牌，便于随时撤销；
- 回滚只会移除 provider，不会自动删除已保存的令牌；如需更换请直接覆盖或在凭据管理中清除。

## 故障排查

| 现象 | 处理 |
|---|---|
| 401 / 令牌无效 | 在 MoArk 控制台重新生成令牌并填写 |
| 400 资源包或额度错误 | 检查运行包余额、令牌绑定与模型授权 |
| 海外站连接失败 | 确认选择海外区域，使用 `https://api.moark.ai/v1` |
| 模型列表为空 | 确认令牌可用、区域正确，然后重新点击 `获取模型` |
| 接入后模型选择器没有 MoArk | 运行 `运行自测`；仍失败时回滚后重新接入 |
| Desktop CLI 安装失败 | 先完全退出 Desktop，再执行 `dsh plugin --profile desktop add dsh-moark` |

## 卸载

1. 在设置页点击 `回滚`，移除 `providers.moark`；
2. 在 `设置 → 内置插件` 中移除插件，或执行：

```bash
dsh plugin --profile web remove dsh-moark
```

3. 如需彻底停用，在 MoArk 控制台撤销对应访问令牌。

## License

[MIT](./LICENSE)
