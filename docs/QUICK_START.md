# 🚀 快速开始：使用 GitHub Actions 部署

## 📋 准备工作

你需要：
- ✅ 一个 GitHub 账号
- ✅ 阿里云 OSS 账号和配置信息
- ✅ 5 分钟时间

---

## 🎯 三步部署

### 第一步：配置 GitHub Secrets（2 分钟）

#### 方式一：使用配置助手（推荐）

1. **运行配置助手**
   ```bash
   # Windows 用户双击运行
   setup-secrets.bat
   ```

2. **按提示输入信息**
   - OSS 区域
   - AccessKey ID
   - AccessKey Secret
   - Bucket 名称
   - 其他配置（可选）

3. **查看生成的配置清单**
   - 打开 `secrets.txt`
   - 复制配置信息

#### 方式二：手动准备

准备以下信息：
```
OSS_REGION: oss-cn-beijing
OSS_ACCESS_KEY_ID: 你的 AccessKey ID
OSS_ACCESS_KEY_SECRET: 你的 AccessKey Secret
OSS_BUCKET: 你的 Bucket 名称
```

---

### 第二步：添加到 GitHub（2 分钟）

1. **打开你的 GitHub 仓库**
   - 访问：`https://github.com/你的用户名/你的仓库名`

2. **进入 Settings**
   - 点击顶部的「Settings」标签

3. **添加 Secrets**
   - 左侧菜单：「Secrets and variables」→「Actions」
   - 点击「New repository secret」
   - 逐个添加配置（从 secrets.txt 复制）

4. **启用 GitHub Pages**
   - 左侧菜单：「Pages」
   - Source 选择：`GitHub Actions`
   - 保存

---

### 第三步：推送代码部署（1 分钟）

```bash
# 添加所有文件
git add .

# 提交
git commit -m "使用 GitHub Actions 部署"

# 推送（会自动触发部署）
git push origin main
```

---

## ✅ 验证部署

### 1. 查看部署状态

1. **进入 Actions 标签**
   - 点击仓库顶部的「Actions」

2. **查看工作流**
   - 可以看到「部署到 GitHub Pages」正在运行
   - 等待 1-3 分钟

3. **部署成功**
   - 看到绿色的 ✅ 表示成功
   - 点击查看部署地址

### 2. 访问网站

访问：`https://你的用户名.github.io/仓库名/`

### 3. 测试功能

1. **测试配置**
   - 按 F12 打开控制台
   - 输入：`console.log(OSS_CONFIG)`
   - 应该能看到你的配置

2. **测试上传**
   - 点击「记录甜蜜瞬间」
   - 上传一张图片
   - 查看是否成功

3. **测试同步**
   - 在另一个设备打开网页
   - 点击「刷新数据」
   - 应该能看到刚才添加的内容

---

## 🎉 完成！

现在你的甜蜜相册已经成功部署了！

**你做到了**：
- ✅ 密钥安全存储在 GitHub Secrets
- ✅ 推送代码自动部署
- ✅ 支持图片上传到 OSS
- ✅ 支持多端数据同步

---

## 🔄 日常使用

### 添加内容

1. 打开网站
2. 添加甜蜜日常或纪念日
3. 上传照片
4. 自动同步到云端

### 更新代码

```bash
# 修改代码
git add .
git commit -m "更新内容"
git push origin main

# 自动重新部署
```

### 更新配置

1. 进入 GitHub Secrets
2. 更新需要修改的 Secret
3. 手动触发部署：
   - Actions → 部署到 GitHub Pages → Run workflow

---

## ❓ 遇到问题？

### 部署失败

**检查清单**：
- ✅ 所有必需的 Secrets 都已添加
- ✅ Secret 名称正确（区分大小写）
- ✅ Pages Source 设置为 `GitHub Actions`
- ✅ 推送的分支是 `main`

**查看日志**：
- Actions → 点击失败的工作流 → 查看详细日志

### 图片上传失败

**检查清单**：
- ✅ OSS 配置正确
- ✅ OSS 跨域规则已设置
- ✅ AccessKey 有写入权限

**设置 CORS**：
```
来源：https://你的用户名.github.io
允许 Methods：GET, POST, PUT, DELETE, HEAD
允许 Headers：*
暴露 Headers：ETag, x-oss-request-id
```

### 配置为空

**原因**：Secrets 没有正确设置

**解决**：
1. 检查 Secrets 名称是否正确
2. 重新添加 Secrets
3. 手动触发部署

---

## 📚 更多帮助

- 📖 [详细部署指南](GITHUB_ACTIONS_DEPLOY.md)
- 📖 [多端同步指南](SYNC_GUIDE.md)
- 📖 [常见问题](GITHUB_ACTIONS_DEPLOY.md#常见问题)

---

## 💡 提示

### 安全建议

1. **使用 RAM 子账号**
   - 不要使用主账号 AccessKey
   - 只授予必要的权限

2. **定期更换密钥**
   - 建议每 3-6 个月更换一次

3. **监控使用情况**
   - 设置费用预警
   - 查看访问日志

### 性能优化

1. **图片压缩**
   - 上传前压缩图片
   - 减少存储和流量成本

2. **定期备份**
   - 使用「导出数据」功能
   - 保存到本地

---

## 🎁 享受甜蜜时光

现在一切就绪，开始记录你们的甜蜜回忆吧！💕

如有问题，欢迎提 Issue！
