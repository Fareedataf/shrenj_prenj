document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. Enhanced Mobile Navigation =====
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  let overlay = null;

  // Create overlay element
  function createOverlay() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
      `;
      document.body.appendChild(overlay);

      // Close menu when clicking overlay
      overlay.addEventListener('click', closeMenu);
    }
  }

  function openMenu() {
    if (nav && overlay) {
      nav.classList.add('open');
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
      document.body.style.overflow = 'hidden'; // Prevent scrolling
      toggle.setAttribute('aria-expanded', 'true');
    }
  }

  function closeMenu() {
    if (nav && overlay) {
      nav.classList.remove('open');
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      document.body.style.overflow = ''; // Restore scrolling
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (toggle && nav) {
    createOverlay();

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (nav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when clicking nav links
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // ===== 2. Form Validation =====
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      form.querySelectorAll('.error').forEach(err => err.textContent = '');
      form.querySelectorAll('input, textarea').forEach(input => input.style.borderColor = '');

      // Validate Email
      const email = form.querySelector('input[type="email"]');
      if (email && !validateEmail(email.value)) {
        showError(email, 'الرجاء إدخال بريد إلكتروني صحيح');
        isValid = false;
      }

      // Validate Password (if exists)
      const password = form.querySelector('input[type="password"]');
      if (password && password.value.length < 6) {
        showError(password, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        isValid = false;
      }

      // Validate Confirm Password
      const confirmPass = form.querySelector('input[name="confirmPassword"]');
      if (confirmPass && password && confirmPass.value !== password.value) {
        showError(confirmPass, 'كلمتا المرور غير متطابقتين');
        isValid = false;
      }

      // Validate Required Fields
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          showError(field, 'هذا الحقل مطلوب');
          isValid = false;
        }
      });

      if (isValid) {
        // Simulate success
        const successMsg = form.parentElement.querySelector('.alert.success');
        if (successMsg) {
          successMsg.style.display = 'block';
          form.reset();
          setTimeout(() => successMsg.style.display = 'none', 5000);
        } else {
          alert('تم الإرسال بنجاح! (محاكاة)');
          form.reset();
        }
      }
    });
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, message) {
    const errorSmall = input.parentElement.querySelector('.error');
    if (errorSmall) errorSmall.textContent = message;
    input.style.borderColor = 'var(--danger)';
  }

  // ===== 3. Password Strength Checker =====
  const passwordInput = document.getElementById('passwordInput');
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');

  if (passwordInput && strengthFill && strengthText) {
    passwordInput.addEventListener('input', () => {
      const val = passwordInput.value;
      let strength = 0;

      if (val.length >= 6) strength++;
      if (val.length >= 10) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;

      let color = '#e2e8f0';
      let width = '0%';
      let text = '';

      if (val.length === 0) {
        // Empty
      } else if (strength <= 2) {
        color = '#ef4444'; // Weak
        width = '30%';
        text = 'ضعيفة 😟';
      } else if (strength <= 4) {
        color = '#f59e0b'; // Medium
        width = '60%';
        text = 'متوسطة 😐';
      } else {
        color = '#10b981'; // Strong
        width = '100%';
        text = 'قوية 💪';
      }

      strengthFill.style.width = width;
      strengthFill.style.backgroundColor = color;
      strengthText.textContent = text;
      strengthText.style.color = color;
    });
  }

  // ===== 4. External Links =====
  // Only add target="_blank" to external links
  document.querySelectorAll('a').forEach(link => {
    if (link.hostname !== window.location.hostname && link.href.startsWith('http')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // ===== 5. Scroll Animations =====
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card, .hero-inner, .section h2').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });

  // Add class for animation
  const style = document.createElement('style');
  style.textContent = `
    .fade-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ===== 6. Scroll Progress Bar =====
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });

  // ===== 7. Enhanced Loading Screen =====
  // Only show on first visit or hard refresh, not on internal navigation
  const isInternalNavigation = sessionStorage.getItem('visited');

  if (!isInternalNavigation) {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-spinner"></div>
      <div class="loader-text">جاري التحميل...</div>
    `;
    document.body.appendChild(loader);

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
      }, 800);
    });

    // Mark as visited for this session
    sessionStorage.setItem('visited', 'true');
  } else {
    // Add quick fade-in for internal navigation
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.3s';
      document.body.style.opacity = '1';
    }, 50);
  }

  // ===== 8. Dark Mode Toggle =====
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = '🌙';
  themeToggle.setAttribute('aria-label', 'تبديل الوضع الليلي');
  document.body.appendChild(themeToggle);

  // Check saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedTheme === 'dark') {
    themeToggle.innerHTML = '☀️';
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';

    // Show toast notification
    showToast(newTheme === 'dark' ? 'تم تفعيل الوضع الليلي' : 'تم تفعيل الوضع النهاري', 'success');
  });

  // ===== 9. Toast Notification System =====
  window.showToast = function (message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? '✓' : '✕';
    const iconColor = type === 'success' ? '#10b981' : '#ef4444';

    toast.innerHTML = `
      <div style="font-size: 1.5rem; color: ${iconColor};">${icon}</div>
      <div style="flex: 1;">
        <div style="font-weight: 700; color: #1e293b; margin-bottom: 0.25rem;">
          ${type === 'success' ? 'نجح' : 'خطأ'}
        </div>
        <div style="color: #64748b; font-size: 0.9rem;">${message}</div>
      </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hidden');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // ===== 10. Animated Counter (for Home Page) =====
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length > 0) {
    const speed = 200;

    const animateCounter = (counter) => {
      const target = +counter.getAttribute('data-target');
      const increment = target / speed;
      let count = 0;

      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.innerText = Math.ceil(count);
          setTimeout(updateCount, 10);
        } else {
          counter.innerText = target + '+';
        }
      };
      updateCount();
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          animateCounter(counter);
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

});