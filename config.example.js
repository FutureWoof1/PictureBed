// 阿里云 OSS 配置示例
// 复制此文件为 config.js 并填入你的实际配置

const OSS_CONFIG = {
    region: 'oss-cn-beijing',           // OSS 区域，如：oss-cn-beijing
    accessKeyId: 'YOUR_ACCESS_KEY_ID',  // 你的 AccessKey ID
    accessKeySecret: 'YOUR_ACCESS_KEY_SECRET', // 你的 AccessKey Secret
    bucket: 'YOUR_BUCKET_NAME',         // 你的 Bucket 名称
    uploadDir: 'sweet-album/',          // 图片上传目录
    dataFile: 'sweet-album/data.json'   // 数据文件路径（用于多端同步）
};

// 恋爱开始日期配置
const LOVE_START_DATE = '2022-10-15';  // 修改为你们的恋爱纪念日

// 注意：
// 1. 请勿将包含真实密钥的 config.js 提交到公开的 Git 仓库
// 2. 建议在 .gitignore 中添加 config.js
// 3. 如果不配置 OSS，图片将使用 Base64 存储（不推荐用于生产环境）
// 4. 配置 OSS 后，数据将自动同步到云端，实现多端访问
