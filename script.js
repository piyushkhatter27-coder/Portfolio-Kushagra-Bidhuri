document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const themeToggle = document.getElementById('theme-toggle');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get stored theme or default to system preference
    const storedTheme = localStorage.getItem('theme') || (systemPrefersDark.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', storedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Dynamic Typewriter Effect for Hero Subtitle
    const words = ["Circuit Designer", "R&D Specialist", "Electronics Engineer", "Problem Solver"];
    const typingTextEl = document.getElementById('typing-text');
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIdx];
        if (isDeleting) {
            typingTextEl.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            typeSpeed = 40; // delete faster
        } else {
            typingTextEl.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            typeSpeed = 100; // normal typing speed
        }

        // Handle word transitions
        if (!isDeleting && charIdx === currentWord.length) {
            isDeleting = true;
            typeSpeed = 1500; // Pause at the end of the word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typeSpeed = 500; // Pause before starting next word
        }

        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typewriter
    if (typingTextEl) {
        setTimeout(typeEffect, 1000);
    }

    // Tab Switching & Animations
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const skillFills = document.querySelectorAll('.skill-fill');

    function animateSkillBars() {
        skillFills.forEach(fill => {
            const progress = fill.getAttribute('data-progress');
            fill.style.width = progress + '%';
        });
    }

    function resetSkillBars() {
        skillFills.forEach(fill => {
            fill.style.width = '0%';
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Deactivate all buttons & contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Activate target
            btn.classList.add('active');
            const targetContentEl = document.getElementById(targetTab);
            targetContentEl.classList.add('active');

            // Trigger specific page load actions
            if (targetTab === 'biodata') {
                setTimeout(animateSkillBars, 100);
            } else {
                resetSkillBars();
            }

            // Scroll to view if not already aligned
            const viewerTop = document.querySelector('.profile-viewer').offsetTop;
            window.scrollTo({
                top: viewerTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Trigger skills animation if page starts with biodata visible
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab && activeTab.getAttribute('data-tab') === 'biodata') {
        setTimeout(animateSkillBars, 500);
    }

    // Print Button Action
    const printBtns = document.querySelectorAll('.print-resume-btn');
    printBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Pre-select Resume Tab to ensure proper print preview layout
            const resumeTabBtn = document.querySelector('[data-tab="resume"]');
            if (resumeTabBtn) {
                resumeTabBtn.click();
            }
            // Add brief timeout for transition layout to register
            setTimeout(() => {
                window.print();
            }, 300);
        });
    });

    // Form Validation & Interaction (Safe check)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formStatus = document.getElementById('form-status');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Disable button & show sending state
            submitBtn.disabled = true;
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin-icon" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                    <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Sending...
            `;

            // Setup custom spin keyframe rules dynamically if not in CSS
            if (!document.getElementById('spin-keyframe')) {
                const style = document.createElement('style');
                style.id = 'spin-keyframe';
                style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
                document.head.appendChild(style);
            }

            // Mock network call (1.5 seconds)
            setTimeout(() => {
                const name = document.getElementById('form-name').value.trim();
                const email = document.getElementById('form-email').value.trim();
                const msg = document.getElementById('form-msg').value.trim();

                if (name === '' || email === '' || msg === '') {
                    // Fail validation state
                    formStatus.className = 'form-status error';
                    formStatus.textContent = 'Oops! Please fill in all fields before sending.';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                    return;
                }

                // Successful mock send
                formStatus.className = 'form-status success';
                formStatus.textContent = `Thanks, ${name}! Your message has been sent successfully. Kushagra will get back to you shortly.`;
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;

                // Clear message success notice after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);

            }, 1500);
        });
    }

    // Scrollspy for Navigation Link Underline Activations
    const sections = document.querySelectorAll('section, .profile-viewer');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset header height

        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.offsetHeight;
            if (scrollPosition >= secTop && scrollPosition < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id') || '';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });



    // Contact Dropdown Interactions
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggleBtn = dropdown.querySelector('.dropdown-toggle, .social-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggleBtn && menu) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close other dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(m => {
                    if (m !== menu) m.classList.remove('show');
                });
                menu.classList.toggle('show');
            });
        }
    });

    // Close all dropdowns when clicking anywhere outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    });
});
