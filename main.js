// 配置管理
const CONFIG = {
    // 阿里云 OSS 配置（需要在 config.js 中配置）
    oss: {
        region: 'oss-cn-beijing',
        accessKeyId: '',
        accessKeySecret: '',
        bucket: '',
        uploadDir: 'PictureBed/',
        dataFile: 'PictureBed/data.json'  // 数据文件路径
    },
    // 恋爱开始日期
    startDate: '2022-10-15'
};

// 从 config.js 加载配置（如果存在）
if (typeof window.OSS_CONFIG !== 'undefined' && window.OSS_CONFIG) {
    Object.assign(CONFIG.oss, window.OSS_CONFIG);
    console.log('✅ OSS 配置已加载:', CONFIG.oss);
}

// 从 LOVE_START_DATE 加载恋爱开始日期
if (typeof window.LOVE_START_DATE !== 'undefined' && window.LOVE_START_DATE) {
    CONFIG.startDate = window.LOVE_START_DATE;
    console.log('✅ 恋爱开始日期已加载:', CONFIG.startDate);
}

// 本地存储管理模块（支持 OSS 云端同步）
class StorageManager {
    constructor() {
        this.KEYS = {
            MEMORIES: 'sweet_album_memories',
            ANNIVERSARIES: 'sweet_album_anniversaries',
            LAST_SYNC: 'sweet_album_last_sync'
        };
        this.ossClient = null;
        this.syncEnabled = false;
        this.initOSS();
        this.initStorage();
    }

    // 初始化 OSS 客户端
    initOSS() {
        if (!CONFIG.oss.accessKeyId || !CONFIG.oss.bucket) {
            console.warn('OSS 未配置，数据仅保存在本地浏览器');
            return;
        }

        if (typeof OSS !== 'undefined') {
            this.ossClient = new OSS({
                region: CONFIG.oss.region,
                accessKeyId: CONFIG.oss.accessKeyId,
                accessKeySecret: CONFIG.oss.accessKeySecret,
                bucket: CONFIG.oss.bucket
            });
            this.syncEnabled = true;
            console.log('✅ OSS 已配置，数据将自动同步到云端');
        }
    }

    async initStorage() {
        // 如果启用了 OSS 同步，先从云端加载数据
        if (this.syncEnabled) {
            try {
                await this.loadFromOSS();
                console.log('✅ 已从云端加载数据');
            } catch (error) {
                console.log('ℹ️ 云端暂无数据，使用本地数据');
                // 如果云端没有数据，使用本地数据并上传到云端
                if (!localStorage.getItem(this.KEYS.MEMORIES)) {
                    localStorage.setItem(this.KEYS.MEMORIES, JSON.stringify([]));
                }
                if (!localStorage.getItem(this.KEYS.ANNIVERSARIES)) {
                    localStorage.setItem(this.KEYS.ANNIVERSARIES, JSON.stringify([]));
                }
                await this.saveToOSS();
            }
        } else {
            // 本地模式
            if (!localStorage.getItem(this.KEYS.MEMORIES)) {
                localStorage.setItem(this.KEYS.MEMORIES, JSON.stringify([]));
            }
            if (!localStorage.getItem(this.KEYS.ANNIVERSARIES)) {
                localStorage.setItem(this.KEYS.ANNIVERSARIES, JSON.stringify([]));
            }
        }
    }

    // 从 OSS 加载数据
    async loadFromOSS() {
        if (!this.ossClient) return;

        try {
            const result = await this.ossClient.get(CONFIG.oss.dataFile);
            const data = JSON.parse(result.content.toString());
            
            if (data.memories) {
                localStorage.setItem(this.KEYS.MEMORIES, JSON.stringify(data.memories));
            }
            if (data.anniversaries) {
                localStorage.setItem(this.KEYS.ANNIVERSARIES, JSON.stringify(data.anniversaries));
            }
            
            localStorage.setItem(this.KEYS.LAST_SYNC, new Date().toISOString());
        } catch (error) {
            if (error.code !== 'NoSuchKey') {
                console.error('从 OSS 加载数据失败:', error);
            }
            throw error;
        }
    }

    // 保存数据到 OSS
    async saveToOSS() {
        if (!this.ossClient) return;

        try {
            const data = {
                memories: this.getMemories(),
                anniversaries: this.getAnniversaries(),
                lastUpdate: new Date().toISOString()
            };

            const content = JSON.stringify(data, null, 2);
            await this.ossClient.put(CONFIG.oss.dataFile, Buffer.from(content));
            
            localStorage.setItem(this.KEYS.LAST_SYNC, new Date().toISOString());
            console.log('✅ 数据已同步到云端');
        } catch (error) {
            console.error('保存数据到 OSS 失败:', error);
            throw error;
        }
    }

    // 甜蜜日常
    getMemories() {
        return JSON.parse(localStorage.getItem(this.KEYS.MEMORIES) || '[]');
    }

    async addMemory(memory) {
        const memories = this.getMemories();
        memory.id = Date.now();
        memories.push(memory);
        localStorage.setItem(this.KEYS.MEMORIES, JSON.stringify(memories));
        
        // 同步到 OSS
        if (this.syncEnabled) {
            await this.saveToOSS();
        }
        
        return memory;
    }

    async deleteMemory(id) {
        const memories = this.getMemories().filter(m => m.id !== id);
        localStorage.setItem(this.KEYS.MEMORIES, JSON.stringify(memories));
        
        // 同步到 OSS
        if (this.syncEnabled) {
            await this.saveToOSS();
        }
    }

    // 纪念日
    getAnniversaries() {
        return JSON.parse(localStorage.getItem(this.KEYS.ANNIVERSARIES) || '[]');
    }

    async addAnniversary(anniversary) {
        const anniversaries = this.getAnniversaries();
        anniversary.id = Date.now();
        anniversaries.push(anniversary);
        localStorage.setItem(this.KEYS.ANNIVERSARIES, JSON.stringify(anniversaries));
        
        // 同步到 OSS
        if (this.syncEnabled) {
            await this.saveToOSS();
        }
        
        return anniversary;
    }

    async deleteAnniversary(id) {
        const anniversaries = this.getAnniversaries().filter(a => a.id !== id);
        localStorage.setItem(this.KEYS.ANNIVERSARIES, JSON.stringify(anniversaries));
        
        // 同步到 OSS
        if (this.syncEnabled) {
            await this.saveToOSS();
        }
    }

    // 手动刷新数据（从云端重新加载）
    async refresh() {
        if (this.syncEnabled) {
            await this.loadFromOSS();
            return true;
        }
        return false;
    }

    // 获取最后同步时间
    getLastSyncTime() {
        const lastSync = localStorage.getItem(this.KEYS.LAST_SYNC);
        return lastSync ? new Date(lastSync) : null;
    }

    // 导出数据
    exportData() {
        return {
            memories: this.getMemories(),
            anniversaries: this.getAnniversaries(),
            exportDate: new Date().toISOString()
        };
    }

    // 导入数据
    async importData(data) {
        if (data.memories) {
            localStorage.setItem(this.KEYS.MEMORIES, JSON.stringify(data.memories));
        }
        if (data.anniversaries) {
            localStorage.setItem(this.KEYS.ANNIVERSARIES, JSON.stringify(data.anniversaries));
        }
        
        // 同步到 OSS
        if (this.syncEnabled) {
            await this.saveToOSS();
        }
    }
}

// 图片上传管理模块
class ImageUploader {
    constructor() {
        this.ossClient = null;
        this.initOSS();
    }

    initOSS() {
        // 检查是否配置了 OSS
        if (!CONFIG.oss.accessKeyId || !CONFIG.oss.bucket) {
            console.warn('OSS 未配置，将使用 Base64 存储图片（不推荐用于生产环境）');
            return;
        }

        // 初始化 OSS 客户端（需要引入 ali-oss SDK）
        if (typeof OSS !== 'undefined') {
            this.ossClient = new OSS({
                region: CONFIG.oss.region,
                accessKeyId: CONFIG.oss.accessKeyId,
                accessKeySecret: CONFIG.oss.accessKeySecret,
                bucket: CONFIG.oss.bucket
            });
        }
    }

    async uploadImage(file) {
        // 如果配置了 OSS，使用 OSS 上传
        if (this.ossClient) {
            return await this.uploadToOSS(file);
        }
        
        // 否则转换为 Base64（仅用于测试，不推荐生产环境）
        return await this.convertToBase64(file);
    }

    async uploadToOSS(file) {
        try {
            const fileName = `${CONFIG.oss.uploadDir}${Date.now()}_${file.name}`;
            const result = await this.ossClient.put(fileName, file);
            return result.url;
        } catch (error) {
            console.error('OSS 上传失败:', error);
            throw new Error('图片上传失败');
        }
    }

    convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

// 计数器管理模块
class CounterManager {
    constructor() {
        this.startDate = new Date(CONFIG.startDate);
        this.interval = null;
    }

    init() {
        console.log('⏰ 初始化计数器，开始日期:', this.startDate);
        this.updateCounter();
        this.interval = setInterval(() => {
            this.updateCounter();
        }, 1000);
    }

    updateCounter() {
        const now = new Date();
        const diff = now - this.startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) {
            daysEl.textContent = days;
        } else {
            console.error('❌ 找不到 #days 元素');
        }
        if (hoursEl) hoursEl.textContent = hours;
        if (minutesEl) minutesEl.textContent = minutes;
        if (secondsEl) secondsEl.textContent = seconds;
    }

    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// UI管理模块
class UIManager {
    constructor(storage, uploader) {
        this.storage = storage;
        this.uploader = uploader;
        this.uploadedPhotos = {
            memory: [],
            anniversary: []
        };
    }

    // 模态框管理
    openModal(modalId) {
        console.log('📂 打开模态框:', modalId);
        const modal = document.getElementById(modalId);
        console.log('modal 元素:', modal);
        if (modal) {
            modal.classList.add('active');
            console.log('✅ 模态框已打开');
        } else {
            console.error('❌ 找不到模态框:', modalId);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            const form = modal.querySelector('form');
            if (form) form.reset();
            
            // 清空照片预览
            if (modalId === 'memoryModal') {
                this.uploadedPhotos.memory = [];
                const preview = document.getElementById('memoryPhotoPreview');
                if (preview) preview.innerHTML = '';
            }
            if (modalId === 'anniversaryModal') {
                this.uploadedPhotos.anniversary = [];
                const preview = document.getElementById('anniversaryPhotoPreview');
                if (preview) preview.innerHTML = '';
            }
        }
    }

    // 处理照片选择
    async handlePhotoSelect(files, type) {
        const previewContainer = document.getElementById(
            type === 'memory' ? 'memoryPhotoPreview' : 'anniversaryPhotoPreview'
        );
        const submitBtn = document.getElementById(
            type === 'memory' ? 'memorySubmitBtn' : 'anniversarySubmitBtn'
        );

        // 禁用提交按钮
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '上传中...';
        }

        for (const file of files) {
            try {
                // 上传图片
                const url = await this.uploader.uploadImage(file);
                this.uploadedPhotos[type].push(url);

                // 显示预览
                const previewItem = document.createElement('div');
                previewItem.className = 'photo-preview-item';
                previewItem.innerHTML = `
                    <img src="${url}" alt="预览">
                    <button type="button" class="photo-preview-remove" data-url="${url}">
                        <i class="fas fa-times"></i>
                    </button>
                `;

                // 绑定删除事件
                previewItem.querySelector('.photo-preview-remove').addEventListener('click', (e) => {
                    const urlToRemove = e.currentTarget.dataset.url;
                    this.uploadedPhotos[type] = this.uploadedPhotos[type].filter(u => u !== urlToRemove);
                    previewItem.remove();
                });

                previewContainer.appendChild(previewItem);
            } catch (error) {
                console.error('上传失败:', error);
                alert('图片上传失败，请重试');
            }
        }

        // 启用提交按钮
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '保存';
        }
    }

    // 时光轴 - 从甜蜜日常和纪念日联动生成
    loadTimeline() {
        const memories = this.storage.getMemories();
        const anniversaries = this.storage.getAnniversaries();
        const container = document.getElementById('timelineContainer');
        
        if (!container) return;
        
        // 合并所有事件
        const allEvents = [
            ...memories.map(m => ({
                ...m,
                type: 'memory',
                displayTitle: m.title,
                displayIcon: m.mood
            })),
            ...anniversaries.map(a => ({
                ...a,
                type: 'anniversary',
                displayTitle: a.name,
                displayIcon: a.icon,
                content: a.description
            }))
        ];
        
        // 按日期排序
        allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        container.innerHTML = allEvents.map(item => {
            const hasPhotos = item.photos && item.photos.length > 0;
            const photosHtml = hasPhotos ? `
                <button class="timeline-toggle" data-id="${item.id}" data-type="${item.type}">
                    <i class="fas fa-images"></i> 查看照片 (${item.photos.length})
                </button>
                <div class="timeline-photos" id="timeline-photos-${item.type}-${item.id}" style="display: none;">
                    ${item.photos.map(url => `
                        <img src="${url}" alt="照片" class="timeline-photo" onclick="window.uiManager.openPhotoViewer('${url}', '${this.escapeHtml(item.displayTitle)}')">
                    `).join('')}
                </div>
            ` : '';
            
            return `
                <div class="timeline-item" data-id="${item.id}">
                    <div class="timeline-content">
                        <div class="timeline-badge">${item.displayIcon}</div>
                        <div class="timeline-date">${this.formatDate(item.date)}</div>
                        <h3 class="timeline-title">${this.escapeHtml(item.displayTitle)}</h3>
                        <p class="timeline-desc">${this.escapeHtml(item.content)}</p>
                        ${photosHtml}
                    </div>
                    <div class="timeline-dot"></div>
                </div>
            `;
        }).join('');

        // 绑定照片展开事件
        container.querySelectorAll('.timeline-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const type = e.currentTarget.dataset.type;
                const photosDiv = document.getElementById(`timeline-photos-${type}-${id}`);
                if (photosDiv) {
                    const isVisible = photosDiv.style.display !== 'none';
                    photosDiv.style.display = isVisible ? 'none' : 'grid';
                    e.currentTarget.innerHTML = isVisible 
                        ? `<i class="fas fa-images"></i> 查看照片 (${photosDiv.querySelectorAll('img').length})`
                        : `<i class="fas fa-times"></i> 收起照片`;
                }
            });
        });
    }

    // 甜蜜日常
    loadMemories() {
        const memories = this.storage.getMemories();
        const container = document.getElementById('memoriesGrid');
        
        if (!container) return;
        
        // 按日期倒序排序
        memories.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = memories.map(memory => {
            const hasPhotos = memory.photos && memory.photos.length > 0;
            const photosHtml = hasPhotos ? `
                <button class="memory-toggle" data-id="${memory.id}">
                    <i class="fas fa-images"></i> 查看照片 (${memory.photos.length})
                </button>
                <div class="memory-photos" id="memory-photos-${memory.id}" style="display: none;">
                    ${memory.photos.map(url => `
                        <img src="${url}" alt="照片" class="memory-photo" onclick="window.uiManager.openPhotoViewer('${url}', '${this.escapeHtml(memory.title)}')">
                    `).join('')}
                </div>
            ` : '';
            
            return `
                <div class="memory-card" data-id="${memory.id}">
                    <button class="memory-delete" data-id="${memory.id}">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="memory-header">
                        <span class="memory-mood">${memory.mood}</span>
                        <span class="memory-date">${this.formatDate(memory.date)}</span>
                    </div>
                    <h3 class="memory-title">${this.escapeHtml(memory.title)}</h3>
                    <p class="memory-content">${this.escapeHtml(memory.content)}</p>
                    ${photosHtml}
                </div>
            `;
        }).join('');

        // 绑定删除事件
        container.querySelectorAll('.memory-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.deleteMemory(id);
            });
        });

        // 绑定照片展开事件
        container.querySelectorAll('.memory-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const photosDiv = document.getElementById(`memory-photos-${id}`);
                if (photosDiv) {
                    const isVisible = photosDiv.style.display !== 'none';
                    photosDiv.style.display = isVisible ? 'none' : 'grid';
                    e.currentTarget.innerHTML = isVisible 
                        ? `<i class="fas fa-images"></i> 查看照片 (${photosDiv.querySelectorAll('img').length})`
                        : `<i class="fas fa-times"></i> 收起照片`;
                }
            });
        });
    }

    async addMemory() {
        const date = document.getElementById('memoryDate').value;
        const title = document.getElementById('memoryTitle').value;
        const content = document.getElementById('memoryContent').value;
        const mood = document.getElementById('memoryMood').value;

        if (!date || !title || !content || !mood) return;

        const memory = {
            date,
            title,
            content,
            mood,
            photos: this.uploadedPhotos.memory
        };

        try {
            await this.storage.addMemory(memory);
            this.uploadedPhotos.memory = [];
            this.loadMemories();
            this.loadTimeline();
            this.closeModal('memoryModal');
        } catch (error) {
            console.error('保存失败:', error);
            alert('保存失败，请重试');
        }
    }

    async deleteMemory(id) {
        if (!confirm('确定要删除这条记录吗？')) return;

        try {
            await this.storage.deleteMemory(id);
            this.loadMemories();
            this.loadTimeline();
        } catch (error) {
            console.error('删除失败:', error);
            alert('删除失败，请重试');
        }
    }

    // 纪念日
    loadAnniversaries() {
        const anniversaries = this.storage.getAnniversaries();
        const container = document.getElementById('anniversariesGrid');
        
        if (!container) return;
        
        // 按日期排序
        anniversaries.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        container.innerHTML = anniversaries.map(anniversary => {
            const hasPhotos = anniversary.photos && anniversary.photos.length > 0;
            const photosHtml = hasPhotos ? `
                <button class="anniversary-toggle" data-id="${anniversary.id}">
                    <i class="fas fa-images"></i> 查看照片 (${anniversary.photos.length})
                </button>
                <div class="anniversary-photos" id="anniversary-photos-${anniversary.id}" style="display: none;">
                    ${anniversary.photos.map(url => `
                        <img src="${url}" alt="照片" class="anniversary-photo" onclick="window.uiManager.openPhotoViewer('${url}', '${this.escapeHtml(anniversary.name)}')">
                    `).join('')}
                </div>
            ` : '';
            
            return `
                <div class="anniversary-card" data-id="${anniversary.id}">
                    <button class="anniversary-delete" data-id="${anniversary.id}">
                        <i class="fas fa-times"></i>
                    </button>
                    <span class="anniversary-icon">${anniversary.icon}</span>
                    <h3 class="anniversary-name">${this.escapeHtml(anniversary.name)}</h3>
                    <div class="anniversary-date">${this.formatDate(anniversary.date)}</div>
                    <div class="anniversary-countdown">${this.getCountdown(anniversary.date)}</div>
                    <p class="anniversary-desc">${this.escapeHtml(anniversary.description)}</p>
                    ${photosHtml}
                </div>
            `;
        }).join('');

        // 绑定删除事件
        container.querySelectorAll('.anniversary-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.deleteAnniversary(id);
            });
        });

        // 绑定照片展开事件
        container.querySelectorAll('.anniversary-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const photosDiv = document.getElementById(`anniversary-photos-${id}`);
                if (photosDiv) {
                    const isVisible = photosDiv.style.display !== 'none';
                    photosDiv.style.display = isVisible ? 'none' : 'grid';
                    e.currentTarget.innerHTML = isVisible 
                        ? `<i class="fas fa-images"></i> 查看照片 (${photosDiv.querySelectorAll('img').length})`
                        : `<i class="fas fa-times"></i> 收起照片`;
                }
            });
        });
    }

    async addAnniversary() {
        const date = document.getElementById('anniversaryDate').value;
        const name = document.getElementById('anniversaryName').value;
        const icon = document.getElementById('anniversaryIcon').value;
        const description = document.getElementById('anniversaryDesc').value;

        if (!date || !name || !icon || !description) return;

        const anniversary = {
            date,
            name,
            icon,
            description,
            photos: this.uploadedPhotos.anniversary
        };

        try {
            await this.storage.addAnniversary(anniversary);
            this.uploadedPhotos.anniversary = [];
            this.loadAnniversaries();
            this.loadTimeline();
            this.closeModal('anniversaryModal');
        } catch (error) {
            console.error('保存失败:', error);
            alert('保存失败，请重试');
        }
    }

    async deleteAnniversary(id) {
        if (!confirm('确定要删除这个纪念日吗？')) return;

        try {
            await this.storage.deleteAnniversary(id);
            this.loadAnniversaries();
            this.loadTimeline();
        } catch (error) {
            console.error('删除失败:', error);
            alert('删除失败，请重试');
        }
    }

    // 照片查看器
    openPhotoViewer(src, caption) {
        const viewer = document.getElementById('photoViewer');
        const img = document.getElementById('viewerImage');
        const captionEl = document.getElementById('viewerCaption');

        img.src = src;
        captionEl.textContent = caption;
        viewer.classList.add('active');
    }

    closePhotoViewer() {
        const viewer = document.getElementById('photoViewer');
        viewer.classList.remove('active');
    }

    // 工具函数
    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}年${month}月${day}日`;
    }

    getCountdown(dateString) {
        const targetDate = new Date(dateString);
        const today = new Date();
        
        let thisYearDate = new Date(today.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        
        if (thisYearDate < today) {
            thisYearDate = new Date(today.getFullYear() + 1, targetDate.getMonth(), targetDate.getDate());
        }
        
        const diff = thisYearDate - today;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) {
            return '就是今天！🎉';
        } else if (days === 1) {
            return '明天就到了！';
        } else {
            return `还有 ${days} 天`;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化应用
class App {
    constructor() {
        this.storage = new StorageManager();
        this.uploader = new ImageUploader();
        this.ui = new UIManager(this.storage, this.uploader);
        this.counter = new CounterManager();
        
        window.uiManager = this.ui;
        
        this.init();
    }

    async init() {
        // 等待存储初始化完成
        await this.storage.initStorage();
        
        this.counter.init();

        this.ui.loadTimeline();
        this.ui.loadMemories();
        this.ui.loadAnniversaries();

        this.bindEvents();
        this.initNavigation();
        this.addDataManagement();
        this.addSyncStatus();
    }

    bindEvents() {
        const addMemoryBtn = document.getElementById('addMemoryBtn');
        const addAnniversaryBtn = document.getElementById('addAnniversaryBtn');

        console.log('🔗 绑定事件...');
        console.log('addMemoryBtn:', addMemoryBtn);
        console.log('addAnniversaryBtn:', addAnniversaryBtn);

        if (addMemoryBtn) {
            addMemoryBtn.addEventListener('click', () => {
                console.log('🎯 点击了记录甜蜜瞬间按钮');
                this.ui.openModal('memoryModal');
            });
        } else {
            console.error('❌ 找不到 #addMemoryBtn 元素');
        }

        if (addAnniversaryBtn) {
            addAnniversaryBtn.addEventListener('click', () => {
                console.log('🎯 点击了添加纪念日按钮');
                this.ui.openModal('anniversaryModal');
            });
        } else {
            console.error('❌ 找不到 #addAnniversaryBtn 元素');
        }

        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal;
                this.ui.closeModal(modalId);
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.ui.closeModal(modal.id);
                }
            });
        });

        const memoryForm = document.getElementById('memoryForm');
        if (memoryForm) {
            memoryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.ui.addMemory();
            });
        }

        const anniversaryForm = document.getElementById('anniversaryForm');
        if (anniversaryForm) {
            anniversaryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.ui.addAnniversary();
            });
        }

        const viewerClose = document.querySelector('.viewer-close');
        if (viewerClose) {
            viewerClose.addEventListener('click', () => {
                this.ui.closePhotoViewer();
            });
        }

        const photoViewer = document.getElementById('photoViewer');
        if (photoViewer) {
            photoViewer.addEventListener('click', (e) => {
                if (e.target.id === 'photoViewer') {
                    this.ui.closePhotoViewer();
                }
            });
        }

        // 照片上传事件
        const memoryPhotos = document.getElementById('memoryPhotos');
        if (memoryPhotos) {
            memoryPhotos.addEventListener('change', async (e) => {
                if (e.target.files.length > 0) {
                    await this.ui.handlePhotoSelect(e.target.files, 'memory');
                    e.target.value = '';
                }
            });
        }

        const anniversaryPhotos = document.getElementById('anniversaryPhotos');
        if (anniversaryPhotos) {
            anniversaryPhotos.addEventListener('change', async (e) => {
                if (e.target.files.length > 0) {
                    await this.ui.handlePhotoSelect(e.target.files, 'anniversary');
                    e.target.value = '';
                }
            });
        }
    }

    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section, .hero-section');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // 添加数据管理功能
    addDataManagement() {
        // 在页脚添加数据管理按钮
        const footer = document.querySelector('.footer');
        if (footer) {
            const dataManageDiv = document.createElement('div');
            dataManageDiv.style.marginTop = '20px';
            dataManageDiv.innerHTML = `
                ${this.storage.syncEnabled ? `
                <button id="refreshDataBtn" style="margin: 5px; padding: 8px 16px; background: #00CED1; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-sync-alt"></i> 刷新数据
                </button>
                ` : ''}
                <button id="exportDataBtn" style="margin: 5px; padding: 8px 16px; background: #8A2BE2; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-download"></i> 导出数据
                </button>
                <button id="importDataBtn" style="margin: 5px; padding: 8px 16px; background: #FF69B4; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-upload"></i> 导入数据
                </button>
                <input type="file" id="importDataFile" accept=".json" style="display: none;">
            `;
            footer.insertBefore(dataManageDiv, footer.firstChild);

            // 刷新数据（从云端重新加载）
            if (this.storage.syncEnabled) {
                document.getElementById('refreshDataBtn').addEventListener('click', async () => {
                    const btn = document.getElementById('refreshDataBtn');
                    btn.disabled = true;
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 刷新中...';
                    
                    try {
                        await this.storage.refresh();
                        this.ui.loadMemories();
                        this.ui.loadAnniversaries();
                        this.ui.loadTimeline();
                        alert('数据已刷新！');
                    } catch (error) {
                        alert('刷新失败，请重试');
                    } finally {
                        btn.disabled = false;
                        btn.innerHTML = '<i class="fas fa-sync-alt"></i> 刷新数据';
                    }
                });
            }

            // 导出数据
            document.getElementById('exportDataBtn').addEventListener('click', () => {
                const data = this.storage.exportData();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
        a.download = `PictureBed-backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
            });

            // 导入数据
            document.getElementById('importDataBtn').addEventListener('click', () => {
                document.getElementById('importDataFile').click();
            });

            document.getElementById('importDataFile').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                        try {
                            const data = JSON.parse(event.target.result);
                            if (confirm('确定要导入数据吗？这将覆盖当前所有数据！')) {
                                await this.storage.importData(data);
                                this.ui.loadMemories();
                                this.ui.loadAnniversaries();
                                this.ui.loadTimeline();
                                alert('数据导入成功！');
                            }
                        } catch (error) {
                            alert('数据格式错误，导入失败！');
                        }
                    };
                    reader.readAsText(file);
                }
            });
        }
    }

    // 添加同步状态显示
    addSyncStatus() {
        if (!this.storage.syncEnabled) return;

        const nav = document.querySelector('.nav');
        if (nav) {
            const syncStatus = document.createElement('div');
            syncStatus.id = 'syncStatus';
            syncStatus.style.cssText = 'position: fixed; top: 70px; right: 20px; padding: 8px 12px; background: rgba(0, 206, 209, 0.9); color: white; border-radius: 5px; font-size: 12px; z-index: 999;';
            syncStatus.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> 云端同步已启用';
            document.body.appendChild(syncStatus);

            // 3秒后淡出
            setTimeout(() => {
                syncStatus.style.transition = 'opacity 1s';
                syncStatus.style.opacity = '0';
                setTimeout(() => syncStatus.remove(), 1000);
            }, 3000);
        }
    }
}

// 启动应用
function startApp() {
    console.log('🚀 启动应用...');
    console.log('📝 配置信息:', {
        ossConfig: window.OSS_CONFIG,
        loveStartDate: window.LOVE_START_DATE
    });
    new App();
}

// 确保 DOM 加载完成后再启动
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    // DOM 已经加载完成，直接启动
    startApp();
}