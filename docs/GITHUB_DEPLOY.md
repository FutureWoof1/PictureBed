# 🚀 GitHub Pages 部署指南（含 OSS 配置）

## ⚠️ 重要提示

由于 OSS 配置包含敏感的 AccessKey，部署到 GitHub 时需要特别注意安全！

---

## 📋 部署步骤

### 1. 配置 OSS

编辑 `config.public.js` 文件（这个文件会被提交到 GitHub）：

```javascript
const OSS_CONFIG = {
    region: 'oss-cn-beijing',
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    accessKeySecret: 'YOUR_ACCESS_KEY_SECRET',
    bucket: 'YOUR_BUCKET_NAME',
    uploadDir: 'PictureBed/',
    dataFile: 'PictureBed/data.json'
};

const LOVE_START_DATE = '2022-10-15';
```

### 2. 设置 OSS 跨域规则（重要！）

在阿里云 OSS 控制台设置 CORS：

1. 登录阿里云 OSS 控制台
2. 选择你的 Bucket
3. 找到「数据安全」→「跨域设置」
4. 点击「创建规则」，填写：

```
来源：*
（或者指定你的 GitHub Pages 域名：https://你的用户名.github.io）

允许 Methods：GET, POST, PUT, DELETE, HEAD

允许 Headers：*

暴露 Headers：ETag, x-oss-request-id

缓存时间：600
```

### 3. 设置 OSS Bucket 权限

**方式一：公共读（简单但不够安全）**
- 在 Bucket 设置中，将「读写权限」设置为「公共读」

**方式二：Bucket Policy（推荐）**
- 设置 Bucket Policy，只允许读取特定目录：

```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": ["*"],
      "Action": ["oss:GetObject"],
      "Resource": ["acs:oss:*:*:你的bucket名称/PictureBed/*"]
    }
  ]
}
```

### 4. 推送到 GitHub

```bash
# 添加所有文件（config.public.js 会被提交）
git add .

# 提交
git commit -m "部署到 GitHub Pages"

# 推送
git push origin main
```

### 5. 启用 GitHub Pages

1. 进入 GitHub 仓库
2. 点击「Settings」
3. 找到「Pages」
4. 在「Source」中选择：
   - Branch: `main`
   - Folder: `/ (root)`
5. 点击「Save」
6. 等待几分钟，访问你的网站

---

## 🔒 安全建议

### ⚠️ 如果你的仓库是公开的

**强烈建议**使用只读权限的子账号 AccessKey：

1. 登录阿里云 RAM 控制台
2. 创建一个子账号
3. 只授予以下权限：
   - `AliyunOSSReadOnlyAccess`（只读）
   - 或者自定义策略，只允许读写指定 Bucket 的指定目录

4. 使用子账号的 AccessKey 配置 `config.public.js`

### 🔐 如果你的仓库是私有的

可以直接使用主账号的 AccessKey，但仍然建议：
- 定期更换 AccessKey
- 监控 OSS 使用情况
- 设置费用预警

---

## 🧪 测试部署

部署完成后，打开浏览器控制台（F12），检查：

### 1. 检查配置是否加载

在控制台输入：
```javascript
console.log(OSS_CONFIG);
```

应该能看到你的 OSS 配置。

### 2. 检查 OSS 连接

上传一张图片，查看控制台是否有错误：
- ✅ 如果成功：会显示「✅ OSS 已配置，数据将自动同步到云端」
- ❌ 如果失败：会显示错误信息

### 3. 常见错误

#### 错误 1：`AccessDenied`
**原因**：OSS 跨域规则未设置或 Bucket 权限不足
**解决**：检查 CORS 设置和 Bucket 权限

#### 错误 2：`InvalidAccessKeyId`
**原因**：AccessKey 配置错误
**解决**：检查 `config.public.js` 中的配置

#### 错误 3：`NoSuchBucket`
**原因**：Bucket 名称错误或不存在
**解决**：检查 Bucket 名称是否正确

#### 错误 4：图片上传失败
**原因**：没有写入权限
**解决**：检查 RAM 权限，确保有 `PutObject` 权限

---

## 📱 多端同步测试

1. **设备 A**：打开网页，添加一条甜蜜日常
2. **设备 B**：打开网页，点击「刷新数据」按钮
3. **验证**：设备 B 应该能看到设备 A 添加的内容

---

## 🔄 更新配置

如果需要更新 OSS 配置：

1. 修改 `config.public.js`
2. 提交并推送到 GitHub
3. GitHub Pages 会自动重新部署（可能需要几分钟）
4. 清除浏览器缓存后刷新页面

---

## 💡 本地开发

本地开发时，可以使用 `config.js`（不会被提交）：

```bash
# 复制配置
cp config.public.js config.js

# 修改 config.js（只在本地使用）
```

页面会优先加载 `config.public.js`，如果不存在则加载 `config.js`。

---

## ❓ 常见问题

### 1. 为什么要用 config.public.js？

- `config.js`：本地开发使用，不提交到 Git
- `config.public.js`：部署使用，会提交到 Git

### 2. AccessKey 会泄露吗？

如果仓库是公开的，AccessKey 会被看到。所以建议：
- 使用只读权限的子账号
- 或者将仓库设为私有

### 3. 可以不用 OSS 吗？

可以！如果不配置 OSS：
- 图片会使用 Base64 存储在 localStorage
- 数据只保存在本地浏览器
- 不支持多端同步

### 4. 如何保护 AccessKey？

**最佳实践**：
1. 使用 RAM 子账号
2. 只授予最小权限
3. 设置 IP 白名单
4. 定期更换密钥
5. 监控使用情况

---

## 🎉 完成

现在你的甜蜜相册已经部署到 GitHub Pages，并且支持 OSS 图片上传和多端同步了！

访问地址：`https://你的用户名.github.io/仓库名/`

祝你使用愉快！💕
