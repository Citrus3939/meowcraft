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