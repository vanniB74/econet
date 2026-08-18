// ========== APPLICATION STATE ==========
const appState = {
  currentLang: 'it',
  isLoggedIn: false,
  userName: null,
  hasSubscription: false,
  currentPage: 'home',
  mobileMenuOpen: false,
  darkMode: true,
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  // Enable dark mode by default
  if (appState.darkMode) {
    document.body.classList.add('dark-mode');
  }
  
  initializeLanguageSelector();
  initializeFormHandling();
  initializeScrollAnimations();
  initializeNavigation();
  initializeLangSwitcher();
  
  // Load saved language preference
  const savedLang = localStorage.getItem('preferredLang') || navigator.language.split('-')[0];
  if (T[savedLang]) {
    appState.currentLang = savedLang;
  }
  
  // Translate page on load
  translatePage(appState.currentLang);
  updateLanguageSwitcher();
});

// ========== LANGUAGE SELECTOR ==========
function initializeLanguageSelector() {
  const langToggleBtn = document.getElementById('langToggleBtn');
  const langDropdown = document.getElementById('langDropdown');

  if (!langToggleBtn || !langDropdown) return;

  // Populate language options
  const languages = [
    { code: 'it', flag: '🇮🇹', name: 'Italiano' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  ];

  langDropdown.innerHTML = languages
    .map(
      (lang) =>
        `<button class="lang-option" data-lang="${lang.code}">
          <span>${lang.flag}</span> ${lang.name}
        </button>`
    )
    .join('');

  // Toggle dropdown
  langToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    langDropdown.classList.remove('active');
  });

  // Handle language selection
  langDropdown.querySelectorAll('.lang-option').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const newLang = e.currentTarget.getAttribute('data-lang');
      changeLanguage(newLang);
      langDropdown.classList.remove('active');
    });
  });
}

function updateLanguageSwitcher() {
  const langMap = {
    it: { flag: '🇮🇹', code: 'IT' },
    en: { flag: '🇬🇧', code: 'EN' },
    fr: { flag: '🇫🇷', code: 'FR' },
    de: { flag: '🇩🇪', code: 'DE' },
  };

  const current = langMap[appState.currentLang];
  const flagEl = document.getElementById('currentLangFlag');
  const codeEl = document.getElementById('currentLangCode');

  if (flagEl) flagEl.textContent = current.flag;
  if (codeEl) codeEl.textContent = current.code;
}

function changeLanguage(lang) {
  if (!T[lang]) return;
  
  appState.currentLang = lang;
  localStorage.setItem('preferredLang', lang);
  translatePage(lang);
  updateLanguageSwitcher();
}

// ========== LANGUAGE SWITCHER (SEPARATE FROM DROPDOWN) ==========
function initializeLangSwitcher() {
  // This is handled by initializeLanguageSelector
}

// ========== NAVIGATION ==========
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-links a[href*="#"]');
  
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        return;
      }
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        appState.currentPage = href.substring(1);
      }
    });
  });
}

// ========== SCROLL ANIMATIONS ==========
function initializeScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('slide-left');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  });

  // Observe all reveal elements
  document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
  });
}

// ========== FORM HANDLING ==========
function initializeFormHandling() {
  const bookingForm = document.getElementById('bookingForm');
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleFormSubmit);
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('userName')?.value,
    email: document.getElementById('userEmail')?.value,
    phone: document.getElementById('userPhone')?.value,
  };

  // Validate form
  if (!formData.name || !formData.email || !formData.phone) {
    showNotification('Compila tutti i campi', 'error');
    return;
  }

  // Here you would typically send the data to a server
  // For now, we'll just show a success message
  console.log('Form submitted:', formData);
  
  // Save to localStorage (as demo)
  const submissions = JSON.parse(localStorage.getItem('bookingSubmissions') || '[]');
  submissions.push({
    ...formData,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem('bookingSubmissions', JSON.stringify(submissions));

  // Reset form and show success
  e.target.reset();
  showNotification(getTranslation(appState.currentLang, 'form_success'), 'success');
}

// ========== NOTIFICATIONS ==========
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    zIndex: '9999',
    animation: 'slideInRight 0.3s ease-out',
    backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  });

  document.body.appendChild(notification);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// ========== PDF DOWNLOAD (PLACEHOLDER) ==========
document.addEventListener('DOMContentLoaded', () => {
  const pdfBtn = document.querySelector('.js-download-pdf');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showNotification('📥 Generazione PDF in corso...', 'info');
      // In a real application, you would generate and download a PDF here
      // For now, this is just a placeholder
    });
  }
});

// ========== UTILITY FUNCTIONS ==========
function navigateTo(page) {
  appState.currentPage = page;
  const section = document.getElementById(page);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function getCurrentLanguage() {
  return appState.currentLang;
}

function setLoginState(isLoggedIn, userName = null) {
  appState.isLoggedIn = isLoggedIn;
  appState.userName = userName;
  localStorage.setItem('authState', JSON.stringify({
    isLoggedIn,
    userName,
  }));
}

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
  // Alt + L: Toggle language dropdown
  if (e.altKey && e.key === 'l') {
    e.preventDefault();
    const langDropdown = document.getElementById('langDropdown');
    if (langDropdown) {
      langDropdown.classList.toggle('active');
    }
  }
});

// ========== MOBILE MENU HANDLING ==========
function toggleMobileMenu() {
  appState.mobileMenuOpen = !appState.mobileMenuOpen;
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.style.display = appState.mobileMenuOpen ? 'flex' : 'none';
  }
}

// ========== RESTORE PREVIOUS STATE ==========
function restorePreviousState() {
  const authState = localStorage.getItem('authState');
  if (authState) {
    try {
      const { isLoggedIn, userName } = JSON.parse(authState);
      if (isLoggedIn) {
        appState.isLoggedIn = true;
        appState.userName = userName;
      }
    } catch (e) {
      console.error('Error restoring auth state:', e);
    }
  }
}

// Restore state on page load
document.addEventListener('DOMContentLoaded', restorePreviousState);

// ========== ANALYTICS (PLACEHOLDER) ==========
function trackEvent(eventName, eventData = {}) {
  console.log(`Event: ${eventName}`, eventData);
  // In a real application, you would send this to an analytics service
}

// Track page views
document.addEventListener('DOMContentLoaded', () => {
  trackEvent('page_view', {
    language: appState.currentLang,
    timestamp: new Date().toISOString(),
  });
});

// Track language changes
function trackLanguageChange(oldLang, newLang) {
  trackEvent('language_changed', {
    from: oldLang,
    to: newLang,
    timestamp: new Date().toISOString(),
  });
}

// ========== SMOOTH SCROLL POLYFILL ==========
if (!CSS.supports('scroll-behavior: smooth')) {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'auto' });
      }
    });
  });
}

// ========== PERFORMANCE OPTIMIZATION ==========
// Lazy load images (if any)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
}
