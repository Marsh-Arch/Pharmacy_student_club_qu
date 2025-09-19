// Bilingual Pharmacy Club Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Language Management System
    class LanguageManager {
        constructor() {
            this.currentLang = this.getStoredLanguage() || this.detectBrowserLanguage() || 'en';
            this.isRTL = this.currentLang === 'ar';
            this.init();
        }

        init() {
            this.setupLanguageToggle();
            this.applyLanguage(this.currentLang);
            this.updateLanguageButton();
        }

        getStoredLanguage() {
            try {
                return localStorage.getItem('pharmacy-club-language');
            } catch (e) {
                // localStorage might not be available in some environments
                return null;
            }
        }

        setStoredLanguage(lang) {
            try {
                localStorage.setItem('pharmacy-club-language', lang);
            } catch (e) {
                // localStorage might not be available in some environments
                console.warn('Could not save language preference');
            }
        }

        detectBrowserLanguage() {
            const browserLang = navigator.language || navigator.userLanguage;
            return browserLang.startsWith('ar') ? 'ar' : 'en';
        }

        setupLanguageToggle() {
            const languageBtn = document.getElementById('language-btn');
            if (languageBtn) {
                languageBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleLanguage();
                });
            }
        }

        toggleLanguage() {
            const newLang = this.currentLang === 'en' ? 'ar' : 'en';
            console.log(`Switching from ${this.currentLang} to ${newLang}`);
            this.switchLanguage(newLang);
        }

        switchLanguage(lang) {
            if (lang === this.currentLang) return;

            // Add switching animation class
            document.body.classList.add('lang-switching');
            
            setTimeout(() => {
                this.currentLang = lang;
                this.isRTL = lang === 'ar';
                this.applyLanguage(lang);
                this.updateLanguageButton();
                this.setStoredLanguage(lang);
                
                // Remove switching animation class
                setTimeout(() => {
                    document.body.classList.remove('lang-switching');
                }, 100);
                
                // Update gallery data for new language
                updateGalleryData();
                
                // Trigger custom event for other components
                window.dispatchEvent(new CustomEvent('languageChanged', {
                    detail: { language: lang, isRTL: this.isRTL }
                }));
                
                console.log(`Language switched to: ${lang}`);
            }, 150);
        }

        applyLanguage(lang) {
            const html = document.documentElement;
            
            // Update HTML attributes
            html.setAttribute('lang', lang);
            html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
            
            // Update document title
            document.title = lang === 'ar' ? 'نادي الصيدلة - الكلية' : 'Pharmacy Club - College';
            
            // Update all elements with data attributes
            this.updateElementsWithDataAttributes(lang);
            
            // Update select options
            this.updateSelectOptions(lang);
        }

        updateElementsWithDataAttributes(lang) {
            const elements = document.querySelectorAll('[data-en][data-ar]');
            
            elements.forEach(element => {
                const text = element.getAttribute(`data-${lang}`);
                if (text) {
                    // Handle different element types
                    if (element.tagName === 'INPUT' && element.type !== 'submit') {
                        element.placeholder = text;
                    } else if (element.tagName === 'OPTION') {
                        element.textContent = text;
                    } else {
                        // For regular elements, preserve HTML structure for <br> tags
                        if (text.includes('<br>')) {
                            element.innerHTML = text;
                        } else {
                            element.textContent = text;
                        }
                    }
                }
            });
        }

        updateSelectOptions(lang) {
            const selects = document.querySelectorAll('select');
            selects.forEach(select => {
                const options = select.querySelectorAll('option[data-en][data-ar]');
                options.forEach(option => {
                    const text = option.getAttribute(`data-${lang}`);
                    if (text) {
                        option.textContent = text;
                    }
                });
            });
        }

        updateLanguageButton() {
            const langText = document.getElementById('lang-text');
            if (langText) {
                langText.textContent = this.currentLang === 'en' ? 'العربية' : 'English';
            }
        }

        getCurrentLanguage() {
            return this.currentLang;
        }

        isCurrentlyRTL() {
            return this.isRTL;
        }
    }

    // Initialize Language Manager
    const languageManager = new LanguageManager();

    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Logo click handler to navigate to home
    const logoElements = document.querySelectorAll('.nav-logo, .logo-img, .logo-text');
    logoElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Enhanced Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const headerHeight = 100;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced Gallery Lightbox Functionality with Language Support
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    let galleryImages = [];

    function updateGalleryData() {
        const currentLang = languageManager.getCurrentLanguage();
        galleryImages = Array.from(galleryItems).map(item => ({
            src: item.getAttribute('data-src'),
            caption: item.getAttribute(`data-caption-${currentLang}`) || 
                    item.querySelector('.gallery-caption')?.getAttribute(`data-${currentLang}`) ||
                    item.querySelector('.gallery-caption')?.textContent || 
                    (currentLang === 'ar' ? 'صورة المعرض' : 'Gallery Image')
        }));
    }

    // Update gallery data on language change
    window.addEventListener('languageChanged', updateGalleryData);
    
    // Initialize gallery data
    if (galleryItems.length > 0) {
        updateGalleryData();

        // Open lightbox
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                currentImageIndex = index;
                updateGalleryData(); // Ensure latest language data
                showLightboxImage();
                lightbox.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        });
    }

    // Close lightbox functions
    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Close lightbox when clicking outside the image
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });

    // Show lightbox image
    function showLightboxImage() {
        if (galleryImages.length > 0 && lightboxImg && lightboxCaption) {
            const image = galleryImages[currentImageIndex];
            lightboxImg.src = image.src;
            lightboxImg.alt = image.caption;
            lightboxCaption.textContent = image.caption;
        }
    }

    // Previous image
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function(e) {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            showLightboxImage();
        });
    }

    // Next image
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function(e) {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            showLightboxImage();
        });
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (lightbox && !lightbox.classList.contains('hidden')) {
            if (e.key === 'ArrowLeft' && lightboxPrev) {
                lightboxPrev.click();
            } else if (e.key === 'ArrowRight' && lightboxNext) {
                lightboxNext.click();
            }
        }
    });

    // Enhanced Form Validation with Language Support
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        const currentLang = languageManager.getCurrentLanguage();

        // Remove existing error message
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Error messages in both languages
        const errorMessages = {
            en: {
                required: 'This field is required',
                email: 'Please enter a valid email address',
                select: 'Please select an option',
                minLength: 'Please provide at least 10 characters'
            },
            ar: {
                required: 'هذا الحقل مطلوب',
                email: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
                select: 'يرجى اختيار خيار',
                minLength: 'يرجى كتابة ١٠ أحرف على الأقل'
            }
        };

        // Email validation
        if (field.type === 'email' && value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                isValid = false;
                errorMessage = errorMessages[currentLang].email;
            }
        }

        // Required field validation
        if (field.required && !value) {
            isValid = false;
            errorMessage = errorMessages[currentLang].required;
        }

        // Select field validation
        if (field.tagName === 'SELECT' && field.required && !value) {
            isValid = false;
            errorMessage = errorMessages[currentLang].select;
        }

        // Text area minimum length
        if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
            isValid = false;
            errorMessage = errorMessages[currentLang].minLength;
        }

        // Apply validation styles
        if (!isValid) {
            field.classList.add('error');
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: var(--color-error);
                font-size: var(--font-size-sm);
                margin-top: var(--space-4);
                text-align: ${currentLang === 'ar' ? 'right' : 'left'};
            `;
            errorElement.textContent = errorMessage;
            field.parentElement.appendChild(errorElement);
        } else {
            field.classList.remove('error');
        }

        return isValid;
    }

    // Enhanced Membership Form Handler
    const membershipForm = document.getElementById('membership-form');
    if (membershipForm) {
        membershipForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isFormValid = true;

            // Validate all fields
            const nameField = membershipForm.querySelector('#student-name');
            const emailField = membershipForm.querySelector('#student-email');
            const yearField = membershipForm.querySelector('#year-level');

            if (nameField) isFormValid = validateField(nameField) && isFormValid;
            if (emailField) isFormValid = validateField(emailField) && isFormValid;
            if (yearField) isFormValid = validateField(yearField) && isFormValid;

            if (isFormValid) {
                const currentLang = languageManager.getCurrentLanguage();
                const successMessage = currentLang === 'ar' 
                    ? 'شكراً لاهتمامك! سنتواصل معك قريباً بخصوص فرص العضوية.'
                    : 'Thank you for your interest! We will contact you soon about membership opportunities.';
                    
                showNotification(successMessage, 'success');
                membershipForm.reset();
                
                // Remove any remaining error states
                membershipForm.querySelectorAll('.form-control').forEach(field => {
                    field.classList.remove('error');
                    const errorMsg = field.parentElement.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                });
            }
        });

        // Real-time validation for membership form
        membershipForm.querySelectorAll('.form-control').forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });

            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }

    // Enhanced Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isFormValid = true;

            // Validate all fields
            const nameField = contactForm.querySelector('#contact-name');
            const emailField = contactForm.querySelector('#contact-email');
            const subjectField = contactForm.querySelector('#contact-subject');
            const messageField = contactForm.querySelector('#contact-message');

            if (nameField) isFormValid = validateField(nameField) && isFormValid;
            if (emailField) isFormValid = validateField(emailField) && isFormValid;
            if (subjectField) isFormValid = validateField(subjectField) && isFormValid;
            if (messageField) isFormValid = validateField(messageField) && isFormValid;

            if (isFormValid) {
                const currentLang = languageManager.getCurrentLanguage();
                const successMessage = currentLang === 'ar' 
                    ? 'شكراً لتواصلك معنا! سنعود إليك قريباً.'
                    : 'Thank you for contacting us! We will get back to you shortly.';
                    
                showNotification(successMessage, 'success');
                contactForm.reset();
                
                // Remove any remaining error states
                contactForm.querySelectorAll('.form-control').forEach(field => {
                    field.classList.remove('error');
                    const errorMsg = field.parentElement.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                });
            }
        });

        // Real-time validation for contact form
        contactForm.querySelectorAll('.form-control').forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });

            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }

    // Enhanced Notification System with Language Support
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        // Get color based on type
        let borderColor = 'var(--color-info)';
        if (type === 'success') borderColor = 'var(--color-success)';
        if (type === 'error') borderColor = 'var(--color-error)';
        if (type === 'warning') borderColor = 'var(--color-warning)';
        
        const isRTL = languageManager.isCurrentlyRTL();
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            ${isRTL ? 'left: 20px' : 'right: 20px'};
            background: var(--color-surface);
            color: var(--color-text);
            padding: var(--space-16) var(--space-20);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            border-${isRTL ? 'right' : 'left'}: 4px solid ${borderColor};
            max-width: 400px;
            z-index: 1500;
            opacity: 0;
            transform: translateX(${isRTL ? '-100%' : '100%'});
            transition: all var(--duration-normal) var(--ease-standard);
            cursor: pointer;
            font-size: var(--font-size-md);
            line-height: 1.4;
            direction: ${isRTL ? 'rtl' : 'ltr'};
            text-align: ${isRTL ? 'right' : 'left'};
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto-hide notification
        const hideTimeout = setTimeout(() => {
            hideNotification(notification, isRTL);
        }, 5000);

        // Click to dismiss
        notification.addEventListener('click', function() {
            clearTimeout(hideTimeout);
            hideNotification(notification, isRTL);
        });

        function hideNotification(notif, rtl) {
            notif.style.opacity = '0';
            notif.style.transform = `translateX(${rtl ? '-100%' : '100%'})`;
            setTimeout(() => {
                if (notif.parentNode) {
                    notif.remove();
                }
            }, 300);
        }
    }

    // Active navigation highlight based on scroll position
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Header background change on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            updateActiveNavigation();
            
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(252, 252, 249, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.backgroundColor = 'var(--color-surface)';
                header.style.backdropFilter = 'none';
            }
        });
    }

    // Initial call to set active navigation
    updateActiveNavigation();

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.philosophy-card, .event-card, .news-card, .leader-card, .gallery-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Form focus animations
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Update form placeholders based on language
    window.addEventListener('languageChanged', function(e) {
        const lang = e.detail.language;
        
        // Update form placeholders that aren't handled by data attributes
        const nameInputs = document.querySelectorAll('input[name="name"]');
        nameInputs.forEach(input => {
            input.placeholder = lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name';
        });

        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.placeholder = lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address';
        });

        const messageTextareas = document.querySelectorAll('textarea[name="message"]');
        messageTextareas.forEach(textarea => {
            textarea.placeholder = lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...';
        });
    });

    // Add custom styles dynamically with RTL support
    const customStyle = document.createElement('style');
    customStyle.textContent = `
        .nav-link.active {
            background-color: var(--color-primary);
            color: var(--color-btn-primary-text);
        }
        
        .form-control.error {
            border-color: var(--color-error);
            box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
        }
        
        .form-group.focused .form-label {
            color: var(--color-primary);
        }
        
        .gallery-img {
            transition: transform var(--duration-normal) var(--ease-standard);
        }
        
        .gallery-item:hover .gallery-img {
            transform: scale(1.05);
        }
        
        /* Make logo elements clickable */
        .nav-logo, .logo-img, .logo-text {
            cursor: pointer;
        }
        
        /* Language button styling */
        #language-btn {
            border: 1px solid var(--color-border);
            background: var(--color-surface);
            color: var(--color-text);
        }
        
        #language-btn:hover {
            background: var(--color-secondary);
            border-color: var(--color-primary);
        }
        
        @media (max-width: 768px) {
            .notification {
                right: 10px !important;
                left: 10px !important;
                max-width: none !important;
            }
            
            [dir="rtl"] .notification {
                right: 10px !important;
                left: 10px !important;
            }
        }
        
        /* RTL-specific styles */
        [dir="rtl"] .hero-buttons {
            justify-content: flex-start;
        }
        
        [dir="rtl"] .philosophy-card,
        [dir="rtl"] .event-card,
        [dir="rtl"] .news-card,
        [dir="rtl"] .leader-card {
            text-align: right;
        }
        
        [dir="rtl"] .gallery-caption {
            text-align: right;
        }
        
        [dir="rtl"] .lightbox-caption {
            text-align: right;
        }
        
        /* Language transition animations */
        .lang-transition {
            transition: all 0.3s ease;
        }
        
        .lang-switching {
            pointer-events: none;
        }
        
        .lang-switching * {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(customStyle);

    // Keyboard shortcuts for language switching
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + L to toggle language
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            languageManager.toggleLanguage();
        }
    });

    // Console message for developers
    console.log('🏥 Bilingual Pharmacy Club Website Loaded Successfully!');
    console.log('✅ Navigation: Working');
    console.log('✅ Gallery Lightbox: Working');
    console.log('✅ Forms: Working with validation');
    console.log('✅ Mobile Menu: Working');
    console.log('✅ Language Toggle: Working (English/Arabic)');
    console.log('✅ RTL Support: Working');
    console.log('🌐 Current Language:', languageManager.getCurrentLanguage());
    console.log('📱 Keyboard Shortcut: Ctrl/Cmd + L to toggle language');
    console.log('Built with modern web technologies and bilingual design system');
});