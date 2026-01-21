# 🔐 GitHub Actions 安全部署指南

## 📋 概述

本指南将教你如何使用 GitHub Actions 安全地部署甜蜜相册，**不将 OSS 密钥提交到代码库**。

### ✨ 优势

- ✅ **安全**：密钥存储在 GitHub Secrets，不会暴露在代码中
- ✅ **自动化**：推送代码后自动部署
- ✅ **灵活**：可以随时更新密钥，无需修改代码
- ✅ **免费**：GitHub Actions 对公开仓库完全免费

---

## 🚀 部署步骤

### 第一步：准备 OSS 配置信息

你需要准备以下信息：

| 配置项 | 说明 | 示例 |
|--------|------|------|
| `OSS_REGION` | OSS 区域 | `oss-cn-beijing` |
| `OSS_ACCESS_KEY_ID` | AccessKey ID | `LTAI5t...` |
| `OSS_ACCESS_KEY_SECRET` | AccessKey Secret | `QQ3I15...` |
| `OSS_BUCKET` | Bucket 名称 | `picturebed0928` |
| `OSS_UPLOAD_DIR` | 上传目录（可选） | `PictureBed/` |
| `OSS_DATA_FILE` | 数据文件路径（可选） | `PictureBed/data.json` |
| `LOVE_START_DATE` | 恋爱开始日期（可选） | `2022-10-15` |

---

### 第二步：设置 GitHub Secrets

1. **打开你的 GitHub 仓库**
   - 访问：`https://github.com/你的用户名/你的仓库名`

2. **进入 Settings**
   - 点击仓库顶部的「Settings」标签

3. **找到 Secrets and variables**
   - 左侧菜单：「Secrets and variables」→「Actions」

4. **添加 Secrets**
   - 点击「New repository secret」按钮
   - 逐个添加以下 Secrets：

#### 必需的 Secrets（必须添加）

```
Name: OSS_REGION
Secret: oss-cn-beijing
```

```
Name: OSS_ACCESS_KEY_ID
Secret: 你的 AccessKey ID
```

```
Name: OSS_ACCESS_KEY_SECRET
Secret: 你的 AccessKey Secret
```

```
Name: OSS_BUCKET
Secret: 你的 Bucket 名称
```

#### 可选的 Secrets（可以不添加，使用默认值）

```
Name: OSS_UPLOAD_DIR
Secret: PictureBed/
```

```
Name: OSS_DATA_FILE
Secret: PictureBed/data.json
```

```
Name: LOVE_START_DATE
Secret: 2022-10-15
```

---

### 第三步：启用 GitHub Pages

1. **进入 Settings → Pages**
   - 在仓库设置中找到「Pages」

2. **配置 Source**
   - Source: `GitHub Actions`（重要！不是 Deploy from a branch）

3. **保存设置**

---

### 第四步：推送代码触发部署

```bash
# 添加所有文件（config.public.js 不会被提交）
git add .

# 提交
git commit -m "使用 GitHub Actions 部署"

# 推送到 GitHub
git push origin main
```

推送后，GitHub Actions 会自动：
1. ✅ 检出代码
2. ✅ 从 Secrets 读取配置
3. ✅ 生成 `config.public.js` 文件
4. ✅ 部署到 GitHub Pages

---

### 第五步：查看部署状态

1. **进入 Actions 标签**
   - 点击仓库顶部的「Actions」

2. **查看工作流运行**
   - 可以看到「部署到 GitHub Pages」工作流
   - 点击查看详细日志

3. **等待部署完成**
   - 通常需要 1-3 分钟
   - 看到绿色的 ✅ 表示成功

4. **访问网站**
   - 部署成功后，访问：`https://你的用户名.github.io/仓库名/`

---

## 🧪 测试部署

### 1. 检查配置是否注入成功

打开网站后，按 `F12` 打开浏览器控制台，输入：

```javascript
console.log(OSS_CONFIG);
```

应该能看到你的 OSS 配置（不是空值）。

### 2. 测试图片上传

1. 点击「记录甜蜜瞬间」
2. 上传一张图片
3. 查看控制台是否有错误
4. 登录阿里云 OSS，检查图片是否上传成功

### 3. 测试多端同步

1. 在设备 A 添加内容
2. 在设备 B 打开网页，点击「刷新数据」
3. 应该能看到设备 A 添加的内容

---

## 🔄 更新配置

如果需要更新 OSS 配置（例如更换 AccessKey）：

1. **进入 GitHub Secrets**
   - Settings → Secrets and variables → Actions

2. **更新 Secret**
   - 找到要更新的 Secret
   - 点击「Update」
   - 输入新值

3. **重新部署**
   - 方式一：推送新的代码
   - 方式二：手动触发工作流
     - Actions → 部署到 GitHub Pages → Run workflow

---

## 🔒 安全最佳实践

### 1. 使用 RAM 子账号（强烈推荐）

不要使用主账号的 AccessKey，而是创建一个只读权限的子账号：

1. **登录阿里云 RAM 控制台**
   - https://ram.console.aliyun.com/

2. **创建用户**
   - 用户管理 → 创建用户
   - 勾选「OpenAPI 调用访问」

3. **授予权限**
   - 只授予必要的权限：
   ```json
   {
     "Version": "1",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "oss:PutObject",
           "oss:GetObject",
           "oss:DeleteObject"
         ],
         "Resource": [
           "acs:oss:*:*:你的bucket名称/PictureBed/*"
         ]
       }
     ]
   }
   ```

4. **使用子账号的 AccessKey**
   - 将子账号的 AccessKey 添加到 GitHub Secrets

### 2. 设置 OSS 跨域规则

在阿里云 OSS 控制台设置 CORS：

```
来源：https://你的用户名.github.io
允许 Methods：GET, POST, PUT, DELETE, HEAD
允许 Headers：*
暴露 Headers：ETag, x-oss-request-id
```

### 3. 定期更换密钥

建议每 3-6 个月更换一次 AccessKey。

### 4. 监控使用情况

在阿里云控制台设置：
- 费用预警
- 流量监控
- 访问日志

---

## 📱 手动触发部署

如果你只想更新配置，不想修改代码：

1. **进入 Actions 标签**
2. **选择「部署到 GitHub Pages」工作流**
3. **点击「Run workflow」**
4. **选择 branch: main**
5. **点击「Run workflow」按钮**

---

## ❓ 常见问题

### 1. 部署失败：`Error: No such file or directory`

**原因**：`.github/workflows/deploy.yml` 文件不存在

**解决**：
```bash
# 确保工作流文件存在
ls .github/workflows/deploy.yml

# 如果不存在，重新创建
mkdir -p .github/workflows
# 然后创建 deploy.yml 文件
```

### 2. 部署成功但配置为空

**原因**：GitHub Secrets 没有设置或名称错误

**解决**：
- 检查 Secrets 名称是否正确（区分大小写）
- 确保所有必需的 Secrets 都已添加

### 3. 图片上传失败：`AccessDenied`

**原因**：OSS 跨域规则未设置或权限不足

**解决**：
- 设置 OSS CORS 规则
- 检查 RAM 权限是否包含 `PutObject`

### 4. 页面 404

**原因**：GitHub Pages 配置错误

**解决**：
- 确保 Pages Source 设置为 `GitHub Actions`
- 不是 `Deploy from a branch`

### 5. 工作流没有触发

**原因**：推送的分支不是 `main`

**解决**：
```bash
# 查看当前分支
git branch

# 如果不是 main，切换到 main
git checkout main

# 或者修改 .github/workflows/deploy.yml 中的分支名
```

---

## 🎯 工作流说明

### 触发条件

工作流会在以下情况下触发：

1. **推送到 main 分支**
   ```bash
   git push origin main
   ```

2. **手动触发**
   - Actions → Run workflow

### 工作流步骤

1. **检出代码**：从仓库拉取最新代码
2. **注入配置**：从 Secrets 读取配置，生成 `config.public.js`
3. **验证配置**：检查配置文件是否生成成功
4. **配置 Pages**：设置 GitHub Pages
5. **上传产物**：上传网站文件
6. **部署**：部署到 GitHub Pages

### 查看日志

在 Actions 标签中可以查看每个步骤的详细日志，方便调试。

---

## 📊 对比：三种部署方式

| 方式 | 安全性 | 便捷性 | 推荐度 |
|------|--------|--------|--------|
| **GitHub Actions**（本方案） | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ 强烈推荐 |
| 提交 config.public.js | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⚠️ 仅私有仓库 |
| 不使用 OSS | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ 简单场景 |

---

## 🎉 完成

现在你的甜蜜相册已经使用 GitHub Actions 安全部署了！

**优势总结**：
- ✅ 密钥不会暴露在代码中
- ✅ 推送代码自动部署
- ✅ 可以随时更新配置
- ✅ 完全免费

**下一步**：
1. ✅ 设置 GitHub Secrets
2. ✅ 推送代码触发部署
3. ✅ 测试图片上传
4. ✅ 享受甜蜜时光！💕

---

## 📚 相关文档

- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [阿里云 OSS 文档](https://help.aliyun.com/product/31815.html)
- [阿里云 RAM 文档](https://help.aliyun.com/product/28625.html)

---

如有问题，欢迎提 Issue！💖
