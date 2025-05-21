// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the theme class to the document body
    document.body.setAttribute('data-theme', currentTheme);
    
    // Update the toggle button state
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.checked = (currentTheme === 'dark');
    }
    
    // Update icons or UI indicators
    updateThemeIcons(currentTheme);
});

function toggleTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const newTheme = themeToggle.checked ? 'dark' : 'light';
    
    // Show loader animation to make transition smoother
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('active');
    
    setTimeout(() => {
        // Update the theme attribute on the body
        document.body.setAttribute('data-theme', newTheme);
        
        // Save the theme preference to localStorage
        localStorage.setItem('theme', newTheme);
        
        // Update icons or UI indicators
        updateThemeIcons(newTheme);
        
        // Dispatch an event that theme has changed - for charts and other components
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: newTheme } 
        }));
        
        // Hide loader
        if (loader) loader.classList.remove('active');
    }, 300);
}

function updateThemeIcons(theme) {
    const sunIcon = document.querySelector('.theme-icon.sun');
    const moonIcon = document.querySelector('.theme-icon.moon');
    
    if (sunIcon && moonIcon) {
        if (theme === 'dark') {
            sunIcon.style.opacity = '0.4';
            moonIcon.style.opacity = '1';
        } else {
            sunIcon.style.opacity = '1';
            moonIcon.style.opacity = '0.4';
        }
    }
}
