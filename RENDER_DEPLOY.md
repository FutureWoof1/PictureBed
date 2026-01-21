# Render 部署指南

## 🚀 快速部署到 Render

Render 是一个现代化的云平台，提供免费的 Web 服务托管，非常适合部署 FastAPI 应用。

### ✨ 为什么选择 Render？

- ✅ **完全免费**：每月 750 小时免费额度（足够一个应用 24/7 运行）
- ✅ **自动 HTTPS**：免费提供 SSL 证书
- ✅ **自动部署**：连接 GitHub 后，每次推送代码自动部署
- ✅ **环境变量管理**：安全存储敏感配置
- ✅ **支持 Python**：原生支持 FastAPI/Uvicorn
- ✅ **全球 CDN**：访问速度快

---

## 📋 部署前准备

### 1. 确保代码已推送到 GitHub

```bash
# 如果还没有推送到 GitHub
git add .
git commit -m "Add Render deployment config"
git push origin main
```

### 2. 准备 OSS 配置信息

你需要准备以下阿里云 OSS 配置信息：
- `OSS_ACCESS_KEY_ID`：你的 AccessKey ID
- `OSS_ACCESS_KEY_SECRET`：你的 AccessKey Secret
- `OSS_ENDPOINT`：OSS 节点（如 `oss-cn-beijing.aliyuncs.com`）
- `OSS_BUCKET_NAME`：Bucket 名称（如 `picturebed0928`）
- `OSS_BASE_URL`：（可选）自定义域名

---

## 🎯 部署步骤

### 步骤 1：注册 Render 账号

1. 访问 [https://render.com](https://render.com)
2. 点击右上角 **Sign Up**
3. 选择 **Sign up with GitHub**（推荐，方便后续连接仓库）
4. 授权 Render 访问你的 GitHub 账号

### 步骤 2：创建 Web Service

1. 登录后，点击右上角 **New +** 按钮
2. 选择 **Web Service**
3. 在右侧找到你的 `sweet-album` 仓库，点击 **Connect**
   - 如果没看到仓库，点击 **Configure account** 授权更多仓库

### 步骤 3：配置服务

Render 会自动检测到 `render.yaml` 配置文件，但你需要确认以下信息：

#### 基本配置
- **Name**: `sweet-album`（或你喜欢的名字）
- **Region**: `Oregon (US West)` 或 `Singapore`（推荐，延迟较低）
- **Branch**: `main`
- **Runtime**: `Python 3`

#### 构建配置（自动填充）
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### 计费方案
- **Instance Type**: 选择 **Free**（免费方案）

### 步骤 4：配置环境变量

在 **Environment Variables** 部分，添加以下环境变量：

| Key | Value | 说明 |
|-----|-------|------|
| `OSS_ACCESS_KEY_ID` | `你的AccessKey ID` | ⚠️ 必填 |
| `OSS_ACCESS_KEY_SECRET` | `你的AccessKey Secret` | ⚠️ 必填 |
| `OSS_ENDPOINT` | `oss-cn-beijing.aliyuncs.com` | ⚠️ 必填，替换为你的节点 |
| `OSS_BUCKET_NAME` | `picturebed0928` | ⚠️ 必填，替换为你的 Bucket |
| `OSS_BASE_URL` | `https://your-domain.com` | 可选，自定义域名 |
| `OSS_UPLOAD_DIR` | `sweet-album/` | 可选，默认值 |
| `DATA_DIR` | `data` | 可选，默认值 |

**添加方式**：
1. 点击 **Add Environment Variable**
2. 输入 Key 和 Value
3. 重复添加所有必需的环境变量

### 步骤 5：部署

1. 确认所有配置无误
2. 点击底部的 **Create Web Service** 按钮
3. Render 开始自动部署（约 2-3 分钟）

---

## 📊 部署过程

部署时你会看到实时日志：

```
==> Cloning from https://github.com/你的用户名/sweet-album...
==> Checking out commit abc123...
==> Running build command 'pip install -r requirements.txt'...
    Collecting fastapi
    Collecting uvicorn
    ...
==> Build successful 🎉
==> Starting service with 'uvicorn main:app --host 0.0.0.0 --port $PORT'...
    INFO:     Started server process
    INFO:     Waiting for application startup.
    [OK] 数据文件初始化完成: data
    [OK] 阿里云 OSS 初始化成功: picturebed0928
    INFO:     Application startup complete.
==> Your service is live 🎉
```

---

## 🎉 部署成功

部署成功后，你会获得一个访问地址：

```
https://sweet-album-xxxx.onrender.com
```

### 测试你的应用

1. 访问上面的地址
2. 尝试添加甜蜜日常
3. 上传图片测试

---

## 🔄 更新部署

### 自动部署（推荐）

每次你推送代码到 GitHub，Render 会自动重新部署：

```bash
# 1. 修改代码
# ... 编辑文件 ...

# 2. 提交并推送
git add .
git commit -m "更新功能"
git push origin main

# 3. Render 自动检测并部署（无需手动操作）
```

### 手动部署

如果需要手动触发部署：

1. 登录 Render Dashboard
2. 进入你的 `sweet-album` 服务
3. 点击右上角 **Manual Deploy** → **Deploy latest commit**

---

## 🔧 管理你的服务

### 查看日志

1. 进入 Render Dashboard
2. 点击你的服务名称
3. 选择 **Logs** 标签
4. 查看实时日志和历史日志

### 修改环境变量

1. 进入服务详情页
2. 选择 **Environment** 标签
3. 修改或添加环境变量
4. 点击 **Save Changes**
5. 服务会自动重启

### 查看服务状态

在 Dashboard 可以看到：
- ✅ **Live**：服务正常运行
- 🔄 **Deploying**：正在部署
- ❌ **Failed**：部署失败（查看日志排查）

---

## ⚠️ 免费方案限制

Render 免费方案有以下限制：

| 限制项 | 说明 |
|--------|------|
| **休眠机制** | 15 分钟无请求后自动休眠，下次访问需要 30-60 秒唤醒 |
| **带宽** | 每月 100 GB 流量 |
| **构建时间** | 每月 500 分钟构建时间 |
| **磁盘空间** | 临时存储，重启后丢失（所以我们用 OSS 存图片） |
| **数据库** | 不包含数据库（我们用 JSON 文件存储） |

### 💡 避免休眠的方法

如果不想服务休眠，可以使用定时 Ping 服务：

#### 方法 1：使用 UptimeRobot（推荐）

1. 访问 [https://uptimerobot.com](https://uptimerobot.com)
2. 注册免费账号
3. 添加监控：
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://sweet-album-xxxx.onrender.com`
   - **Monitoring Interval**: 5 minutes
4. 保存，服务会每 5 分钟访问一次，保持唤醒

#### 方法 2：使用 Cron-job.org

1. 访问 [https://cron-job.org](https://cron-job.org)
2. 注册账号
3. 创建定时任务，每 10 分钟访问一次你的服务

---

## 🐛 常见问题

### 1. 部署失败：找不到 requirements.txt

**原因**：文件未推送到 GitHub

**解决**：
```bash
git add requirements.txt
git commit -m "Add requirements.txt"
git push origin main
```

### 2. 服务启动失败：OSS 初始化错误

**原因**：环境变量配置错误

**解决**：
1. 检查 Render Dashboard 中的环境变量
2. 确保 `OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET` 等都已正确填写
3. 注意不要有多余的空格或引号

### 3. 图片上传失败

**原因**：OSS 配置错误或权限不足

**解决**：
1. 检查 OSS Bucket 是否设置为公共读
2. 确认 AccessKey 有上传权限
3. 查看 Render 日志中的详细错误信息

### 4. 访问速度慢

**原因**：Render 服务器在国外

**解决**：
- 选择 Singapore 区域（相对国内较快）
- 或者使用国内云服务器（阿里云、腾讯云）

### 5. 数据丢失

**原因**：Render 免费方案的磁盘是临时的

**解决**：
- ✅ 图片已存储在 OSS，不会丢失
- ⚠️ JSON 数据文件会在服务重启后丢失
- 💡 建议升级到付费方案或使用外部数据库

---

## 🔐 安全建议

### 1. 保护环境变量

- ✅ 永远不要将 `.env` 文件推送到 GitHub
- ✅ 在 Render 中使用环境变量管理敏感信息
- ✅ 定期更换 AccessKey

### 2. 设置访问限制

如果不想公开访问，可以：
- 在前端添加密码保护
- 使用 Render 的 IP 白名单功能（付费功能）

### 3. 监控服务

- 定期查看 Render 日志
- 设置 UptimeRobot 监控服务可用性
- 关注 OSS 的流量和费用

---

## 📈 升级到付费方案

如果需要更好的性能，可以升级到 Render 付费方案：

| 方案 | 价格 | 特性 |
|------|------|------|
| **Starter** | $7/月 | 无休眠、更多资源 |
| **Standard** | $25/月 | 更高性能、自动扩展 |
| **Pro** | $85/月 | 专用资源、优先支持 |

---

## 🎯 总结

现在你的甜蜜相册已经部署到 Render：

- ✅ 免费托管，自动 HTTPS
- ✅ 连接 GitHub，自动部署
- ✅ 图片存储在阿里云 OSS
- ✅ 全球可访问

**下一步**：
1. 分享你的应用地址给 TA 💕
2. 设置 UptimeRobot 避免休眠
3. 定期备份 JSON 数据文件

祝你使用愉快！🎉
