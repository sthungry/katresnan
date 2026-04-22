/**
 * Custom Dropdown Component
 * Replaces native select elements with styled custom dropdowns
 */

class CustomDropdown {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            searchable: options.searchable || false,
            placeholder: options.placeholder || 'Pilih opsi',
            onChange: options.onChange || null,
            ...options
        };
        
        this.selectedValue = element.value || '';
        this.selectedText = '';
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        console.log('🔧 CustomDropdown init for:', this.element.id || this.element.name);
        
        // Check if already initialized
        if (this.element.classList.contains('custom-dropdown-initialized')) {
            console.log('⏭️ Already initialized, skipping');
            return;
        }
        
        try {
            // Mark as initialized
            this.element.classList.add('custom-dropdown-initialized');
            
            // Hide original select
            this.element.style.display = 'none';
            
            // Create custom dropdown
            this.createDropdown();
            
            // Set initial value
            if (this.selectedValue) {
                this.updateSelected(this.selectedValue);
            }
            
            // Setup event listeners
            this.setupEventListeners();
            
            console.log('✅ CustomDropdown initialized for:', this.element.id || this.element.name);
        } catch (error) {
            console.error('❌ Error initializing CustomDropdown:', error);
            // Remove initialized class on error
            this.element.classList.remove('custom-dropdown-initialized');
            // Show original select if initialization fails
            this.element.style.display = '';
        }
    }
    
    createDropdown() {
        // Create wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'custom-dropdown';
        
        // Create trigger button
        this.trigger = document.createElement('button');
        this.trigger.type = 'button';
        this.trigger.className = 'custom-dropdown-trigger';
        if (!this.selectedValue) {
            this.trigger.classList.add('placeholder');
        }
        this.trigger.innerHTML = `
            <span class="custom-dropdown-text">${this.options.placeholder}</span>
            <ion-icon name="chevron-down-outline" class="custom-dropdown-icon"></ion-icon>
        `;
        
        // Create dropdown menu
        this.menu = document.createElement('div');
        this.menu.className = 'custom-dropdown-menu';
        
        // Add search if enabled
        if (this.options.searchable) {
            const searchWrapper = document.createElement('div');
            searchWrapper.className = 'custom-dropdown-search';
            searchWrapper.innerHTML = `
                <input type="text" placeholder="Cari..." class="custom-dropdown-search-input">
            `;
            this.menu.appendChild(searchWrapper);
            this.searchInput = searchWrapper.querySelector('input');
        }
        
        // Create options container
        this.optionsContainer = document.createElement('div');
        this.optionsContainer.className = 'custom-dropdown-options';
        this.menu.appendChild(this.optionsContainer);
        
        // Populate options
        this.populateOptions();
        
        // Assemble dropdown
        this.wrapper.appendChild(this.trigger);
        this.wrapper.appendChild(this.menu);
        
        // Insert after original select
        this.element.parentNode.insertBefore(this.wrapper, this.element.nextSibling);
    }
    
    populateOptions(filter = '') {
        this.optionsContainer.innerHTML = '';
        
        const children = Array.from(this.element.children);
        let hasVisibleOptions = false;
        
        console.log('📋 Populating options, children count:', children.length);
        
        children.forEach(child => {
            if (child.tagName === 'OPTGROUP') {
                console.log('📁 Found optgroup:', child.label);
                // Handle optgroup
                const groupLabel = child.label;
                const groupOptions = Array.from(child.children); // FIX: use children instead of options
                
                console.log('  Options in group:', groupOptions.length);
                
                // Check if any option in this group matches the filter
                const visibleGroupOptions = groupOptions.filter(option => {
                    // Skip only empty placeholder options (no value AND text starts with "pilih")
                    if (!option.value && option.text.toLowerCase().trim().startsWith('pilih')) {
                        return false;
                    }
                    if (filter && !option.text.toLowerCase().includes(filter.toLowerCase())) {
                        return false;
                    }
                    return true;
                });
                
                console.log('  Visible options:', visibleGroupOptions.length);
                
                if (visibleGroupOptions.length > 0) {
                    // Add group header
                    const groupHeader = document.createElement('div');
                    groupHeader.className = 'custom-dropdown-group-header';
                    groupHeader.textContent = groupLabel;
                    this.optionsContainer.appendChild(groupHeader);
                    
                    // Add group options
                    visibleGroupOptions.forEach(option => {
                        hasVisibleOptions = true;
                        this.createOptionElement(option);
                    });
                }
            } else if (child.tagName === 'OPTION') {
                console.log('📄 Found standalone option:', child.text, 'value:', child.value);
                // Handle standalone option
                // Skip only empty placeholder options (no value AND text contains "pilih")
                if (!child.value && child.text.toLowerCase().trim().startsWith('pilih')) {
                    console.log('  ⏭️ Skipping placeholder option');
                    return;
                }
                
                if (filter && !child.text.toLowerCase().includes(filter.toLowerCase())) {
                    console.log('  ⏭️ Filtered out by search');
                    return;
                }
                
                console.log('  ✅ Adding option to dropdown');
                hasVisibleOptions = true;
                this.createOptionElement(child);
            }
        });
        
        console.log('✅ Total visible options:', hasVisibleOptions);
        
        // Show empty state if no options
        if (!hasVisibleOptions) {
            const emptyElement = document.createElement('div');
            emptyElement.className = 'custom-dropdown-empty';
            emptyElement.textContent = 'Tidak ada opsi';
            this.optionsContainer.appendChild(emptyElement);
        }
    }
    
    createOptionElement(option) {
        const optionElement = document.createElement('div');
        optionElement.className = 'custom-dropdown-option';
        optionElement.dataset.value = option.value;
        optionElement.textContent = option.text;
        
        if (option.value === this.selectedValue) {
            optionElement.classList.add('selected');
        }
        
        optionElement.addEventListener('click', () => {
            this.selectOption(option.value, option.text);
        });
        
        this.optionsContainer.appendChild(optionElement);
    }
    
    setupEventListeners() {
        // Toggle dropdown
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
        
        // Search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.populateOptions(e.target.value);
            });
            
            this.searchInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.close();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        // Close other dropdowns
        document.querySelectorAll('.custom-dropdown.open').forEach(dropdown => {
            if (dropdown !== this.wrapper) {
                dropdown.classList.remove('open');
            }
        });
        
        this.wrapper.classList.add('open');
        this.isOpen = true;
        
        // Focus search input if available
        if (this.searchInput) {
            setTimeout(() => this.searchInput.focus(), 100);
        }
    }
    
    close() {
        this.wrapper.classList.remove('open');
        this.isOpen = false;
        
        // Clear search
        if (this.searchInput) {
            this.searchInput.value = '';
            this.populateOptions();
        }
    }
    
    selectOption(value, text) {
        this.selectedValue = value;
        this.selectedText = text;
        
        // Update original select
        this.element.value = value;
        
        // Trigger change event on original select
        const event = new Event('change', { bubbles: true });
        this.element.dispatchEvent(event);
        
        // Update UI
        this.updateSelected(value);
        
        // Call onChange callback
        if (this.options.onChange) {
            this.options.onChange(value, text);
        }
        
        this.close();
    }
    
    updateSelected(value) {
        const option = Array.from(this.element.options).find(opt => opt.value === value);
        
        if (option) {
            this.selectedValue = value;
            this.selectedText = option.text;
            
            const textElement = this.trigger.querySelector('.custom-dropdown-text');
            textElement.textContent = option.text;
            this.trigger.classList.remove('placeholder');
            
            // Update selected state in options
            this.optionsContainer.querySelectorAll('.custom-dropdown-option').forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.value === value);
            });
        }
    }
    
    setValue(value) {
        this.element.value = value;
        this.updateSelected(value);
    }
    
    destroy() {
        if (this.wrapper && this.wrapper.parentNode) {
            this.wrapper.remove();
        }
        this.element.style.display = '';
        this.element.customDropdown = null;
    }
}

// Auto-initialize all select elements with data-custom-dropdown attribute
document.addEventListener('DOMContentLoaded', () => {
    initializeCustomDropdowns();
});

function initializeCustomDropdowns(container = document) {
    const selects = container.querySelectorAll('select[data-custom-dropdown]');
    selects.forEach(select => {
        if (!select.customDropdown) {
            const searchable = select.dataset.searchable === 'true';
            const placeholder = select.dataset.placeholder || 'Pilih opsi';
            
            select.customDropdown = new CustomDropdown(select, {
                searchable,
                placeholder
            });
        }
    });
}

// Export for use in other scripts
window.CustomDropdown = CustomDropdown;
window.initializeCustomDropdowns = initializeCustomDropdowns;
