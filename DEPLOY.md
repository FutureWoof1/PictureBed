# Git 部署指南

## 🎯 快速导航

- **[本地运行](#本地开发运行当前电脑)**：在你的开发电脑上直接运行（不需要 Git 克隆）
- **[推送到 Git](#准备工作)**：将代码上传到 GitHub/Gitee
- **[部署到 Render](RENDER_DEPLOY.md)**：免费云平台部署（推荐，最简单）⭐
- **[部署到服务器](#部署到远程服务器需要克隆)**：在云服务器上运行（需要 Git 克隆）

---

## 💻 本地开发运行（当前电脑）

> **适用场景**：你已经有代码在本地，只想在当前电脑上运行测试

```bash
# 1. 进入项目目录
cd D:/BackUp/Project/Python/picture

# 2. 安装依赖
pip install -r requirements.txt

# 3. 配置环境变量（可选）
# 如果使用默认的 SM.MS 图床，可以跳过此步骤
# cp .env.example .env

# 4. 启动应用
uvicorn main:app --reload
```

访问：http://localhost:8000

**说明**：
- ✅ 不需要 `git clone`，因为代码已经在你的电脑上
- ✅ `--reload` 参数会在代码修改时自动重启，方便开发
- ✅ 默认使用 SM.MS 免费图床，无需额外配置

---

## 📦 准备工作

### 1. 初始化 Git 仓库

```bash
# 进入项目目录
cd D:/BackUp/Project/Python/picture

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交初始版本
git commit -m "Initial commit: 甜蜜相册项目 - 支持图床上传"
```

### 2. 创建 GitHub/Gitee 仓库

#### GitHub
1. 访问 https://github.com/new
2. 创建新仓库（例如：`sweet-album`）
3. 选择 **Public** 或 **Private**
4. **不要**勾选 "Initialize this repository with a README"

#### Gitee（国内推荐）
1. 访问 https://gitee.com/projects/new
2. 创建新仓库（例如：`sweet-album`）
3. 选择 **公开** 或 **私有**
4. **不要**勾选 "使用 Readme 文件初始化这个仓库"

### 3. 关联远程仓库并推送

```bash
# GitHub
git remote add origin https://github.com/你的用户名/sweet-album.git
git branch -M main
git push -u origin main

# 或者 Gitee
git remote add origin https://gitee.com/你的用户名/sweet-album.git
git branch -M main
git push -u origin main
```

## 🚀 部署到服务器

> **重要说明**：以下步骤适用于**将代码部署到远程服务器**（如阿里云、腾讯云等）。
> 
> - ✅ **需要克隆**：在远程服务器、团队成员电脑等**没有代码**的环境
> - ❌ **不需要克隆**：在你当前的开发电脑上（代码已经存在于 `D:/BackUp/Project/Python/picture`）

### 本地开发运行（当前电脑）

如果你只是想在当前电脑上运行项目：

```bash
# 进入项目目录
cd D:/BackUp/Project/Python/picture

# 安装依赖
pip install -r requirements.txt

# 配置环境变量（可选，使用默认配置也可以）
# cp .env.example .env

# 启动应用
uvicorn main:app --reload  # 开发模式，代码修改自动重启
# 或
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

访问：http://localhost:8000

### 方式一：部署到远程服务器（需要克隆）

**使用场景**：将项目部署到阿里云、腾讯云、AWS 等云服务器

```bash
# 1. SSH 登录到远程服务器
ssh user@your-server-ip

# 2. 克隆仓库（从 Git 获取代码）
git clone https://github.com/你的用户名/sweet-album.git
cd sweet-album

# 2. 安装依赖
pip install -r requirements.txt

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入实际配置

# 4. 启动应用
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 方式二：使用 Docker 部署

```bash
# 1. 克隆仓库
git clone https://github.com/你的用户名/sweet-album.git
cd sweet-album

# 2. 构建镜像
docker build -t sweet-album .

# 3. 运行容器
docker run -d -p 8000:8000 \
  -e DB_HOST=your_db_host \
  -e DB_USER=your_db_user \
  -e DB_PASSWORD=your_db_password \
  -e DB_NAME=your_db_name \
  -e IMAGE_BED_TYPE=smms \
  -e IMAGE_BED_API_KEY=your_api_key \
  --name sweet-album \
  sweet-album
```

### 方式三：使用 Systemd 守护进程（Linux）

创建服务文件 `/etc/systemd/system/sweet-album.service`:

```ini
[Unit]
Description=Sweet Album Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/sweet-album
Environment="PATH=/usr/local/bin:/usr/bin:/bin"
EnvironmentFile=/path/to/sweet-album/.env
ExecStart=/usr/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable sweet-album
sudo systemctl start sweet-album
sudo systemctl status sweet-album
```

## 🔄 更新部署

### 本地开发流程

```bash
# 1. 修改代码
# ... 编辑文件 ...

# 2. 测试
uvicorn main:app --reload

# 3. 提交更改
git add .
git commit -m "描述你的更改"
git push origin main
```

### 服务器更新流程

```bash
# 1. 拉取最新代码
cd /path/to/sweet-album
git pull origin main

# 2. 更新依赖（如果有变化）
pip install -r requirements.txt

# 3. 重启服务
# 如果使用 systemd
sudo systemctl restart sweet-album

# 如果使用 Docker
docker restart sweet-album

# 如果直接运行
# 先停止旧进程，再启动新进程
```

## 🔐 安全建议

### 1. 保护敏感信息

- ✅ 已添加 `.gitignore`，排除 `.env` 文件
- ✅ 使用 `.env.example` 作为配置模板
- ⚠️ **永远不要**将真实的数据库密码和 API 密钥提交到 Git

### 2. 修改默认配置

在 `main.py` 中，建议移除默认值，强制使用环境变量：

```python
# 不推荐（有默认值）
'host': os.getenv('DB_HOST', '11.142.154.110'),

# 推荐（强制配置）
'host': os.getenv('DB_HOST'),  # 如果未设置会报错
```

### 3. 使用 HTTPS

生产环境建议使用 Nginx 反向代理并配置 SSL 证书：

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 图床迁移说明

### 从本地存储迁移到图床

如果你之前使用本地存储，现在想迁移到图床：

1. **数据库中的图片 URL 需要更新**
   - 旧格式：`/static/uploads/20240120123456.jpg`
   - 新格式：`https://sm.ms/xxx/xxx.jpg`

2. **迁移脚本示例**（可选）：

```python
import pymysql
import os
import httpx
import asyncio

async def migrate_images():
    conn = pymysql.connect(
        host='your_host',
        user='your_user',
        password='your_password',
        database='your_database'
    )
    
    cursor = conn.cursor()
    cursor.execute("SELECT id, photos FROM memories")
    
    for row in cursor.fetchall():
        memory_id, photos = row
        # 处理每个图片 URL
        # ... 上传到图床并更新数据库 ...
    
    conn.close()

# 运行迁移
asyncio.run(migrate_images())
```

## 🎯 最佳实践

### 1. 分支管理

```bash
# 创建开发分支
git checkout -b develop

# 创建功能分支
git checkout -b feature/new-feature

# 合并到主分支
git checkout main
git merge feature/new-feature
```

### 2. 版本标签

```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 3. 自动化部署（GitHub Actions）

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Server

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/sweet-album
            git pull origin main
            pip install -r requirements.txt
            sudo systemctl restart sweet-album
```

## 📞 问题排查

### 1. 推送失败

```bash
# 如果遇到推送失败，可能需要先拉取
git pull origin main --rebase
git push origin main
```

### 2. 图床上传失败

- 检查网络连接
- 验证 API 密钥是否正确
- 查看图床服务状态
- 检查文件大小是否超限

### 3. 环境变量未生效

```bash
# 确保 .env 文件在正确位置
ls -la .env

# 检查环境变量是否加载
python -c "import os; print(os.getenv('IMAGE_BED_TYPE'))"
```

## 🎉 完成

现在你的项目已经：
- ✅ 使用图床存储图片（不占用服务器空间）
- ✅ 代码托管在 Git 仓库
- ✅ 可以轻松部署到任何服务器
- ✅ 支持多种图床服务切换
- ✅ 配置文件与代码分离，更安全

祝你使用愉快！💕