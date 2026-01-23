# 💕 甜蜜相册 - 记录我们的爱情故事

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-pink)
![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Web-brightgreen)

一个精美的纯静态网页应用，用于记录恋爱时光的甜蜜瞬间 💑

[快速开始](#-快速开始) • [功能特性](#-功能特性) • [在线演示](#) • [部署指南](#-部署方式)

</div>

---

## 📖 项目简介
Main分支为有后端的，StaticHtml分支为纯前端实现的。 但是github pages只能部署静态网页。后面的信息为前端代码。

这是一个完全基于前端技术的爱情记录网页，无需后端服务器，支持：
- 📸 记录甜蜜日常和重要纪念日
- ⏰ 自动生成时光轴，按时间顺序展示
- 💝 实时恋爱计时器，精确到秒
- ☁️ 支持阿里云 OSS 云端同步，多端访问
- 🔐 安全验证功能，保护隐私内容
- 📱 完美适配桌面端和移动端

> 🚀 **推荐部署方式**：[GitHub Pages + GitHub Actions](docs/GITHUB_ACTIONS_DEPLOY.md)（免费、安全、自动化）

---

## 🚀 快速开始

### 方式一：本地预览

```bash
# 1. 克隆项目
git clone https://github.com/your-username/picture.git
cd picture

# 2. 直接打开 index.html
# 或使用本地服务器（推荐）
python -m http.server 8000
# 访问 http://localhost:8000
```

### 方式二：部署到 GitHub Pages（推荐）⭐

**最安全、最简单的部署方式**，密钥存储在 GitHub Secrets，完全自动化。

#### 第一步：Fork 或克隆项目
```bash
git clone https://github.com/your-username/picture.git
cd picture
```

#### 第二步：配置 GitHub Secrets
在仓库 `Settings → Secrets and variables → Actions` 中添加以下密钥：

| 密钥名称 | 说明 | 是否必需 |
|---------|------|----------|
| `OSS_REGION` | OSS 区域（如 `oss-cn-beijing`） | ✅ 必需 |
| `OSS_ACCESS_KEY_ID` | 阿里云 AccessKey ID | ✅ 必需 |
| `OSS_ACCESS_KEY_SECRET` | 阿里云 AccessKey Secret | ✅ 必需 |
| `OSS_BUCKET` | OSS Bucket 名称 | ✅ 必需 |
| `EDIT_PASSWORD` | 编辑密码 | ✅ 必需 |
| `OSS_UPLOAD_DIR` | 上传目录（默认 `PictureBed/`） | ⭕ 可选 |
| `OSS_DATA_FILE` | 数据文件路径（默认 `PictureBed/data.json`） | ⭕ 可选 |
| `LOVE_START_DATE` | 恋爱开始日期（默认 `2022-10-15`） | ⭕ 可选 |

#### 第三步：启用 GitHub Pages
在仓库 `Settings → Pages → Source` 选择 `GitHub Actions`

#### 第四步：推送代码，自动部署
```bash
git add .
git commit -m "部署到 GitHub Pages"
git push origin main
```

✅ **部署完成！** 访问 `https://your-username.github.io/picture/`

> 📖 **详细教程**：[GitHub Actions 部署指南](docs/GITHUB_ACTIONS_DEPLOY.md)

---

### 方式三：其他平台部署

本项目支持部署到任何静态网站托管平台：
- **Vercel**：自动部署，全球 CDN
- **Netlify**：功能强大，支持表单
- **Cloudflare Pages**：全球加速
- **阿里云 OSS**：国内访问快

> 📖 **详细教程**：[静态网站部署指南](docs/STATIC_DEPLOY.md)

---

## ✨ 功能特性

### 📸 甜蜜日常记录
- ✅ 记录每天的甜蜜瞬间和心情
- ✅ 支持上传多张照片（拖拽上传）
- ✅ 丰富的心情表情选择
- ✅ 按日期倒序展示，支持编辑和删除
- ✅ 照片轮播查看，支持全屏模式

### 🎉 重要纪念日管理
- ✅ 添加重要纪念日（生日、纪念日等）
- ✅ 自动计算倒计时天数
- ✅ 多种图标和颜色选择
- ✅ 支持照片记录
- ✅ 到期提醒功能

### ⏰ 时光轴展示
- ✅ 自动整合甜蜜日常和纪念日
- ✅ 按时间顺序展示（S型曲线布局）
- ✅ 可展开查看详细内容和照片
- ✅ 精美的视觉效果和动画

### 💝 恋爱计时器
- ✅ 实时显示在一起的时间
- ✅ 精确到秒，动态更新
- ✅ 浪漫的粉色主题

### 💾 数据管理
- ✅ **本地存储**：使用 localStorage 存储数据
- ✅ **云端同步**：配置 OSS 后自动同步到云端
- ✅ **多端访问**：不同设备打开网页都能看到最新内容
- ✅ **数据备份**：支持导出/导入 JSON 格式数据
- ✅ **刷新数据**：从云端重新加载最新数据

### 🔐 安全验证
- ✅ **只读模式**：未登录用户只能查看，无法编辑
- ✅ **编辑模式**：输入密码后可以添加、编辑、删除内容
- ✅ **会话管理**：验证状态保存1小时
- ✅ **密码保护**：通过 GitHub Secrets 安全存储密码

### 📱 响应式设计
- ✅ 完美适配桌面端和移动端
- ✅ 触摸手势支持（滑动、缩放）
- ✅ 移动端优化的布局和交互

> 💡 **多端同步说明**：配置阿里云 OSS 后，数据会自动同步到云端，实现多设备访问。详见 [多端同步指南](docs/SYNC_GUIDE.md)

---

## 📁 项目结构

```
picture/
├── index.html                    # 主页面
├── main.js                       # 主逻辑（数据管理、OSS 上传、认证等）
├── style.css                     # 样式文件（响应式设计）
├── config.example.js             # 配置文件示例（可复制为 config.js）
├── .gitignore                    # Git 忽略文件（排除敏感信息）
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions 部署配置
├── docs/                         # 文档目录
│   ├── QUICK_START.md            # 快速开始指南
│   ├── GITHUB_ACTIONS_DEPLOY.md  # GitHub Actions 部署教程
│   ├── STATIC_DEPLOY.md          # 静态网站部署指南
│   ├── SECURITY.md               # 安全验证功能说明
│   ├── SYNC_GUIDE.md             # 多端同步指南
│   └── DEPLOY.md                 # Python 版本部署文档
└── README.md                     # 项目说明文档
```

### 📝 文件说明

| 文件 | 说明 | 是否提交到 Git |
|------|------|----------------|
| `index.html` | 主页面，包含所有 UI 结构 | ✅ 是 |
| `main.js` | 主逻辑，处理数据、OSS、认证等 | ✅ 是 |
| `style.css` | 样式文件，响应式设计 | ✅ 是 |
| `config.js` | **本地配置文件**（包含 OSS 密钥） | ❌ **禁止** |
| `config.public.js` | **公开配置文件**（由 GitHub Actions 生成） | ❌ **禁止** |
| `config.example.js` | 配置文件示例 | ✅ 是 |
| `.gitignore` | Git 忽略文件 | ✅ 是 |

> ⚠️ **重要**：`config.js` 和 `config.public.js` 包含 OSS 密钥，**绝对不能**提交到 Git！已在 `.gitignore` 中排除。

---

## 🔧 配置说明

### 方式一：使用 GitHub Secrets（推荐）⭐

**最安全的方式**，密钥存储在 GitHub Secrets，不会暴露在代码中。

在仓库 `Settings → Secrets and variables → Actions` 中添加以下密钥：

```yaml
# 必需配置
OSS_REGION: "oss-cn-beijing"              # OSS 区域
OSS_ACCESS_KEY_ID: "YOUR_ACCESS_KEY_ID"  # 你的 AccessKey ID
OSS_ACCESS_KEY_SECRET: "YOUR_SECRET"     # 你的 AccessKey Secret
OSS_BUCKET: "YOUR_BUCKET_NAME"           # 你的 Bucket 名称
EDIT_PASSWORD: "your_password"           # 编辑密码

# 可选配置
OSS_UPLOAD_DIR: "PictureBed/"            # 上传目录（默认）
OSS_DATA_FILE: "PictureBed/data.json"   # 数据文件路径（默认）
LOVE_START_DATE: "2022-10-15"           # 恋爱开始日期（默认）
```

> 📖 **详细教程**：[GitHub Actions 部署指南](docs/GITHUB_ACTIONS_DEPLOY.md)

---

### 方式二：本地配置文件（本地开发）

如果你想在本地测试，可以创建 `config.js` 文件：

```bash
# 1. 复制配置文件
cp config.example.js config.js

# 2. 编辑 config.js，填入你的配置
```

```javascript
// config.js
window.OSS_CONFIG = {
    region: 'oss-cn-beijing',
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    accessKeySecret: 'YOUR_ACCESS_KEY_SECRET',
    bucket: 'YOUR_BUCKET_NAME',
    uploadDir: 'PictureBed/',
    dataFile: 'PictureBed/data.json'
};

window.LOVE_START_DATE = '2022-10-15';
window.EDIT_PASSWORD = 'your_password';
```

> ⚠️ **警告**：`config.js` 已在 `.gitignore` 中排除，**不会**被提交到 Git。

---

### 阿里云 OSS 配置步骤

1. **创建 OSS Bucket**
   - 登录阿里云控制台
   - 创建一个新的 Bucket（建议选择私有读写）

2. **获取 AccessKey**
   - 在阿里云控制台获取 AccessKey ID 和 Secret
   - 建议使用 RAM 子账号，只授予 OSS 权限

3. **设置 CORS 跨域规则**
   ```json
   {
     "allowedOrigins": ["*"],
     "allowedMethods": ["GET", "POST", "PUT", "DELETE", "HEAD"],
     "allowedHeaders": ["*"],
     "exposeHeaders": ["ETag"],
     "maxAgeSeconds": 3600
   }
   ```

4. **配置 Bucket 策略（可选）**
   - 如果需要公开访问图片，设置读权限为公共读

> 📖 **详细教程**：[多端同步指南](docs/SYNC_GUIDE.md)

---

## 🎭 使用说明

### 🔐 安全验证

1. **首次访问**：网页默认为只读模式，右上角显示“登录编辑”按钮
2. **登录编辑**：点击按钮，输入密码（默认：`love2022`）
3. **编辑内容**：验证成功后可以添加、编辑、删除内容
4. **退出登录**：点击右上角“退出编辑”按钮

> 📖 **详细说明**：[安全验证功能文档](docs/SECURITY.md)

---

### 📸 添加甜蜜日常

1. 点击“甜蜜日常”区域的“+ 添加日常”按钮
2. 选择日期和心情
3. 输入内容描述
4. 拖拽或选择图片上传（支持多张）
5. 点击“保存”

---

### 🎉 添加纪念日

1. 点击“纪念日”区域的“+ 添加纪念日”按钮
2. 输入纪念日名称
3. 选择日期和图标
4. 可选上传纪念照片
5. 点击“保存”

---

### 💾 数据管理

- **导出数据**：点击页面底部“导出数据”按钮，下载 JSON 文件
- **导入数据**：点击“导入数据”按钮，选择之前导出的 JSON 文件
- **刷新数据**：点击“刷新数据”按钮，从云端重新加载最新数据

> ⚠️ **注意**：导入数据会覆盖当前数据，请先备份！

---

## 📊 数据存储

### 纯静态版本
- 数据存储在浏览器 localStorage
- 图片可选择 OSS 或 Base64
- 支持导出/导入备份

### Python 版本
- 数据存储在 JSON 文件
- 图片存储在阿里云 OSS
- 支持多用户

---

## 🔒 安全建议

### ✅ 已实现的安全措施

1. **密钥保护**
   - ✅ `config.js` 和 `config.public.js` 已在 `.gitignore` 中排除
   - ✅ 不会被提交到 Git 仓库
   - ✅ GitHub Actions 使用 Secrets 存储密钥

2. **OSS 安全**
   - ✅ 建议使用 RAM 子账号，只授予 OSS 权限
   - ✅ 设置 CORS 跨域规则，限制访问来源
   - ✅ Bucket 设置为私有读写，防止数据泄露

3. **编辑密码**
   - ✅ 默认密码为 `love2022`，强烈建议修改
   - ✅ 密码通过 GitHub Secrets 存储
   - ✅ 会话状态保存 1 小时，关闭浏览器后自动失效

### ⚠️ 注意事项

1. **绝对不要将以下文件提交到 Git**
   - ❌ `config.js`（包含 OSS 密钥）
   - ❌ `config.public.js`（由 GitHub Actions 生成）
   - ❌ `secrets.txt`（任何包含密钥的文件）

2. **定期备份数据**
   - 使用页面底部的“导出数据”功能
   - 防止浏览器清除缓存导致数据丢失

3. **不要在隐私模式下使用**
   - 隐私模式下 localStorage 不会持久化
   - 关闭浏览器后数据会丢失

4. **OSS 跨域设置**
   - 必须在阿里云 OSS 控制台设置 CORS 规则
   - 否则图片上传会失败

---

## 📱 浏览器兼容性

| 浏览器 | 桌面端 | 移动端 | 说明 |
|---------|---------|---------|------|
| Chrome | ✅ 90+ | ✅ 90+ | 完全支持 |
| Firefox | ✅ 88+ | ✅ 88+ | 完全支持 |
| Safari | ✅ 14+ | ✅ 14+ | 完全支持 |
| Edge | ✅ 90+ | ✅ 90+ | 完全支持 |
| Opera | ✅ 76+ | ✅ 64+ | 完全支持 |

### 功能支持

- ✅ localStorage 存储
- ✅ ES6+ 语法
- ✅ Fetch API
- ✅ Promise
- ✅ 触摸事件
- ✅ 文件上传 API

---

## 🚀 部署方式

### 免费部署平台对比

| 平台 | 优点 | 缺点 | 推荐指数 |
|------|------|------|----------|
| **GitHub Pages** | 免费、稳定、简单、支持 Actions | 国内访问较慢 | ⭐⭐⭐⭐⭐ |
| **Vercel** | 快速、自动部署、全球 CDN | 需要注册账号 | ⭐⭐⭐⭐ |
| **Netlify** | 功能强大、支持表单 | 需要注册账号 | ⭐⭐⭐⭐ |
| **Cloudflare Pages** | 全球 CDN、速度快 | 配置略复杂 | ⭐⭐⭐ |
| **阿里云 OSS** | 国内访问快 | 需要开通 OSS | ⭐⭐⭐ |

### 📖 详细部署教程

- 🚀 [GitHub Pages + GitHub Actions 部署](docs/GITHUB_ACTIONS_DEPLOY.md)（推荐）
- 📚 [3 步快速开始](docs/QUICK_START.md)
- 🌐 [静态网站部署指南](docs/STATIC_DEPLOY.md)
- 🔐 [安全验证功能说明](docs/SECURITY.md)
- ☁️ [多端同步指南](docs/SYNC_GUIDE.md)

---

## ❓ 常见问题

### 1. 图片上传失败？

**原因**：
- OSS 配置不正确
- OSS 跨域设置未配置
- AccessKey 权限不足

**解决方法**：
1. 检查 GitHub Secrets 中的 OSS 配置是否正确
2. 在阿里云 OSS 控制台设置 CORS 规则
3. 查看浏览器控制台错误信息
4. 确认 AccessKey 有 OSS 上传权限

---

### 2. 数据丢失？

**原因**：
- 浏览器清除了缓存
- 在隐私模式下使用
- localStorage 超出容量限制

**解决方法**：
1. 定期使用“导出数据”功能备份
2. 不要在隐私模式下使用
3. 不要清除浏览器缓存
4. 配置 OSS 实现云端同步

---

### 3. GitHub Pages 部署后 404？

**原因**：
- Pages 设置不正确
- 部署未完成
- 文件路径错误

**解决方法**：
1. 确认 Pages Source 设置为 `GitHub Actions`
2. 等待几分钟让部署完成
3. 检查 Actions 执行日志
4. 确认文件路径正确

---

### 4. 忘记编辑密码？

**解决方法**：
1. 打开浏览器开发者工具（F12）
2. 在控制台输入：`sessionStorage.clear()`
3. 刷新页面
4. 修改 GitHub Secrets 中的 `EDIT_PASSWORD`
5. 重新部署

---

### 5. 多设备数据不同步？

**原因**：
- 未配置 OSS
- OSS 数据文件路径不一致

**解决方法**：
1. 确认已配置 OSS
2. 检查 `OSS_DATA_FILE` 路径是否一致
3. 点击“刷新数据”按钮
4. 查看浏览器控制台错误信息

> 📖 **更多问题**：请查看 [静态网站部署指南](docs/STATIC_DEPLOY.md) 或提交 Issue

---

## 📝 更新日志

### v2.1.0 - 2026-01-23
- ✨ 新增安全验证功能（只读/编辑模式）
- ✨ 支持通过 GitHub Secrets 配置密码
- ✨ 优化移动端布局（S 型曲线适配）
- ✨ 图片全屏查看功能
- ✨ 登录按钮移至导航栏右上角
- 🐛 修复多个界面显示问题

### v2.0.0 - 2024-01-20
- ✨ 纯静态版本，无需后端
- ✨ 使用 localStorage 存储数据
- ✨ 支持数据导出/导入
- ✨ 支持阿里云 OSS 云端同步
- ✨ 可部署到 GitHub Pages
- ✨ GitHub Actions 自动部署

### v1.0.0 - 2023-12-01
- ✨ FastAPI 后端版本
- ✨ 阿里云 OSS 图片上传
- ✨ JSON 文件存储

---

## 💖 致谢

本项目使用了以下优秀的开源项目和服务：

- 🎨 **UI 框架**：原生 HTML/CSS/JavaScript
- 🎭 **图标库**：[Font Awesome](https://fontawesome.com/)
- 🎨 **字体**：[Google Fonts](https://fonts.google.com/)（Ma Shan Zheng、ZCOOL XiaoWei）
- ☁️ **云存储**：[阿里云 OSS](https://www.aliyun.com/product/oss)
- 🚀 **部署平台**：[GitHub Pages](https://pages.github.com/)
- 🤖 **CI/CD**：[GitHub Actions](https://github.com/features/actions)

特别感谢所有为开源社区做出贡献的开发者！❤️

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

你可以自由地：
- ✅ 使用本项目
- ✅ 修改本项目
- ✅ 分发本项目
- ✅ 商业使用

但需要保留原作者的版权声明。

---

## 🎁 祝福

愿你们的爱情永远甜蜜！💕

如有问题或建议，欢迎：
- 📮 提交 [Issue](https://github.com/your-username/picture/issues)
- 🔀 提交 [Pull Request](https://github.com/your-username/picture/pulls)
- ⭐ 给项目点个 Star

---

<div align="center">

**Made with ❤️ for Love**

[⬆ 回到顶部](#-甜蜜相册---记录我们的爱情故事)

</div>
