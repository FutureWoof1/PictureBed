@echo off
chcp 65001 >nul
echo ========================================
echo   阿里云 OSS 配置向导
echo ========================================
echo.

REM 检查是否已存在 .env 文件
if exist .env (
    echo [警告] .env 文件已存在
    set /p overwrite="是否覆盖现有配置？(y/n): "
    if /i not "%overwrite%"=="y" (
        echo 配置已取消
        pause
        exit /b
    )
)

echo.
echo 请按照提示输入阿里云 OSS 配置信息
echo （如果不清楚如何获取，请查看 OSS_CONFIG.md 文档）
echo.

REM 输入配置信息
set /p ACCESS_KEY_ID="1. AccessKey ID: "
set /p ACCESS_KEY_SECRET="2. AccessKey Secret: "
set /p ENDPOINT="3. Endpoint (例如: oss-cn-hangzhou.aliyuncs.com): "
set /p BUCKET_NAME="4. Bucket 名称: "
set /p BASE_URL="5. 自定义域名 (可选，直接回车跳过): "
set /p UPLOAD_DIR="6. 上传目录 (默认: sweet-album/): "

REM 设置默认值
if "%UPLOAD_DIR%"=="" set UPLOAD_DIR=sweet-album/

REM 生成 .env 文件
echo # 环境变量配置文件 > .env
echo # 由配置向导自动生成于 %date% %time% >> .env
echo. >> .env
echo # ========== 数据存储配置 ========== >> .env
echo DATA_DIR=data >> .env
echo. >> .env
echo # ========== 阿里云 OSS 配置 ========== >> .env
echo OSS_ACCESS_KEY_ID=%ACCESS_KEY_ID% >> .env
echo OSS_ACCESS_KEY_SECRET=%ACCESS_KEY_SECRET% >> .env
echo OSS_ENDPOINT=%ENDPOINT% >> .env
echo OSS_BUCKET_NAME=%BUCKET_NAME% >> .env
echo OSS_BASE_URL=%BASE_URL% >> .env
echo OSS_UPLOAD_DIR=%UPLOAD_DIR% >> .env
echo. >> .env
echo # ========== 应用配置 ========== >> .env
echo PORT=8001 >> .env

echo.
echo ========================================
echo   配置完成！
echo ========================================
echo.
echo .env 文件已生成，配置信息如下：
echo.
echo AccessKey ID: %ACCESS_KEY_ID%
echo Endpoint: %ENDPOINT%
echo Bucket: %BUCKET_NAME%
echo 上传目录: %UPLOAD_DIR%
if not "%BASE_URL%"=="" echo 自定义域名: %BASE_URL%
echo.
echo 下一步：
echo 1. 确保 Bucket 权限设置为"公共读"
echo 2. 运行 run.bat 启动应用
echo 3. 访问 http://localhost:8001 测试上传
echo.
echo 详细配置说明请查看 OSS_CONFIG.md 文档
echo.
pause
