/**
 * Feature Gate System
 * Sistem pembatasan fitur berdasarkan paket langganan dengan limit per fitur
 * 
 * @author Kiro AI
 * @version 2.0.0
 */

const FeatureGate = (function() {
    'use strict';
    
    // Package hierarchy dan pricing dengan limits per fitur
    const PACKAGES = {
        free: { 
            level: 0, 
            price: 0, 
            displayName: 'Gratis',
            limits: {
                guests: 50,        // Maksimal 50 Tamu
                checkins: 50,      // 50 Check-in QR Code
                waTemplates: 1,    // 1 Template WhatsApp
                giftItems: 1       // 1 Item Wishlist Kado
            }
        },
        gratis: {  // Alias untuk 'free'
            level: 0, 
            price: 0, 
            displayName: 'Gratis',
            limits: {
                guests: 50,        // Maksimal 50 Tamu
                checkins: 50,      // 50 Check-in QR Code
                waTemplates: 1,    // 1 Template WhatsApp
                giftItems: 1       // 1 Item Wishlist Kado
            }
        },
        basic: { 
            level: 1, 
            price: 49000, 
            displayName: 'Basic',
            limits: {
                guests: 100,
                checkins: 50,
                waTemplates: 2,
                giftItems: 2
            }
        },
        premium: { 
            level: 2, 
            price: 99000, 
            displayName: 'Premium',
            limits: {
                guests: 500,
                checkins: 300,
                waTemplates: 5,
                giftItems: 5
            }
        },
        ultimate: { 
            level: 3, 
            price: 149000, 
            displayName: 'Ultimate',
            limits: {
                guests: -1,      // unlimited
                checkins: -1,    // unlimited
                waTemplates: -1, // unlimited
                giftItems: -1    // unlimited
            }
        }
    };
    
    // Feature configuration - semua fitur accessible, hanya dibatasi limit
    const FEATURES = {
        dashboard: {
            menuId: 'dashboardTab',
            title: 'Dashboard',
            icon: 'home-outline'
        },
        guest_list: {
            menuId: 'onlineTab',
            title: 'Daftar Tamu',
            icon: 'people-outline',
            limitKey: 'guests',
            limitLabel: 'tamu'
        },
        qr_checkin: {
            menuId: 'offlineTab',
            title: 'Check-in QR',
            icon: 'qr-code-outline',
            limitKey: 'checkins',
            limitLabel: 'check-in'
        },
        wishes: {
            menuId: 'wishesTab',
            title: 'Ucapan Tamu',
            icon: 'chatbubbles-outline'
        },
        wa_templates: {
            menuId: 'waTemplatesTab',
            title: 'Template WA',
            icon: 'chatbox-ellipses-outline',
            limitKey: 'waTemplates',
            limitLabel: 'template'
        },
        gift_settings: {
            menuId: 'giftSettingsToggle',
            title: 'Atur Hadiah',
            icon: 'gift-outline'
        },
        gift_list: {
            menuId: 'giftListTab',
            title: 'Daftar Kado',
            icon: 'list-outline',
            limitKey: 'giftItems',
            limitLabel: 'kado'
        },
        bank_account: {
            menuId: 'bankAccountTab',
            title: 'Rekening Bank',
            icon: 'card-outline'
        },
        shipping_address: {
            menuId: 'shippingAddressTab',
            title: 'Alamat Kirim',
            icon: 'location-outline'
        }
    };
    
    // State
    let currentPackage = 'free';
    let modalShown = false;
    
    // Current counts for each limited feature
    let currentCounts = {
        guests: 0,
        checkins: 0,
        waTemplates: 0,
        giftItems: 0
    };
    
    /**
     * Initialize feature gate system
     * @param {string} packageType - User's current package
     */
    function init(packageType) {
        currentPackage = packageType || 'free';
        console.log('🔐 FeatureGate initialized with package:', currentPackage);
        createModalContainer();
    }
    
    /**
     * Get limit for a specific feature
     * @param {string} limitKey - guests, checkins, waTemplates, giftItems
     * @returns {number} -1 for unlimited
     */
    function getLimit(limitKey) {
        return PACKAGES[currentPackage]?.limits[limitKey] ?? 0;
    }
    
    /**
     * Check if user can add more items for a feature
     * @param {string} limitKey - guests, checkins, waTemplates, giftItems
     * @param {number} currentCount - Current count (optional, uses stored count if not provided)
     * @returns {boolean}
     */
    function canAdd(limitKey, currentCount = null) {
        const limit = getLimit(limitKey);
        if (limit === -1) return true; // Unlimited
        const count = currentCount !== null ? currentCount : currentCounts[limitKey];
        return count < limit;
    }
    
    /**
     * Set current count for a feature
     * @param {string} limitKey
     * @param {number} count
     */
    function setCount(limitKey, count) {
        currentCounts[limitKey] = count;
    }
    
    /**
     * Get current count for a feature
     * @param {string} limitKey
     * @returns {number}
     */
    function getCount(limitKey) {
        return currentCounts[limitKey] || 0;
    }
    
    /**
     * Calculate upgrade price difference
     * @param {string} targetPackage
     * @returns {number}
     */
    function getUpgradePrice(targetPackage) {
        const currentPrice = PACKAGES[currentPackage]?.price || 0;
        const targetPrice = PACKAGES[targetPackage]?.price || 0;
        return Math.max(0, targetPrice - currentPrice);
    }
    
    /**
     * Format price to Rupiah
     * @param {number} amount
     * @returns {string}
     */
    function formatRupiah(amount) {
        return 'Rp ' + amount.toLocaleString('id-ID');
    }
    
    /**
     * Get next package for upgrade
     * @returns {string|null}
     */
    function getNextPackage() {
        const currentLevel = PACKAGES[currentPackage]?.level || 0;
        for (const key of Object.keys(PACKAGES)) {
            if (PACKAGES[key].level === currentLevel + 1) {
                return key;
            }
        }
        return null;
    }
    
    /**
     * Create modal container
     */
    function createModalContainer() {
        if (document.getElementById('featureGateModal')) return;
        
        const modalHTML = `
            <div id="featureGateModal" class="feature-gate-modal hidden">
                <div class="feature-gate-backdrop" onclick="FeatureGate.closeModal()"></div>
                <div class="feature-gate-content">
                    <button class="feature-gate-close" onclick="FeatureGate.closeModal()">
                        <ion-icon name="close-outline"></ion-icon>
                    </button>
                    <div id="featureGateModalBody"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    /**
     * Get feature-specific UX copy
     * @param {string} limitKey
     * @param {number} limit
     * @param {string} nextPkgName
     * @param {string} nextLimitText
     * @returns {object}
     */
    function getFeatureCopy(limitKey, limit, nextPkgName, nextLimitText) {
        const copies = {
            guests: {
                icon: 'people',
                iconColor: '#8B5CF6', // Soft purple
                title: 'Waktunya Tambah Kuota Tamu',
                description: `Undangan kamu sudah penuh dengan ${limit} tamu. Artinya acaramu makin ramai dan meriah.`,
                benefit1: `Tampung hingga ${nextLimitText} tamu undangan`,
                benefit2: 'Kelola daftar tamu lebih leluasa',
                benefit3: 'Kirim undangan ke lebih banyak orang tersayang'
            },
            checkins: {
                icon: 'qr-code',
                iconColor: '#10B981', // Soft green
                title: 'Butuh Lebih Banyak Check-in',
                description: `Sudah ${limit} tamu yang check-in. Acaramu pasti seru dan penuh kehadiran.`,
                benefit1: `Check-in hingga ${nextLimitText} tamu`,
                benefit2: 'Pantau kehadiran tamu dengan lebih lengkap',
                benefit3: 'Data kehadiran lebih akurat untuk acaramu'
            },
            waTemplates: {
                icon: 'chatbox-ellipses',
                iconColor: '#3B82F6', // Soft blue
                title: 'Mau Buat Template Baru',
                description: `Kamu sudah punya ${limit} template WhatsApp. Butuh variasi pesan yang lebih banyak untuk berbagai kategori tamu.`,
                benefit1: `Buat hingga ${nextLimitText} template berbeda`,
                benefit2: 'Personalisasi pesan untuk setiap kategori tamu',
                benefit3: 'Undangan lebih personal dan berkesan'
            },
            giftItems: {
                icon: 'gift',
                iconColor: '#F59E0B', // Soft amber
                title: 'Tambah Wishlist Kado',
                description: `Wishlist kamu sudah ${limit} item. Masih ada kado impian lainnya yang ingin kamu tambahkan.`,
                benefit1: `Tambahkan hingga ${nextLimitText} item wishlist`,
                benefit2: 'Lebih banyak pilihan untuk tamu yang ingin memberi',
                benefit3: 'Tingkatkan peluang mendapat kado yang diinginkan'
            }
        };
        
        return copies[limitKey] || {
            icon: 'sparkles',
            iconColor: '#8B5CF6',
            title: 'Tingkatkan Pengalamanmu',
            description: `Kamu sudah mencapai batas ${limit} untuk fitur ini.`,
            benefit1: `Dapatkan kuota hingga ${nextLimitText}`,
            benefit2: 'Akses fitur lebih lengkap',
            benefit3: 'Pengalaman tanpa batas'
        };
    }
    
    /**
     * Show limit reached modal
     * @param {string} limitKey - guests, checkins, waTemplates, giftItems
     * @param {string} featureTitle - Display title for the feature
     */
    function showLimitModal(limitKey, featureTitle) {
        const limit = getLimit(limitKey);
        const nextPackage = getNextPackage();
        
        if (!nextPackage) {
            // Already at ultimate - show appreciation message
            if (typeof window.app !== 'undefined' && window.app.showToast) {
                window.app.showToast('Kamu sudah di paket Ultimate', true);
            }
            return;
        }
        
        const nextLimit = PACKAGES[nextPackage].limits[limitKey];
        const nextLimitText = nextLimit === -1 ? 'tanpa batas' : nextLimit;
        const upgradePrice = getUpgradePrice(nextPackage);
        const currentPkg = PACKAGES[currentPackage];
        const nextPkg = PACKAGES[nextPackage];
        const currentPrice = currentPkg.price;
        const targetPrice = nextPkg.price;
        
        // Get feature-specific copy
        const copy = getFeatureCopy(limitKey, limit, nextPkg.displayName, nextLimitText);
        
        const modalBody = document.getElementById('featureGateModalBody');
        modalBody.innerHTML = `
            <div class="feature-gate-header">
                <div class="feature-gate-icon" style="background-color: ${copy.iconColor}; box-shadow: 0 8px 16px -4px ${copy.iconColor}40;">
                    <ion-icon name="${copy.icon}"></ion-icon>
                </div>
                <h3 class="feature-gate-title">${copy.title}</h3>
                <p class="feature-gate-description">${copy.description}</p>
            </div>
            
            <div class="feature-gate-benefits">
                <p class="feature-gate-benefits-title">Dengan paket ${nextPkg.displayName}, kamu bisa:</p>
                <div class="feature-gate-benefit">
                    <ion-icon name="checkmark-circle" class="text-green-500"></ion-icon>
                    <span>${copy.benefit1}</span>
                </div>
                <div class="feature-gate-benefit">
                    <ion-icon name="checkmark-circle" class="text-green-500"></ion-icon>
                    <span>${copy.benefit2}</span>
                </div>
                <div class="feature-gate-benefit">
                    <ion-icon name="checkmark-circle" class="text-green-500"></ion-icon>
                    <span>${copy.benefit3}</span>
                </div>
            </div>
            
            <div class="feature-gate-upgrade-info">
                <div class="feature-gate-package-badge">
                    <ion-icon name="sparkles"></ion-icon>
                    <span>Paket <strong>${nextPkg.displayName}</strong></span>
                </div>
                ${upgradePrice > 0 ? `
                    <p class="feature-gate-price">
                        Hanya bayar <strong>${formatRupiah(upgradePrice)}</strong>
                        <span class="feature-gate-price-strike">${formatRupiah(targetPrice)}</span>
                        <span class="feature-gate-price-note">Sekali bayar, selamanya milikmu</span>
                    </p>
                ` : ''}
            </div>
            
            <div class="feature-gate-actions">
                <button class="feature-gate-btn-upgrade" onclick="FeatureGate.goToUpgrade('${nextPackage}')">
                    <ion-icon name="arrow-up-circle-outline"></ion-icon>
                    <span>Upgrade Paket Mu Sekarang</span>
                </button>
                <button class="feature-gate-btn-later" onclick="FeatureGate.closeModal()">
                    Nanti saja
                </button>
            </div>
        `;
        
        const modal = document.getElementById('featureGateModal');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        modalShown = true;
    }
    
    /**
     * Close modal
     */
    function closeModal() {
        const modal = document.getElementById('featureGateModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            modalShown = false;
        }
    }
    
    /**
     * Navigate to upgrade page
     * @param {string} targetPackage
     */
    function goToUpgrade(targetPackage) {
        closeModal();
        
        const currentPrice = PACKAGES[currentPackage]?.price || 0;
        const targetPrice = PACKAGES[targetPackage]?.price || 0;
        const diff = targetPrice - currentPrice;
        
        const params = new URLSearchParams({
            upgrade: 'true',
            current: currentPackage,
            target: targetPackage,
            current_price: currentPrice,
            diff: diff
        });
        
        window.location.href = `pilih-harga.html?${params.toString()}`;
    }
    
    /**
     * Get current user package
     * @returns {string}
     */
    function getCurrentPackage() {
        return currentPackage;
    }
    
    /**
     * Get package display name
     * @param {string} packageKey
     * @returns {string}
     */
    function getPackageDisplayName(packageKey) {
        return PACKAGES[packageKey]?.displayName || packageKey;
    }
    
    /**
     * Check if modal is currently shown
     * @returns {boolean}
     */
    function isModalShown() {
        return modalShown;
    }
    
    // ========================================
    // SPECIFIC LIMIT FUNCTIONS (shortcuts)
    // ========================================
    
    // Guest limits
    function getGuestLimit() { return getLimit('guests'); }
    function canAddGuest(count) { return canAdd('guests', count); }
    function setGuestCount(count) { setCount('guests', count); updateLimitUI('guests', 'guestLimitProgress', 'tamu'); }
    function getGuestCount() { return getCount('guests'); }
    
    // Check-in limits
    function getCheckinLimit() { return getLimit('checkins'); }
    function canAddCheckin(count) { return canAdd('checkins', count); }
    function setCheckinCount(count) { setCount('checkins', count); updateLimitUI('checkins', 'checkinLimitProgress', 'check-in'); }
    function getCheckinCount() { return getCount('checkins'); }
    
    // WA Template limits
    function getWaTemplateLimit() { return getLimit('waTemplates'); }
    function canAddWaTemplate(count) { return canAdd('waTemplates', count); }
    function setWaTemplateCount(count) { setCount('waTemplates', count); updateLimitUI('waTemplates', 'waTemplateLimitProgress', 'template'); }
    function getWaTemplateCount() { return getCount('waTemplates'); }
    
    // Gift Item limits
    function getGiftItemLimit() { return getLimit('giftItems'); }
    function canAddGiftItem(count) { return canAdd('giftItems', count); }
    function setGiftItemCount(count) { setCount('giftItems', count); updateLimitUI('giftItems', 'giftLimitProgress', 'kado'); }
    function getGiftItemCount() { return getCount('giftItems'); }
    
    // Show specific limit modals
    function showGuestLimitModal() { showLimitModal('guests', 'Tamu'); }
    function showCheckinLimitModal() { showLimitModal('checkins', 'Check-in'); }
    function showWaTemplateLimitModal() { showLimitModal('waTemplates', 'Template WA'); }
    function showGiftItemLimitModal() { showLimitModal('giftItems', 'Daftar Kado'); }
    
    /**
     * Generic function to update limit UI for any feature
     * @param {string} limitKey - guests, checkins, waTemplates, giftItems
     * @param {string} containerId - DOM element ID for the progress container
     * @param {string} label - Display label (e.g., 'tamu', 'check-in')
     */
    function updateLimitUI(limitKey, containerId, label) {
        const limit = getLimit(limitKey);
        const count = getCount(limitKey);
        const isUnlimited = limit === -1;
        
        const progressContainer = document.getElementById(containerId);
        if (!progressContainer) return;
        
        if (isUnlimited) {
            progressContainer.style.display = 'none';
            progressContainer.classList.add('unlimited');
        } else {
            progressContainer.style.display = 'block';
            progressContainer.classList.remove('unlimited');
            
            const percentage = Math.min((count / limit) * 100, 100);
            const progressBar = progressContainer.querySelector('.feature-limit-bar, .guest-limit-bar');
            const progressText = progressContainer.querySelector('.feature-limit-text, .guest-limit-text');
            const hintEl = progressContainer.querySelector('.feature-limit-hint, .guest-limit-hint');
            
            if (progressBar) {
                progressBar.style.width = percentage + '%';
                // Reset classes
                progressBar.classList.remove('feature-limit-normal', 'feature-limit-warning', 'feature-limit-danger');
                progressBar.classList.remove('guest-limit-normal', 'guest-limit-warning', 'guest-limit-danger');
                
                // Add appropriate class based on percentage
                const prefix = progressBar.classList.contains('guest-limit-bar') ? 'guest-limit' : 'feature-limit';
                if (percentage >= 90) {
                    progressBar.classList.add(`${prefix}-danger`);
                } else if (percentage >= 70) {
                    progressBar.classList.add(`${prefix}-warning`);
                } else {
                    progressBar.classList.add(`${prefix}-normal`);
                }
            }
            
            if (progressText) {
                // Cleaner format: "5/20" instead of "5/20 tamu"
                progressText.textContent = `${count}/${limit}`;
            }
            
            if (hintEl) {
                // Show hint when 70% or more
                if (percentage >= 70) {
                    hintEl.style.display = 'flex';
                    hintEl.classList.add('show');
                } else {
                    hintEl.style.display = 'none';
                    hintEl.classList.remove('show');
                }
            }
        }
    }
    
    /**
     * Update guest limit UI elements (backward compatible)
     */
    function updateGuestLimitUI() {
        updateLimitUI('guests', 'guestLimitProgress', 'tamu');
    }
    
    /**
     * Update check-in limit UI
     */
    function updateCheckinLimitUI() {
        updateLimitUI('checkins', 'checkinLimitProgress', 'check-in');
    }
    
    /**
     * Update WA template limit UI
     */
    function updateWaTemplateLimitUI() {
        updateLimitUI('waTemplates', 'waTemplateLimitProgress', 'template');
    }
    
    /**
     * Update gift item limit UI
     */
    function updateGiftLimitUI() {
        updateLimitUI('giftItems', 'giftLimitProgress', 'kado');
    }
    
    /**
     * Get progress bar hint text based on feature
     * @param {string} limitKey
     * @param {string} label
     * @returns {string}
     */
    function getProgressHintText(limitKey, label) {
        const hints = {
            guests: 'Kuota tamu hampir penuh. <a onclick="FeatureGate.goToUpgrade(FeatureGate.getNextPackage())">Tambah kuota</a> untuk undang lebih banyak tamu.',
            checkins: 'Kuota check-in hampir habis. <a onclick="FeatureGate.goToUpgrade(FeatureGate.getNextPackage())">Tingkatkan</a> untuk pantau lebih banyak kehadiran.',
            waTemplates: 'Slot template hampir penuh. <a onclick="FeatureGate.goToUpgrade(FeatureGate.getNextPackage())">Tambah slot</a> untuk variasi pesan lebih banyak.',
            giftItems: 'Wishlist hampir penuh. <a onclick="FeatureGate.goToUpgrade(FeatureGate.getNextPackage())">Tambah slot</a> untuk lebih banyak pilihan kado.'
        };
        
        return hints[limitKey] || `Kuota ${label} hampir penuh. <a onclick="FeatureGate.goToUpgrade(FeatureGate.getNextPackage())">Tingkatkan paket</a> untuk menambah kuota.`;
    }
    
    /**
     * Generate progress bar HTML for any feature
     * @param {string} limitKey - guests, checkins, waTemplates, giftItems
     * @param {string} containerId - DOM element ID
     * @param {string} label - Display label
     * @param {string} icon - Ion-icon name
     * @returns {string} HTML string
     */
    function getProgressBarHTML(limitKey, containerId, label, icon) {
        const limit = getLimit(limitKey);
        const isUnlimited = limit === -1;
        
        if (isUnlimited) return '';
        
        const hintText = getProgressHintText(limitKey, label.toLowerCase());
        
        return `
            <div id="${containerId}" class="feature-limit-container">
                <div class="feature-limit-header">
                    <span class="feature-limit-label">
                        <ion-icon name="${icon}"></ion-icon>
                        ${label}
                    </span>
                    <span class="feature-limit-text">0/${limit}</span>
                </div>
                <div class="feature-limit-track">
                    <div class="feature-limit-bar feature-limit-normal" style="width: 0%"></div>
                </div>
                <div class="feature-limit-hint">
                    <ion-icon name="bulb-outline"></ion-icon>
                    <span>${hintText}</span>
                </div>
            </div>
        `;
    }
    
    /**
     * Get limit info for display
     * @param {string} limitKey
     * @returns {object}
     */
    function getLimitInfo(limitKey) {
        const limit = getLimit(limitKey);
        const count = getCount(limitKey);
        const isUnlimited = limit === -1;
        const percentage = isUnlimited ? 0 : Math.min((count / limit) * 100, 100);
        const remaining = isUnlimited ? -1 : Math.max(0, limit - count);
        
        return {
            limit,
            count,
            isUnlimited,
            percentage,
            remaining,
            canAdd: isUnlimited || count < limit
        };
    }
    
    // Public API
    return {
        init,
        // Generic limit functions
        getLimit,
        canAdd,
        setCount,
        getCount,
        getLimitInfo,
        showLimitModal,
        updateLimitUI,
        getProgressBarHTML,
        // Guest specific
        getGuestLimit,
        canAddGuest,
        setGuestCount,
        getGuestCount,
        showGuestLimitModal,
        updateGuestLimitUI,
        // Check-in specific
        getCheckinLimit,
        canAddCheckin,
        setCheckinCount,
        getCheckinCount,
        showCheckinLimitModal,
        updateCheckinLimitUI,
        // WA Template specific
        getWaTemplateLimit,
        canAddWaTemplate,
        setWaTemplateCount,
        getWaTemplateCount,
        showWaTemplateLimitModal,
        updateWaTemplateLimitUI,
        // Gift Item specific
        getGiftItemLimit,
        canAddGiftItem,
        setGiftItemCount,
        getGiftItemCount,
        showGiftItemLimitModal,
        updateGiftLimitUI,
        // Utility
        getUpgradePrice,
        formatRupiah,
        closeModal,
        goToUpgrade,
        getCurrentPackage,
        getPackageDisplayName,
        getNextPackage,
        isModalShown,
        PACKAGES,
        FEATURES
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeatureGate;
}
