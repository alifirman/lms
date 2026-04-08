/**
 * Utility functions for the LMS application
 */

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) {
        const div = document.createElement('div');
        div.id = 'toast-container';
        div.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-2';
        document.body.appendChild(div);
    }
    
    const toast = document.createElement('div');
    const bgColors = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        info: 'bg-indigo-500',
        warning: 'bg-amber-500'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    toast.className = `${bgColors[type] || bgColors.info} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slideInRight min-w-[250px]`;
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span class="text-sm font-medium">${message}</span>
    `;
    
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('animate-slideOutRight');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}
