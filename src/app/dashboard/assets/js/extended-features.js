// Extended Features untuk Dashboard Undangan
// Fitur: Template WA, Gift Tracker, Dark Mode, dll

const ExtendedFeatures = {
    API_EXTENDED: '/api/extended_features.php',
    
    waTemplates: [],
    giftTrackerItems: [],
    thankYouTemplates: [],
    categories: ['Keluarga', 'Teman', 'Rekan Kerja', 'Tetangga', 'Umum'],
    giftCategories: ['Peralatan Rumah', 'Elektronik', 'Dekorasi', 'Pakaian', 'Uang', 'Lainnya'],
    
    // ========== DARK MODE ==========
    async initDarkMode() {
        try {
            const response = await fetch(`${this.API_EXTENDED}?action=get_dark_mode`);
            const result = await response.json();
            if (result.success && result.dark_mode) {
                document.body.classList.add('dark-mode');
                const toggle = document.getElementById('darkModeToggle');
                if (toggle) toggle.checked = true;
            }
        } catch(e) {
            console.error('Failed to load dark mode preference', e);
        }
    },
    
    async toggleDarkMode(enabled) {
        document.body.classList.toggle('dark-mode', enabled);
        try {
            await fetch(`${this.API_EXTENDED}?action=toggle_dark_mode`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ dark_mode: enabled ? 1 : 0 })
            });
        } catch(e) {
            console.error('Failed to save dark mode preference', e);
        }
    },
    
    // ========== WA TEMPLATES ==========
    async loadWATemplates() {
        // Show skeleton loading
        this.renderWATemplatesSkeleton();
        
        try {
            const response = await fetch(`${this.API_EXTENDED}?action=get_wa_templates`);
            const result = await response.json();
            if (result.success) {
                this.waTemplates = result.templates;
            }
        } catch(e) {
            console.error('Failed to load WA templates', e);
        }
        
        // Render actual templates after loading
        this.renderWATemplatesList();
    },
    
    renderWATemplatesView() {
        // Generate WA template limit progress bar
        const waTemplateProgressBar = typeof FeatureGate !== 'undefined' ? 
            FeatureGate.getProgressBarHTML('waTemplates', 'waTemplateLimitProgress', 'Template WA', 'chatbox-ellipses-outline') : '';
        
        return `
            <div class="space-y-6">
                <!-- WA Template Limit Progress Bar -->
                ${waTemplateProgressBar}
                
                <div id="waTemplatesContainer" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"></div>
            </div>`;
    },
    
    renderWATemplatesSkeleton() {
        const container = document.getElementById('waTemplatesContainer');
        if (!container) return;
        
        const skeletonCards = Array.from({length: 6}, (_, index) => `
            <div class="bg-white dark:bg-gray-800 rounded-3xl border border-stroke dark:border-gray-700 overflow-hidden">
                <div class="p-6">
                    <!-- Header Skeleton -->
                    <div class="flex items-start justify-between gap-3 mb-4">
                        <div class="flex-1">
                            <div class="skeleton skeleton-text w-40 mb-2"></div>
                            <div class="skeleton skeleton-text-sm w-20 rounded-full"></div>
                        </div>
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <div class="skeleton w-9 h-9 rounded-lg"></div>
                            <div class="skeleton w-9 h-9 rounded-lg"></div>
                        </div>
                    </div>
                    
                    <!-- Message Preview Skeleton -->
                    <div class="relative mb-6">
                        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 border-l-4 border-gray-200 dark:border-gray-600">
                            <div class="space-y-2">
                                <div class="skeleton skeleton-text w-full"></div>
                                <div class="skeleton skeleton-text w-4/5"></div>
                                <div class="skeleton skeleton-text w-3/5"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Action Buttons Skeleton -->
                    <div class="flex gap-2">
                        <div class="skeleton skeleton-text w-full h-10 rounded-xl"></div>
                        <div class="skeleton skeleton-text w-full h-10 rounded-xl"></div>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = skeletonCards;
    },

    renderWATemplatesList() {
        const container = document.getElementById('waTemplatesContainer');
        if (!container) return;
        
        // Update WA template limit UI
        if (typeof FeatureGate !== 'undefined') {
            FeatureGate.setWaTemplateCount(this.waTemplates.length);
        }
        
        if (this.waTemplates.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-16 px-6">
                    <div class="max-w-sm mx-auto">
                        <div class="mb-8">
                            <img src="/assets/empty-state.svg" alt="Belum ada template" class="empty-state-illustration mx-auto">
                        </div>
                        <h3 class="text-2xl font-bold text-dark dark:text-white mb-4">Belum Ada Template WhatsApp</h3>
                        <p class="text-dark/70 dark:text-gray-400 leading-relaxed mb-6">
                            Buat template pesan WhatsApp untuk mempermudah pengiriman undangan dengan pesan yang konsisten dan personal.
                        </p>
                        <button onclick="ExtendedFeatures.renderWATemplateModal()" class="btn-expand-hover bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-full text-sm transition-all duration-200 inline-flex items-center">
                            Buat Template Pertama
                            <ion-icon name="add-outline"></ion-icon>
                        </button>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.waTemplates.map((template, index) => {
            const gradients = [
                'from-blue-500 to-purple-600',
                'from-green-500 to-teal-600', 
                'from-orange-500 to-red-600',
                'from-purple-500 to-pink-600',
                'from-indigo-500 to-blue-600',
                'from-teal-500 to-green-600'
            ];
            const gradient = gradients[index % gradients.length];
            
            const categoryColors = {
                'Semua': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
                'Keluarga': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                'Teman': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                'Rekan Kerja': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                'Tetangga': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
                'Umum': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
            };
            
            const categoryColor = categoryColors[template.kategori_target] || categoryColors['Semua'];
            const wordCount = template.isi_template.split(' ').length;
            const estimatedTime = Math.ceil(wordCount / 200); // Reading time estimation
            
            return `
                <div class="group relative bg-white dark:bg-gray-800 rounded-3xl border border-stroke dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1">
                    <!-- Content -->
                    <div class="p-6">
                        <!-- Header with Action Buttons -->
                        <div class="flex items-start justify-between gap-3 mb-4">
                            <div class="flex-1">
                                <h3 class="font-bold text-lg text-dark dark:text-white leading-tight mb-2">${template.nama_template}</h3>
                                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColor} flex-shrink-0">
                                    <ion-icon name="people-outline" class="w-3 h-3 mr-1"></ion-icon>
                                    ${template.kategori_target}
                                </span>
                            </div>
                            
                            <!-- Always Visible Action Buttons -->
                            <div class="flex items-center gap-2 flex-shrink-0">
                                <button onclick="ExtendedFeatures.renderWATemplateModal(${template.id})" class="p-2.5 bg-gray-100 hover:bg-black text-gray-600 hover:text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md" title="Edit Template">
                                    <ion-icon name="create-outline" class="text-lg"></ion-icon>
                                </button>
                                <button onclick="ExtendedFeatures.deleteWATemplate(${template.id})" class="p-2.5 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md" title="Hapus Template">
                                    <ion-icon name="trash-outline" class="text-lg"></ion-icon>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Stats Row -->
                        <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                            <div class="flex items-center gap-1">
                                <ion-icon name="text-outline" class="text-sm"></ion-icon>
                                <span>${template.isi_template.length} karakter</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <ion-icon name="time-outline" class="text-sm"></ion-icon>
                                <span>~${estimatedTime} menit baca</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <ion-icon name="chatbubbles-outline" class="text-sm"></ion-icon>
                                <span>${wordCount} kata</span>
                            </div>
                        </div>
                        
                        <!-- Message Preview -->
                        <div class="relative mb-6">
                            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 border-l-4 border-primary/30">
                                <div class="text-sm text-dark/80 dark:text-gray-300 leading-relaxed line-clamp-3">
                                    ${this.formatTemplatePreview(template.isi_template)}
                                </div>
                                ${template.isi_template.length > 150 ? `
                                    <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 dark:from-gray-700/50 to-transparent rounded-b-2xl"></div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="flex gap-2">
                            <button onclick="ExtendedFeatures.duplicateTemplate(${template.id})" class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-dark dark:text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm">
                                <ion-icon name="copy-outline" class="mr-2"></ion-icon>
                                Duplikat
                            </button>
                            <button onclick="ExtendedFeatures.previewTemplate(${template.id})" class="flex-1 bg-dark hover:bg-dark/90 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm">
                                <ion-icon name="eye-outline" class="mr-2"></ion-icon>
                                Preview
                            </button>
                        </div>
                    </div>
                    
                    <!-- Hover Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>
                </div>
            `;
        }).join('');
    },
    
    formatTemplatePreview(text) {
        // Replace template variables with example values for preview
        return text
            .replace(/\[nama_tamu\]/g, '<span class="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">Nama Tamu</span>')
            .replace(/\[nama_mempelai\]/g, '<span class="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">Nama Mempelai</span>')
            .replace(/\[link_undangan\]/g, '<span class="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">Link Undangan</span>')
            .substring(0, 200) + (text.length > 200 ? '...' : '');
    },
    
    previewTemplate(templateId) {
        const template = this.waTemplates.find(t => t.id == templateId);
        if (!template) return;
        
        const modalContainer = document.getElementById('mainModalContainer');
        modalContainer.innerHTML = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 modal-backdrop" onclick="if(event.target === this) document.getElementById('mainModalContainer').innerHTML = ''">
                <div class="modal-sidebar active">
                    <div class="modal-sidebar-header">
                        <h2 class="modal-sidebar-title">Preview Template</h2>
                        <button onclick="document.getElementById('mainModalContainer').innerHTML = ''" class="modal-sidebar-close">
                            <ion-icon name="close-outline" class="text-2xl"></ion-icon>
                        </button>
                    </div>
                    <div class="modal-sidebar-content">
                        <div class="mb-4">
                            <h3 class="font-semibold text-dark dark:text-white mb-2">${template.nama_template}</h3>
                            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                ${template.kategori_target}
                            </span>
                        </div>
                        
                        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
                            <div class="text-sm text-dark dark:text-white whitespace-pre-wrap leading-relaxed">
                                ${this.formatTemplatePreview(template.isi_template)}
                            </div>
                        </div>
                        
                        <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            <p>Template ini akan menggunakan data tamu yang sebenarnya saat dikirim.</p>
                        </div>
                    </div>
                    <div class="modal-sidebar-footer">
                        <div class="flex gap-3">
                            <button onclick="ExtendedFeatures.renderWATemplateModal(${template.id})" class="flex-1 bg-gray-100 dark:bg-gray-700 text-dark dark:text-white font-semibold py-3 px-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                Edit Template
                            </button>
                            <button onclick="document.getElementById('mainModalContainer').innerHTML = ''" class="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-full shadow-sm transition-all duration-200">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    duplicateTemplate(templateId) {
        // Check limit before duplicating (creates a new template)
        if (typeof FeatureGate !== 'undefined') {
            if (!FeatureGate.canAddWaTemplate()) {
                FeatureGate.showWaTemplateLimitModal();
                return;
            }
        }
        
        const template = this.waTemplates.find(t => t.id == templateId);
        if (!template) return;
        
        // Create a copy with modified name
        const duplicatedTemplate = {
            ...template,
            id: null,
            nama_template: `${template.nama_template} (Copy)`
        };
        
        // Open modal with duplicated data
        this.renderWATemplateModal(null, duplicatedTemplate);
    },
    
    renderWATemplateModal(templateId = null, duplicatedData = null) {
        const template = templateId ? this.waTemplates.find(t => t.id == templateId) : duplicatedData;
        const isEditing = !!templateId;
        
        // Check limit before opening modal for new template (not when editing)
        if (!isEditing && typeof FeatureGate !== 'undefined') {
            if (!FeatureGate.canAddWaTemplate()) {
                FeatureGate.showWaTemplateLimitModal();
                return;
            }
        }
        
        // Hide mobile navbar
        if (typeof app !== 'undefined' && typeof app.hideMobileNav === 'function') {
            app.hideMobileNav();
        }
        
        const modalContainer = document.getElementById('mainModalContainer');
        modalContainer.innerHTML = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 modal-backdrop" onclick="if(event.target === this) { document.getElementById('mainModalContainer').innerHTML = ''; if(typeof app !== 'undefined' && typeof app.showMobileNav === 'function') app.showMobileNav(); }">
                <div class="modal-sidebar active">
                    <div class="modal-sidebar-header">
                        <h2 class="modal-sidebar-title">${isEditing ? 'Edit' : 'Tambah'} Template WhatsApp</h2>
                        <button onclick="document.getElementById('mainModalContainer').innerHTML = ''; if(typeof app !== 'undefined' && typeof app.showMobileNav === 'function') app.showMobileNav();" class="modal-sidebar-close">
                            <ion-icon name="close-outline" class="text-2xl"></ion-icon>
                        </button>
                    </div>
                    <div class="modal-sidebar-content">
                        <form id="waTemplateForm" class="space-y-6" novalidate>
                            ${isEditing ? `<input type="hidden" name="id" value="${template.id}">` : ''}
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="form-field">
                                    <label class="block text-sm font-semibold text-dark dark:text-white mb-2">Nama Template</label>
                                    <input type="text" name="nama_template" value="${template?.nama_template || ''}" placeholder="Contoh: Undangan Keluarga" data-required="true">
                                    <span class="form-error">Nama template wajib diisi</span>
                                </div>
                                <div class="form-field">
                                    <label class="block text-sm font-semibold text-dark dark:text-white mb-2">Kategori Target</label>
                                    <select name="kategori_target" data-required="true" data-custom-dropdown data-placeholder="Pilih Kategori">
                                        <option value="">Pilih Kategori</option>
                                        <option value="Semua" ${template?.kategori_target === 'Semua' ? 'selected' : ''}>Semua Kategori</option>
                                        ${this.categories.map(cat => `<option value="${cat}" ${template?.kategori_target === cat ? 'selected' : ''}>${cat}</option>`).join('')}
                                    </select>
                                    <span class="form-error">Kategori target wajib dipilih</span>
                                </div>
                            </div>
                            
                            <div class="form-field">
                                <label class="block text-sm font-semibold text-dark dark:text-white mb-2">Isi Pesan Template</label>
                                <textarea name="isi_template" rows="8" placeholder="Tulis pesan template di sini..." data-required="true">${template?.isi_template || ''}</textarea>
                                <span class="form-error">Isi pesan template wajib diisi</span>
                                
                                <!-- Template Variables Help -->
                                <div class="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <h4 class="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Variabel Template:</h4>
                                    <div class="flex flex-wrap gap-2 text-xs">
                                        <code class="px-2 py-1 bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 rounded">[nama_tamu]</code>
                                        <code class="px-2 py-1 bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-200 rounded">[nama_mempelai]</code>
                                        <code class="px-2 py-1 bg-purple-100 dark:bg-purple-800/50 text-purple-800 dark:text-purple-200 rounded">[link_undangan]</code>
                                    </div>
                                    <p class="text-xs text-blue-700 dark:text-blue-300 mt-2">Variabel ini akan diganti otomatis dengan data tamu saat mengirim pesan.</p>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-sidebar-footer">
                        <div class="flex gap-3">
                            <button type="button" onclick="document.getElementById('mainModalContainer').innerHTML = ''" class="flex-1 bg-gray-100 dark:bg-gray-700 text-dark dark:text-white font-semibold py-3 px-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                Batal
                            </button>
                            <button type="submit" form="waTemplateForm" class="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-full shadow-sm transition-all duration-200">
                                ${isEditing ? 'Simpan Perubahan' : 'Buat Template'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        
        // Initialize custom dropdown for kategori_target
        setTimeout(() => {
            const kategoriSelect = document.querySelector('#waTemplateForm select[name="kategori_target"]');
            if (kategoriSelect && !kategoriSelect.customDropdown && typeof CustomDropdown !== 'undefined') {
                kategoriSelect.customDropdown = new CustomDropdown(kategoriSelect, {
                    placeholder: 'Pilih Kategori'
                });
            }
        }, 100);
        
        // Add real-time validation event listeners
        const waTemplateFields = document.querySelectorAll('#waTemplateForm input, #waTemplateForm select, #waTemplateForm textarea');
        waTemplateFields.forEach(field => {
            field.addEventListener('input', () => {
                const formField = field.closest('.form-field');
                if (formField) {
                    formField.classList.remove('error');
                    const errorMsg = formField.querySelector('.form-error');
                    if (errorMsg) {
                        errorMsg.classList.remove('show');
                    }
                }
            });
        });
        
        document.getElementById('waTemplateForm').addEventListener('submit', (e) => {
            e.preventDefault(); // Always prevent default first
            this.handleWATemplateSubmit(e, isEditing);
        });
    },
    
    async handleWATemplateSubmit(event, isEditing) {
        event.preventDefault();
        const form = event.target;
        
        // Check limit before adding new template (not when editing)
        if (!isEditing && typeof FeatureGate !== 'undefined') {
            if (!FeatureGate.canAddWaTemplate()) {
                FeatureGate.showWaTemplateLimitModal();
                return;
            }
        }
        
        // Validate form using the same validation system as dashboard
        if (!this.validateForm(form)) {
            return;
        }
        
        const data = Object.fromEntries(new FormData(form).entries());
        const action = isEditing ? 'update_wa_template' : 'add_wa_template';
        
        try {
            const response = await fetch(`${this.API_EXTENDED}?action=${action}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            const result = await response.json();
            window.app.showToast(result.message, result.success);
            if (result.success) {
                document.getElementById('mainModalContainer').innerHTML = '';
                await this.loadWATemplates();
                this.renderWATemplatesList();
            }
        } catch (error) {
            window.app.showToast('Terjadi kesalahan.', false);
        }
    },
    
    async deleteWATemplate(id) {
        window.app.renderConfirmModal('Yakin menghapus template ini?', async () => {
            try {
                const response = await fetch(`${this.API_EXTENDED}?action=delete_wa_template`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({id})
                });
                const result = await response.json();
                window.app.showToast(result.message, result.success);
                if (result.success) {
                    await this.loadWATemplates();
                    this.renderWATemplatesList();
                }
            } catch(e) {
                window.app.showToast('Gagal menghapus template.', false);
            }
        });
    },
    
    // Form validation function (same as dashboard)
    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            const formField = field.closest('.form-field');
            if (!formField) return; // Skip fields without form-field wrapper
            
            const errorMsg = formField.querySelector('.form-error');
            if (!errorMsg) return; // Skip fields without error message element
            
            // Reset error state
            formField.classList.remove('error');
            errorMsg.classList.remove('show');
            
            // Validate based on field type and requirements
            let fieldValid = true;
            let errorMessage = '';
            
            // Required field validation
            if (field.hasAttribute('data-required') || field.hasAttribute('required')) {
                if (!field.value.trim()) {
                    fieldValid = false;
                    errorMessage = this.getRequiredFieldError(field);
                }
            }
            
            // Custom validation for template fields
            if (fieldValid && field.value.trim()) {
                switch (field.name) {
                    case 'nama_template':
                        if (field.value.length < 3) {
                            fieldValid = false;
                            errorMessage = 'Nama template minimal 3 karakter';
                        } else if (field.value.length > 50) {
                            fieldValid = false;
                            errorMessage = 'Nama template maksimal 50 karakter';
                        }
                        break;
                        
                    case 'isi_template':
                        if (field.value.length < 10) {
                            fieldValid = false;
                            errorMessage = 'Isi pesan minimal 10 karakter';
                        } else if (field.value.length > 1000) {
                            fieldValid = false;
                            errorMessage = 'Isi pesan maksimal 1000 karakter';
                        }
                        break;
                }
            }
            
            // Show error if validation failed
            if (!fieldValid) {
                formField.classList.add('error');
                errorMsg.textContent = errorMessage;
                errorMsg.classList.add('show');
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    getRequiredFieldError(field) {
        const fieldName = field.getAttribute('placeholder') || 
                        field.previousElementSibling?.textContent || 
                        'Field ini';
        
        switch (field.name) {
            case 'nama_template':
                return 'Nama template wajib diisi';
            case 'kategori_target':
                return 'Kategori target wajib dipilih';
            case 'isi_template':
                return 'Isi pesan template wajib diisi';
            default:
                return `${fieldName.replace(':', '')} wajib diisi`;
        }
    },
    
    // ========== GIFT TRACKER ==========
    async loadGiftTracker() {
        try {
            const response = await fetch(`${this.API_EXTENDED}?action=get_gift_tracker`);
            const result = await response.json();
            if (result.success) {
                this.giftTrackerItems = result.gifts;
            }
        } catch(e) {
            console.error('Failed to load gift tracker', e);
        }
    },
    
    renderGiftTrackerView() {
        return `
            <div>
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 px-5">
                    <h2 class="text-2xl md:text-3xl font-bold text-text-primary">Catatan Kado Fisik</h2>
                    <button onclick="ExtendedFeatures.renderGiftTrackerModal()" class="btn-primary font-semibold py-2 px-4 rounded-lg flex items-center gap-2 w-full md:w-auto">
                        <ion-icon name="add-outline"></ion-icon> Catat Kado
                    </button>
                </div>
                <div id="giftTrackerContainer" class="space-y-4"></div>
            </div>`;
    },
    
    renderGiftTrackerList() {
        const container = document.getElementById('giftTrackerContainer');
        if (!container) return;
        
        if (this.giftTrackerItems.length === 0) {
            container.innerHTML = `<div class="text-center py-10 bg-card rounded-lg shadow-sm"><p class="text-text-secondary">Belum ada kado yang dicatat.</p></div>`;
            return;
        }
        
        container.innerHTML = this.giftTrackerItems.map(gift => {
            const date = new Date(gift.tanggal_terima);
            const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            
            return `
            <div class="bg-card p-6 rounded-2xl shadow-sm">
                <div class="flex justify-between items-start gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <h3 class="font-bold text-lg text-text-primary">${gift.nama_barang}</h3>
                            <span class="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">${gift.kategori}</span>
                        </div>
                        <p class="text-text-secondary">Dari: <span class="font-semibold">${gift.nama_pengirim}</span></p>
                        <p class="text-sm text-text-secondary">${formattedDate}</p>
                        ${gift.catatan ? `<p class="text-sm text-text-secondary mt-2 italic">"${gift.catatan}"</p>` : ''}
                        ${gift.thank_you_sent ? '<span class="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">✓ Ucapan terima kasih terkirim</span>' : ''}
                    </div>
                    <div class="flex gap-2">
                        ${!gift.thank_you_sent && gift.nama_tamu ? `<button onclick="ExtendedFeatures.sendThankYouForGift(${gift.id}, '${gift.nama_pengirim.replace(/'/g, "\\'")}', '${gift.nama_tamu}')" class="p-2 text-green-500 hover:bg-green-50 rounded-full" title="Kirim Terima Kasih"><ion-icon name="logo-whatsapp"></ion-icon></button>` : ''}
                        <button onclick="ExtendedFeatures.renderGiftTrackerModal(${gift.id})" class="p-2 text-yellow-500 hover:bg-yellow-50 rounded-full" title="Edit"><ion-icon name="create-outline"></ion-icon></button>
                        <button onclick="ExtendedFeatures.deleteGiftTracker(${gift.id})" class="p-2 text-red-500 hover:bg-red-50 rounded-full" title="Hapus"><ion-icon name="trash-outline"></ion-icon></button>
                    </div>
                </div>
            </div>`;
        }).join('');
    },
    
    renderGiftTrackerModal(giftId = null) {
        const gift = giftId ? this.giftTrackerItems.find(g => g.id == giftId) : null;
        const isEditing = !!gift;
        
        const modalContainer = document.getElementById('mainModalContainer');
        modalContainer.innerHTML = `
            <div class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div class="bg-card w-full max-w-lg p-6 sm:p-8 rounded-2xl relative shadow-xl max-h-[90vh] overflow-y-auto">
                    <button onclick="document.getElementById('mainModalContainer').innerHTML = ''" class="absolute top-4 right-4 p-2 text-gray-400 hover:text-text-primary">
                        <ion-icon name="close-outline" class="text-2xl"></ion-icon>
                    </button>
                    <h2 class="text-xl font-bold text-text-primary mb-6">${isEditing ? 'Edit' : 'Catat'} Kado Fisik</h2>
                    <form id="giftTrackerForm" class="space-y-4" enctype="multipart/form-data">
                        ${isEditing ? `<input type="hidden" name="id" value="${gift.id}">` : ''}
                        <div>
                            <label class="block text-sm font-medium text-text-secondary mb-1">Nama Pengirim</label>
                            <input type="text" name="nama_pengirim" value="${gift?.nama_pengirim || ''}" class="input-field w-full px-4 py-2" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-text-secondary mb-1">Nama Barang</label>
                            <input type="text" name="nama_barang" value="${gift?.nama_barang || ''}" class="input-field w-full px-4 py-2" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-text-secondary mb-1">Kategori</label>
                            <select name="kategori" class="input-field w-full px-4 py-2">
                                ${this.giftCategories.map(cat => `<option value="${cat}" ${gift?.kategori === cat ? 'selected' : ''}>${cat}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-text-secondary mb-1">Catatan</label>
                            <textarea name="catatan" rows="3" class="input-field w-full px-4 py-2">${gift?.catatan || ''}</textarea>
                        </div>
                        <div class="flex justify-end gap-4 pt-4">
                            <button type="submit" class="btn-primary font-semibold py-2 px-4 rounded-lg">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>`;
        
        document.getElementById('giftTrackerForm').addEventListener('submit', (e) => this.handleGiftTrackerSubmit(e, isEditing));
    },
    
    async handleGiftTrackerSubmit(event, isEditing) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const action = isEditing ? 'update_gift_tracker' : 'add_gift_tracker';
        
        try {
            const response = await fetch(`${this.API_EXTENDED}?action=${action}`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            window.app.showToast(result.message, result.success);
            if (result.success) {
                document.getElementById('mainModalContainer').innerHTML = '';
                await this.loadGiftTracker();
                this.renderGiftTrackerList();
            }
        } catch (error) {
            window.app.showToast('Terjadi kesalahan.', false);
        }
    },
    
    async deleteGiftTracker(id) {
        window.app.renderConfirmModal('Yakin menghapus catatan kado ini?', async () => {
            try {
                const response = await fetch(`${this.API_EXTENDED}?action=delete_gift_tracker`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({id})
                });
                const result = await response.json();
                window.app.showToast(result.message, result.success);
                if (result.success) {
                    await this.loadGiftTracker();
                    this.renderGiftTrackerList();
                }
            } catch(e) {
                window.app.showToast('Gagal menghapus catatan.', false);
            }
        });
    },
    
    async sendThankYouForGift(giftId, senderName, guestName) {
        // Implementasi kirim WA terima kasih
        const guest = window.app.allGuests.find(g => g.nama_tamu === guestName);
        if (!guest || !guest.nomor_telepon) {
            window.app.showToast('Nomor telepon tidak tersedia.', false);
            return;
        }
        
        let formattedTelepon = String(guest.nomor_telepon).replace(/\D/g, '');
        if (formattedTelepon.startsWith('0')) { formattedTelepon = '62' + formattedTelepon.substring(1); }
        else if (!formattedTelepon.startsWith('62')) { formattedTelepon = '62' + formattedTelepon; }
        
        const pesan = `Halo ${senderName}, terima kasih banyak untuk kadonya! Sangat bermanfaat untuk kami. Semoga sehat selalu ya! 😊`;
        const linkWA = `https://api.whatsapp.com/send?phone=${formattedTelepon}&text=${encodeURIComponent(pesan)}`;
        window.open(linkWA, '_blank', 'noopener,noreferrer');
        
        // Mark as sent
        try {
            await fetch(`${this.API_EXTENDED}?action=mark_thank_you_sent`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: giftId})
            });
            await this.loadGiftTracker();
            this.renderGiftTrackerList();
        } catch(e) {
            console.error('Failed to mark thank you as sent', e);
        }
    },
    
    // ========== IMPORT FROM GOOGLE CONTACTS ==========
    renderImportContactsButton() {
        return `<button onclick="ExtendedFeatures.importFromGoogleContacts()" class="btn-secondary font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
            <ion-icon name="cloud-download-outline"></ion-icon> Import dari Google Contacts
        </button>`;
    },
    
    importFromGoogleContacts() {
        window.app.showToast('Fitur import Google Contacts akan segera hadir!', false);
        // TODO: Implementasi OAuth Google Contacts API
    }
};

// Export untuk digunakan di file lain
window.ExtendedFeatures = ExtendedFeatures;
