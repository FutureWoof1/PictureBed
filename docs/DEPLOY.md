# 🚀 部署指南

本项目是一个**纯静态网页应用**，无需服务器，可以部署到任何静态网站托管平台。

---

## 📦 部署方式

### 1️⃣ GitHub Pages（推荐）

**优点**：免费、稳定、自动部署

```bash
# 1. 推送代码到 GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/sweet-album.git
git push -u origin main

# 2. 在 GitHub 仓库设置中启用 Pages
# Settings → Pages → Source: main branch → / (root)
```

访问地址：`https://你的用户名.github.io/sweet-album/`

详细步骤请查看 [STATIC_DEPLOY.md](STATIC_DEPLOY.md)

---

### 2️⃣ Vercel

**优点**：速度快、支持自定义域名

1. 访问 https://vercel.com
2. 导入 GitHub 仓库
3. 直接部署（根目录）
4. 点击部署

---

### 3️⃣ Netlify

**优点**：功能强大、支持表单处理

1. 访问 https://netlify.com
2. 拖拽整个项目文件夹到网页
3. 自动部署完成

---

### 4️⃣ Cloudflare Pages

**优点**：全球 CDN、速度极快

1. 访问 https://pages.cloudflare.com
2. 连接 GitHub 仓库
3. 直接部署（根目录）
4. 部署

---

## ⚙️ 配置 OSS 图床

部署前需要配置阿里云 OSS：

```bash
# 1. 复制配置文件
cp config.example.js config.js

# 2. 编辑 config.js，填入你的 OSS 配置
# 注意：config.js 不会被提交到 Git（已在 .gitignore 中）
```

**config.js 示例**：
```javascript
window.APP_CONFIG = {
    OSS_REGION: 'oss-cn-beijing',
    OSS_BUCKET: 'your-bucket-name',
    OSS_ACCESS_KEY_ID: 'your-access-key-id',
    OSS_ACCESS_KEY_SECRET: 'your-access-key-secret',
    OSS_UPLOAD_DIR: 'sweet-album/'
};
```

---

## 🔒 安全提示

⚠️ **重要**：`config.js` 包含敏感信息，已被 `.gitignore` 排除，不会提交到 Git。

**部署后配置方式**：
1. 在部署平台的环境变量中配置 OSS 信息
2. 或者在部署后手动上传 `config.js` 文件

---

## 📁 项目结构

```
sweet-album/
├── index.html          # 主页面
├── main.js             # 核心逻辑
├── style.css           # 样式文件
├── config.example.js   # 配置模板
├── config.js           # 实际配置（不提交）
├── docs/               # 文档目录
│   ├── DEPLOY.md      # 部署指南
│   └── STATIC_DEPLOY.md  # 详细部署指南
├── README.md           # 项目说明
└── start_static.bat    # 本地预览脚本
```

---

## 🧪 本地预览

```bash
# Windows
start_static.bat

# Mac/Linux
python3 -m http.server 8080
```

访问：http://localhost:8080

---

## 🎉 完成

现在你的甜蜜相册已经部署完成！

- ✅ 纯静态网页，无需服务器
- ✅ 图片存储在阿里云 OSS
- ✅ 数据存储在浏览器 LocalStorage
- ✅ 支持多种部署平台
- ✅ 完全免费

祝你使用愉快！💕
