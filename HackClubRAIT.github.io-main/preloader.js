// Preloader Script - Keep it simple and clean
const bodyTag = document.body;
const loaderContainer = document.getElementById("loader_fixed_container");

// Wait for everything to load
window.addEventListener('load', function() {
    console.log('✓ Page loaded successfully');
    
    // Hide loader after 1 second
    setTimeout(function() {
        if (loaderContainer) {
            loaderContainer.style.opacity = "0";
            loaderContainer.style.pointerEvents = "none";
            
            // Remove scroll lock
            if (bodyTag.classList.contains('no_scroll_bar_visible')) {
                bodyTag.classList.remove('no_scroll_bar_visible');
                bodyTag.classList.add('scroll_bar_visible');
            }
            
            console.log('✓ Loader hidden, page ready');
        } else {
            console.error('❌ Loader container not found');
        }
    }, 1000);
});