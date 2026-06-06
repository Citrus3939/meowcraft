# Meow Craft

Meow Craft 是一个高端动漫角色假毛定制工作室首页原型，适合后续改造成 Shopify 首页。

页面目标不是直接结账，而是引导用户提交定制咨询。

## 页面方向

- 中文高端工作室文案
- 面向美国和加拿大 Cosplayer
- 强调角色准确度、手工工艺、沟通和信任感
- 极简布局、大留白、柔和紫色点缀
- 首屏支持背景视频
- 作品、客户反馈和工作室幕后均优先使用真实照片 / 视频

## 背景视频替换

首屏视频在 `index.html` 中：

```html
<source src="assets/hero-video.webm" type="video/webm" />
<source src="assets/hero-video.mp4" type="video/mp4" />
```

你可以手动修改 `src`：

```html
<source src="assets/your-video.mp4" type="video/mp4" />
```

建议：

- 将视频放到 `assets/` 文件夹
- 使用 10-20 秒静音循环视频
- 推荐内容顺序：角色参考图 -> 假毛结构制作 -> 造型过程 -> Cosplayer 成果
- 建议压缩视频，避免首页加载过慢
- 可同时提供 `.webm` 和 `.mp4`，浏览器会优先选择支持的格式

如果视频未加载成功，页面会自动显示首屏的静态流程占位背景。

## 页面结构

- 首屏背景视频 Hero
- 为什么选择 Meow Craft
- 精选作品
- 定制流程
- 服务层级
- 工作室幕后
- 客户反馈
- FAQ
- 定制咨询表单
- 最终 CTA

## 本地预览

直接用浏览器打开 `index.html`，或在仓库目录运行：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## 正式上线替换项

- 替换首屏背景视频
- 替换作品展示为真实项目照片
- 替换客户反馈为真实客户照片、评论截图、Discord 截图
- 将咨询表单接入 Shopify Forms、Klaviyo、Gorgias、Airtable 或自定义工作流
- 补充 TikTok、Instagram、X 真实链接
