# Meow Craft 更新日志

## 2026-06-06 23:44 UTC

- 顶部 header 改为无背景、无边框、无胶囊底的悬浮布局。
- Logo 与品牌名固定在左上角。
- 桌面端右上角显示作品 / 流程 / 服务 / FAQ 导航，以及咨询入口。
- 移动端保留左上品牌和右上咨询入口，避免导航挤压。

## 2026-06-07 00:16 UTC

- 读取 ChatGPT v0.3 handoff 更新。
- 将 Hero 后模块升级为 What We Do + Works Carousel。
- 左侧增加四段工艺流程叙事，右侧增加作品阶段轮播。
- 支持点击步骤、Prev / Next 切换，以及滚动到步骤时同步右侧图片。
- 为轮播图片增加 hover 放大细节效果。
- 服务层级取消单一卡片高亮，并补充 USD 区间。

## 2026-06-07 00:30 UTC

- 同步 v0.4 品牌策略：Confidence-Driven Customization。
- 明确用户核心焦虑不是价格，而是“不适合自己 / 不像角色 / 花钱后失望”。
- 明确 Meow Craft 的差异化：同时为角色和佩戴者本人定制。
- 记录新的七步流程：角色咨询、个人适配分析、设计方案、制作过程、进度确认、最终确认、售后护理。
- 记录新文案原则：从“定制假发服务”升级为“为你量身设计的角色呈现方案”。

## 2026-06-07 01:02 UTC

- 同步 v0.6 策略：Confidence-Driven Experience。
- 将 What We Do 模块从时间线/流程列表改为情绪叙事 + 视觉转化。
- 左侧改为 Reference / Structure / Styling / Detail / Final 五段故事。
- 右侧改为五阶段 Transformation 视觉，随滚动同步切换。
- 移除旧 Prev / Next 控制和传统流程按钮，减少 corporate workflow feeling。
- 记录后续问题：是否改 Hero 文案、是否扩展咨询表字段、是否指定更精准的五阶段素材。

## 2026-06-07 01:12 UTC

- 清理旧 craft-story / carousel controls / process-list 样式残留。
- 将“定制流程”从旧 5 步流程改为 v0.6 七步 Confidence Process。
- 新流程强调角色准确度与个人适配度，而不只是制作步骤。

## 2026-06-07 03:38 UTC

- 更新视觉方向为 Anime Editorial + Soft Luxury + Craft Atelier。
- 基础色改为 Warm Ivory / Soft Porcelain / Ink Black / Warm Gray / Mist Border。
- 大标题改用 editorial serif，正文保留 Inter。
- 增加页面留白，减少边框、阴影和通用电商卡片感。
- 作品区加入角色色彩变量，让 Nilou / Frieren / Elysia / Furina / Kafka 的角色色承载动漫情绪。

## 2026-06-07 19:36 UTC

- 将现有 2x2 四宫格拼接素材批量裁切为四张独立图片。
- 新增 `assets/split/编号-1.jpg` 到 `assets/split/编号-4.jpg`。
- 页面媒体位自动读取四张拆分图，并重新排列为 editorial mosaic。
- 原始 `assets/编号.jpg` 保留为 fallback。
