# Sherry's Blog

一个可继续定制的个人博客基础版。首页、文章列表、文章详情和关于页面采用响应式毛玻璃风格；文章与站点配置分开，方便后续修改。

## 本地预览

在项目目录打开终端，运行：

```powershell
python -m http.server 8000
```

浏览器访问 <http://localhost:8000>。文章通过 HTTP 加载，请不要直接双击 HTML 文件预览。也可使用任何静态文件服务器。

## 修改内容

- 编辑 `config.js` 修改昵称、简介、GitHub 地址及文章列表。
- 在 `posts/` 中添加 Markdown 文件，再在 `config.js` 的 `posts` 数组中添加对应条目。
- 目前支持 Markdown 的标题、段落、引用、粗体和行内代码；复杂 Markdown 功能留待后续扩展。
- 编辑 `style.css` 调整颜色、布局与样式；编辑 `app.js` 调整页面结构和交互。
- 示例文章和简介是占位内容，可按自己的想法替换。

## 同步到 GitHub

完成修改后，在项目目录运行 `git status` 检查变更，再执行 `git add`、`git commit` 和 `git push`。请不要提交密码、令牌或私人资料。仓库推送成功不等于网站已经公开部署；部署方式可在后续确定。
