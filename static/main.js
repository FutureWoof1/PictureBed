// API基础配置
const API_BASE = '';

// API管理模块
class APIManager {
    // 获取所有甜蜜日常
    async getMemories() {
        const response = await fetch(`${API_BASE}/api/memories`);
        const result = await response.json();
        return result.data || [];
    }

    // 创建甜蜜日常
    async createMemory(memory) {
        const response = await fetch(`${API_BASE}/api/memories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memory)
        });
        return await response.json();
    }

    // 删除甜蜜日常
    async deleteMemory(id) {
        const response = await fetch(`${API_BASE}/api/memories/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    }

    // 获取所有纪念日
    async getAnniversaries() {
        const response = await fetch(`${API_BASE}/api/anniversaries`);
        const result = await response.json();
        return result.data || [];
    }

    // 创建纪念日
    async createAnniversary(anniversary) {
        const response = await fetch(`${API_BASE}/api/anniversaries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(anniversary)
        });
        return await response.json();
    }

    // 删除纪念日
    async deleteAnniversary(id) {
        const response = await fetch(`${API_BASE}/api/anniversaries/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    }

    // 上传图片
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE}/api/upload`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        return result.data.url;
    }
}

// 计数器管理模块
class CounterManager {
    constructor() {
        this.startDate = new Date('2022-10-15');
        this.interval = null;
    }

    init() {
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

        if (daysEl) daysEl.textContent = days;
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
    constructor(api) {
        this.api = api;
        this.uploadedPhotos = {
            memory: [],
            anniversary: []
        };
    }

    // 模态框管理
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
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
        if (submitBtn) submitBtn.disabled = true;

        for (const file of files) {
            try {
                // 上传图片
                const url = await this.api.uploadImage(file);
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
        if (submitBtn) submitBtn.disabled = false;
    }

    // 时光轴 - 从甜蜜日常和纪念日联动生成
    async loadTimeline() {
        const memories = await this.api.getMemories();
        const anniversaries = await this.api.getAnniversaries();
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
    async loadMemories() {
        const memories = await this.api.getMemories();
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
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                await this.deleteMemory(id);
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

        await this.api.createMemory(memory);
        this.uploadedPhotos.memory = [];
        await this.loadMemories();
        await this.loadTimeline();
        this.closeModal('memoryModal');
    }

    async deleteMemory(id) {
        if (!confirm('确定要删除这条记录吗？')) return;

        await this.api.deleteMemory(id);
        await this.loadMemories();
        await this.loadTimeline();
    }

    // 纪念日
    async loadAnniversaries() {
        const anniversaries = await this.api.getAnniversaries();
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
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                await this.deleteAnniversary(id);
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

        await this.api.createAnniversary(anniversary);
        this.uploadedPhotos.anniversary = [];
        await this.loadAnniversaries();
        await this.loadTimeline();
        this.closeModal('anniversaryModal');
    }

    async deleteAnniversary(id) {
        if (!confirm('确定要删除这个纪念日吗？')) return;

        await this.api.deleteAnniversary(id);
        await this.loadAnniversaries();
        await this.loadTimeline();
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
        this.api = new APIManager();
        this.ui = new UIManager(this.api);
        this.counter = new CounterManager();
        
        window.uiManager = this.ui;
        
        this.init();
    }

    async init() {
        this.counter.init();

        await this.ui.loadTimeline();
        await this.ui.loadMemories();
        await this.ui.loadAnniversaries();

        this.bindEvents();
        this.initNavigation();
    }

    bindEvents() {
        const addMemoryBtn = document.getElementById('addMemoryBtn');
        const addAnniversaryBtn = document.getElementById('addAnniversaryBtn');

        if (addMemoryBtn) {
            addMemoryBtn.addEventListener('click', () => {
                this.ui.openModal('memoryModal');
            });
        }

        if (addAnniversaryBtn) {
            addAnniversaryBtn.addEventListener('click', () => {
                this.ui.openModal('anniversaryModal');
            });
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
            memoryForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.ui.addMemory();
            });
        }

        const anniversaryForm = document.getElementById('anniversaryForm');
        if (anniversaryForm) {
            anniversaryForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.ui.addAnniversary();
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
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
