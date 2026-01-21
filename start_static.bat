@echo off
chcp 65001 >nul
echo ========================================
echo   甜蜜相册 - 纯静态版本启动器
echo ========================================
echo.

echo [提示] 纯静态版本无需 Python 后端
echo [提示] 将使用浏览器直接打开 HTML 文件
echo.

echo 正在启动...
echo.

start index.html

echo.
echo ========================================
echo   已在浏览器中打开！
echo ========================================
echo.
echo [说明] 
echo 1. 数据存储在浏览器 localStorage
echo 2. 如需上传图片，请配置 config.js
echo 3. 定期使用"导出数据"功能备份
echo.
echo [配置 OSS]
echo 1. 复制 config.example.js 为 config.js
echo 2. 填入你的阿里云 OSS 配置
echo.

echo 按任意键退出...
pause >nul
