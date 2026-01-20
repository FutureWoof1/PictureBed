import os
import json
import base64
import httpx
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import pymysql
from pymysql.cursors import DictCursor

app = FastAPI()

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库配置（从环境变量获取）
DB_CONFIG = {
    'host': os.getenv('DB_HOST', '11.142.154.110'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER', 'with_sdsgfuqiplgabccw'),
    'password': os.getenv('DB_PASSWORD', '2K!Yw0V^ulAsll'),
    'database': os.getenv('DB_NAME', 'wbyemtvy'),
    'charset': 'utf8mb4',
    'cursorclass': DictCursor
}

# 图床配置（从环境变量获取）
IMAGE_BED_CONFIG = {
    'type': os.getenv('IMAGE_BED_TYPE', 'smms'),  # 图床类型: smms, imgbb, imgur
    'api_key': os.getenv('IMAGE_BED_API_KEY', ''),  # API密钥（SM.MS可选）
    'smms_api_url': 'https://sm.ms/api/v2/upload',
    'imgbb_api_url': 'https://api.imgbb.com/1/upload',
    'imgur_api_url': 'https://api.imgur.com/3/image'
}

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

# 数据库连接
def get_db_connection():
    return pymysql.connect(**DB_CONFIG)

# 根路径重定向到静态页面
@app.get("/")
async def root():
    return RedirectResponse(url="/static/index.html")

# ========== 甜蜜日常 API ==========
@app.get("/api/memories")
async def get_memories():
    """获取所有甜蜜日常"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM memories ORDER BY date DESC")
            memories = cursor.fetchall()
            # 解析photos字段（JSON字符串转列表）
            for memory in memories:
                memory['photos'] = json.loads(memory['photos']) if memory['photos'] else []
        conn.close()
        return {"code": 0, "data": memories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/memories")
async def create_memory(memory: Memory):
    """创建甜蜜日常"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            photos_json = json.dumps(memory.photos)
            sql = """INSERT INTO memories (date, title, content, mood, photos) 
                     VALUES (%s, %s, %s, %s, %s)"""
            cursor.execute(sql, (memory.date, memory.title, memory.content, memory.mood, photos_json))
            conn.commit()
            memory_id = cursor.lastrowid
        conn.close()
        return {"code": 0, "data": {"id": memory_id}, "message": "创建成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/memories/{memory_id}")
async def delete_memory(memory_id: int):
    """删除甜蜜日常"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM memories WHERE id = %s", (memory_id,))
            conn.commit()
        conn.close()
        return {"code": 0, "message": "删除成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== 纪念日 API ==========
@app.get("/api/anniversaries")
async def get_anniversaries():
    """获取所有纪念日"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM anniversaries ORDER BY date ASC")
            anniversaries = cursor.fetchall()
            # 解析photos字段
            for anniversary in anniversaries:
                anniversary['photos'] = json.loads(anniversary['photos']) if anniversary['photos'] else []
        conn.close()
        return {"code": 0, "data": anniversaries}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/anniversaries")
async def create_anniversary(anniversary: Anniversary):
    """创建纪念日"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            photos_json = json.dumps(anniversary.photos)
            sql = """INSERT INTO anniversaries (date, name, icon, description, photos) 
                     VALUES (%s, %s, %s, %s, %s)"""
            cursor.execute(sql, (anniversary.date, anniversary.name, anniversary.icon, 
                                anniversary.description, photos_json))
            conn.commit()
            anniversary_id = cursor.lastrowid
        conn.close()
        return {"code": 0, "data": {"id": anniversary_id}, "message": "创建成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/anniversaries/{anniversary_id}")
async def delete_anniversary(anniversary_id: int):
    """删除纪念日"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM anniversaries WHERE id = %s", (anniversary_id,))
            conn.commit()
        conn.close()
        return {"code": 0, "message": "删除成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== 图片上传辅助函数 ==========
async def upload_to_smms(file_content: bytes, filename: str, api_key: str = None):
    """上传图片到 SM.MS 图床"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        files = {'smfile': (filename, file_content)}
        headers = {}
        if api_key:
            headers['Authorization'] = api_key
        
        response = await client.post(
            IMAGE_BED_CONFIG['smms_api_url'],
            files=files,
            headers=headers
        )
        result = response.json()
        
        if result.get('success'):
            return result['data']['url']
        elif result.get('code') == 'image_repeated':
            # 图片已存在，返回已有URL
            return result['images']
        else:
            raise Exception(f"SM.MS上传失败: {result.get('message', '未知错误')}")

async def upload_to_imgbb(file_content: bytes, filename: str, api_key: str):
    """上传图片到 ImgBB 图床"""
    if not api_key:
        raise Exception("ImgBB需要API Key，请设置IMAGE_BED_API_KEY环境变量")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # ImgBB需要base64编码
        image_base64 = base64.b64encode(file_content).decode('utf-8')
        data = {
            'key': api_key,
            'image': image_base64,
            'name': filename
        }
        
        response = await client.post(IMAGE_BED_CONFIG['imgbb_api_url'], data=data)
        result = response.json()
        
        if result.get('success'):
            return result['data']['url']
        else:
            raise Exception(f"ImgBB上传失败: {result.get('error', {}).get('message', '未知错误')}")

async def upload_to_imgur(file_content: bytes, filename: str, api_key: str):
    """上传图片到 Imgur 图床"""
    if not api_key:
        raise Exception("Imgur需要Client ID，请设置IMAGE_BED_API_KEY环境变量")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Imgur需要base64编码
        image_base64 = base64.b64encode(file_content).decode('utf-8')
        headers = {'Authorization': f'Client-ID {api_key}'}
        data = {'image': image_base64, 'name': filename}
        
        response = await client.post(
            IMAGE_BED_CONFIG['imgur_api_url'],
            headers=headers,
            data=data
        )
        result = response.json()
        
        if result.get('success'):
            return result['data']['link']
        else:
            raise Exception(f"Imgur上传失败: {result.get('data', {}).get('error', '未知错误')}")

# ========== 图片上传 API ==========
@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    """上传图片到图床"""
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
        
        # 根据配置选择图床
        image_bed_type = IMAGE_BED_CONFIG['type'].lower()
        api_key = IMAGE_BED_CONFIG['api_key']
        
        if image_bed_type == 'smms':
            image_url = await upload_to_smms(contents, filename, api_key)
        elif image_bed_type == 'imgbb':
            image_url = await upload_to_imgbb(contents, filename, api_key)
        elif image_bed_type == 'imgur':
            image_url = await upload_to_imgur(contents, filename, api_key)
        else:
            raise HTTPException(status_code=400, detail=f"不支持的图床类型: {image_bed_type}")
        
        # 保存上传记录到数据库
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO uploaded_images (filename, filepath) VALUES (%s, %s)",
                (filename, image_url)
            )
            conn.commit()
        conn.close()
        
        return {"code": 0, "data": {"url": image_url}, "message": "上传成功"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 挂载静态文件目录（必须在最后）
app.mount("/static", StaticFiles(directory="static", html=True), name="static")
