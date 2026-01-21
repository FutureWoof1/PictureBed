@echo off
chcp 65001 >nul
echo ========================================
echo    甜蜜相册启动脚本
echo ========================================
echo.

REM 检查 Python 是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Python，请先安装 Python 3.9 或更高版本
    echo 下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [1/4] 检测到 Python 版本:
python --version
echo.

REM 检查是否已安装依赖
echo [2/4] 检查并安装依赖包...
pip show fastapi >nul 2>&1
if %errorlevel% neq 0 (
    echo 正在安装依赖包，请稍候...
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo [错误] 依赖包安装失败
        pause
        exit /b 1
    )
    echo 依赖包安装完成！
) else (
    echo 依赖包已安装
)
echo.

REM 创建上传目录
echo [3/4] 创建必要的目录...
if not exist "static\uploads" (
    mkdir "static\uploads"
    echo 已创建 static\uploads 目录
) else (
    echo static\uploads 目录已存在
)
echo.

REM 启动应用
echo [4/4] 启动应用...
echo.
echo ========================================
echo    应用正在启动...
echo    访问地址: http://localhost:8001
echo    按 Ctrl+C 停止服务
echo ========================================
echo.

uvicorn main:app --host 0.0.0.0 --port 8001 --reload

pause
