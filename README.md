# KissCream · 把结构拆开来看

交互式 3D 结构拆解站点：拖拽旋转、拉动进度条、点击零件，把一层层结构拆开看。

纯静态站点（无构建步骤），一个 HTML 文件里用 canvas 自研了软件三维渲染器，不依赖任何三方 3D 库。

## 目录

| 文件 | 说明 |
|---|---|
| `index.html` | 首页（作品入口卡片、安装到桌面引导） |
| `football.html` | 足球结构拆解交互页 |
| `manifest.json` | PWA 清单（可安装到桌面，必须叫 `.json`） |
| `sw.js` | Service Worker（导航网络优先，静态资源 stale-while-revalidate） |
| `_headers` | 响应头配置（Cloudflare Pages / Netlify 用；GitHub Pages 会忽略） |
| `.nojekyll` | 关闭 GitHub Pages 的 Jekyll 处理（对 Cloudflare 无影响） |
| `assets/football.jpg` | 草坪背景贴图 |
| `icons/` | 应用图标（512 / 192 / apple-touch） |

页面内所有资源引用都是**相对路径**（`./sw.js`、`manifest.json`、`icons/...`），
因此无论是根域名还是子路径部署（`<user>.github.io/<repo>/`），都不用改代码。

## 日常更新流程

```text
改本地文件  →  GitHub Desktop 里 Commit  →  Push
                        ↓
        Cloudflare Pages 自动构建并发布（约 20～30 秒）
```

不需要手动上传压缩包，也没有部署次数限制。

## 首次配置

### 一、把站点放进 GitHub

1. 安装 [GitHub Desktop](https://desktop.github.com/)（自带 git，无需命令行）
2. 打开后登录 GitHub 账号
3. 菜单 **File → New repository**
   - Name：`kisscream-site`
   - Local path：指向 `E:\DeepSeek练习\site`（让它把仓库根目录设成 `site` 本身）
   - **不要**勾选 Initialize with a README（仓库里已经有 README.md）
4. 点 **Create repository** → **Publish repository**

### 二、接到 Cloudflare Pages

1. 打开 <https://dash.cloudflare.com/> → 左侧 **Workers & Pages**
2. **Create → Pages → Connect to Git**
3. 授权 GitHub，选择仓库 `kisscream-site`，分支 `main`
4. 构建设置：
   - Framework preset：**None**
   - Build command：**留空**
   - Build output directory：**`/`**
5. **Save and Deploy** → 约 30 秒后得到 `https://kisscream-site.pages.dev`

### 三、可选：自定义域名

Pages 项目 → **Custom domains → Set up a domain**，填你自己的域名并按提示改 DNS。

## 备选：GitHub Pages（不需要代理）

`dash.cloudflare.com` 在国内经常打不开，如果哪天不想挂代理：

1. 仓库必须是 **Public**（免费账号只能用公开仓库发布 Pages）：
   **Settings → General → Danger Zone → Change visibility → Public**
2. **Settings → Pages** → Source `Deploy from a branch` → `main` + `/ (root)` → **Save**
3. 访问 `https://<你的用户名>.github.io/kisscream-site/`

## 注意事项

- **换域名会让手机上已安装的 PWA 失效**，需要在浏览器里重新「添加到主屏幕」。
- PWA 清单必须叫 `manifest.json`：GitHub Pages 不认 `.webmanifest` 的 MIME 类型，会导致装不上桌面；
  Cloudflare Pages 靠 `_headers` 补 MIME，两者都兼容的方案就是直接用 `.json`。
- `sw.js` 的导航请求是网络优先，**发版后刷新一次就是最新版本**；静态资源下次打开自动更新。
- 想清掉 Service Worker 缓存来排查问题时：浏览器 DevTools → Application → Service Workers → Unregister。