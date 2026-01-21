# 甜蜜相册 💕

一个记录恋爱时光的网页应用，支持记录甜蜜日常、重要纪念日，并自动生成时光轴。

> 🚀 **快速开始**：[3 步部署到 GitHub Pages](docs/QUICK_START.md) | 📖 [详细部署指南](docs/GITHUB_ACTIONS_DEPLOY.md)

---

## 🎯 版本说明

本项目提供两个版本：

### 1. 纯静态版本（推荐）⭐
- ✅ 无需后端服务器
- ✅ 使用 localStorage 存储数据
- ✅ 支持阿里云 OSS 图片上传
- ✅ 可部署到 GitHub Pages、Vercel、Netlify
- 📖 [查看部署文档](docs/STATIC_DEPLOY.md)

### 2. Python 后端版本
- 使用 FastAPI 后端
- 使用 JSON 文件存储数据
- 支持阿里云 OSS 图片上传
- 📖 [查看部署文档](docs/DEPLOY.md)

---

## 🚀 快速开始（纯静态版本）

### 方式一：直接打开（本地测试）

1. 双击打开 `index.html`（或使用本地服务器）

### 方式二：部署到 GitHub Pages（使用 GitHub Actions - 推荐）✅

**最安全的方式**：密钥存储在 GitHub Secrets，不会暴露在代码中。

```bash
# 1. 设置 GitHub Secrets
# 在仓库 Settings → Secrets and variables → Actions 中添加：
# - OSS_REGION
# - OSS_ACCESS_KEY_ID
# - OSS_ACCESS_KEY_SECRET
# - OSS_BUCKET
# - OSS_UPLOAD_DIR（可选）
# - OSS_DATA_FILE（可选）
# - LOVE_START_DATE（可选）

# 2. 启用 GitHub Pages
# Settings → Pages → Source: GitHub Actions

# 3. 推送代码（会自动部署）
git add .
git commit -m "部署到 GitHub Pages"
git push origin main
```

⚠️ **重要**：
- ✅ **密钥安全**：OSS 配置存储在 GitHub Secrets，不会暴露
- ✅ **自动部署**：推送代码后自动部署
- ✅ **完全免费**：GitHub Actions 对公开仓库免费
- ✅ **必须设置 OSS 跨域规则（CORS）**

详细部署教程请查看 [docs/GITHUB_ACTIONS_DEPLOY.md](docs/GITHUB_ACTIONS_DEPLOY.md) ⭐

---

### 方式三：手动部署（不推荐）

如果你不想使用 GitHub Actions，也可以手动提交配置文件：

```bash
# 1. 配置 OSS
# 编辑 config.public.js，填入你的 OSS 配置（这个文件会被提交到 GitHub）

# 2. 推送到 GitHub
git add .
git commit -m "部署到 GitHub Pages"
git push origin main

# 3. 在 GitHub 仓库设置中启用 Pages
# Settings → Pages → Source: main → Folder: / (root)
```

⚠️ **警告**：这种方式会将 OSS 密钥提交到代码库，仅适用于私有仓库！

详细部署教程请查看 [docs/GITHUB_DEPLOY.md](docs/GITHUB_DEPLOY.md)

---

## ✨ 功能特性

### 📸 甜蜜日常
- 记录每天的甜蜜瞬间
- 支持上传多张照片
- 选择心情表情
- 按日期倒序展示

### 🎉 重要纪念日
- 添加重要纪念日
- 自动计算倒计时
- 支持多种图标
- 照片记录

### ⏰ 时光轴
- 自动整合甜蜜日常和纪念日
- 按时间顺序展示
- 可展开查看照片

### 💝 恋爱计时器
- 实时显示在一起的时间
- 精确到秒
- 动态更新

### 💾 数据管理
- 导出数据备份（JSON 格式）
- 导入数据恢复
- 跨设备数据迁移
- **☁️ 云端同步**：配置 OSS 后自动同步到云端，支持多端访问
- **🔄 刷新数据**：从云端重新加载最新数据

> 💡 **多端同步功能**：配置阿里云 OSS 后，数据会自动同步到云端，不同设备打开网页都能看到最新内容！详见 [多端同步指南](docs/SYNC_GUIDE.md)

---

## 📁 项目结构

```
picture/
├── index.html                # 主页面
├── main.js                   # 主逻辑
├── style.css                 # 样式
├── config.js                 # 配置文件（不提交）
├── config.example.js         # 配置示例
├── docs/                     # 文档目录
│   ├── STATIC_DEPLOY.md     # 静态版本部署文档
│   └── DEPLOY.md            # Python 版本部署文档
└── README.md                 # 本文档
```

---

## 🔧 配置说明

### 阿里云 OSS 配置（可选）

如果你想使用阿里云 OSS 存储图片：

1. 复制配置文件：
```bash
cp config.example.js config.js
```

2. 编辑 `config.js`：
```javascript
const OSS_CONFIG = {
    region: 'oss-cn-beijing',
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    accessKeySecret: 'YOUR_ACCESS_KEY_SECRET',
    bucket: 'YOUR_BUCKET_NAME'
};
```

3. 修改恋爱开始日期：
```javascript
const LOVE_START_DATE = '2022-10-15';
```

**如果不配置 OSS**：图片将使用 Base64 存储在 localStorage（有容量限制）

---

## 🎨 自定义

### 修改恋爱开始日期
编辑 `config.js` 中的 `LOVE_START_DATE`

### 修改页面标题
编辑 `index.html` 中的 `<title>` 和页面标题

### 修改样式
编辑 `style.css`，自定义颜色、字体等

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

## 🔐 安全建议

1. **不要将 `config.js` 提交到公开仓库**
   - 已在 `.gitignore` 中排除
   - 包含 OSS 密钥，需要保密

2. **设置 OSS 跨域规则**
   - 在阿里云 OSS 控制台设置 CORS
   - 允许你的域名访问

3. **定期备份数据**
   - 使用页面底部的"导出数据"功能
   - 防止浏览器清除缓存导致数据丢失

---

## 📱 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🎉 部署平台

### 推荐平台（免费）

| 平台 | 优点 | 缺点 |
|------|------|------|
| **GitHub Pages** | 免费、稳定、简单 | 国内访问较慢 |
| **Vercel** | 快速、自动部署 | 需要注册账号 |
| **Netlify** | 功能强大 | 需要注册账号 |
| **Cloudflare Pages** | 全球 CDN | 需要注册账号 |

详细部署教程请查看 [docs/STATIC_DEPLOY.md](docs/STATIC_DEPLOY.md)

---

## ❓ 常见问题

### 1. 图片上传失败？
- 检查 OSS 配置是否正确
- 检查 OSS 跨域设置
- 查看浏览器控制台错误

### 2. 数据丢失？
- 定期导出数据备份
- 不要在隐私模式下使用
- 不要清除浏览器缓存

### 3. GitHub Pages 404？
- 确保设置为 `/` (root) 目录
- 等待几分钟让部署完成
- 检查文件路径是否正确

更多问题请查看 [docs/STATIC_DEPLOY.md](docs/STATIC_DEPLOY.md)

---

## 📝 更新日志

### v2.0.0 - 纯静态版本
- ✨ 新增纯静态版本，无需后端
- ✨ 使用 localStorage 存储数据
- ✨ 支持数据导出/导入
- ✨ 可部署到 GitHub Pages

### v1.0.0 - Python 版本
- ✨ FastAPI 后端
- ✨ 阿里云 OSS 图片上传
- ✨ JSON 文件存储

---

## 💖 致谢

- 由 [With](https://with.woa.com/) 通过自然语言生成
- 使用 [Tailwind CSS](https://tailwindcss.com/)
- 使用 [Font Awesome](https://fontawesome.com/)
- 使用 [阿里云 OSS](https://www.aliyun.com/product/oss)

---

## 📄 许可证

MIT License

---

## 🎁 祝福

愿你们的爱情永远甜蜜！💕

如有问题或建议，欢迎提 Issue！
