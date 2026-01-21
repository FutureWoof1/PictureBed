# 甜蜜相册 - 情侣纪念日管理系统

## 📖 项目简介

这是一个基于 FastAPI + JSON 文件存储的情侣纪念日管理系统，用于记录和管理甜蜜日常和重要纪念日。系统提供了完整的前后端功能，包括日常记录、纪念日管理、图片上传等功能。

## 🏗️ 技术栈

### 后端
- **FastAPI**: 现代化的 Python Web 框架
- **JSON 文件存储**: 轻量级数据持久化方案
- **Uvicorn**: ASGI 服务器
- **Pydantic**: 数据验证和序列化
- **HTTPX**: 异步 HTTP 客户端（用于图床上传）

### 前端
- **原生 HTML/CSS/JavaScript**: 无框架依赖
- **响应式设计**: 支持移动端和桌面端

### 数据存储
- **JSON 文件**: 本地文件存储，无需数据库

## 📁 项目结构

```
picture/
├── main.py                 # FastAPI 主应用程序
├── requirements.txt        # Python 依赖包
├── run.bat                # Windows 启动脚本
├── Dockerfile             # Docker 容器配置
├── .gitignore             # Git 忽略文件配置
├── .env.example           # 环境变量配置示例
├── data/                  # 数据存储目录（JSON 文件）
│   ├── memories.json      # 甜蜜日常数据
│   ├── anniversaries.json # 纪念日数据
│   └── uploads.json       # 上传记录
└── static/                # 静态资源目录
    ├── index.html         # 前端主页面
    ├── main.js            # 前端 JavaScript 逻辑
    └── style.css          # 样式文件
```

## 🔧 核心执行逻辑

### 1. 应用启动流程

```
启动脚本 (run.bat/uvicorn)
    ↓
加载 FastAPI 应用 (main.py)
    ↓
初始化中间件 (CORS)
    ↓
初始化数据文件 (data/*.json)
    ↓
注册 API 路由
    ↓
挂载静态文件目录
    ↓
启动 Uvicorn 服务器 (0.0.0.0:8000)
```

**详细说明：**

1. **环境检查**: `run.bat` 脚本首先检查 Python 环境和依赖包
2. **依赖安装**: 如果依赖未安装，自动执行 `pip install -r requirements.txt`
3. **配置加载**: 从环境变量加载数据库和图床配置
4. **服务启动**: 使用 Uvicorn 启动 FastAPI 应用，监听 8000 端口

### 2. 数据库连接机制

```python
# 数据库配置从环境变量读取，支持默认值
DB_CONFIG = {
    'host': os.getenv('DB_HOST', '11.142.154.110'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER', 'with_sdsgfuqiplgabccw'),
    'password': os.getenv('DB_PASSWORD', '2K!Yw0V^ulAsll'),
    'database': os.getenv('DB_NAME', 'wbyemtvy'),
    'charset': 'utf8mb4',
    'cursorclass': DictCursor
}

# 每次请求创建新连接，使用后立即关闭
def get_db_connection():
    return pymysql.connect(**DB_CONFIG)
```

**连接策略：**
- 采用**短连接模式**：每次 API 请求创建新连接，操作完成后立即关闭
- 使用 `DictCursor`：查询结果自动转换为字典格式
- 支持环境变量配置：便于不同环境部署

### 3. API 请求处理流程

#### 3.1 甜蜜日常 (Memories) 处理流程

**获取日常列表 (GET /api/memories)**
```
客户端请求
    ↓
FastAPI 路由匹配
    ↓
get_memories() 函数执行
    ↓
创建数据库连接
    ↓
执行 SQL: SELECT * FROM memories ORDER BY date DESC
    ↓
获取查询结果 (fetchall)
    ↓
解析 photos 字段 (JSON 字符串 → 列表)
    ↓
关闭数据库连接
    ↓
返回 JSON 响应: {"code": 0, "data": [...]}
```

**创建日常记录 (POST /api/memories)**
```
客户端提交数据 (Memory 模型)
    ↓
Pydantic 数据验证
    ↓
create_memory() 函数执行
    ↓
创建数据库连接
    ↓
将 photos 列表序列化为 JSON 字符串
    ↓
执行 SQL: INSERT INTO memories (...)
    ↓
提交事务 (conn.commit)
    ↓
获取新记录 ID (cursor.lastrowid)
    ↓
关闭数据库连接
    ↓
返回成功响应: {"code": 0, "data": {"id": xxx}}
```

**删除日常记录 (DELETE /api/memories/{memory_id})**
```
客户端请求删除 (传入 memory_id)
    ↓
FastAPI 路径参数解析
    ↓
delete_memory() 函数执行
    ↓
创建数据库连接
    ↓
执行 SQL: DELETE FROM memories WHERE id = %s
    ↓
提交事务
    ↓
关闭数据库连接
    ↓
返回成功响应: {"code": 0, "message": "删除成功"}
```

#### 3.2 纪念日 (Anniversaries) 处理流程

纪念日的处理流程与甜蜜日常类似，主要区别：
- 数据表：`anniversaries`
- 排序方式：`ORDER BY date ASC` (按日期升序)
- 字段差异：包含 `icon` 字段用于显示图标

#### 3.3 图片上传处理流程（图床模式）

**上传图片 (POST /api/upload)**
```
客户端上传文件 (multipart/form-data)
    ↓
FastAPI 接收 UploadFile 对象
    ↓
upload_image() 函数执行
    ↓
验证文件类型 (必须是 image/*)
    ↓
读取文件内容 (await file.read())
    ↓
生成唯一文件名 (时间戳 + 扩展名)
    ↓
根据配置选择图床服务 (SM.MS/ImgBB/Imgur)
    ↓
调用对应图床 API 上传
    ↓
获取图床返回的图片 URL
    ↓
创建数据库连接
    ↓
记录上传信息到 uploaded_images 表
    ↓
提交事务并关闭连接
    ↓
返回图片访问 URL (图床链接)
```

**关键点：**
- 文件名生成：`{YYYYMMDDHHMMSSffffff}.{ext}` 确保唯一性
- 存储位置：使用阿里云 OSS 对象存储服务
- 访问方式：通过 OSS 公共读权限或 CDN 加速域名访问
- 数据记录：保存文件名和 OSS URL 到 JSON 文件，便于管理和追踪
- 异步上传：使用 oss2 SDK 异步上传，性能优异

### 4. 数据模型与验证

使用 Pydantic 进行数据验证：

```python
class Memory(BaseModel):
    date: str              # 日期
    title: str             # 标题
    content: str           # 内容
    mood: str              # 心情
    photos: Optional[List[str]] = []  # 照片列表（可选）

class Anniversary(BaseModel):
    date: str              # 日期
    name: str              # 名称
    icon: str              # 图标
    description: str       # 描述
    photos: Optional[List[str]] = []  # 照片列表（可选）
```

**验证流程：**
1. 客户端提交 JSON 数据
2. FastAPI 自动调用 Pydantic 模型验证
3. 验证失败返回 422 错误（包含详细错误信息）
4. 验证成功传递给处理函数

### 5. 异常处理机制

```python
try:
    # 业务逻辑
    conn = get_db_connection()
    # ... 数据库操作 ...
    conn.close()
    return {"code": 0, "data": ...}
except Exception as e:
    # 统一异常处理
    raise HTTPException(status_code=500, detail=str(e))
```

**异常处理策略：**
- 所有 API 函数使用 try-except 包裹
- 捕获所有异常并转换为 HTTPException
- 返回 500 状态码和错误详情
- 确保数据库连接在异常时也能正确关闭

### 6. 静态文件服务

```python
# 根路径重定向
@app.get("/")
async def root():
    return RedirectResponse(url="/static/index.html")

# 挂载静态文件目录（必须在最后）
app.mount("/static", StaticFiles(directory="static", html=True), name="static")
```

**访问流程：**
1. 用户访问 `http://localhost:8000/`
2. 自动重定向到 `/static/index.html`
3. FastAPI 从 `static/` 目录提供文件服务
4. 上传的图片通过 `/static/uploads/{filename}` 访问

### 7. CORS 跨域配置

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # 允许所有源
    allow_credentials=True,   # 允许携带凭证
    allow_methods=["*"],      # 允许所有 HTTP 方法
    allow_headers=["*"],      # 允许所有请求头
)
```

**作用：**
- 支持前后端分离开发
- 允许跨域 API 调用
- 生产环境建议限制 `allow_origins`

## 🚀 快速开始

### 方式一：使用启动脚本（本地运行，推荐）

```bash
# Windows 系统
run.bat

# 脚本会自动：
# 1. 检查 Python 环境
# 2. 安装依赖包
# 3. 创建必要目录
# 4. 启动应用
```

### 方式二：部署到 Render（云端部署，推荐）⭐

**最简单的免费云端部署方案！**

```bash
# 1. 推送代码到 GitHub
git add .
git commit -m "Deploy to Render"
git push origin main

# 2. 访问 https://render.com 并连接你的 GitHub 仓库
# 3. 配置环境变量（OSS 配置）
# 4. 点击部署，完成！

# 详细步骤请查看：RENDER_DEPLOY.md
```

**优势**：
- ✅ 完全免费（每月 750 小时）
- ✅ 自动 HTTPS 证书
- ✅ 自动部署（推送代码即部署）
- ✅ 全球 CDN 加速

📖 **[查看完整 Render 部署指南](RENDER_DEPLOY.md)**

### 方式三：手动启动（本地开发）

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 创建上传目录
mkdir -p static/uploads

# 3. 启动应用
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 方式四：Docker 部署

```bash
# 1. 构建镜像
docker build -t sweet-album .

# 2. 运行容器
docker run -d -p 8000:8000 \
  -e DB_HOST=your_db_host \
  -e DB_USER=your_db_user \
  -e DB_PASSWORD=your_db_password \
  -e DB_NAME=your_db_name \
  sweet-album
```

## 🗄️ 数据库表结构

### memories 表（甜蜜日常）
```sql
CREATE TABLE memories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    mood VARCHAR(50),
    photos JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### anniversaries 表（纪念日）
```sql
CREATE TABLE anniversaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(20) NOT NULL,
    name VARCHAR(200) NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    photos JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### uploaded_images 表（上传图片记录）
```sql
CREATE TABLE uploaded_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 API 接口文档

### 甜蜜日常接口

| 方法 | 路径 | 说明 | 请求体 | 响应 |
|------|------|------|--------|------|
| GET | `/api/memories` | 获取所有日常 | - | `{"code": 0, "data": [...]}` |
| POST | `/api/memories` | 创建日常 | Memory 对象 | `{"code": 0, "data": {"id": xxx}}` |
| DELETE | `/api/memories/{id}` | 删除日常 | - | `{"code": 0, "message": "删除成功"}` |

### 纪念日接口

| 方法 | 路径 | 说明 | 请求体 | 响应 |
|------|------|------|--------|------|
| GET | `/api/anniversaries` | 获取所有纪念日 | - | `{"code": 0, "data": [...]}` |
| POST | `/api/anniversaries` | 创建纪念日 | Anniversary 对象 | `{"code": 0, "data": {"id": xxx}}` |
| DELETE | `/api/anniversaries/{id}` | 删除纪念日 | - | `{"code": 0, "message": "删除成功"}` |

### 图片上传接口

| 方法 | 路径 | 说明 | 请求体 | 响应 |
|------|------|------|--------|------|
| POST | `/api/upload` | 上传图片 | multipart/form-data | `{"code": 0, "data": {"url": "..."}}` |

## 🔒 环境变量配置

### 数据库配置

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| DB_HOST | 数据库主机 | 11.142.154.110 |
| DB_PORT | 数据库端口 | 3306 |
| DB_USER | 数据库用户名 | with_sdsgfuqiplgabccw |
| DB_PASSWORD | 数据库密码 | 2K!Yw0V^ulAsll |
| DB_NAME | 数据库名称 | wbyemtvy |

### 阿里云 OSS 配置

| 变量名 | 说明 | 必填 |
|--------|------|------|
| OSS_ACCESS_KEY_ID | AccessKey ID | 是 |
| OSS_ACCESS_KEY_SECRET | AccessKey Secret | 是 |
| OSS_ENDPOINT | OSS 地域节点 | 是 |
| OSS_BUCKET_NAME | Bucket 名称 | 是 |
| OSS_BASE_URL | 自定义域名（CDN） | 否 |
| OSS_UPLOAD_DIR | 上传目录 | 否（默认：sweet-album/） |

### 阿里云 OSS 配置说明

#### 快速配置（推荐）

使用配置向导快速设置：

```bash
# Windows 系统
setup_oss.bat

# 按照提示输入配置信息即可
```

#### 手动配置

1. **复制配置文件**
   ```bash
   cp .env.example .env
   ```

2. **编辑 .env 文件**
   ```bash
   OSS_ACCESS_KEY_ID=your_access_key_id
   OSS_ACCESS_KEY_SECRET=your_access_key_secret
   OSS_ENDPOINT=oss-cn-hangzhou.aliyuncs.com
   OSS_BUCKET_NAME=your_bucket_name
   OSS_BASE_URL=  # 可选，如果配置了 CDN
   OSS_UPLOAD_DIR=sweet-album/
   ```

3. **获取配置信息**
   - 登录阿里云控制台：https://oss.console.aliyun.com/
   - 创建 Bucket（权限设置为"公共读"）
   - 获取 AccessKey：https://ram.console.aliyun.com/manage/ak
   - 记录 Endpoint（例如：oss-cn-hangzhou.aliyuncs.com）

#### 详细配置指南

查看 [OSS_CONFIG.md](OSS_CONFIG.md) 获取完整的配置指南，包括：
- 如何创建 OSS Bucket
- 如何获取 AccessKey
- 如何配置 CDN 加速
- 常见问题解决
- 费用说明

### 配置方法

1. **复制配置文件**:
   ```bash
   cp .env.example .env
   ```

2. **编辑 `.env` 文件**，填入实际配置

3. **重启应用**使配置生效

**安全建议：** 
- 生产环境请通过环境变量设置配置，不要使用默认值
- 不要将 `.env` 文件提交到 Git 仓库
- 定期更换 API 密钥

## 📝 开发说明

### 添加新功能

1. 在 `main.py` 中定义数据模型（Pydantic）
2. 创建数据库表
3. 实现 API 路由函数
4. 在前端 `main.js` 中添加对应的 AJAX 调用
5. 更新 UI 界面

### 调试模式

```bash
# 启用热重载（代码修改自动重启）
uvicorn main:app --reload

# 查看 API 文档
# 访问 http://localhost:8000/docs (Swagger UI)
# 访问 http://localhost:8000/redoc (ReDoc)
```

## 🐛 常见问题

### 1. 数据库连接失败
- 检查数据库配置是否正确
- 确认数据库服务是否启动
- 验证网络连接和防火墙设置

### 2. 图片上传失败
- 检查图床配置是否正确（IMAGE_BED_TYPE 和 IMAGE_BED_API_KEY）
- 验证网络连接，确保能访问图床 API
- 检查文件大小限制（不同图床有不同限制）
- 验证文件类型是否为图片
- 查看错误信息，可能是 API 密钥无效或配额用尽

### 3. 端口被占用
```bash
# 修改启动端口
uvicorn main:app --port 8001
```

## 📄 许可证

本项目仅供学习和个人使用。

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

**访问地址**: http://localhost:8000  
**API 文档**: http://localhost:8000/docs