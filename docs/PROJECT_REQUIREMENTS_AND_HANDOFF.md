# Meow Craft 独立站项目需求与协作日志

> Project Manager: ChatGPT  
> Founder: Citrus  
> Engineering / Implementation: Cursor / Codex  
> Repository: Citrus3939/meowcraft  
> Branch: cursor/meow-craft-site-a620  
> Document Purpose: 作为 Meow Craft 独立站的单一需求源、品牌源、开发交接文档和版本更新日志。

---

## 7. 首页结构需求

### Section 1: Hero
- 极简背景，大字体，视频蒙版文字
- 主标题: 因为热爱，让幻想拥有真实的重量。
- 英文核心: Where imagination takes form.
- 辅助说明: Premium Handcrafted Anime Wig Studio
- CTA: Start Your Custom Order
- 动效: 大字视频蒙版，文字淡入，滚动后文字缩放/淡出

### Section 2: What We Do + Works Carousel (v0.3)
- **左侧**: 文字介绍“我们做什么”，随滚动从左侧飘入，逐步展示工艺流程
- **右侧**: 作品轮播，鼠标悬浮放大显示细节
- **滚动交互**: 随滚动展示制作过程，从毛坯到最终成品
- **服务层级信息**: 展示各档待遇，不高亮
- **移动端**: 保持极简布局，不增加 menu
- **专业感**: 模块整体体现高级手工工艺感

### 服务层级展示
- Ready Styled Collection (59-149 USD)
- Custom Commission (199-499 USD)
- Signature Commission (499-999+ USD)
- 每档服务内容与待遇清晰列出

### UX / UI Notes
- 避免简单卡片样式，突出作品细节和工艺展示
- 左侧文字滚动与右侧图片轮播同步
- 鼠标悬浮时作品图片放大，显示细节
- 滚动逐步展示制作过程，强化叙事体验

### Next Steps
1. Cursor 实现左侧文字 + 右侧作品轮播，滚动过程交互
2. 图片 hover 放大与细节展示
3. 更新文档底部 changelog

---

## Change Log

### v0.3 - What We Do + Works Carousel Implemented

Date: 2026-06-07

Changed Files:

- index.html
- styles.css
- script.js
- docs/PROJECT_REQUIREMENTS_AND_HANDOFF.md

What Changed:

- 将 Hero 后的原“为什么选择”模块升级为 What We Do + Works Carousel。
- 左侧增加“角色分析 / 毛坯与结构 / 剪裁与造型 / 确认与交付”四段工艺叙事。
- 右侧增加作品轮播，使用已绑定素材展示 Reference / Base / Crafting / Final 阶段。
- 支持点击步骤切换轮播、Prev / Next 切换轮播。
- 使用 IntersectionObserver 在滚动到对应步骤时同步右侧作品图。
- 作品图支持 hover 轻微放大以突出细节。
- 服务层级移除“最受欢迎”高亮，三档保持同等视觉权重，并补充 59-149 / 199-499 / 499-999+ USD 区间。

Why Changed:

- 响应 v0.3 需求：用“左侧文字 + 右侧作品轮播”的方式展示 Meow Craft 做什么。
- 强化从角色参考到最终成品的制作叙事，而不是仅用普通卡片说明服务。
- 让作品细节和工艺过程成为页面的主要说服力。

Open Questions:

- 当前轮播使用素材 3 / 4 / 7 / 11 作为阶段图，是否需要由 Founder 指定更准确的四张代表图？
- 是否需要进一步把该模块做成 pinned scroll section？
- 服务层级价格是否要显示 USD 区间，还是继续弱化价格？

Next Tasks:

1. Founder / ChatGPT review What We Do 模块的图文节奏。
2. 如需更强叙事，可继续把该模块升级为 pinned scroll。
3. 后续继续优化 Consultation CTA，提升咨询转化。