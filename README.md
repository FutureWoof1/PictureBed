# 甜蜜相册 💕

一个记录恋爱时光的网页应用，支持记录甜蜜日常、重要纪念日，并自动生成时光轴。

## 🎯 版本说明

本项目提供两个版本：

### 1. 纯静态版本（推荐）⭐
- ✅ 无需后端服务器
- ✅ 使用 localStorage 存储数据
- ✅ 支持阿里云 OSS 图片上传
- ✅ 可部署到 GitHub Pages、Vercel、Netlify
- 📖 [查看部署文档](STATIC_DEPLOY.md)

### 2. Python 后端版本
- 使用 FastAPI 后端
- 使用 JSON 文件存储数据
- 支持阿里云 OSS 图片上传
- 📖 [查看部署文档](DEPLOY.md)

---

## 🚀 快速开始（纯静态版本）

### 方式一：直接打开（本地测试）

1. 进入 `static` 目录
2. 双击打开 `index.html`（或使用本地服务器）

### 方式二：部署到 GitHub Pages

```bash
# 1. 配置 OSS（可选）
cp static/config.example.js static/config.js
# 编辑 static/config.js，填入你的 OSS 配置

# 2. 推送到 GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/sweet-album.git
git push -u origin main

# 3. 在 GitHub 仓库设置中启用 Pages
# Settings → Pages → Source: main → Folder: /static
```

详细部署教程请查看 [STATIC_DEPLOY.md](STATIC_DEPLOY.md)

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

---

## 📁 项目结构

```
picture/
├── static/                    # 静态文件（纯前端版本）
│   ├── index.html            # 主页面
│   ├── main.js               # 主逻辑
│   ├── style.css             # 样式
│   ├── config.js             # 配置文件（不提交）
│   └── config.example.js     # 配置示例
├── main.py                   # Python 后端（可选）
├── requirements.txt          # Python 依赖
├── STATIC_DEPLOY.md          # 静态版本部署文档
├── DEPLOY.md                 # Python 版本部署文档
└── README.md                 # 本文档
```

---

## 🔧 配置说明

### 阿里云 OSS 配置（可选）

如果你想使用阿里云 OSS 存储图片：

1. 复制配置文件：
```bash
cp static/config.example.js static/config.js
```

2. 编辑 `static/config.js`：
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
编辑 `static/config.js` 中的 `LOVE_START_DATE`

### 修改页面标题
编辑 `static/index.html` 中的 `<title>` 和页面标题

### 修改样式
编辑 `static/style.css`，自定义颜色、字体等

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

1. **不要将 `static/config.js` 提交到公开仓库**
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

详细部署教程请查看 [STATIC_DEPLOY.md](STATIC_DEPLOY.md)

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
- 确保设置为 `/static` 目录
- 等待几分钟让部署完成
- 检查文件路径是否正确

更多问题请查看 [STATIC_DEPLOY.md](STATIC_DEPLOY.md)

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
