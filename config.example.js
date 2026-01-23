// 配置文件示例
// 使用方法：
// 1. 将此文件复制为 config.js 或 config.public.js
// 2. 填写你的实际配置信息
// 3. config.js 用于本地开发（不要提交到 Git）
// 4. config.public.js 用于 GitHub Pages 部署（可以提交到 Git）

// 阿里云 OSS 配置（用于图片上传和数据同步）
window.OSS_CONFIG = {
    region: 'oss-cn-beijing',           // OSS 区域，例如：oss-cn-beijing
    accessKeyId: 'YOUR_ACCESS_KEY_ID',  // 你的 AccessKey ID
    accessKeySecret: 'YOUR_ACCESS_KEY_SECRET',  // 你的 AccessKey Secret
    bucket: 'YOUR_BUCKET_NAME',         // 你的 Bucket 名称
    uploadDir: 'PictureBed/',           // 上传目录（可选，默认为 PictureBed/）
    dataFile: 'PictureBed/data.json'    // 数据文件路径（可选）
};

// 恋爱开始日期（用于计算在一起的天数）
window.LOVE_START_DATE = '2022-10-15';  // 格式：YYYY-MM-DD

// 编辑密码（用于保护内容编辑功能）
// ⚠️ 重要：请务必修改默认密码！
window.EDIT_PASSWORD = 'your_custom_password';  // 修改为你自己的密码

// 注意事项：
// 1. 如果不配置 OSS，图片将使用 Base64 存储在浏览器本地
// 2. 编辑密码默认为 'love2022'，建议修改为更安全的密码
// 3. 密码验证状态会保存在浏览器会话中（1小时有效）
// 4. 关闭浏览器后需要重新验证
