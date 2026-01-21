# 纯静态版本部署指南

## 🎯 项目说明

这是一个**纯静态网页**版本的甜蜜相册，无需后端服务器，可以直接部署到 GitHub Pages、Vercel、Netlify 等静态托管平台。

### ✨ 特性

- ✅ 纯前端实现，无需后端服务器
- ✅ 使用 localStorage 存储数据
- ✅ 支持阿里云 OSS 图片上传
- ✅ 支持数据导出/导入备份
- ✅ 可部署到任何静态托管平台

---

## 📋 部署前准备

### 1. 配置阿里云 OSS（可选）

如果你想使用阿里云 OSS 存储图片：

1. 复制 `static/config.example.js` 为 `static/config.js`
2. 填入你的 OSS 配置信息：

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
const LOVE_START_DATE = '2022-10-15';  // 改为你们的日期
```

**⚠️ 安全提示**：
- 不要将包含真实密钥的 `config.js` 提交到公开仓库
- 建议在 `.gitignore` 中添加 `static/config.js`

### 2. 如果不使用 OSS

如果不配置 OSS，图片将使用 Base64 编码存储在 localStorage 中：
- ✅ 优点：无需额外配置，开箱即用
- ⚠️ 缺点：localStorage 有 5-10MB 限制，不适合大量图片

---

## 🚀 部署方式

### 方式一：GitHub Pages（推荐）

#### 步骤 1：准备代码

```bash
# 1. 进入项目目录
cd D:/BackUp/Project/Python/picture

# 2. 创建 .gitignore（如果还没有）
echo "static/config.js" >> .gitignore
echo ".env" >> .gitignore

# 3. 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit: 纯静态甜蜜相册"
```

#### 步骤 2：推送到 GitHub

```bash
# 1. 在 GitHub 创建新仓库（例如：sweet-album）
# 2. 关联远程仓库
git remote add origin https://github.com/你的用户名/sweet-album.git
git branch -M main
git push -u origin main
```

#### 步骤 3：配置 GitHub Pages

1. 进入仓库的 **Settings** → **Pages**
2. **Source** 选择 `main` 分支
3. **Folder** 选择 `/static`（因为所有静态文件都在 static 目录）
4. 点击 **Save**

#### 步骤 4：访问网站

等待 1-2 分钟后，访问：
```
https://你的用户名.github.io/sweet-album/
```

---

### 方式二：Vercel（超快部署）

#### 使用 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 进入 static 目录
cd static

# 3. 部署
vercel

# 4. 按提示操作，选择项目设置
```

#### 使用 Vercel 网页

1. 访问 https://vercel.com
2. 点击 **New Project**
3. 导入你的 GitHub 仓库
4. **Root Directory** 设置为 `static`
5. 点击 **Deploy**

---

### 方式三：Netlify

#### 使用 Netlify CLI

```bash
# 1. 安装 Netlify CLI
npm install -g netlify-cli

# 2. 进入 static 目录
cd static

# 3. 部署
netlify deploy --prod

# 4. 选择 static 目录作为发布目录
```

#### 使用 Netlify 网页

1. 访问 https://netlify.com
2. 点击 **Add new site** → **Import an existing project**
3. 连接 GitHub 仓库
4. **Publish directory** 设置为 `static`
5. 点击 **Deploy site**

---

### 方式四：本地运行（测试）

如果只是想在本地测试：

```bash
# 方法 1：使用 Python
cd static
python -m http.server 8000

# 方法 2：使用 Node.js
npx http-server static -p 8000

# 方法 3：使用 VS Code Live Server 插件
# 右键 index.html → Open with Live Server
```

访问：http://localhost:8000

---

## 📁 项目结构

```
picture/
├── static/                    # 静态文件目录（部署这个目录）
│   ├── index.html            # 主页面
│   ├── main.js               # 主逻辑（纯前端版本）
│   ├── style.css             # 样式文件
│   ├── config.js             # 配置文件（不提交到 Git）
│   └── config.example.js     # 配置示例
├── .gitignore                # Git 忽略文件
└── STATIC_DEPLOY.md          # 本文档
```

---

## 💾 数据管理

### 数据存储

所有数据存储在浏览器的 localStorage 中：
- `sweet_album_memories`：甜蜜日常数据
- `sweet_album_anniversaries`：纪念日数据

### 数据备份

在页面底部有两个按钮：

1. **导出数据**：将所有数据导出为 JSON 文件
2. **导入数据**：从 JSON 文件恢复数据

**建议**：定期导出数据备份，防止浏览器清除缓存导致数据丢失。

### 跨设备同步

由于数据存储在本地，不同设备之间的数据不会自动同步。如需同步：

1. 在设备 A 导出数据
2. 将 JSON 文件传输到设备 B
3. 在设备 B 导入数据

---

## 🔐 安全建议

### 1. 保护 OSS 密钥

**方法一：不提交 config.js**（推荐）

```bash
# .gitignore
static/config.js
```

每次部署时手动上传 `config.js`，或在部署平台设置环境变量。

**方法二：使用 STS 临时凭证**

使用阿里云 STS 服务生成临时访问凭证，避免暴露永久密钥。

**方法三：使用 OSS 签名 URL**

配置一个简单的后端服务生成签名 URL，前端通过签名 URL 上传。

### 2. 设置 OSS 跨域

在阿里云 OSS 控制台设置 CORS 规则：

```xml
<CORSRule>
  <AllowedOrigin>https://你的域名.com</AllowedOrigin>
  <AllowedMethod>GET</AllowedMethod>
  <AllowedMethod>POST</AllowedMethod>
  <AllowedMethod>PUT</AllowedMethod>
  <AllowedHeader>*</AllowedHeader>
</CORSRule>
```

### 3. 设置 OSS 防盗链

在 OSS 控制台设置 Referer 白名单，防止图片被盗用。

---

## 🔄 更新部署

### GitHub Pages

```bash
# 1. 修改代码
# 2. 提交并推送
git add .
git commit -m "更新内容"
git push origin main

# 3. GitHub Pages 会自动重新部署
```

### Vercel / Netlify

推送到 GitHub 后会自动触发部署，无需手动操作。

---

## ❓ 常见问题

### 1. 图片上传失败

**原因**：
- OSS 配置错误
- OSS 跨域未设置
- 网络问题

**解决**：
1. 检查 `config.js` 配置是否正确
2. 在 OSS 控制台设置 CORS
3. 查看浏览器控制台错误信息

### 2. 数据丢失

**原因**：
- 浏览器清除了缓存
- 使用了隐私模式

**解决**：
1. 定期导出数据备份
2. 不要在隐私模式下使用
3. 考虑使用云存储方案

### 3. GitHub Pages 404

**原因**：
- 部署目录设置错误
- 文件路径大小写问题

**解决**：
1. 确保 Pages 设置为 `/static` 目录
2. 检查文件路径是否正确
3. 等待几分钟让 GitHub 完成部署

### 4. 图片太多导致 localStorage 满了

**原因**：
- localStorage 有 5-10MB 限制
- 使用 Base64 存储图片占用空间大

**解决**：
1. 配置阿里云 OSS 存储图片
2. 删除一些旧照片
3. 导出数据后清空重新开始

---

## 🎨 自定义

### 修改恋爱开始日期

编辑 `static/config.js`：

```javascript
const LOVE_START_DATE = '2022-10-15';  // 改为你们的日期
```

### 修改页面标题

编辑 `static/index.html`：

```html
<title>我们的甜蜜时光 💕</title>
<h1 class="nav-title">💑 我们的爱情故事</h1>
```

### 修改样式

编辑 `static/style.css`，自定义颜色、字体等。

---

## 📞 技术支持

如有问题，请检查：
1. 浏览器控制台（F12）的错误信息
2. OSS 配置是否正确
3. 网络连接是否正常

---

## 🎉 完成

现在你的甜蜜相册已经部署成功！

- ✅ 无需服务器，完全免费
- ✅ 访问速度快
- ✅ 数据安全可控
- ✅ 随时随地访问

祝你们甜蜜幸福！💕
