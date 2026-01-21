import os
import json
import base64
import httpx
import oss2
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = FastAPI()

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据存储配置（使用 JSON 文件）
DATA_DIR = os.getenv('DATA_DIR', 'data')
MEMORIES_FILE = os.path.join(DATA_DIR, 'memories.json')
ANNIVERSARIES_FILE = os.path.join(DATA_DIR, 'anniversaries.json')
UPLOADS_FILE = os.path.join(DATA_DIR, 'uploads.json')

# 阿里云 OSS 配置（从环境变量获取）
OSS_CONFIG = {
    'access_key_id': os.getenv('OSS_ACCESS_KEY_ID', ''),
    'access_key_secret': os.getenv('OSS_ACCESS_KEY_SECRET', ''),
    'endpoint': os.getenv('OSS_ENDPOINT', ''),  # 例如: oss-cn-hangzhou.aliyuncs.com
    'bucket_name': os.getenv('OSS_BUCKET_NAME', ''),
    'base_url': os.getenv('OSS_BASE_URL', ''),  # 自定义域名或Bucket域名
    'upload_dir': os.getenv('OSS_UPLOAD_DIR', 'sweet-album/')  # OSS中的上传目录
}

# 初始化 OSS Bucket
def init_oss_bucket():
    """初始化阿里云 OSS Bucket"""
    if not all([OSS_CONFIG['access_key_id'], OSS_CONFIG['access_key_secret'], 
                OSS_CONFIG['endpoint'], OSS_CONFIG['bucket_name']]):
        print("[警告] OSS配置不完整，图片上传功能将不可用")
        return None
    
    try:
        auth = oss2.Auth(OSS_CONFIG['access_key_id'], OSS_CONFIG['access_key_secret'])
        bucket = oss2.Bucket(auth, OSS_CONFIG['endpoint'], OSS_CONFIG['bucket_name'])
        print(f"[OK] 阿里云 OSS 初始化成功: {OSS_CONFIG['bucket_name']}")
        return bucket
    except Exception as e:
        print(f"[错误] OSS初始化失败: {e}")
        return None

# 全局 OSS Bucket 实例
oss_bucket = None

# 数据模型
class Memory(BaseModel):
    date: str
    title: str
    content: str
    mood: str
    photos: Optional[List[str]] = []

class Anniversary(BaseModel):
    date: str
    name: str
    icon: str
    description: str
    photos: Optional[List[str]] = []

# JSON 文件操作辅助函数
def init_data_files():
    """初始化数据文件"""
    os.makedirs(DATA_DIR, exist_ok=True)
    
    if not os.path.exists(MEMORIES_FILE):
        with open(MEMORIES_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)
    
    if not os.path.exists(ANNIVERSARIES_FILE):
        with open(ANNIVERSARIES_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)
    
    if not os.path.exists(UPLOADS_FILE):
        with open(UPLOADS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)
    
    print(f"[OK] 数据文件初始化完成: {DATA_DIR}")

def read_json_file(filepath):
    """读取 JSON 文件"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def write_json_file(filepath, data):
    """写入 JSON 文件"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def get_next_id(data_list):
    """获取下一个ID"""
    if not data_list:
        return 1
    return max(item.get('id', 0) for item in data_list) + 1

# 数据库连接
def get_db_connection():
    return pymysql.connect(**DB_CONFIG)

# 根路径重定向到静态页面
@app.get("/")
async def root():
    return RedirectResponse(url="/static/index.html")

# 启动时初始化数据文件和 OSS
@app.on_event("startup")
async def startup_event():
    global oss_bucket
    init_data_files()
    oss_bucket = init_oss_bucket()

# ========== 甜蜜日常 API ==========
@app.get("/api/memories")
async def get_memories():
    """获取所有甜蜜日常"""
    try:
        memories = read_json_file(MEMORIES_FILE)
        # 按日期降序排序
        memories.sort(key=lambda x: x.get('date', ''), reverse=True)
        return {"code": 0, "data": memories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/memories")
async def create_memory(memory: Memory):
    """创建甜蜜日常"""
    try:
        memories = read_json_file(MEMORIES_FILE)
        new_memory = {
            "id": get_next_id(memories),
            "date": memory.date,
            "title": memory.title,
            "content": memory.content,
            "mood": memory.mood,
            "photos": memory.photos,
            "created_at": datetime.now().isoformat()
        }
        memories.append(new_memory)
        write_json_file(MEMORIES_FILE, memories)
        return {"code": 0, "data": {"id": new_memory['id']}, "message": "创建成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/memories/{memory_id}")
async def delete_memory(memory_id: int):
    """删除甜蜜日常"""
    try:
        memories = read_json_file(MEMORIES_FILE)
        memories = [m for m in memories if m.get('id') != memory_id]
        write_json_file(MEMORIES_FILE, memories)
        return {"code": 0, "message": "删除成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== 纪念日 API ==========
@app.get("/api/anniversaries")
async def get_anniversaries():
    """获取所有纪念日"""
    try:
        anniversaries = read_json_file(ANNIVERSARIES_FILE)
        # 按日期升序排序
        anniversaries.sort(key=lambda x: x.get('date', ''))
        return {"code": 0, "data": anniversaries}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/anniversaries")
async def create_anniversary(anniversary: Anniversary):
    """创建纪念日"""
    try:
        anniversaries = read_json_file(ANNIVERSARIES_FILE)
        new_anniversary = {
            "id": get_next_id(anniversaries),
            "date": anniversary.date,
            "name": anniversary.name,
            "icon": anniversary.icon,
            "description": anniversary.description,
            "photos": anniversary.photos,
            "created_at": datetime.now().isoformat()
        }
        anniversaries.append(new_anniversary)
        write_json_file(ANNIVERSARIES_FILE, anniversaries)
        return {"code": 0, "data": {"id": new_anniversary['id']}, "message": "创建成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/anniversaries/{anniversary_id}")
async def delete_anniversary(anniversary_id: int):
    """删除纪念日"""
    try:
        anniversaries = read_json_file(ANNIVERSARIES_FILE)
        anniversaries = [a for a in anniversaries if a.get('id') != anniversary_id]
        write_json_file(ANNIVERSARIES_FILE, anniversaries)
        return {"code": 0, "message": "删除成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== 图片上传辅助函数 ==========
async def upload_to_oss(file_content: bytes, filename: str) -> str:
    """上传图片到阿里云 OSS"""
    if not oss_bucket:
        raise Exception("OSS未初始化，请检查配置")
    
    try:
        # 构建 OSS 中的文件路径
        object_name = f"{OSS_CONFIG['upload_dir']}{filename}"
        
        # 上传文件
        result = oss_bucket.put_object(object_name, file_content)
        
        if result.status == 200:
            # 构建访问URL
            if OSS_CONFIG['base_url']:
                # 使用自定义域名
                base_url = OSS_CONFIG['base_url'].rstrip('/')
                image_url = f"{base_url}/{object_name}"
            else:
                # 使用默认的 Bucket 域名
                image_url = f"https://{OSS_CONFIG['bucket_name']}.{OSS_CONFIG['endpoint']}/{object_name}"
            
            return image_url
        else:
            raise Exception(f"OSS上传失败，状态码: {result.status}")
    except Exception as e:
        raise Exception(f"OSS上传错误: {str(e)}")

# ========== 图片上传 API ==========
@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    """上传图片到阿里云 OSS"""
    try:
        # 检查文件类型
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="只能上传图片文件")
        
        # 读取文件内容
        contents = await file.read()
        
        # 生成文件名（使用时间戳）
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
        ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        filename = f"{timestamp}.{ext}"
        
        # 上传到阿里云 OSS
        image_url = await upload_to_oss(contents, filename)
        
        # 保存上传记录到 JSON 文件
        uploads = read_json_file(UPLOADS_FILE)
        new_upload = {
            "id": get_next_id(uploads),
            "filename": filename,
            "filepath": image_url,
            "created_at": datetime.now().isoformat()
        }
        uploads.append(new_upload)
        write_json_file(UPLOADS_FILE, uploads)
        
        return {"code": 0, "data": {"url": image_url}, "message": "上传成功"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 挂载静态文件目录（必须在最后）
app.mount("/static", StaticFiles(directory="static", html=True), name="static")

# 直接运行支持
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv('PORT', 8001))  # 默认使用 8001 端口，避免冲突
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
