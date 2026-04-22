/**
 * Admin Themes Management JavaScript
 * Integrated with dashboard
 */

let themes = [];
let editingTheme = null;

/**
 * Initialize theme management
 */
function initThemeManagement() {
    loadThemes();
}

/**
 * Load all themes
 */
async function loadThemes() {
    try {
        const response = await fetch('api/theme_handler.php?action=get_all_admin');
        const data = await response.json();
        
        if (data.success) {
            themes = data.themes;
            renderThemeTable();
        } else {
            showThemeError('Gagal memuat tema');
        }
    } catch (error) {
        console.error('Error loading themes:', error);
        showThemeError('Terjadi kesalahan');
    }
}

/**
 * Render themes table
 */
function renderThemeTable() {
    const container = document.getElementById('themesTableContainer');
    if (!container) return;
    
    if (themes.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    Belum ada tema. Klik "Tambah Tema" untuk membuat tema baru.
                </td>
            </tr>
        `;
        return;
    }
    
    container.innerHTML = themes.map(theme => `
        <tr class="border-b border-stroke dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <td class="px-6 py-4">
                <img src="${theme.preview_image || 'assets/placeholder-theme.jpg'}" 
                     alt="${theme.name}" 
                     class="w-20 h-20 object-cover rounded-lg"
                     onerror="this.src='assets/placeholder-theme.jpg'">
            </td>
            <td class="px-6 py-4">
                <div class="font-medium text-gray-900 dark:text-white">${theme.name}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">${theme.theme_id}</div>
            </td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    ${theme.category}
                </span>
            </td>
            <td class="px-6 py-4">
                <label class="relative inline-flex items-center cursor-pointer" title="${theme.is_active ? 'Nonaktifkan Tema' : 'Aktifkan Tema'}">
                    <input type="checkbox" class="sr-only peer" ${theme.is_active ? 'checked' : ''} onchange="toggleThemeActive(${theme.id})">
                    <div class="w-11 h-6 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600" style="background-color: ${theme.is_active ? '#10b981' : '#e5e7eb'};"></div>
                    <span class="ml-3 text-sm font-medium ${theme.is_active ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}">${theme.is_active ? 'Aktif' : 'Nonaktif'}</span>
                </label>
            </td>
            <td class="px-6 py-4">
                ${theme.is_premium ? '<i class="fas fa-crown text-yellow-500"></i>' : '-'}
            </td>
            <td class="px-6 py-4">
                <div class="flex gap-2">
                    <button onclick="editTheme(${theme.id})" 
                            class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors" title="Edit">
                        <ion-icon name="create-outline" class="text-xl"></ion-icon>
                    </button>
                    <button onclick="deleteTheme(${theme.id})" 
                            class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" title="Hapus">
                        <ion-icon name="trash-outline" class="text-xl"></ion-icon>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Open add modal
 */
function openAddThemeModal() {
    editingTheme = null;
    document.getElementById('themeModalTitle').textContent = 'Tambah Tema';
    document.getElementById('themeForm').reset();
    document.getElementById('themeId').value = '';
    document.getElementById('themeIdInput').disabled = false;
    const preview = document.getElementById('imagePreview');
    if (preview) preview.classList.add('hidden');
    document.getElementById('themeModal').classList.remove('hidden');
}

/**
 * Edit theme
 */
function editTheme(themeId) {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;
    
    editingTheme = theme;
    document.getElementById('themeModalTitle').textContent = 'Edit Tema';
    document.getElementById('themeId').value = theme.id;
    document.getElementById('themeIdInput').value = theme.theme_id;
    document.getElementById('themeIdInput').disabled = true;
    document.getElementById('themeName').value = theme.name;
    document.getElementById('themeDescription').value = theme.description || '';
    document.getElementById('previewImage').value = theme.preview_image || '';
    document.getElementById('themeCategory').value = theme.category;
    document.getElementById('themePrice').value = theme.price;
    document.getElementById('elementorIdPreview').value = theme.elementor_template_id_preview || '';
    document.getElementById('elementorIdCustomize').value = theme.elementor_template_id_customize || '';
    document.getElementById('popupIdCustomize').value = theme.popup_id_customize || '';
    document.getElementById('sortOrder').value = theme.sort_order || 0;
    document.getElementById('demoUrl').value = theme.demo_url || '';
    document.getElementById('isPremium').checked = theme.is_premium == 1;
    
    if (theme.preview_image) {
        const preview = document.getElementById('imagePreview');
        preview.querySelector('img').src = theme.preview_image;
        preview.classList.remove('hidden');
    }
    
    document.getElementById('themeModal').classList.remove('hidden');
}

/**
 * Close modal
 */
function closeThemeModal() {
    document.getElementById('themeModal').classList.add('hidden');
    editingTheme = null;
}

/**
 * Save theme (create or update)
 */
async function saveTheme(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const action = editingTheme ? 'update' : 'create';
    formData.append('action', action);
    
    try {
        const response = await fetch('api/theme_handler.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            app.showToast(data.message, true);
            closeThemeModal();
            loadThemes();
        } else {
            app.showToast(data.message, false);
        }
    } catch (error) {
        console.error('Error saving theme:', error);
        app.showToast('Terjadi kesalahan saat menyimpan', false);
    }
}

/**
 * Upload image
 */
async function uploadThemeImage(input) {
    if (!input.files || !input.files[0]) return;
    
    const formData = new FormData();
    formData.append('preview_image', input.files[0]);
    formData.append('action', 'upload_preview');
    
    try {
        const response = await fetch('api/theme_handler.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('previewImage').value = data.url;
            const preview = document.getElementById('imagePreview');
            preview.querySelector('img').src = data.url;
            preview.classList.remove('hidden');
            app.showToast('Gambar berhasil diupload', true);
        } else {
            app.showToast(data.message, false);
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        app.showToast('Gagal upload gambar', false);
    }
}

/**
 * Toggle theme active status
 */
async function toggleThemeActive(themeId) {
    if (!confirm('Ubah status tema ini?')) return;
    
    const formData = new FormData();
    formData.append('action', 'toggle_active');
    formData.append('id', themeId);
    
    try {
        const response = await fetch('api/theme_handler.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            app.showToast(data.message, true);
            loadThemes();
        } else {
            app.showToast(data.message, false);
        }
    } catch (error) {
        console.error('Error toggling status:', error);
        app.showToast('Terjadi kesalahan', false);
    }
}

/**
 * Delete theme
 */
async function deleteTheme(themeId) {
    if (!confirm('Hapus tema ini? Tindakan ini tidak dapat dibatalkan.')) return;
    
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', themeId);
    
    try {
        const response = await fetch('api/theme_handler.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            app.showToast(data.message, true);
            loadThemes();
        } else {
            app.showToast(data.message, false);
        }
    } catch (error) {
        console.error('Error deleting theme:', error);
        app.showToast('Terjadi kesalahan', false);
    }
}

/**
 * Show error message
 */
function showThemeError(message) {
    const container = document.getElementById('themesTableContainer');
    if (!container) return;
    
    container.innerHTML = `
        <tr>
            <td colspan="6" class="px-6 py-12 text-center">
                <i class="fas fa-exclamation-circle text-4xl text-red-300 mb-2"></i>
                <p class="text-red-500">${message}</p>
                <button onclick="loadThemes()" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Coba Lagi
                </button>
            </td>
        </tr>
    `;
}
