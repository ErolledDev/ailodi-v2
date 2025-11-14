// Global variables
let contentData = [];
let filteredData = [];
let editingId = null;
let settings = {
    siteTitle: 'Admin CMS',
    siteDescription: 'Manage content',
    defaultAuthor: '',
    defaultStatus: 'draft'
};

// DOM elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const contentForm = document.getElementById('content-form');
const contentTable = document.getElementById('content-table-body');
const importBtn = document.getElementById('import-btn');
const exportBtn = document.getElementById('export-btn');
const importFile = document.getElementById('import-file');
const contentTextarea = document.getElementById('content');
const cancelBtn = document.getElementById('cancel-btn');
const markdownToolbar = document.querySelector('.markdown-toolbar');
const statusFilter = document.getElementById('status-filter');
const searchFilter = document.getElementById('search-filter');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const tabNavigation = document.getElementById('tab-navigation');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const themeToggle = document.getElementById('theme-toggle');
const currentDataJson = document.getElementById('current-data-json');
const markdownPreview = document.getElementById('markdown-preview');
const copyJsonBtn = document.getElementById('copy-json-btn');
const previewBtn = document.getElementById('preview-btn');
const previewModal = document.getElementById('preview-modal');
const closeModalBtn = document.getElementById('close-modal');
const contentPreviewModal = document.getElementById('content-preview-modal');
const closeContentPreviewBtn = document.getElementById('close-content-preview');
const contentPreviewTitle = document.getElementById('content-preview-title');
const contentPreviewContent = document.getElementById('content-preview-content');

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadContentData();
    loadSettings();
    initializeTheme();
});

// Initialize dashboard functionality
function initializeDashboard() {
    // Auto-generate slug from title
    document.getElementById('title').addEventListener('input', function() {
        const slug = this.value
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        document.getElementById('slug').value = slug;
    });
}

// Setup all event listeners
function setupEventListeners() {
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.dataset.tab);
            closeMobileMenu();
        });
    });

    // Form submission
    contentForm.addEventListener('submit', handleFormSubmit);

    // Import/Export functionality
    importBtn.addEventListener('click', () => importFile.click());
    exportBtn.addEventListener('click', exportToJSON);
    importFile.addEventListener('change', handleImport);

    // Cancel editing
    cancelBtn.addEventListener('click', cancelEditing);

    // Markdown toolbar
    markdownToolbar.addEventListener('click', handleMarkdownToolbar);

    // Filter functionality
    statusFilter.addEventListener('change', applyFilters);
    searchFilter.addEventListener('input', applyFilters);

    // Mobile menu
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    sidebarOverlay.addEventListener('click', closeMobileMenu);

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Copy JSON functionality
    if (copyJsonBtn) {
        copyJsonBtn.addEventListener('click', copyJsonData);
    }

    // Preview modal functionality
    if (previewBtn) {
        previewBtn.addEventListener('click', openPreviewModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closePreviewModal);
    }
    
    if (previewModal) {
        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) {
                closePreviewModal();
            }
        });
    }

    // Content preview modal functionality
    if (closeContentPreviewBtn) {
        closeContentPreviewBtn.addEventListener('click', closeContentPreviewModal);
    }
    
    if (contentPreviewModal) {
        contentPreviewModal.addEventListener('click', (e) => {
            if (e.target === contentPreviewModal) {
                closeContentPreviewModal();
            }
        });
    }

    // Settings functionality
    setupSettingsListeners();

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!tabNavigation.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (previewModal.classList.contains('active')) {
                closePreviewModal();
            }
            if (contentPreviewModal.classList.contains('active')) {
                closeContentPreviewModal();
            }
        }
    });
}

// Preview modal functions
function openPreviewModal() {
    updateMarkdownPreview();
    previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePreviewModal() {
    previewModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Content preview modal functions
function openContentPreviewModal(id) {
    const item = contentData.find(content => content.id === id);
    if (!item) return;

    contentPreviewTitle.textContent = item.title;
    
    try {
        const html = marked.parse(item.content || '');
        contentPreviewContent.innerHTML = html;
    } catch (error) {
        console.error('Markdown parsing error:', error);
        contentPreviewContent.innerHTML = '<p class="preview-placeholder">Error parsing markdown content...</p>';
    }
    
    contentPreviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContentPreviewModal() {
    contentPreviewModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Update markdown preview
function updateMarkdownPreview() {
    if (!markdownPreview || !contentTextarea) return;
    
    const markdownText = contentTextarea.value;
    
    if (!markdownText.trim()) {
        markdownPreview.innerHTML = '<p class="preview-placeholder">Start typing to see your content preview...</p>';
        return;
    }
    
    try {
        // Use marked.js to convert markdown to HTML
        const html = marked.parse(markdownText);
        markdownPreview.innerHTML = html;
    } catch (error) {
        console.error('Markdown parsing error:', error);
        markdownPreview.innerHTML = '<p class="preview-placeholder">Error parsing markdown...</p>';
    }
}

// Copy JSON data to clipboard
async function copyJsonData() {
    try {
        const jsonText = currentDataJson.textContent;
        
        if (!jsonText || jsonText === 'Loading...') {
            showNotification('No data to copy!', 'warning');
            return;
        }

        // Use the modern clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(jsonText);
            showNotification('JSON data copied to clipboard!', 'success');
        } else {
            // Fallback for older browsers or non-secure contexts
            const textArea = document.createElement('textarea');
            textArea.value = jsonText;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                showNotification('JSON data copied to clipboard!', 'success');
            } catch (err) {
                console.error('Fallback copy failed:', err);
                showNotification('Failed to copy data. Please select and copy manually.', 'error');
            }
            
            document.body.removeChild(textArea);
        }
    } catch (error) {
        console.error('Copy failed:', error);
        showNotification('Failed to copy data to clipboard!', 'error');
    }
}

// Mobile menu functions
function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle('active');
    tabNavigation.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    document.body.style.overflow = tabNavigation.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    mobileMenuToggle.classList.remove('active');
    tabNavigation.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Theme functions
function initializeTheme() {
    const savedTheme = localStorage.getItem('cms-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('cms-theme', newTheme);
}

// Setup settings event listeners
function setupSettingsListeners() {
    const backupDataBtn = document.getElementById('backup-data');
    const restoreDataBtn = document.getElementById('restore-data');
    const clearDataBtn = document.getElementById('clear-data');

    if (backupDataBtn) {
        backupDataBtn.addEventListener('click', backupData);
    }

    if (restoreDataBtn) {
        restoreDataBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = handleRestore;
            input.click();
        });
    }

    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearAllData);
    }
}

// Load content data from JSON file
async function loadContentData() {
    try {
        const response = await fetch('./data/content.json');
        if (response.ok) {
            contentData = await response.json();
            filteredData = [...contentData];
            updateDashboard();
        } else {
            console.warn('Could not load content.json, starting with empty data');
            contentData = [];
            filteredData = [];
            updateDashboard();
        }
    } catch (error) {
        console.warn('Error loading content data:', error);
        contentData = [];
        filteredData = [];
        updateDashboard();
    }
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('cms-settings');
    if (savedSettings) {
        settings = { ...settings, ...JSON.parse(savedSettings) };
    }
    
    // Update header
    document.querySelector('.dashboard-header h1').textContent = settings.siteTitle;
    const headerDesc = document.querySelector('.dashboard-header p');
    if (headerDesc) {
        headerDesc.textContent = settings.siteDescription;
    }
}

// Update JSON preview
function updateJsonPreview() {
    if (currentDataJson) {
        if (contentData.length === 0) {
            currentDataJson.textContent = '[]';
        } else {
            currentDataJson.textContent = JSON.stringify(contentData, null, 2);
        }
    }
}

// Apply filters to content
function applyFilters() {
    const statusValue = statusFilter.value;
    const searchValue = searchFilter.value.toLowerCase();
    
    filteredData = contentData.filter(item => {
        const matchesStatus = statusValue === 'all' || item.status === statusValue;
        const matchesSearch = !searchValue || 
            item.title.toLowerCase().includes(searchValue) ||
            (item.author && item.author.toLowerCase().includes(searchValue)) ||
            (item.content && item.content.toLowerCase().includes(searchValue));
        
        return matchesStatus && matchesSearch;
    });
    
    renderContentTable();
}

// Switch between tabs
function switchTab(tabName) {
    // Update tab buttons
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Update content table when switching to manage tab
    if (tabName === 'manage') {
        applyFilters();
    }
    
    // Update JSON preview when switching to settings tab
    if (tabName === 'settings') {
        updateJsonPreview();
    }
}

// Update all dashboard components
function updateDashboard() {
    updateOverviewStats();
    updateRecentContent();
    applyFilters();
    updateJsonPreview();
}

// Update overview statistics
function updateOverviewStats() {
    const totalContent = contentData.length;
    const publishedContent = contentData.filter(item => item.status === 'published').length;
    const draftContent = contentData.filter(item => item.status === 'draft').length;
    
    // Get unique categories
    const allCategories = contentData.flatMap(item => 
        Array.isArray(item.categories) ? item.categories : 
        typeof item.categories === 'string' ? item.categories.split(',').map(c => c.trim()) : []
    );
    const uniqueCategories = [...new Set(allCategories)].length;

    document.getElementById('total-content').textContent = totalContent;
    document.getElementById('published-content').textContent = publishedContent;
    document.getElementById('draft-content').textContent = draftContent;
    document.getElementById('total-categories').textContent = uniqueCategories;
}

// Update recent content list
function updateRecentContent() {
    const recentContentList = document.getElementById('recent-content-list');
    const recentItems = contentData
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 5);

    if (recentItems.length === 0) {
        recentContentList.innerHTML = '<p class="preview-placeholder">No content available</p>';
        return;
    }

    recentContentList.innerHTML = recentItems.map(item => `
        <div class="content-item">
            <div class="content-item-info">
                <h4>${item.title}</h4>
                <p>By ${item.author || 'Unknown'} • ${formatDate(item.updatedAt || item.createdAt)}</p>
            </div>
            <span class="content-status status-${item.status}">${item.status}</span>
        </div>
    `).join('');
}

// Render content table
function renderContentTable() {
    if (filteredData.length === 0) {
        const message = contentData.length === 0 ? 'No content available' : 'No content matches your filters';
        contentTable.innerHTML = `<tr><td colspan="5" class="preview-placeholder" style="text-align: center; padding: 40px;">${message}</td></tr>`;
        return;
    }

    contentTable.innerHTML = filteredData.map(item => `
        <tr>
            <td>
                ${item.featuredImageUrl ? 
                    `<img src="${item.featuredImageUrl}" alt="${item.title}" class="content-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                     <div class="content-image-placeholder" style="display: none;">No Image</div>` :
                    `<div class="content-image-placeholder">No Image</div>`
                }
            </td>
            <td><strong>${item.title}</strong></td>
            <td><span class="content-status status-${item.status}">${item.status}</span></td>
            <td>${formatDate(item.publishDate)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary btn-small" onclick="previewContent('${item.id}')" title="Preview Content">
                        <span class="btn-icon"><i class="fa-solid fa-eye"></i></span>
                        Preview
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="editContent('${item.id}')" title="Edit Content">
                        <span class="btn-icon"><i class="fa-solid fa-edit"></i></span>
                        Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteContent('${item.id}')" title="Delete Content">
                        <span class="btn-icon"><i class="fa-solid fa-trash"></i></span>
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Preview content
function previewContent(id) {
    openContentPreviewModal(id);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contentForm);
    const now = new Date().toISOString();
    
    const contentItem = {
        id: editingId || generateId(),
        title: formData.get('title'),
        slug: formData.get('slug'),
        content: formData.get('content'),
        featuredImageUrl: formData.get('featuredImageUrl') || '',
        metaDescription: formData.get('metaDescription') || '',
        seoTitle: formData.get('seoTitle') || '',
        keywords: parseCommaSeparated(formData.get('keywords')),
        author: formData.get('author') || settings.defaultAuthor || '',
        categories: parseCommaSeparated(formData.get('categories')),
        tags: parseCommaSeparated(formData.get('tags')),
        status: formData.get('status'),
        publishDate: now, // Automatically set to current date/time
        createdAt: editingId ? getExistingItem(editingId).createdAt : now,
        updatedAt: now
    };

    if (editingId) {
        // Update existing content
        const index = contentData.findIndex(item => item.id === editingId);
        if (index !== -1) {
            contentData[index] = contentItem;
        }
        editingId = null;
    } else {
        // Add new content
        contentData.push(contentItem);
    }

    // Reset form and update dashboard
    contentForm.reset();
    updateFormTitle('Create New Content', 'Create Content');
    updateDashboard();
    
    // Switch to manage tab to see the result
    switchTab('manage');
    
    // Show success message
    showNotification('Content saved successfully!', 'success');
}

// Edit content
function editContent(id) {
    const item = contentData.find(content => content.id === id);
    if (!item) return;

    editingId = id;
    
    // Populate form fields
    document.getElementById('title').value = item.title;
    document.getElementById('slug').value = item.slug;
    document.getElementById('content').value = item.content;
    document.getElementById('featuredImageUrl').value = item.featuredImageUrl || '';
    document.getElementById('metaDescription').value = item.metaDescription || '';
    document.getElementById('seoTitle').value = item.seoTitle || '';
    document.getElementById('keywords').value = Array.isArray(item.keywords) ? item.keywords.join(', ') : '';
    document.getElementById('author').value = item.author || '';
    document.getElementById('categories').value = Array.isArray(item.categories) ? item.categories.join(', ') : '';
    document.getElementById('tags').value = Array.isArray(item.tags) ? item.tags.join(', ') : '';
    document.getElementById('status').value = item.status;

    // Update form title and button
    updateFormTitle('Edit Content', 'Update Content');
    
    // Switch to create tab
    switchTab('create');
}

// Delete content
function deleteContent(id) {
    if (confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
        contentData = contentData.filter(item => item.id !== id);
        updateDashboard();
        showNotification('Content deleted successfully!', 'success');
    }
}

// Cancel editing
function cancelEditing() {
    editingId = null;
    contentForm.reset();
    updateFormTitle('Create New Content', 'Create Content');
}

// Export to JSON
function exportToJSON() {
    if (contentData.length === 0) {
        showNotification('No content to export!', 'warning');
        return;
    }

    const jsonContent = JSON.stringify(contentData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `content-export-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Content exported successfully!', 'success');
}

// Handle import
function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const jsonData = JSON.parse(event.target.result);
            
            if (!Array.isArray(jsonData)) {
                showNotification('Invalid JSON format. Expected an array of content items.', 'error');
                return;
            }
            
            const importedData = jsonData.filter(item => {
                // Validate required fields
                if (!item.title || !item.slug) {
                    return false;
                }
                
                // Ensure required fields exist
                if (!item.id) item.id = generateId();
                if (!item.createdAt) item.createdAt = new Date().toISOString();
                if (!item.updatedAt) item.updatedAt = new Date().toISOString();
                if (!item.status) item.status = 'draft';
                
                return true;
            });
            
            if (importedData.length > 0) {
                // Ask user if they want to replace or merge
                const replace = confirm(`Found ${importedData.length} valid items. Click OK to replace all existing content, or Cancel to merge with existing content.`);
                
                if (replace) {
                    contentData = importedData;
                } else {
                    contentData = [...contentData, ...importedData];
                }
                
                updateDashboard();
                showNotification(`Successfully imported ${importedData.length} items!`, 'success');
            } else {
                showNotification('No valid content found in the JSON file!', 'warning');
            }
        } catch (error) {
            console.error('Import error:', error);
            showNotification('Error importing JSON file. Please check the format.', 'error');
        }
    };
    
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
}

// Backup data
function backupData() {
    const backupData = {
        content: contentData,
        settings: settings,
        timestamp: new Date().toISOString()
    };
    
    const jsonContent = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cms-backup-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('System backup created successfully!', 'success');
}

// Handle restore
function handleRestore(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const backupData = JSON.parse(event.target.result);
            
            if (backupData.content && Array.isArray(backupData.content)) {
                const replace = confirm('This will replace all existing data. Are you sure you want to continue?');
                
                if (replace) {
                    contentData = backupData.content;
                    if (backupData.settings) {
                        settings = { ...settings, ...backupData.settings };
                        localStorage.setItem('cms-settings', JSON.stringify(settings));
                        loadSettings();
                    }
                    updateDashboard();
                    showNotification('System data restored successfully!', 'success');
                }
            } else {
                showNotification('Invalid backup file format!', 'error');
            }
        } catch (error) {
            console.error('Restore error:', error);
            showNotification('Error restoring backup file!', 'error');
        }
    };
    
    reader.readAsText(file);
    e.target.value = '';
}

// Clear all data
function clearAllData() {
    const confirm1 = confirm('This will permanently delete ALL content and settings. Are you absolutely sure?');
    if (!confirm1) return;
    
    const confirm2 = confirm('This action cannot be undone. Click OK to confirm deletion.');
    if (!confirm2) return;
    
    contentData = [];
    filteredData = [];
    settings = {
        siteTitle: 'Admin CMS',
        siteDescription: 'Manage Content',
        defaultAuthor: '',
        defaultStatus: 'draft'
    };
    
    localStorage.removeItem('cms-settings');
    loadSettings();
    updateDashboard();
    
    showNotification('All data cleared successfully!', 'success');
}

// Handle markdown toolbar
function handleMarkdownToolbar(e) {
    if (!e.target.closest('.toolbar-btn')) return;
    
    const button = e.target.closest('.toolbar-btn');
    const action = button.dataset.action;
    const textarea = contentTextarea;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let replacement = '';
    let cursorOffset = 0;
    
    switch (action) {
        case 'bold':
            replacement = `**${selectedText || 'bold text'}**`;
            cursorOffset = selectedText ? 0 : -9;
            break;
        case 'italic':
            replacement = `*${selectedText || 'italic text'}*`;
            cursorOffset = selectedText ? 0 : -11;
            break;
        case 'heading':
            replacement = `# ${selectedText || 'Heading'}`;
            cursorOffset = selectedText ? 0 : -7;
            break;
        case 'link':
            replacement = `[${selectedText || 'link text'}](url)`;
            cursorOffset = selectedText ? -5 : -14;
            break;
        case 'image':
            replacement = `![${selectedText || 'alt text'}](image-url)`;
            cursorOffset = selectedText ? -12 : -21;
            break;
        case 'code':
            if (selectedText.includes('\n')) {
                replacement = `\`\`\`\n${selectedText || 'code'}\n\`\`\``;
                cursorOffset = selectedText ? 0 : -8;
            } else {
                replacement = `\`${selectedText || 'code'}\``;
                cursorOffset = selectedText ? 0 : -5;
            }
            break;
        case 'quote':
            replacement = `> ${selectedText || 'quote'}`;
            cursorOffset = selectedText ? 0 : -5;
            break;
        case 'list':
            replacement = `- ${selectedText || 'list item'}`;
            cursorOffset = selectedText ? 0 : -9;
            break;
    }
    
    // Replace selected text
    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    
    // Set cursor position
    const newCursorPos = start + replacement.length + cursorOffset;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
}

// Utility functions
function generateId() {
    return 'content-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function getExistingItem(id) {
    return contentData.find(item => item.id === id);
}

function parseCommaSeparated(value) {
    if (!value) return [];
    return value.split(',').map(item => item.trim()).filter(item => item);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatCategories(categories) {
    if (!categories) return 'None';
    if (Array.isArray(categories)) {
        return categories.slice(0, 2).join(', ') + (categories.length > 2 ? '...' : '');
    }
    return categories;
}

function updateFormTitle(title, buttonText) {
    document.getElementById('form-title').textContent = title;
    document.getElementById('submit-text').textContent = buttonText;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Set background color based on type
    const colors = {
        success: 'hsl(142 76% 36%)',
        error: 'hsl(0 84.2% 60.2%)',
        warning: 'hsl(48 96% 53%)',
        info: 'hsl(221.2 83.2% 53.3%)'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}