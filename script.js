// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Detect if device is mobile
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Handle other anchor links (like footer links) - excluding nav-links
    const otherLinks = document.querySelectorAll('a[href^="#"]:not(.nav-links a)');
    
    otherLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Get navbar height for offset calculation
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 70;
                
                // Calculate the position with navbar offset
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                // Smooth scroll to the calculated position
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation on scroll (reduced on mobile for performance)
    const observerOptions = {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = isMobile ? 'opacity 0.4s ease, transform 0.4s ease' : 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add typing effect to the main title (slower on mobile)
    const title = document.querySelector('.header-info h1');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, isMobile ? 120 : 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }

    // Enhanced click to copy email functionality with better mobile feedback
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        // Add touch-friendly styling
        if (isMobile) {
            link.style.minHeight = '44px';
            link.style.display = 'flex';
            link.style.alignItems = 'center';
        }
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.href.replace('mailto:', '');
            
            // Copy to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    showFeedback(this, 'Email copied!', '#48bb78');
                }).catch(() => {
                    window.location.href = this.href;
                });
            } else {
                // Fallback for older browsers
                window.location.href = this.href;
            }
        });
    });

    // Enhanced click to copy phone functionality
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        // Add touch-friendly styling
        if (isMobile) {
            link.style.minHeight = '44px';
            link.style.display = 'flex';
            link.style.alignItems = 'center';
        }
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const phone = this.href.replace('tel:', '');
            
            // Copy to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(phone).then(() => {
                    showFeedback(this, 'Phone copied!', '#48bb78');
                }).catch(() => {
                    window.location.href = this.href;
                });
            } else {
                // Fallback - try to make call
                window.location.href = this.href;
            }
        });
    });

    // Feedback function for mobile-friendly notifications
    function showFeedback(element, message, color) {
        const originalText = element.textContent;
        const originalColor = element.style.color;
        
        element.textContent = message;
        element.style.color = color;
        
        // Add vibration feedback on mobile
        if (navigator.vibrate && isMobile) {
            navigator.vibrate(50);
        }
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.color = originalColor;
        }, 2000);
    }

    // Enhanced hover effects for non-touch devices only
    if (!isMobile) {
        const skillTags = document.querySelectorAll('.skill-tag');
        skillTags.forEach(tag => {
            tag.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            });
            
            tag.addEventListener('mouseleave', function() {
                this.style.boxShadow = '';
            });
        });
    }

    // Add progress bars to language proficiency with mobile optimization
    const languageItems = document.querySelectorAll('.language-item');
    languageItems.forEach(item => {
        const level = item.querySelector('.language-level').textContent;
        let percentage = 0;
        
        switch(level) {
            case 'Native':
                percentage = 100;
                break;
            case 'Professional Proficiency':
                percentage = 90;
                break;
            case 'Good Proficiency':
                percentage = 75;
                break;
            default:
                percentage = 50;
        }
        
        const progressBar = document.createElement('div');
        progressBar.style.width = '100%';
        progressBar.style.height = isMobile ? '3px' : '4px';
        progressBar.style.backgroundColor = '#e2e8f0';
        progressBar.style.borderRadius = '2px';
        progressBar.style.marginTop = isMobile ? '6px' : '8px';
        progressBar.style.overflow = 'hidden';
        
        const progress = document.createElement('div');
        progress.style.width = '0%';
        progress.style.height = '100%';
        progress.style.background = 'linear-gradient(90deg, #667eea, #764ba2)';
        progress.style.borderRadius = '2px';
        progress.style.transition = isMobile ? 'width 0.8s ease' : 'width 1s ease';
        
        progressBar.appendChild(progress);
        item.appendChild(progressBar);
        
        // Animate progress bar when in view
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        progress.style.width = percentage + '%';
                    }, isMobile ? 300 : 500);
                }
            });
        });
        
        progressObserver.observe(item);
    });
});

// Simple brand header scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const brandHeader = document.querySelector('.brand-header');
    
    // Add scroll effect to brand header
    let lastScrollY = 0;
    let ticking = false;
    
    function updateBrandHeader() {
        const currentScrollY = window.scrollY;
        
        if (brandHeader) {
            if (currentScrollY > 100) {
                brandHeader.classList.add('scrolled');
            } else {
                brandHeader.classList.remove('scrolled');
            }
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateBrandHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, {passive: true});
    
    // Enhanced CV Download functionality
    const cvDownloadButton = document.querySelector('a[download="CVISSAM.pdf"]');
    if (cvDownloadButton) {
        cvDownloadButton.addEventListener('click', function(e) {
            // Add visual feedback
            const originalText = this.querySelector('.button-text').textContent;
            const buttonText = this.querySelector('.button-text');
            const icon = this.querySelector('.fas');
            
            // Change button state during download
            buttonText.textContent = 'Downloading...';
            icon.classList.remove('fa-download');
            icon.classList.add('fa-spinner', 'fa-spin');
            
            // Add haptic feedback on mobile
            if (navigator.vibrate && window.innerWidth <= 768) {
                navigator.vibrate(50);
            }
            
            // Reset button after download
            setTimeout(() => {
                buttonText.textContent = 'Downloaded!';
                icon.classList.remove('fa-spinner', 'fa-spin');
                icon.classList.add('fa-check');
                
                // Reset to original state
                setTimeout(() => {
                    buttonText.textContent = originalText;
                    icon.classList.remove('fa-check');
                    icon.classList.add('fa-download');
                }, 2000);
            }, 1000);
            
            // Track download event (if analytics are needed)
            console.log('CV Downloaded:', new Date().toISOString());
        });
        
        // Enhanced hover effects for download button
        cvDownloadButton.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.fas.fa-download');
            if (icon) {
                icon.style.animation = 'downloadPulse 0.6s ease infinite';
            }
        });
        
        cvDownloadButton.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.fas.fa-download');
            if (icon) {
                icon.style.animation = '';
            }
        });
    }
    
    // Enhanced Contact Me scroll functionality
    const contactMeButton = document.getElementById('contactMeBtn');
    if (contactMeButton) {
        contactMeButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add visual feedback
            const originalText = this.querySelector('.button-text').textContent;
            const buttonText = this.querySelector('.button-text');
            const icon = this.querySelector('.fas');
            
            // Change button state during scroll
            buttonText.textContent = 'Taking you there...';
            icon.classList.remove('fa-paper-plane');
            icon.classList.add('fa-rocket');
            
            // Scroll to the very bottom of the page
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            
            // Smooth scroll to the bottom of the page
            window.scrollTo({
                top: documentHeight,
                behavior: 'smooth'
            });
            
            // Add haptic feedback on mobile
            if (navigator.vibrate && window.innerWidth <= 768) {
                navigator.vibrate([50, 100, 50]);
            }
            
            // Reset button after scroll
            setTimeout(() => {
                buttonText.textContent = 'Let\'s Connect!';
                icon.classList.remove('fa-rocket');
                icon.classList.add('fa-heart');
                
                // Reset to original state
                setTimeout(() => {
                    buttonText.textContent = originalText;
                    icon.classList.remove('fa-heart');
                    icon.classList.add('fa-paper-plane');
                }, 2000);
            }, 1000);
        });
        
        // Enhanced hover effects for contact button
        contactMeButton.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.fas.fa-paper-plane');
            if (icon) {
                icon.style.transform = 'translateX(3px) rotate(15deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        contactMeButton.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.fas.fa-paper-plane');
            if (icon) {
                icon.style.transform = 'translateX(0) rotate(0deg)';
            }
        });
    }
    
    // Detect if device is mobile
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
});

// Enhanced scroll to top functionality with mobile optimization
let scrollToTopButton;

window.addEventListener('scroll', function() {
    const isMobile = window.innerWidth <= 768;
    
    if (window.pageYOffset > (isMobile ? 200 : 300)) {
        if (!scrollToTopButton) {
            scrollToTopButton = document.createElement('button');
            scrollToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
            scrollToTopButton.style.position = 'fixed';
            scrollToTopButton.style.bottom = isMobile ? '90px' : '20px';
            scrollToTopButton.style.left = '20px';
            scrollToTopButton.style.background = '#4a5568';
            scrollToTopButton.style.color = 'white';
            scrollToTopButton.style.border = 'none';
            scrollToTopButton.style.width = isMobile ? '45px' : '50px';
            scrollToTopButton.style.height = isMobile ? '45px' : '50px';
            scrollToTopButton.style.borderRadius = '50%';
            scrollToTopButton.style.cursor = 'pointer';
            scrollToTopButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            scrollToTopButton.style.fontSize = isMobile ? '14px' : '16px';
            scrollToTopButton.style.transition = 'all 0.3s ease';
            scrollToTopButton.style.zIndex = '999';
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.transform = 'translateY(20px)';
            
            scrollToTopButton.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            if (!isMobile) {
                scrollToTopButton.addEventListener('mouseenter', function() {
                    this.style.background = '#2d3748';
                    this.style.transform = 'translateY(-2px)';
                });
                
                scrollToTopButton.addEventListener('mouseleave', function() {
                    this.style.background = '#4a5568';
                    this.style.transform = 'translateY(0)';
                });
            }
            
            document.body.appendChild(scrollToTopButton);
        }
        
        scrollToTopButton.style.opacity = '1';
        scrollToTopButton.style.transform = 'translateY(0)';
    } else if (scrollToTopButton) {
        scrollToTopButton.style.opacity = '0';
        scrollToTopButton.style.transform = 'translateY(20px)';
    }
});

// Enhanced touch support for mobile devices
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Add touch feedback to interactive elements
    const interactiveElements = document.querySelectorAll('.skill-tag, .contact-item a, .footer-links a');
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        }, {passive: true});
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.opacity = '';
            }, 150);
        }, {passive: true});
    });
}

// Orientation change handler for mobile devices
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 500);
});

// Enhanced print styles for mobile
const printStyles = `
    @media print {
        body {
            font-size: 11px !important;
            line-height: 1.3 !important;
            color: black !important;
        }
        
        .header {
            background: none !important;
            color: black !important;
            box-shadow: none !important;
            padding: 15px 0 !important;
        }
        
        .header-content {
            flex-direction: row !important;
            text-align: left !important;
            gap: 20px !important;
        }
        
        .profile-image img {
            width: 80px !important;
            height: 80px !important;
        }
        
        .header-info h1 {
            font-size: 20px !important;
            margin-bottom: 4px !important;
        }
        
        .header-info h2 {
            font-size: 14px !important;
            margin-bottom: 10px !important;
        }
        
        .contact-info {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
            font-size: 10px !important;
        }
        
        .section {
            box-shadow: none !important;
            margin-bottom: 15px !important;
            padding: 12px !important;
            page-break-inside: avoid;
            border: 1px solid #e0e0e0 !important;
        }
        
        .section-title {
            font-size: 14px !important;
            color: black !important;
            margin-bottom: 10px !important;
        }
        
        .skill-tag, .tool-tag {
            background: #f5f5f5 !important;
            color: black !important;
            border: 1px solid #ccc !important;
            font-size: 9px !important;
            padding: 2px 6px !important;
        }
        
        .footer, 
        button {
            display: none !important;
        }
        
        a {
            color: black !important;
            text-decoration: none !important;
        }
        
        .about-text,
        .experience-description,
        .project-item p {
            font-size: 10px !important;
            line-height: 1.2 !important;
        }
        
        .cert-item,
        .education-item,
        .experience-item,
        .project-item,
        .volunteer-item {
            padding: 8px !important;
            margin-bottom: 8px !important;
        }
        
        .languages-grid {
            grid-template-columns: repeat(3, 1fr) !important;
        }
        
        .projects-grid {
            grid-template-columns: 1fr !important;
        }
        
        .skills-grid {
            grid-template-columns: 2fr 1fr !important;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = printStyles;
document.head.appendChild(styleSheet);

// Enhanced responsive functionality for the new header design
document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    // Enhanced header responsiveness
    function optimizeHeaderForDevice() {
        const header = document.querySelector('.header');
        const profileRings = document.querySelectorAll('.profile-ring');
        const particles = document.querySelectorAll('.particle');
        const orbs = document.querySelectorAll('.gradient-orb');
        const contactCards = document.querySelectorAll('.contact-card');
        
        if (isMobile) {
            // Reduce animations on mobile for better performance
            profileRings.forEach(ring => {
                ring.style.animationDuration = '15s';
            });
            
            particles.forEach((particle, index) => {
                if (index > 3) {
                    particle.style.display = 'none';
                } else {
                    particle.style.animationDuration = '20s';
                }
            });
            
            orbs.forEach((orb, index) => {
                if (index > 1) {
                    orb.style.display = 'none';
                } else {
                    orb.style.animationDuration = '25s';
                }
            });
            
            // Enhanced touch interactions for contact cards
            contactCards.forEach(card => {
                card.style.minHeight = '60px';
                card.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.98)';
                }, {passive: true});
                
                card.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                }, {passive: true});
            });
        } else if (isTablet) {
            // Moderate optimizations for tablets
            profileRings.forEach(ring => {
                ring.style.animationDuration = '12s';
            });
            
            particles.forEach(particle => {
                particle.style.animationDuration = '15s';
            });
        }
    }
    
    // CTA button interactions
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        if (!isMobile) {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        } else {
            // Touch feedback for mobile
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            }, {passive: true});
            
            button.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }, {passive: true});
        }
    });
    
    // Enhanced contact card functionality
    const contactLinks = document.querySelectorAll('.contact-card .contact-link');
    contactLinks.forEach(link => {
        if (link.href.includes('mailto:')) {
            link.addEventListener('click', function(e) {
                if (isMobile) {
                    e.preventDefault();
                    const email = this.href.replace('mailto:', '');
                    
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(email).then(() => {
                            showContactFeedback(this, '📧 Email copied!');
                        }).catch(() => {
                            window.location.href = this.href;
                        });
                    } else {
                        window.location.href = this.href;
                    }
                }
            });
        } else if (link.href.includes('tel:')) {
            link.addEventListener('click', function(e) {
                if (isMobile) {
                    const phone = this.href.replace('tel:', '');
                    showContactFeedback(this, '📱 Calling...');
                }
            });
        } else if (link.href.includes('linkedin.com')) {
            link.addEventListener('click', function() {
                if (isMobile) {
                    showContactFeedback(this, '🔗 Opening LinkedIn...');
                }
            });
        }
    });
    
    // Contact feedback function
    function showContactFeedback(element, message) {
        const originalText = element.textContent;
        const card = element.closest('.contact-card');
        
        element.textContent = message;
        card.style.background = 'rgba(72, 187, 120, 0.2)';
        card.style.borderColor = 'rgba(72, 187, 120, 0.4)';
        
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        setTimeout(() => {
            element.textContent = originalText;
            card.style.background = '';
            card.style.borderColor = '';
        }, 2000);
    }
    
    // Availability badge interaction
    const availabilityBadge = document.querySelector('.availability-badge');
    if (availabilityBadge) {
        availabilityBadge.addEventListener('click', function() {
            const statusText = this.querySelector('.status-indicator');
            const originalText = statusText.textContent;
            
            statusText.textContent = '✅ Ready to connect!';
            this.style.background = 'rgba(72, 187, 120, 0.15)';
            this.style.borderColor = 'rgba(72, 187, 120, 0.3)';
            
            setTimeout(() => {
                statusText.textContent = originalText;
                this.style.background = '';
                this.style.borderColor = '';
            }, 2000);
        });
    }
    
    // Responsive window resize handler
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            optimizeHeaderForDevice();
            updateResponsiveElements();
        }, 250);
    });
    
    // Update responsive elements
    function updateResponsiveElements() {
        const currentWidth = window.innerWidth;
        const header = document.querySelector('.header');
        const mainTitle = document.querySelector('.main-title');
        const contactGrid = document.querySelector('.contact-grid');
        const headerActions = document.querySelector('.header-actions');
        
        if (currentWidth <= 480) {
            // Very small screens
            if (mainTitle) {
                mainTitle.style.fontSize = '2.2rem';
            }
            if (contactGrid) {
                contactGrid.style.maxWidth = '280px';
            }
            if (headerActions) {
                headerActions.style.flexDirection = 'column';
                headerActions.style.gap = '15px';
            }
        } else if (currentWidth <= 768) {
            // Mobile screens
            if (mainTitle) {
                mainTitle.style.fontSize = '2.5rem';
            }
            if (contactGrid) {
                contactGrid.style.maxWidth = '400px';
            }
            if (headerActions) {
                headerActions.style.flexDirection = 'column';
                headerActions.style.gap = '20px';
            }
        } else if (currentWidth <= 1024) {
            // Tablet screens
            if (mainTitle) {
                mainTitle.style.fontSize = '3.5rem';
            }
            if (contactGrid) {
                contactGrid.style.maxWidth = '100%';
            }
            if (headerActions) {
                headerActions.style.flexDirection = 'row';
                headerActions.style.gap = '25px';
            }
        } else {
            // Desktop screens
            if (mainTitle) {
                mainTitle.style.fontSize = '';
            }
            if (contactGrid) {
                contactGrid.style.maxWidth = '';
            }
            if (headerActions) {
                headerActions.style.flexDirection = 'row';
                headerActions.style.gap = '30px';
            }
        }
    }
    
    // Orientation change handler for mobile
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            optimizeHeaderForDevice();
            updateResponsiveElements();
            
            // Recalculate header height on orientation change
            const header = document.querySelector('.header');
            if (header && isMobile) {
                if (window.orientation === 90 || window.orientation === -90) {
                    // Landscape mode
                    header.style.minHeight = '100vh';
                    header.style.padding = '40px 0 60px 0';
                } else {
                    // Portrait mode
                    header.style.minHeight = '100vh';
                    header.style.padding = '60px 0 80px 0';
                }
            }
        }, 500);
    });
    
    // Intersection Observer for header animations
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const particles = entry.target.querySelectorAll('.particle');
                const orbs = entry.target.querySelectorAll('.gradient-orb');
                
                particles.forEach((particle, index) => {
                    setTimeout(() => {
                        particle.style.opacity = '1';
                    }, index * 200);
                });
                
                orbs.forEach((orb, index) => {
                    setTimeout(() => {
                        orb.style.opacity = '1';
                    }, index * 300);
                });
            }
        });
    }, {
        threshold: 0.2
    });
    
    const header = document.querySelector('.header');
    if (header) {
        headerObserver.observe(header);
    }
    
    // Initialize optimizations
    optimizeHeaderForDevice();
    updateResponsiveElements();
    
    // Performance monitoring for mobile
    if (isMobile) {
        let performanceOptimized = false;
        
        const checkPerformance = () => {
            if (performance.now() > 5000 && !performanceOptimized) {
                // Further reduce animations if performance is poor
                const profileRings = document.querySelectorAll('.profile-ring');
                const particles = document.querySelectorAll('.particle');
                
                profileRings.forEach(ring => {
                    ring.style.animation = 'none';
                });
                
                particles.forEach((particle, index) => {
                    if (index > 1) {
                        particle.style.display = 'none';
                    }
                });
                
                performanceOptimized = true;
            }
        };
        
        setTimeout(checkPerformance, 5000);
    }
});

/* ========================================
   ENHANCED JAVASCRIPT ANIMATIONS
   ======================================== */

// Enhanced Animation System
document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.innerWidth <= 768;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Create enhanced animation system
    class AnimationController {
        constructor() {
            this.animations = new Map();
            this.setupIntersectionObserver();
            this.setupMouseFollower();
            this.setupParticleSystem();
            this.setupHeaderAnimations();
            this.setupSectionAnimations();
            this.setupSkillAnimations();
            this.setupContactAnimations();
        }
        
        // Enhanced Intersection Observer for better performance
        setupIntersectionObserver() {
            const options = {
                threshold: isMobile ? [0.1, 0.3, 0.5] : [0.1, 0.3, 0.5, 0.7],
                rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px'
            };
            
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target, entry.intersectionRatio);
                    }
                });
            }, options);
        }
        
        // Enhanced mouse follower for desktop
        setupMouseFollower() {
            if (isMobile || isReducedMotion) return;
            
            const cursor = document.createElement('div');
            cursor.className = 'custom-cursor';
            cursor.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                transform: translate(-50%, -50%);
                transition: opacity 0.3s ease, transform 0.1s ease;
                mix-blend-mode: difference;
            `;
            document.body.appendChild(cursor);
            
            let mouseX = 0, mouseY = 0;
            let cursorX = 0, cursorY = 0;
            
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                cursor.style.opacity = '0.8';
            });
            
            document.addEventListener('mouseleave', () => {
                cursor.style.opacity = '0';
            });
            
            // Smooth cursor animation
            const animateCursor = () => {
                cursorX += (mouseX - cursorX) * 0.1;
                cursorY += (mouseY - cursorY) * 0.1;
                cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
                requestAnimationFrame(animateCursor);
            };
            animateCursor();
            
            // Enhanced hover effects
            document.querySelectorAll('a, button, .skill-tag, .contact-card').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%) scale(1.5)`;
                    cursor.style.background = 'linear-gradient(45deg, #f093fb, #f5576c)';
                });
                
                el.addEventListener('mouseleave', () => {
                    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%) scale(1)`;
                    cursor.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
                });
            });
        }
        
        // Enhanced particle system
        setupParticleSystem() {
            if (isReducedMotion) return;
            
            const particleContainer = document.querySelector('.floating-particles');
            if (!particleContainer) return;
            
            // Add more dynamic particles
            for (let i = 0; i < (isMobile ? 3 : 8); i++) {
                const particle = document.createElement('div');
                particle.className = 'dynamic-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 4 + 2}px;
                    height: ${Math.random() * 4 + 2}px;
                    background: rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2});
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: dynamicFloat ${Math.random() * 10 + 15}s linear infinite;
                    animation-delay: ${Math.random() * 5}s;
                `;
                particleContainer.appendChild(particle);
            }
            
            // Add CSS animation for dynamic particles
            if (!document.querySelector('#dynamic-particles-style')) {
                const style = document.createElement('style');
                style.id = 'dynamic-particles-style';
                style.textContent = `
                    @keyframes dynamicFloat {
                        0% { 
                            transform: translateY(100vh) translateX(0px) rotate(0deg);
                            opacity: 0;
                        }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { 
                            transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Enhanced header animations
        setupHeaderAnimations() {
            const header = document.querySelector('.header');
            if (!header) return;
            
            // Profile image breathing effect
            const profileImage = document.querySelector('.profile-image img');
            if (profileImage && !isMobile && !isReducedMotion) {
                let breatheScale = 1;
                let breatheDirection = 1;
                
                const breatheAnimation = () => {
                    breatheScale += breatheDirection * 0.0008;
                    if (breatheScale >= 1.02) breatheDirection = -1;
                    if (breatheScale <= 0.98) breatheDirection = 1;
                    
                    profileImage.style.transform = `scale(${breatheScale})`;
                    requestAnimationFrame(breatheAnimation);
                };
                breatheAnimation();
            }
            
            // Enhanced profile rings rotation
            const rings = document.querySelectorAll('.profile-ring');
            rings.forEach((ring, index) => {
                if (!isReducedMotion) {
                    ring.style.animation = `rotate ${20 + index * 5}s linear infinite ${index % 2 === 0 ? 'normal' : 'reverse'}`;
                }
            });
            
            // Dynamic gradient orbs
            const orbs = document.querySelectorAll('.gradient-orb');
            orbs.forEach((orb, index) => {
                if (!isReducedMotion) {
                    orb.style.animation = `float ${8 + index * 2}s ease-in-out infinite`;
                    orb.style.animationDelay = `${index * 1.5}s`;
                }
            });
        }
        
        // Enhanced section animations
        setupSectionAnimations() {
            document.querySelectorAll('.section').forEach((section, index) => {
                // Set initial state
                section.style.opacity = '0';
                section.style.transform = 'translateY(50px)';
                section.style.transition = `all ${isMobile ? 0.5 : 0.8}s cubic-bezier(0.4, 0, 0.2, 1)`;
                section.style.transitionDelay = `${index * 0.1}s`;
                
                this.observer.observe(section);
                
                // Add entrance animation
                section.addEventListener('mouseenter', () => {
                    if (!isMobile && !isReducedMotion) {
                        section.style.transform += ' scale(1.01)';
                    }
                });
                
                section.addEventListener('mouseleave', () => {
                    if (!isMobile && !isReducedMotion) {
                        section.style.transform = section.style.transform.replace(' scale(1.01)', '');
                    }
                });
            });
        }
        
        // Enhanced skill animations
        setupSkillAnimations() {
            const skillTags = document.querySelectorAll('.skill-tag');
            skillTags.forEach((tag, index) => {
                // Stagger animation
                tag.style.opacity = '0';
                tag.style.transform = 'translateY(20px) scale(0.8)';
                tag.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                tag.style.transitionDelay = `${index * 0.05}s`;
                
                this.observer.observe(tag);
                
                // Enhanced hover effects
                if (!isMobile) {
                    tag.addEventListener('mouseenter', () => {
                        if (!isReducedMotion) {
                            tag.style.transform += ' translateY(-3px) scale(1.05)';
                            tag.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
                        }
                    });
                    
                    tag.addEventListener('mouseleave', () => {
                        if (!isReducedMotion) {
                            tag.style.transform = tag.style.transform.replace(' translateY(-3px) scale(1.05)', '');
                            tag.style.boxShadow = '';
                        }
                    });
                }
            });
            
            // Animate progress bars
            const languageItems = document.querySelectorAll('.language-item');
            languageItems.forEach(item => {
                const progressBar = item.querySelector('.progress-bar');
                if (progressBar) {
                    this.observer.observe(item);
                }
            });
        }
        
        // Enhanced contact animations
        setupContactAnimations() {
            const contactItems = document.querySelectorAll('.contact-item');
            contactItems.forEach((item, index) => {
                // Initial state
                item.style.opacity = '0';
                item.style.transform = 'translateX(-50px)';
                item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.transitionDelay = `${index * 0.15}s`;
                
                this.observer.observe(item);
                
                // Enhanced hover with icon rotation
                const icon = item.querySelector('.contact-icon');
                if (icon && !isMobile) {
                    item.addEventListener('mouseenter', () => {
                        if (!isReducedMotion) {
                            icon.style.transform = 'scale(1.1) rotate(5deg)';
                            icon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                        }
                    });
                    
                    item.addEventListener('mouseleave', () => {
                        if (!isReducedMotion) {
                            icon.style.transform = 'scale(1) rotate(0deg)';
                        }
                    });
                }
            });
        }
        
        // Enhanced element animation function
        animateElement(element, ratio) {
            const animationType = element.dataset.animation || 'fadeInUp';
            
            switch (animationType) {
                case 'fadeInUp':
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    break;
                case 'fadeInLeft':
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                    break;
                case 'fadeInRight':
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                    break;
                case 'scaleIn':
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                    break;
                default:
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
            }
            
            // Add shimmer effect for special elements
            if (element.classList.contains('contact-item') && !isMobile && !isReducedMotion) {
                setTimeout(() => {
                    this.addShimmerEffect(element);
                }, 500);
            }
        }
        
        // Add shimmer effect
        addShimmerEffect(element) {
            const shimmer = document.createElement('div');
            shimmer.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                pointer-events: none;
                animation: shimmer 2s ease-in-out;
            `;
            
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(shimmer);
            
            // Add shimmer keyframes
            if (!document.querySelector('#shimmer-style')) {
                const style = document.createElement('style');
                style.id = 'shimmer-style';
                style.textContent = `
                    @keyframes shimmer {
                        0% { left: -100%; }
                        100% { left: 100%; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            setTimeout(() => {
                shimmer.remove();
            }, 2000);
        }
    }
    
    // Enhanced typing effect for multiple elements
    function enhancedTypeWriter(element, text, speed = 100) {
        if (!element || isReducedMotion) {
            if (element) element.textContent = text;
            return;
        }
        
        element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed + Math.random() * 50); // Add natural variation
            } else {
                // Add cursor blink effect
                element.style.borderRight = '2px solid #667eea';
                element.style.animation = 'blink 1s infinite';
                
                // Remove cursor after 3 seconds
                setTimeout(() => {
                    element.style.borderRight = 'none';
                    element.style.animation = 'none';
                }, 3000);
            }
        };
        
        setTimeout(type, 500);
    }
    
    // Enhanced scroll animations
    function setupScrollAnimations() {
        let ticking = false;
        
        const updateScrollAnimations = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Parallax effect for header elements
            if (!isMobile && !isReducedMotion) {
                const header = document.querySelector('.header');
                if (header) {
                    const parallaxElements = header.querySelectorAll('.gradient-orb, .particle');
                    parallaxElements.forEach((el, index) => {
                        const speed = (index + 1) * 0.1;
                        el.style.transform = `translateY(${scrollY * speed}px)`;
                    });
                }
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        });
    }
    
    // Add CSS for blink animation
    if (!document.querySelector('#blink-style')) {
        const style = document.createElement('style');
        style.id = 'blink-style';
        style.textContent = `
            @keyframes blink {
                0%, 50% { border-color: transparent; }
                51%, 100% { border-color: #667eea; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize enhanced animations
    const animationController = new AnimationController();
    setupScrollAnimations();
    
    // Enhanced typing effect for main title
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        const originalText = mainTitle.textContent;
        enhancedTypeWriter(mainTitle, originalText, isMobile ? 120 : 80);
    }
    
    // Enhanced typing effect for role title
    setTimeout(() => {
        const roleTitle = document.querySelector('.role-title');
        if (roleTitle) {
            const originalText = roleTitle.textContent;
            enhancedTypeWriter(roleTitle, originalText, isMobile ? 100 : 60);
        }
    }, 2000);
    
    // Performance optimization for mobile
    if (isMobile) {
        // Reduce animation complexity on slower devices
        const performanceCheck = () => {
            if (performance.now() > 3000) {
                const complexAnimations = document.querySelectorAll('.dynamic-particle');
                complexAnimations.forEach((el, index) => {
                    if (index > 2) el.remove();
                });
            }
        };
        
        setTimeout(performanceCheck, 3000);
    }
    
    // Handle reduced motion preference
    if (isReducedMotion) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
        document.documentElement.style.setProperty('--transition-duration', '0s');
    }
});

// Enhanced interaction feedback system
document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.innerWidth <= 768;
    
    // Enhanced button interactions
    document.querySelectorAll('button, .cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            // Add ripple animation
            if (!document.querySelector('#ripple-style')) {
                const style = document.createElement('style');
                style.id = 'ripple-style';
                style.textContent = `
                    @keyframes ripple {
                        to { transform: scale(2); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

/* ========================================
   ENHANCED CERTIFICATIONS SYSTEM
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.innerWidth <= 768;
    
    // Certificate data with detailed information
    const certificateData = {
        'datacamp-sql': {
            title: 'Associate Data Engineer in SQL',
            organization: 'DataCamp',
            date: 'May 2025',
            icon: 'fas fa-database',
            description: 'Professional certification demonstrating advanced proficiency in SQL for data engineering tasks including database design, data manipulation, query optimization, and working with large datasets. Covers comprehensive SQL concepts and best practices for data engineering workflows.',
            skills: ['Advanced SQL', 'Database Design', 'Query Optimization', 'Data Warehousing', 'ETL Processes', 'Performance Tuning', 'Data Modeling', 'PostgreSQL', 'MySQL'],
            certificateUrl: 'https://www.datacamp.com/completed/statement-of-accomplishment/track/ada30ab88bd4acbcbf349458f8dec7098ba9ae2d',
            downloadUrl: '#',
            credentialId: 'hrvnuxwwpu'
        },
        'oracle-ai': {
            title: 'Oracle Cloud Infrastructure 2024 Generative AI Certified Professional',
            organization: 'Oracle Corporation',
            date: 'February 2025 - February 2027',
            icon: 'fas fa-cloud',
            description: 'Advanced certification validating expertise in Oracle Cloud Infrastructure Generative AI services, including OCI Generative AI Service, prompt engineering, and Retrieval-Augmented Generation (RAG) implementation. Demonstrates comprehensive knowledge in deploying and managing enterprise-grade AI solutions on Oracle Cloud.',
            skills: ['OCI Generative AI Service', 'Prompt Engineering', 'Retrieval-Augmented Generation (RAG)', 'AI Model Deployment', 'Oracle Cloud Infrastructure', 'Enterprise AI Solutions', 'Cloud AI Services'],
            certificateUrl: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=9CDD87C25598FBE8EBD64C340EBB02DA68E78515BD8E6F6C4A76C2D7F4431DD1',
            downloadUrl: '#'
        },
        'aws-cloud': {
            title: 'AWS Cloud Quest: Cloud Practitioner',
            organization: 'Amazon Web Services',
            date: 'May 15, 2025',
            icon: 'fab fa-aws',
            description: 'Comprehensive hands-on AWS certification covering cloud fundamentals, core services, security best practices, architecture principles, pricing models, and support mechanisms. Gained practical experience through interactive labs, real-world scenarios, and cloud platform management.',
            skills: ['AWS Core Services', 'Cloud Security', 'AWS Architecture', 'Cost Management', 'IAM', 'EC2', 'S3', 'VPC', 'Cloud Foundations', 'AWS Best Practices'],
            certificateUrl: 'https://www.credly.com/badges/e2ac4612-ea88-4dee-be27-e34bd381c087/public_url',
            downloadUrl: '#'
        },
        'ibm-data-science': {
            title: 'IBM Data Science Professional Certificate',
            organization: 'IBM - Coursera',
            date: 'December 2023',
            icon: 'fas fa-chart-bar',
            description: 'Comprehensive professional certificate program covering the complete data science lifecycle from data collection and analysis to machine learning model development and deployment. Gained hands-on experience with industry-standard tools, methodologies, and real-world data science projects.',
            skills: ['Python', 'SQL', 'Data Analysis', 'Data Visualization', 'Machine Learning', 'Jupyter Notebooks', 'pandas', 'NumPy', 'scikit-learn', 'Matplotlib', 'Seaborn', 'Statistical Analysis'],
            certificateUrl: 'https://coursera.org/share/af1c319afd441baa780439e492181479',
            downloadUrl: '#'
        },
        'ml-specialization': {
            title: 'Machine Learning Specialization',
            organization: 'DeepLearning.AI - Coursera',
            date: 'November 2023',
            icon: 'fas fa-brain',
            description: 'Advanced specialization covering supervised learning, advanced learning algorithms, unsupervised learning, and recommender systems. Mastered fundamental ML concepts, neural networks, and practical implementation using Python and popular machine learning frameworks.',
            skills: ['Supervised Learning', 'Neural Networks', 'Unsupervised Learning', 'Recommender Systems', 'Python', 'TensorFlow', 'scikit-learn', 'Deep Learning', 'AI Algorithms', 'Machine Learning Engineering'],
            certificateUrl: 'https://www.coursera.org/account/accomplishments/specialization/WHSRAUTQZ9MW',
            downloadUrl: '#'
        }
    };
    
    // Initialize certificate modal system
    function initializeCertificateSystem() {
        const modal = document.getElementById('certModal');
        const overlay = document.querySelector('.cert-modal-overlay');
        const closeBtn = document.querySelector('.cert-modal-close');
        const certCards = document.querySelectorAll('.cert-card');
        
        // Add click event to certificate cards
        certCards.forEach(card => {
            card.addEventListener('click', function() {
                const certId = this.dataset.cert;
                const certData = certificateData[certId];
                
                if (certData) {
                    openCertificateModal(certData);
                }
                
                // Add haptic feedback on mobile
                if (navigator.vibrate && isMobile) {
                    navigator.vibrate(50);
                }
            });
            
            // Enhanced hover effects for desktop
            if (!isMobile) {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                });
            }
            
            // Touch feedback for mobile
            if (isMobile) {
                card.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.98)';
                }, {passive: true});
                
                card.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                }, {passive: true});
            }
        });
        
        // Modal close events
        closeBtn.addEventListener('click', closeCertificateModal);
        overlay.addEventListener('click', closeCertificateModal);
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeCertificateModal();
            }
        });
        
        // Initialize modal buttons
        initializeModalButtons();
    }
    
    // Open certificate modal with data
    function openCertificateModal(certData) {
        const modal = document.getElementById('certModal');
        const modalTitle = document.getElementById('certModalTitle');
        const modalIcon = document.getElementById('certModalIcon');
        const modalName = document.getElementById('certModalName');
        const modalOrg = document.getElementById('certModalOrg');
        const modalDate = document.getElementById('certModalDate');
        const modalDescription = document.getElementById('certModalDescription');
        
        // Populate modal with certificate data
        modalTitle.textContent = 'Certificate Details';
        modalIcon.className = certData.icon;
        modalName.textContent = certData.title;
        modalOrg.textContent = certData.organization;
        modalDate.textContent = `Issued: ${certData.date}`;
        modalDescription.textContent = certData.description;
        
        // Add skills section if available
        if (certData.skills && certData.skills.length > 0) {
            const skillsSection = createSkillsSection(certData.skills);
            modalDescription.parentNode.appendChild(skillsSection);
        }
        
        // Update modal buttons with certificate URLs
        updateModalButtons(certData);
        
        // Show modal with animation
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        setTimeout(() => {
            document.querySelector('.cert-modal-close').focus();
        }, 400);
    }
    
    // Close certificate modal
    function closeCertificateModal() {
        const modal = document.getElementById('certModal');
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove dynamically added content
        const skillsSection = modal.querySelector('.cert-skills-section');
        if (skillsSection) {
            skillsSection.remove();
        }
    }
    
    // Create skills section for modal
    function createSkillsSection(skills) {
        const skillsSection = document.createElement('div');
        skillsSection.className = 'cert-skills-section';
        skillsSection.style.cssText = `
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(102, 126, 234, 0.1);
        `;
        
        const skillsTitle = document.createElement('h5');
        skillsTitle.textContent = 'Key Skills & Technologies:';
        skillsTitle.style.cssText = `
            font-size: 1.1rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 12px;
        `;
        
        const skillsContainer = document.createElement('div');
        skillsContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        `;
        
        skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.textContent = skill;
            skillTag.style.cssText = `
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
                color: #667eea;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 500;
                border: 1px solid rgba(102, 126, 234, 0.2);
                transition: all 0.3s ease;
            `;
            
            // Add hover effect for desktop
            if (!isMobile) {
                skillTag.addEventListener('mouseenter', function() {
                    this.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15))';
                    this.style.transform = 'translateY(-1px)';
                });
                
                skillTag.addEventListener('mouseleave', function() {
                    this.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))';
                    this.style.transform = '';
                });
            }
            
            skillsContainer.appendChild(skillTag);
        });
        
        skillsSection.appendChild(skillsTitle);
        skillsSection.appendChild(skillsContainer);
        
        return skillsSection;
    }
    
    // Update modal buttons with certificate data
    function updateModalButtons(certData) {
        const viewBtn = document.querySelector('.cert-view-btn');
        const downloadBtn = document.querySelector('.cert-download-btn');
        
        // Update view button
        viewBtn.onclick = function() {
            if (certData.certificateUrl && certData.certificateUrl !== '#') {
                window.open(certData.certificateUrl, '_blank');
            } else {
                showNotification('Certificate validation in progress. Please contact for verification.', 'info');
            }
        };
        
        // Update download button
        downloadBtn.onclick = function() {
            if (certData.downloadUrl && certData.downloadUrl !== '#') {
                // Create download link
                const link = document.createElement('a');
                link.href = certData.downloadUrl;
                link.download = `${certData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
                link.click();
            } else {
                showNotification('Certificate download will be available soon. Please contact for a copy.', 'info');
            }
        };
    }
    
    // Initialize modal buttons
    function initializeModalButtons() {
        const viewBtn = document.querySelector('.cert-view-btn');
        const downloadBtn = document.querySelector('.cert-download-btn');
        
        // Add ripple effect to buttons
        [viewBtn, downloadBtn].forEach(btn => {
            btn.addEventListener('click', function(e) {
                createRippleEffect(this, e);
            });
        });
    }
    
    // Create ripple effect for buttons
    function createRippleEffect(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: modalRipple 0.6s ease;
            pointer-events: none;
            z-index: 1;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        // Add animation keyframes
        if (!document.querySelector('#modal-ripple-style')) {
            const style = document.createElement('style');
            style.id = 'modal-ripple-style';
            style.textContent = `
                @keyframes modalRipple {
                    to { transform: scale(2); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'info' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'linear-gradient(135deg, #f093fb, #f5576c)'};
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            max-width: 300px;
            font-weight: 500;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
        
        // Add haptic feedback
        if (navigator.vibrate && isMobile) {
            navigator.vibrate(50);
        }
    }
    
    // Enhanced animation observer for certificate cards
    function setupCertificateAnimations() {
        const certCards = document.querySelectorAll('.cert-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        certCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(card);
        });
    }
    
    // Performance optimization for mobile
    function optimizeForMobile() {
        if (isMobile) {
            // Reduce animation complexity
            const certCards = document.querySelectorAll('.cert-card');
            certCards.forEach(card => {
                card.style.transition = 'all 0.3s ease';
            });
            
            // Simplified modal animations
            const modal = document.getElementById('certModal');
            if (modal) {
                modal.style.transition = 'all 0.3s ease';
                const modalContent = modal.querySelector('.cert-modal-content');
                if (modalContent) {
                    modalContent.style.transition = 'all 0.3s ease';
                }
            }
        }
    }
    
    // Initialize everything
    initializeCertificateSystem();
    setupCertificateAnimations();
    optimizeForMobile();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newIsMobile = window.innerWidth <= 768;
            if (newIsMobile !== isMobile) {
                location.reload(); // Reload to apply mobile optimizations
            }
        }, 250);
    });
    
    console.log('Enhanced Certificate System initialized successfully!');
});

// Modern Navbar Functionality
class ModernNavbar {
    constructor() {
        this.navbar = document.querySelector('.modern-navbar');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navbarMenu = document.querySelector('.navbar-menu');
        this.navItems = document.querySelectorAll('.nav-item');
        this.sections = document.querySelectorAll('section, #home');
        
        this.init();
    }
    
    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveStates();
        this.setupKeyboardNavigation();
    }
    
    // Navbar scroll effect
    setupScrollEffect() {
        let ticking = false;
        
        const updateNavbar = () => {
            const scrolled = window.scrollY > 20;
            this.navbar.classList.toggle('scrolled', scrolled);
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }
    
    // Mobile menu functionality
    setupMobileMenu() {
        if (!this.mobileMenuBtn || !this.navbarMenu) return;
        
        this.mobileMenuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Close mobile menu when clicking nav items
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        const isActive = this.mobileMenuBtn.classList.contains('active');
        
        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.mobileMenuBtn.classList.add('active');
        this.navbarMenu.classList.add('active');
        this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileMenu() {
        this.mobileMenuBtn.classList.remove('active');
        this.navbarMenu.classList.remove('active');
        this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    // Smooth scroll functionality
    setupSmoothScroll() {
        this.navItems.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.scrollToSection(targetElement, targetId);
                }
            });
        });
    }
    
    scrollToSection(targetElement, targetId) {
        const navbarHeight = 70;
        const offset = targetId === 'home' ? 0 : 10;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - offset;
        
        window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
        });
    }
    
    // Active navigation states
    setupActiveStates() {
        let ticking = false;
        
        const updateActiveStates = () => {
            const scrollPosition = window.scrollY + 100; // Offset for better detection
            
            this.sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.id;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Remove active class from all nav items
                    this.navItems.forEach(item => item.classList.remove('active'));
                    
                    // Add active class to current section nav item
                    const activeNavItem = document.querySelector(`a[href="#${sectionId}"]`);
                    if (activeNavItem) {
                        activeNavItem.classList.add('active');
                    }
                }
            });
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateActiveStates);
                ticking = true;
            }
        });
        
        // Set initial active state
        updateActiveStates();
    }
    
    // Keyboard navigation support
    setupKeyboardNavigation() {
        this.navItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (index + 1) % this.navItems.length;
                        this.navItems[nextIndex].focus();
                        break;
                        
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = (index - 1 + this.navItems.length) % this.navItems.length;
                        this.navItems[prevIndex].focus();
                        break;
                        
                    case 'Home':
                        e.preventDefault();
                        this.navItems[0].focus();
                        break;
                        
                    case 'End':
                        e.preventDefault();
                        this.navItems[this.navItems.length - 1].focus();
                        break;
                }
            });
        });
    }
}

// Initialize modern navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ModernNavbar();
});

// ========================================
// CHAT INTERFACE FUNCTIONALITY
// ========================================

class ChatInterface {
    constructor() {
        // Configuration OpenRouter basée sur votre testAPI.py
        this.openRouterConfig = {
            apiKey: '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',
            baseUrl: 'https://openrouter.ai/api/v1',
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            headers: {
                'HTTP-Referer': 'https://github.com/ISSAM-SALMI/Portfolio-WebSite',
                'X-Title': 'AssistantIA-Issam'
            }
        };
        
        // URL de fallback pour votre API Replit
        this.apiUrl = 'https://9aa48d60-0dfc-48d8-bb54-68391c1021bc-00-1y68zguc1n1x0.spock.replit.dev/api/ask';
        this.workingUrl = this.apiUrl;
        this.isOpen = false;
        this.isTyping = false;
        this.connectionStatus = 'unknown'; // unknown, online, offline, testing
        
        // Contenu du CV d'Issam pour le contexte (basé sur votre testAPI.py)
        this.cvContext = `ISSAM SALMI
Étudiant en ingénierie Big Data
📧 : issamsalmi55@gmail.com | 📞 : +212 669081511 | 🔗 LinkedIn : https://www.linkedin.com/in/issamsalmi | 💻 GitHub : https://github.com/ISSAM-SALMI

Passionné par l'ingénierie des données et l'intelligence artificielle, je me spécialise dans la création de workflows ETL efficaces,
la conception de pipelines de données robustes, et le travail avec les grands modèles de langage (LLMs).
Dévoué à la résolution de problèmes complexes et au développement de solutions innovantes basées sur les données.

SKILLS
• Languages: Python, Java, SQL
• Pipelines: Airflow, Dagster, Talend, Pentaho, ETL
• Big Data: Hadoop, Spark, Kafka, Hive
• Databases: PostgreSQL, MySQL, MongoDB, Hbase, Redis
• Cloud: AWS
• OS: Linux, Windows Server
• Version Control: Git, GitHub
• Viz: Power BI, Tableau, Matplotlib
• LLM: Fine-tuning, Embeddings, RAG
• Containers: Docker, Kubernetes

SOFT SKILLS
• Collaboration et esprit critique
• Adaptabilité
• Travail d'équipe et communication

CERTIFICATS
• Oracle Cloud Infrastructure 2024 Generative AI Certified Professional – Oracle
• AWS Cloud Quest: Cloud Practitioner – Amazon Web Services
• Machine Learning Specialization – DeepLearning.AI
• IBM Data Science – IBM
• Associate Data Engineer in SQL – DataCamp

BÉNÉVOLAT
• Président & Responsable – Google Developer Groups, sur le campus (2024 - En cours)
• Responsable IA – Google Developer Student Clubs (2023)

LANGUES
• Français : Maîtrise professionnelle
• Anglais : Bonne maîtrise
• Arabe : Langue maternelle

ÉDUCATION
Cycle d'ingénierie en Systèmes d'Information et Big Data – École Nationale des Sciences Appliquées
Sept. 2021 – En cours | Berrechid, Maroc

Baccalauréat – Lycée Ibno Yassine
Sept. 2019 – Juin 2020 | Sidi Yahia, Maroc

EXPÉRIENCE
Stagiaire Data Engineer – Finea CDG (Août 2024 – Septembre 2024 | Présentiel)
• Développement de processus ETL avancés et de pipelines de données pour optimiser le flux et améliorer l'efficacité.
• Visualisation et présentation des insights dans Power BI pour soutenir la prise de décisions basée sur les données.
• Technologies : Talend, Pentaho, Python, Power BI, Linux, PostgreSQL, SQL

Développeur – Projet d'école privée (Juin 2022 – Juillet 2022)
• Conception d'une application de bureau en Python pour la gestion des opérations scolaires.
• Intégration d'opérations OLAP pour permettre un suivi et un reporting avancés.
• Technologies : PyQt5, Python, SQL

PROJETS
Pipeline de Données – Architecture Cloud
• Conception d'un pipeline de données avec Airflow, Celery et Postgres pour gérer l'ingestion, la transformation et le stockage cloud de données Reddit.
• Technologies : Apache Airflow, AWS Glue, Amazon Athena, Redshift, PostgreSQL, Celery, Python

Prédiction des Prix de Voitures d'Occasion – Marché Européen
• Développement d'un pipeline MLOps complet pour prédire les prix des voitures d'occasion, depuis le web scraping jusqu'au traitement automatisé et au réentraînement du modèle.
• Technologies : Airflow, Docker, Python, MongoDB, Web Scraping, Machine Learning, Linux

Pipeline de Données – Analyse de Produits Affiliés
• Création d'un pipeline de données pour collecter automatiquement les données de produits affiliés et analyser leur performance avec Airflow, Selenium et PostgreSQL.
• Technologies : PostgreSQL, Power BI, Docker, Airflow, Selenium, Python`;
        
        this.initElements();
        this.bindEvents();
        this.hideNotification();
        this.testConnection(); // Tester la connexion avec le bon endpoint
    }

    async testConnection() {
        try {
            console.log('🔍 Test de connexion avec API Replit (CORS-friendly)');
            this.connectionStatus = 'testing';
            this.updateConnectionIndicator('testing');

            // Utiliser uniquement l'API Replit qui peut communiquer avec OpenRouter côté serveur
            // Le navigateur ne peut pas faire d'appels directs à OpenRouter à cause de CORS
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    question: "Donne moi le numéro de téléphone d'Issam et aussi email et link of linkedin ?",
                    system_prompt: `Tu es un assistant intelligent qui répond uniquement en te basant sur ce CV :\n${this.cvContext}`,
                    cv_context: this.cvContext,
                    // Ajouter les paramètres OpenRouter pour que votre API les utilise
                    openrouter_config: {
                        model: this.openRouterConfig.model,
                        api_key: this.openRouterConfig.apiKey,
                        base_url: this.openRouterConfig.baseUrl
                    }
                }),
                signal: AbortSignal.timeout(15000)
            });

            console.log('📡 Statut API Replit:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ API Replit connectée:', data);
                
                if (data.success !== false && (data.answer || data.response)) {
                    this.connectionStatus = 'online';
                    this.updateConnectionIndicator('online');
                    console.log('✅ API Replit fonctionnelle avec OpenRouter backend');
                    return true;
                }
            }
            
            throw new Error(`API Replit HTTP ${response.status}: ${response.statusText}`);

        } catch (error) {
            console.error('❌ Erreur de connexion:', error.message);
            this.connectionStatus = 'offline';
            this.updateConnectionIndicator('offline');
            
            setTimeout(() => {
                this.addSystemMessage('⚠️ Connexion à l\'API en cours... Cliquez sur "🔄 Tester la connexion" si le problème persiste.');
            }, 1000);
            
            return false;
        }
    }

    updateConnectionIndicator(status) {
        let indicator = document.getElementById('connectionIndicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'connectionIndicator';
            this.chatButton.style.position = 'relative';
            this.chatButton.appendChild(indicator);
        }

        // Supprimer les anciennes classes
        indicator.className = '';
        
        switch (status) {
            case 'online':
                indicator.className = 'connection-online';
                indicator.title = 'API connectée';
                break;
            case 'offline':
                indicator.className = 'connection-offline';
                indicator.title = 'API déconnectée';
                break;
            case 'testing':
                indicator.className = 'connection-testing';
                indicator.title = 'Test de connexion...';
                break;
            default:
                indicator.className = 'connection-offline';
                indicator.title = 'Statut inconnu';
        }
    }

    addSystemMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.style.cssText = `
            text-align: center;
            margin: 10px 0;
            padding: 8px 12px;
            background: rgba(59, 130, 246, 0.1);
            border-radius: 15px;
            font-size: 0.85rem;
            color: #3B82F6;
        `;
        
        messageDiv.textContent = message;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    initElements() {
        this.chatButton = document.getElementById('chatButton');
        this.chatWindow = document.getElementById('chatWindow');
        this.chatClose = document.getElementById('chatClose');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatTyping = document.getElementById('chatTyping');
        this.chatNotification = document.getElementById('chatNotification');
    }

    bindEvents() {
        // Ouvrir/fermer le chat
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.chatClose.addEventListener('click', () => this.closeChat());
        
        // Envoyer un message
        this.chatSend.addEventListener('click', () => this.sendMessage());
        
        // Envoyer avec Enter
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize input
        this.chatInput.addEventListener('input', () => {
            this.updateSendButton();
        });

        // Fermer en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.chat-container')) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.chatWindow.classList.add('active');
        this.chatInput.focus();
        this.hideNotification();
        
        // Animation de l'icône
        this.chatButton.style.transform = 'rotate(180deg)';
        
        // Retester la connexion si elle était hors ligne
        if (this.connectionStatus === 'offline') {
            this.testConnection();
        }

        // Ajouter un message de bienvenue si c'est la première ouverture
        if (this.chatMessages.children.length === 0) {
            setTimeout(() => {
                this.addMessage('👋 Bonjour ! Je suis l\'assistant IA d\'**Issam SALMI**, étudiant en ingénierie Big Data.\n\n💼 Posez-moi vos questions sur :\n• Son **expérience professionnelle** et ses projets\n• Ses **compétences techniques** (Python, SQL, AWS, etc.)\n• Ses **certifications** (Oracle AI, AWS, Machine Learning)\n• Ses **coordonnées** et informations de contact\n• Son **parcours académique** et bénévolat\n\n🚀 Essayez par exemple : *"Quelles sont les compétences techniques d\'Issam ?"* ou *"Comment puis-je contacter Issam ?"*', 'bot');
            }, 500);
        }
        
        setTimeout(() => {
            this.scrollToBottom();
        }, 300);
    }

    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.remove('active');
        
        // Restaurer l'icône
        this.chatButton.style.transform = 'rotate(0deg)';
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;

        // Ajouter le message de l'utilisateur
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.updateSendButton();
        
        // Afficher l'indicateur de frappe
        this.showTyping();

        try {
            console.log('📤 Envoi vers API Replit avec configuration OpenRouter');
            console.log('📝 Message:', message);

            // Envoyer à votre API Replit qui utilise OpenRouter côté serveur
            // Ceci évite les problèmes CORS du navigateur
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    question: message,
                    system_prompt: `Tu es un assistant intelligent qui répond uniquement en te basant sur ce CV :\n${this.cvContext}`,
                    cv_context: this.cvContext,
                    user_question: message,
                    // Passer la configuration OpenRouter à votre API
                    openrouter_config: {
                        model: this.openRouterConfig.model,
                        api_key: this.openRouterConfig.apiKey,
                        base_url: this.openRouterConfig.baseUrl,
                        headers: this.openRouterConfig.headers
                    }
                }),
                signal: AbortSignal.timeout(30000)
            });

            console.log('📡 Statut de la réponse:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur API:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('📦 Données reçues:', data);
            
            // Simuler un délai de réponse réaliste
            setTimeout(() => {
                this.hideTyping();
                
                if (data.success && data.answer) {
                    this.addMessageWithTyping(data.answer, 'bot');
                } else if (data.answer) {
                    this.addMessageWithTyping(data.answer, 'bot');
                } else if (data.response) {
                    this.addMessageWithTyping(data.response, 'bot');
                } else if (data.success === false) {
                    const errorMsg = data.message || data.error || 'Erreur inconnue de l\'API';
                    this.addMessage(`❌ Erreur: ${errorMsg}`, 'bot', true);
                } else {
                    console.warn('⚠️ Format de réponse inattendu:', data);
                    this.addMessage('⚠️ Réponse reçue mais format inattendu. Vérifiez votre API Replit.', 'bot', true);
                }
                
                // Marquer la connexion comme fonctionnelle si succès
                if (data.success !== false && (data.answer || data.response)) {
                    if (this.connectionStatus !== 'online') {
                        this.connectionStatus = 'online';
                        this.updateConnectionIndicator('online');
                    }
                }
            }, 800 + Math.random() * 400);

        } catch (error) {
            console.error('💥 Erreur de chat:', error);
            
            setTimeout(() => {
                this.hideTyping();
                
                let errorMessage = 'Désolé, une erreur s\'est produite. ';
                
                if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
                    errorMessage += 'La requête a pris trop de temps (>30s). Votre API Replit est peut-être surchargée.';
                } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    errorMessage += 'Impossible de joindre l\'API Replit. Vérifiez que votre serveur est démarré.';
                } else if (error.message.includes('CORS')) {
                    errorMessage += 'Problème CORS. Votre API Replit doit accepter les requêtes depuis ce domaine.';
                } else if (error.message.includes('HTTP 405')) {
                    errorMessage += 'Méthode non autorisée. Vérifiez que l\'endpoint /api/ask accepte POST.';
                } else if (error.message.includes('HTTP 404')) {
                    errorMessage += 'API non trouvée. Vérifiez l\'URL de votre Replit.';
                } else if (error.message.includes('HTTP 500')) {
                    errorMessage += 'Erreur serveur. Vérifiez les logs de votre API Replit.';
                } else {
                    errorMessage += `Détails: ${error.message}`;
                }
                
                this.addMessage(errorMessage, 'bot', true);
                this.connectionStatus = 'offline';
                this.updateConnectionIndicator('offline');
            }, 500);
        }
    }

    // Méthode de fallback avec votre API Replit
    addMessage(text, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (sender === 'system') {
            messageDiv.className = 'message system-message';
            messageDiv.textContent = text;
            this.chatMessages.appendChild(messageDiv);
            this.scrollToBottom();
            return;
        }
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = `message-content ${isError ? 'error-message' : ''}`;
        
        // Formater le texte pour les réponses de l'IA (comme ChatGPT)
        if (sender === 'bot' && !isError) {
            const formattedDiv = this.formatAIResponse(text);
            contentDiv.appendChild(formattedDiv);
        } else {
            const textP = document.createElement('p');
            textP.textContent = text;
            contentDiv.appendChild(textP);
        }
        
        // Ajouter un bouton de reconnexion pour les erreurs de connexion
        if (isError && (text.includes('Impossible de joindre') || text.includes('Endpoint') || text.includes('connexion'))) {
            const retryBtn = document.createElement('button');
            retryBtn.className = 'retry-button';
            retryBtn.textContent = '🔄 Tester la connexion';
            
            retryBtn.onclick = () => {
                retryBtn.textContent = '⏳ Test en cours...';
                retryBtn.disabled = true;
                
                this.testConnection().then(() => {
                    if (this.connectionStatus === 'online') {
                        retryBtn.textContent = '✅ Connexion OK !';
                        setTimeout(() => {
                            retryBtn.style.display = 'none';
                        }, 2000);
                    } else {
                        retryBtn.textContent = '❌ Échec de connexion';
                        setTimeout(() => {
                            retryBtn.textContent = '🔄 Réessayer';
                            retryBtn.disabled = false;
                        }, 3000);
                    }
                });
            };
            
            contentDiv.appendChild(retryBtn);
        }
        
        // Ajouter des instructions spécifiques pour /api/ask
        if (isError && text.includes('Endpoint /api/ask non trouvé')) {
            const instructionsP = document.createElement('p');
            instructionsP.style.cssText = 'font-size: 0.8rem; margin-top: 8px; opacity: 0.8; line-height: 1.4; background: rgba(59, 130, 246, 0.1); padding: 8px; border-radius: 8px;';
            instructionsP.innerHTML = `
                <strong>💡 Vérifiez votre API Replit :</strong><br>
                • L'endpoint doit être <code>/api/ask</code><br>
                • Accepter les requêtes POST avec <code>{"question": "..."}</code><br>
                • Retourner <code>{"success": true, "answer": "..."}</code>
            `;
            contentDiv.appendChild(instructionsP);
        }
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.getCurrentTime();
        contentDiv.appendChild(timeSpan);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addMessageWithTyping(text, sender) {
        // Créer le message immédiatement
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Container pour le contenu avec effet de frappe
        const typingContainer = document.createElement('div');
        typingContainer.className = 'ai-response-content typing-container';
        contentDiv.appendChild(typingContainer);
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.getCurrentTime();
        contentDiv.appendChild(timeSpan);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Démarrer l'effet de frappe
        this.typewriterEffect(typingContainer, text);
    }

    typewriterEffect(container, text, speed = 20) {
        const words = text.split(' ');
        let currentIndex = 0;
        
        const typeNextWord = () => {
            if (currentIndex < words.length) {
                const currentText = words.slice(0, currentIndex + 1).join(' ');
                
                // Reformater le texte à chaque étape
                container.innerHTML = '';
                const formattedContent = this.formatAIResponse(currentText);
                container.appendChild(formattedContent);
                
                // Ajouter un curseur clignotant à la fin
                const cursor = document.createElement('span');
                cursor.className = 'typing-cursor';
                cursor.textContent = '▋';
                container.appendChild(cursor);
                
                this.scrollToBottom();
                currentIndex++;
                
                // Vitesse variable selon la longueur du mot
                const wordLength = words[currentIndex - 1]?.length || 3;
                const delay = Math.max(speed, wordLength * 3);
                
                setTimeout(typeNextWord, delay);
            } else {
                // Supprimer le curseur à la fin
                const cursor = container.querySelector('.typing-cursor');
                if (cursor) {
                    cursor.remove();
                }
                
                // Ajouter un bouton de copie (optionnel)
                this.addResponseActions(container.parentElement);
            }
        };
        
        typeNextWord();
    }

    addResponseActions(contentDiv) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'ai-response-actions';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-response-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copier';
        copyBtn.onclick = () => {
            const textContent = contentDiv.querySelector('.ai-response-content').textContent;
            navigator.clipboard.writeText(textContent).then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copié !';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copier';
                }, 2000);
            });
        };
        
        actionsDiv.appendChild(copyBtn);
        contentDiv.appendChild(actionsDiv);
    }

    formatAIResponse(text) {
        const container = document.createElement('div');
        container.className = 'ai-response-content';
        
        // Diviser le texte en paragraphes
        const paragraphs = text.split('\n\n').filter(p => p.trim());
        
        paragraphs.forEach(paragraph => {
            const trimmedParagraph = paragraph.trim();
            
            // Vérifier si c'est une liste à puces
            if (trimmedParagraph.includes('•') || trimmedParagraph.includes('-') || /^\d+\./.test(trimmedParagraph)) {
                const listContainer = this.formatList(trimmedParagraph);
                container.appendChild(listContainer);
            } 
            // Vérifier si c'est un titre (commence par ** ou ##)
            else if (trimmedParagraph.startsWith('**') && trimmedParagraph.endsWith('**')) {
                const title = document.createElement('h4');
                title.className = 'ai-response-title';
                title.textContent = trimmedParagraph.replace(/\*\*/g, '');
                container.appendChild(title);
            }
            // Paragraphe normal
            else {
                const p = document.createElement('p');
                p.className = 'ai-response-paragraph';
                p.innerHTML = this.formatInlineText(trimmedParagraph);
                container.appendChild(p);
            }
        });
        
        return container;
    }

    formatList(text) {
        const listContainer = document.createElement('ul');
        listContainer.className = 'ai-response-list';
        
        // Diviser par les puces ou tirets
        const items = text.split(/(?=•)|(?=-)|\n/).filter(item => item.trim());
        
        items.forEach(item => {
            const cleanItem = item.replace(/^[•\-\d+\.]\s*/, '').trim();
            if (cleanItem) {
                const li = document.createElement('li');
                li.className = 'ai-response-list-item';
                li.innerHTML = this.formatInlineText(cleanItem);
                listContainer.appendChild(li);
            }
        });
        
        return listContainer;
    }

    formatInlineText(text) {
        // Formater le texte en gras (**text**)
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Formater le texte en italique (*text*)
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Formater le code inline (`code`)
        text = text.replace(/`(.*?)`/g, '<code class="inline-code">$1</code>');
        
        // Formater les liens [text](url)
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="ai-link">$1</a>');
        
        return text;
    }

    showTyping() {
        this.isTyping = true;
        this.chatTyping.style.display = 'flex';
        this.chatSend.disabled = true;
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        this.chatTyping.style.display = 'none';
        this.chatSend.disabled = false;
    }

    updateSendButton() {
        const hasText = this.chatInput.value.trim().length > 0;
        this.chatSend.disabled = !hasText || this.isTyping;
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    showNotification() {
        this.chatNotification.style.display = 'flex';
    }

    hideNotification() {
        this.chatNotification.style.display = 'none';
    }
}

// Initialiser le chat quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    const chat = new ChatInterface();
    
    // Optionnel : afficher une notification après quelques secondes
    setTimeout(() => {
        if (!chat.isOpen) {
            chat.showNotification();
        }
    }, 10000); // Afficher après 10 secondes
});