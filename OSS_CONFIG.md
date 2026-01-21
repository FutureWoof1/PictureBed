# 阿里云 OSS 配置指南

本文档将指导你如何配置阿里云 OSS 用于图片存储。

## 📋 前置准备

1. 阿里云账号（已注册并实名认证）
2. 已开通 OSS 服务
3. 已创建 OSS Bucket

---

## 🚀 快速开始

### 第一步：创建 OSS Bucket

1. **登录阿里云控制台**
   - 访问：https://oss.console.aliyun.com/

2. **创建 Bucket**
   - 点击"创建 Bucket"按钮
   - 填写以下信息：
     - **Bucket 名称**：例如 `sweet-album-2024`（全局唯一，只能包含小写字母、数字和短横线）
     - **地域**：选择离你最近的地域（例如：华东1-杭州）
     - **存储类型**：选择"标准存储"
     - **读写权限**：选择"公共读"（重要！允许匿名访问图片）
     - **服务端加密**：可选，根据需求选择
   - 点击"确定"创建

3. **记录 Endpoint**
   - 创建成功后，在 Bucket 列表中找到你的 Bucket
   - 点击进入，在"概览"页面找到"Endpoint（地域节点）"
   - 例如：`oss-cn-hangzhou.aliyuncs.com`
   - **注意**：使用"外网访问"的 Endpoint

### 第二步：获取 AccessKey

1. **访问 AccessKey 管理页面**
   - 访问：https://ram.console.aliyun.com/manage/ak
   - 或者：点击右上角头像 → AccessKey 管理

2. **创建 AccessKey**
   - 点击"创建 AccessKey"
   - 完成安全验证（手机验证码）
   - **重要**：立即保存 AccessKey ID 和 AccessKey Secret
   - AccessKey Secret 只显示一次，请妥善保管

3. **安全建议**
   - 不要将 AccessKey 提交到 Git 仓库
   - 建议使用 RAM 子账号，并授予最小权限
   - 定期更换 AccessKey

### 第三步：配置环境变量

1. **复制配置文件**
   ```bash
   cp .env.example .env
   ```

2. **编辑 .env 文件**
   ```bash
   # 阿里云 OSS 配置
   OSS_ACCESS_KEY_ID=你的AccessKey_ID
   OSS_ACCESS_KEY_SECRET=你的AccessKey_Secret
   OSS_ENDPOINT=oss-cn-hangzhou.aliyuncs.com
   OSS_BUCKET_NAME=sweet-album-2024
   OSS_BASE_URL=
   OSS_UPLOAD_DIR=sweet-album/
   ```

3. **配置说明**
   - `OSS_ACCESS_KEY_ID`：第二步获取的 AccessKey ID
   - `OSS_ACCESS_KEY_SECRET`：第二步获取的 AccessKey Secret
   - `OSS_ENDPOINT`：第一步记录的 Endpoint（不要加 https://）
   - `OSS_BUCKET_NAME`：第一步创建的 Bucket 名称
   - `OSS_BASE_URL`：可选，如果配置了 CDN 加速域名，填写完整的域名（例如：https://cdn.example.com）
   - `OSS_UPLOAD_DIR`：图片在 OSS 中的存储目录，默认为 `sweet-album/`

### 第四步：安装依赖

```bash
pip install -r requirements.txt
```

### 第五步：启动应用

```bash
# Windows
run.bat

# Linux/Mac
python main.py
```

---

## 🔧 高级配置

### 配置 CDN 加速（可选）

如果你的用户分布在全国各地，建议配置 CDN 加速以提升图片加载速度。

1. **开通 CDN 服务**
   - 访问：https://cdn.console.aliyun.com/

2. **添加加速域名**
   - 点击"添加域名"
   - 填写你的域名（例如：cdn.example.com）
   - 源站类型选择"OSS域名"
   - 选择你的 Bucket

3. **配置 CNAME**
   - 在域名解析中添加 CNAME 记录
   - 将你的域名指向 CDN 分配的 CNAME 地址

4. **更新配置**
   - 在 `.env` 文件中设置 `OSS_BASE_URL=https://cdn.example.com`

### 设置跨域访问（CORS）

如果前端和后端不在同一域名下，需要配置 CORS。

1. **进入 Bucket 设置**
   - 在 OSS 控制台中，点击你的 Bucket
   - 选择"权限管理" → "跨域设置"

2. **创建规则**
   - 点击"创建规则"
   - 来源：`*`（或指定你的前端域名）
   - 允许 Methods：`GET, POST, PUT, DELETE, HEAD`
   - 允许 Headers：`*`
   - 暴露 Headers：`ETag, x-oss-request-id`
   - 缓存时间：`600`

### 设置生命周期规则（节省成本）

如果你想自动删除旧图片或转换存储类型，可以配置生命周期规则。

1. **进入 Bucket 设置**
   - 选择"基础设置" → "生命周期"

2. **创建规则**
   - 例如：30天后转为低频访问存储
   - 例如：180天后删除

---

## 🔍 常见问题

### 1. 图片上传失败，提示"OSS未初始化"

**原因**：环境变量配置不完整

**解决方法**：
- 检查 `.env` 文件是否存在
- 确认所有必填项都已填写（AccessKey ID、Secret、Endpoint、Bucket Name）
- 重启应用

### 2. 图片上传成功但无法访问

**原因**：Bucket 权限设置不正确

**解决方法**：
- 进入 OSS 控制台
- 选择你的 Bucket → "权限管理" → "读写权限"
- 设置为"公共读"

### 3. 图片访问速度慢

**原因**：未配置 CDN 加速

**解决方法**：
- 参考"高级配置"中的"配置 CDN 加速"
- 或者选择离用户更近的地域节点

### 4. AccessKey 泄露了怎么办？

**解决方法**：
1. 立即登录阿里云控制台
2. 禁用或删除泄露的 AccessKey
3. 创建新的 AccessKey
4. 更新 `.env` 配置文件
5. 检查是否有异常消费

### 5. 如何查看 OSS 使用量和费用？

**方法**：
- 访问：https://usercenter2.aliyun.com/home
- 查看"费用账单"
- OSS 按量计费，包括存储费用、流量费用、请求费用

---

## 💰 费用说明

阿里云 OSS 采用按量计费，主要包括：

1. **存储费用**
   - 标准存储：约 0.12 元/GB/月
   - 低频访问：约 0.08 元/GB/月

2. **流量费用**
   - 外网流出流量：约 0.5 元/GB
   - CDN 回源流量：约 0.15 元/GB

3. **请求费用**
   - PUT 请求：约 0.01 元/万次
   - GET 请求：约 0.01 元/万次

**示例**：
- 存储 1000 张图片（约 500MB）：0.06 元/月
- 每月 10000 次访问（约 5GB 流量）：2.5 元/月
- **总计**：约 2.6 元/月

**新用户福利**：
- 阿里云新用户可享受 OSS 免费额度
- 标准存储包：40GB 免费存储空间（6个月）
- 外网流出流量包：10GB 免费流量（6个月）

---

## 📚 参考资料

- [阿里云 OSS 官方文档](https://help.aliyun.com/product/31815.html)
- [OSS Python SDK 文档](https://help.aliyun.com/document_detail/32026.html)
- [OSS 定价说明](https://www.aliyun.com/price/product#/oss/detail)
- [RAM 访问控制](https://help.aliyun.com/product/28625.html)

---

## 🆘 获取帮助

如果遇到问题，可以：

1. 查看阿里云 OSS 官方文档
2. 联系阿里云技术支持
3. 在项目 Issues 中提问

---

**祝你使用愉快！💖**
