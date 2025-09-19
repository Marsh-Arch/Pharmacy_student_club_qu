/*
 * Pharmacy Club interactive script
 *
 * This script powers the dynamic features of the Pharmacy Club website.
 * It loads events and news from external JSON files, manages the image
 * gallery, highlights the current navigation link based on scroll position,
 * and adds smooth scrolling and a back‑to‑top button. By separating content
 * from structure, the site becomes easier to update—simply edit the JSON
 * files in the `data` folder instead of modifying the HTML directly.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  initGallery();
  initNavigation();
  initBackToTop();
  loadJSONContent();

  // Contact form submission handler with localisation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      const currentLang = document.documentElement.dataset.currentLang || 'en';
      const dict = window.i18nTranslations && window.i18nTranslations[currentLang];
      const alertMessage = dict && dict.contactAlert ? dict.contactAlert : 'Thank you for contacting the Pharmacy Club! We will get back to you shortly.';
      alert(alertMessage);
      contactForm.reset();
    });
  }
});

/**
 * Initialize gallery controls and optional autoplay.
 */
function initGallery() {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  const images = gallery.querySelectorAll('img');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  let currentIndex = 0;

  function showImage(index) {
    images.forEach(img => img.classList.remove('active'));
    images[index].classList.add('active');
  }
  prevBtn?.addEventListener('click', () => {
    currentIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    showImage(currentIndex);
  });
  nextBtn?.addEventListener('click', () => {
    currentIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    showImage(currentIndex);
  });
  // Optional autoplay: change image every 7 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }, 7000);
}

/**
 * Set up smooth scrolling for navigation links and highlight the link
 * corresponding to the section currently in view using IntersectionObserver.
 */
function initNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href')));

  // Smooth scroll on click
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Highlight navigation item when its section is in view
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.6
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const index = sections.indexOf(entry.target);
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (navLinks[index]) navLinks[index].classList.add('active');
      }
    });
  }, observerOptions);
  sections.forEach(section => {
    if (section) observer.observe(section);
  });
}

/**
 * Add a back‑to‑top button that appears after the user scrolls down.
 */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Load events and news data from JSON files and insert them into
 * the corresponding sections. If fetching fails (e.g., when viewing
 * the site directly from the filesystem), a graceful message is shown.
 */
function loadJSONContent() {
  // Helper to fetch JSON and render items
  function fetchAndRender(url, containerSelector, templateFn) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const items = Object.values(data)[0];
        if (!Array.isArray(items) || items.length === 0) {
          container.innerHTML = '<p>No entries available.</p>';
          return;
        }
        container.innerHTML = items.map(templateFn).join('');
      })
      .catch(err => {
        console.error('Failed to load', url, err);
        container.innerHTML = '<p style="color: red;">Unable to load content. If you are viewing this page locally, please run a local web server to allow fetching JSON files.</p>';
      });
  }
  // Templates
  const newsTemplate = (item) => {
    return `\
      <article class="news-item">
        <h3>${item.title}</h3>
        <p class="meta">${formatDate(item.date)}</p>
        <p>${item.description}</p>
      </article>`;
  };
  const eventTemplate = (item) => {
    return `\
      <article class="event-item">
        <h3>${item.title}</h3>
        <p class="meta">${formatDate(item.date)} | ${item.location}</p>
        <p>${item.description}</p>
      </article>`;
  };
  // Fetch and render data
  fetchAndRender('data/news.json', '#news-list', newsTemplate);
  fetchAndRender('data/events.json', '#events-list', eventTemplate);
}

/**
 * Handle language selection and apply translations to the page.
 */
function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-selector button');
  // Define translation strings for English and Arabic
  const translations = {
    en: {
      heroTitle: 'Pharmacy Club',
      heroMotto: '“The palm: identity and continuous giving. The pill: serving health and community. The book: science, knowledge, and academic excellence.”',
      navAbout: 'About',
      navEvents: 'Events',
      navNews: 'News',
      navGallery: 'Gallery',
      navContact: 'Contact',
      aboutHeading: 'About the Pharmacy Club',
      aboutParagraph1: 'Participation in professional student organizations enriches the pharmacy experience and helps members explore different career paths while sharpening their leadership and communication skills. As part of the college, the club offers opportunities to engage with peers and professionals, share knowledge about clinical pharmacy, and promote excellence in patient care, research and education. Members are encouraged to develop the interdisciplinary skills needed to thrive in diverse health care settings.',
      aboutParagraph2: 'Through hands‑on workshops, community service and health outreach, participants refine their clinical and communication abilities, deepen their understanding of patient‑centred care and prepare to improve public health. These experiences embody the club’s motto by emphasising identity and continuous giving, serving health and community and the pursuit of science and knowledge.',
      eventsHeading: 'Upcoming Events',
      newsHeading: 'Latest News',
      galleryHeading: 'Gallery',
      contactHeading: 'Contact Us',
      contactName: 'Name',
      contactEmail: 'Email',
      contactMessage: 'Message',
      contactSubmit: 'Send',
      contactPlaceholderName: 'Your name',
      contactPlaceholderEmail: 'your@email.com',
      contactPlaceholderMessage: 'How can we help?' 
      ,
      contactAlert: 'Thank you for contacting the Pharmacy Club! We will get back to you shortly.'
    },
    ar: {
      heroTitle: 'نادي الصيدلة',
      heroMotto: '“النخلة: الهوية والعطاء المستمر. الحبة: خدمة الصحة والمجتمع. الكتاب: العلم والمعرفة والتفوق الأكاديمي.”',
      navAbout: 'عن النادي',
      navEvents: 'الفعاليات',
      navNews: 'الأخبار',
      navGallery: 'المعرض',
      navContact: 'اتصل بنا',
      aboutHeading: 'عن نادي الصيدلة',
      aboutParagraph1: 'الانضمام إلى المنظمات الطلابية المهنية يثري تجربة الطالب الصيدلي ويساعد الأعضاء على استكشاف مسارات مهنية مختلفة مع تعزيز مهارات القيادة والتواصل. يوفر النادي فرصًا للتفاعل مع الزملاء والمتخصصين، ومشاركة المعرفة حول الصيدلة السريرية، وتعزيز التميز في رعاية المرضى والبحث والتعليم. يشجع الأعضاء على تطوير المهارات المتعددة التخصصات اللازمة للنجاح في بيئات الرعاية الصحية المتنوعة.',
      aboutParagraph2: 'من خلال ورش العمل العملية وخدمة المجتمع والتوعية الصحية، يصقل المشاركون مهاراتهم السريرية والاتصالية، ويعمقون فهمهم للرعاية المتمركزة على المريض، ويستعدون لتحسين الصحة العامة. تجسد هذه التجارب شعار النادي بالتأكيد على الهوية والعطاء المستمر، وخدمة الصحة والمجتمع، والسعي إلى العلم والمعرفة.',
      eventsHeading: 'الفعاليات القادمة',
      newsHeading: 'آخر الأخبار',
      galleryHeading: 'معرض الصور',
      contactHeading: 'اتصل بنا',
      contactName: 'الاسم',
      contactEmail: 'البريد الإلكتروني',
      contactMessage: 'الرسالة',
      contactSubmit: 'إرسال',
      contactPlaceholderName: 'اسمك',
      contactPlaceholderEmail: 'بريدك الإلكتروني',
      contactPlaceholderMessage: 'كيف يمكننا مساعدتك؟'
      ,
      contactAlert: 'شكرا لتواصلك مع نادي الصيدلة! سنعود إليك قريباً.'
    }
  };

  // Make translations globally accessible for other functions (e.g. contact form)
  window.i18nTranslations = translations;

  // Helper to apply translations based on selected language
  function applyTranslations(lang) {
    const dict = translations[lang] || translations.en;
    // Update text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
    // Update placeholders
    document.querySelectorAll('[data-placeholder-i18n]').forEach(el => {
      const key = el.getAttribute('data-placeholder-i18n');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });
    // Set direction attribute on body for RTL languages
    if (lang === 'ar') {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.setAttribute('dir', 'ltr');
    }
    // Highlight selected language button
    langButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-lang') === lang));
    // Persist selection
    localStorage.setItem('preferredLanguage', lang);
      // Also store current dictionary for use in other functions (e.g. alerts)
      document.documentElement.dataset.currentLang = lang;
  }

  // Attach event listeners to language buttons
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      applyTranslations(selectedLang);
    });
  });
  // Load preferred language from storage or default to English
  const storedLang = localStorage.getItem('preferredLanguage') || 'en';
  applyTranslations(storedLang);
}

/**
 * Format ISO date strings into a human‑friendly format.
 * Example: 2025-10-15 -> October 15, 2025
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}