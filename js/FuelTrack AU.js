/**
 * FuelTrack AU
 * Implement star rating system and copy function
 */

// Execute when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the star rating system
    initStarRating();
    
    // Initialize the copy function
    initCopyButtons();
    
    // Initialize the navigation bar
    initNavigation();
});

/**
 * Initialize navigation bar function
 */
function initNavigation() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // The first link is activated by default
    navLinks[0].classList.add('active');
    
    // Add click events to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove all link activation status
            navLinks.forEach(item => {
                item.classList.remove('active');
            });
            
            // Add the activation status of the current click link
            this.classList.add('active');
        });
        
        // Mouse hover effect
        link.addEventListener('mouseover', function() {
            if (!this.classList.contains('active')) {
                this.style.setProperty('--hover-width', '100%');
            }
        });
        
        link.addEventListener('mouseout', function() {
            if (!this.classList.contains('active')) {
                this.style.setProperty('--hover-width', '0');
            }
        });
    });
    
    // Check whether the current URL matches any navigation links and activate the corresponding links
    const currentUrl = window.location.hash;
    if (currentUrl) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentUrl) {
                // Remove all link activation status
                navLinks.forEach(item => {
                    item.classList.remove('active');
                });
                
                // Activate a link that matches the current URL
                link.classList.add('active');
            }
        });
    }
}

/**
 * Initialize the star rating system
 */
function initStarRating() {
    // Get all star rating containers
    const starRatingContainers = document.querySelectorAll('.star-rating');
    
    // Add events for each star rating container
    starRatingContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');
        const category = container.dataset.category;
        
        // Click Events - Fixed Rating
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(this.dataset.value);
                updateStars(stars, value);
                
                
                console.log(`Rating for ${category}: ${value}`);
            });
        });
        
        // Mouse hover event - Preview rating
        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const value = parseInt(this.dataset.value);
                previewStars(stars, value);
            });
            
            // Mouse Leave Event - Restore Original Rating
            star.addEventListener('mouseout', function() {
                resetStars(stars);
            });
        });
    });
}

/**
 * Updated star display
 * @param {NodeList} stars - Star elements collection
 * @param {number} value - Rating value
 */
function updateStars(stars, value) {
    stars.forEach((star, index) => {
        const starIcon = star.querySelector('i');
        
        if (index < value) {
            // Fill in stars
            starIcon.className = 'fas fa-star';
            star.classList.add('selected');
        } else {
            // Hollow stars
            starIcon.className = 'far fa-star';
            star.classList.remove('selected');
        }
    });
}

/**
 * Preview star display (mouse hover)
 * @param {NodeList} stars 
 * @param {number} value 
 */
function previewStars(stars, value) {
    stars.forEach((star, index) => {
        const starIcon = star.querySelector('i');
        
        if (index < value) {
            
            starIcon.className = 'fas fa-star';
        } else {
            
            starIcon.className = 'far fa-star';
        }
    });
}

/**
 * 
 * @param {NodeList} stars 
 */
function resetStars(stars) {
    stars.forEach(star => {
        const starIcon = star.querySelector('i');
        
        if (star.classList.contains('selected')) {
            
            starIcon.className = 'fas fa-star';
        } else {
            
            starIcon.className = 'far fa-star';
        }
    });
}

/**
 * Initialize the copy button function
 */
function initCopyButtons() {
    // Get all copy buttons
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    // Add click event for each copy button
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the text to be copied
            const textToCopy = this.dataset.clipboardText;
            
            // Copy text to clipboard
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Show the icon that was successfully copied
                    showCopySuccess(this);
                })
                .catch(err => {
                    console.error('无法复制文本: ', err);
                });
        });
    });
}

/**
 * 
 * @param {HTMLElement} button 
 */
function showCopySuccess(button) {
    
    const icon = button.querySelector('i');
    
    
    const originalClass = icon.className;
    
    
    icon.className = 'fas fa-check';
    button.classList.add('copy-success');
    
    
    setTimeout(() => {
        icon.className = originalClass;
        button.classList.remove('copy-success');
    }, 2000);
}

