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

// ========== BLUEPRINT MANAGEMENT ==========
function generateProjectBlueprint() {
  return `
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 2rem; border-radius: 12px; color: #e2e8f0;">
      <h3 style="color: #4ade80; margin-bottom: 1.5rem; font-size: 1.5rem;">🏗️ EcoNet Blueprint Progettuale</h3>
      
      <div style="margin-bottom: 1.5rem;">
        <h4 style="color: #cbd5e1; margin-bottom: 0.75rem;">1. GOVERNANCE ISTITUZIONALE & ASSET MANAGEMENT</h4>
        <p style="color: #94a3b8; line-height: 1.6;">
          <strong>Direzione Operativa:</strong> Dott. Giovanni Giovanelli Luigi<br/>
          <strong>Patronato:</strong> A.C.L.I. Sezione Ceglie del Campo (Bari)<br/>
          <strong>Coordinamento Strategico:</strong> Sviluppo Network EcoNet.Green Social Network HUB<br/>
          <strong>Responsabile Operativo:</strong> Cassano Giuseppe
        </p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="color: #cbd5e1; margin-bottom: 0.75rem;">2. PILASTRO PRODROMICO: FORMAZIONE A PRIORI</h4>
        <p style="color: #94a3b8; line-height: 1.6;">
          ↳ Formazione Tecnica/Biologica → Sicurezza HACCP/Manutenzione → Integrazione Linguistica/Legalità → STOP CAPORALATO
        </p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="color: #cbd5e1; margin-bottom: 0.75rem;">3. ASSET IMMOBILIARI, BONIFICHE & INFRASTRUTTURE</h4>
        <p style="color: #94a3b8; line-height: 1.6;">
          Riqualificazione Fondiaria & Bonifiche → Domotica Digitale → Manutenzione Maredt → Magazzini Operativi<br/>
          <strong>Modello Asset Sharing</strong> per sostenibilità operativa
        </p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="color: #cbd5e1; margin-bottom: 0.75rem;">4. SOTTOSEZIONE AGRICOLA: APICULTURA & TRASFORMAZIONE</h4>
        <p style="color: #94a3b8; line-height: 1.6;">
          Impollinazione Miele → Parco Machine Apistici → Produzione Colture Autoctone
        </p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="color: #cbd5e1; margin-bottom: 0.75rem;">5. MAGAZZINO DI TRASFORMAZIONE AGRICOLA</h4>
        <p style="color: #94a3b8; line-height: 1.6;">
          Ortofrutta Autoctona (Mondatura, Lavorazione, Confezionamento K.m) → Apicoltura (Smielatura, Decantamento, Filtratura) → Erbe Spontanee di Celle del Campo
        </p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="color: #cbd5e1; margin-bottom: 0.75rem;">6. IMPATTO SOCIALE & DISTRIBUZIONE</h4>
        <p style="color: #94a3b8; line-height: 1.6;">
          Regionale Lavoro-Attivato (Mercato, Horeca, Logistica, Enoteca) → Spaccio, Cassette, Miele
        </p>
      </div>

      <div style="border-top: 2px solid #334155; padding-top: 1rem; margin-top: 1rem;">
        <p style="color: #94a3b8; font-size: 0.9rem;">
          <strong>Visione Strategica:</strong> Rete cooperativa territoriale per agricoltura etica, inclusione sociale, km 0 reale e contrasto al caporalato.
        </p>
      </div>
    </div>
  `;
}

function generateKPIBlueprint() {
  return `
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 2rem; border-radius: 12px; color: #e2e8f0;">
      <h3 style="color: #4ade80; margin-bottom: 1.5rem; font-size: 1.5rem;">📊 Dashboard KPI - 20 Indicatori Strategici</h3>
      
      <div style="margin-bottom: 1rem;">
        <h4 style="color: #14b8a6; margin-bottom: 0.75rem;">🤝 GOVERNANCE (4 KPI)</h4>
        <ul style="color: #94a3b8; margin-left: 1.5rem;">
          <li>% Partecipazione assemblea annuale</li>
          <li>Composizione genere board (M/F %)</li>
          <li>Trasparenza documentale (score 0-100)</li>
          <li>Audit compliance (conformità % annuale)</li>
        </ul>
      </div>

      <div style="margin-bottom: 1rem;">
        <h4 style="color: #14b8a6; margin-bottom: 0.75rem;">🌾 PILASTRO AGRICOLO (4 KPI)</h4>
        <ul style="color: #94a3b8; margin-left: 1.5rem;">
          <li>Terreni recuperati (m²/anno)</li>
          <li>Produzione biologica (kg/anno)</li>
          <li>Biodiversità varietale (n. specie autoctone)</li>
          <li>km zero certificati (%)</li>
        </ul>
      </div>

      <div style="margin-bottom: 1rem;">
        <h4 style="color: #14b8a6; margin-bottom: 0.75rem;">👥 PILASTRO SOCIALE (4 KPI)</h4>
        <ul style="color: #94a3b8; margin-left: 1.5rem;">
          <li>Occupati con contratto regolare (n.)</li>
          <li>Stranieri integrati (n. e % della forza lavoro)</li>
          <li>Ore formazione/anno (media per addetto)</li>
          <li>Casi caporalato prevenuti/bloccati (n.)</li>
        </ul>
      </div>

      <div style="margin-bottom: 1rem;">
        <h4 style="color: #14b8a6; margin-bottom: 0.75rem;">💼 PILASTRO COMMERCIALE (4 KPI)</h4>
        <ul style="color: #94a3b8; margin-left: 1.5rem;">
          <li>Ricavi da filiera diretta (€/anno)</li>
          <li>Cooperative partner attive (n.)</li>
          <li>Punti vendita B2C/B2B (n. canali)</li>
          <li>Sostenibilità finanziaria (ricavi propri / costi operativi %)</li>
        </ul>
      </div>

      <div style="margin-bottom: 1rem;">
        <h4 style="color: #14b8a6; margin-bottom: 0.75rem;">🎓 PILASTRO EDUCATIVO (4 KPI)</h4>
        <ul style="color: #94a3b8; margin-left: 1.5rem;">
          <li>Scuole coinvolte in programmi didattici (n.)</li>
          <li>Studenti coinvolti/anno (n.)</li>
          <li>Percorsi botanici guidati/anno (n.)</li>
          <li>Certificazioni educative rilasciate (n.)</li>
        </ul>
      </div>

      <div style="border-top: 2px solid #334155; padding-top: 1rem; margin-top: 1rem;">
        <p style="color: #94a3b8; font-size: 0.9rem;">
          <strong>Aggiornamento:</strong> Trimestrale | <strong>Revisione Strategica:</strong> Annuale | <strong>Benchmark:</strong> Rete A.C.L.I. + Cooperative Sostenibili
        </p>
      </div>
    </div>
  `;
}

function openBlueprintModal(type) {
  const modal = document.getElementById('blueprintModal');
  const content = document.getElementById('blueprintContent');
  
  if (type === 'project') {
    content.innerHTML = generateProjectBlueprint();
    window.currentBlueprint = 'project';
  } else if (type === 'kpi') {
    content.innerHTML = generateKPIBlueprint();
    window.currentBlueprint = 'kpi';
  }
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBlueprintModal() {
  const modal = document.getElementById('blueprintModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function downloadBlueprintPDF() {
  const type = window.currentBlueprint || 'project';
  const title = type === 'project' ? 'EcoNet_Blueprint_Progettuale' : 'EcoNet_Blueprint_KPI';
  
  // For simplicity, we'll use a browser print-to-PDF approach
  showNotification('📥 Preparazione PDF in corso... Usa il menù di stampa per salvare.', 'info');
  
  // Create a new window for printing
  const printWindow = window.open('', '', 'width=800,height=600');
  const content = document.getElementById('blueprintContent').innerHTML;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #0f172a;
          color: #e2e8f0;
          padding: 2rem;
        }
        h3 { color: #4ade80; }
        h4 { color: #14b8a6; }
        p, li { color: #94a3b8; }
        @media print {
          body { background-color: white; }
          h3, h4 { color: #000; }
          p, li { color: #333; }
        }
      </style>
    </head>
    <body>
      ${content}
      <p style="margin-top: 2rem; border-top: 1px solid #334155; padding-top: 1rem; font-size: 0.85rem;">
        Scaricato da: EcoNet Green Social Network | Data: ${new Date().toLocaleDateString('it-IT')}
      </p>
    </body>
    </html>
  `);
  printWindow.document.close();
  
  // Auto-print after a delay
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  const modal = document.getElementById('blueprintModal');
  if (modal && e.target === modal) {
    closeBlueprintModal();
  }
});

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
