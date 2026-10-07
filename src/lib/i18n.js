// Bilingual dictionary. Every user-facing string on the site lives here.
// Usage: <span data-i18n="nav.home">Home</span> — client JS swaps textContent on toggle.
// Server-rendered default is English; JS applies the saved language on load.
export const STRINGS = {
  // brand / nav
  'brand.name': { en: 'Hamro Bazaar', ne: 'हाम्रो बजार' },
  'brand.tag': { en: 'Pittsburgh pilot', ne: 'पिट्सबर्ग पाइलट' },
  'nav.home': { en: 'Home', ne: 'होम' },
  'nav.browse': { en: 'Browse', ne: 'खोज्नुहोस्' },
  'nav.announcements': { en: 'Announcements', ne: 'घोषणा' },
  'nav.request': { en: 'Request', ne: 'अनुरोध' },

  // hero
  'hero.eyebrow': { en: 'Pittsburgh · Nepali + Indian community', ne: 'पिट्सबर्ग · नेपाली + भारतीय समुदाय' },
  'hero.title': {
    en: 'Every Nepali & Indian service in Pittsburgh. One search.',
    ne: 'पिट्सबर्गका सबै नेपाली र भारतीय सेवाहरू। एकै खोजमा।',
  },
  'hero.sub': {
    en: 'Groceries, momo spots, mechanics, tax help, home care — listed by the community, free forever.',
    ne: 'किराना, म:म पसल, मेकानिक, कर सहायता, होम केयर — समुदायद्वारा सूचीबद्ध, सधैं नि:शुल्क।',
  },
  'hero.searchPh': { en: 'What do you need?', ne: 'तपाईंलाई के चाहियो?' },
  'hero.searchLabel': { en: 'Search businesses', ne: 'व्यवसाय खोज्नुहोस्' },

  // sections
  'sec.categories': { en: 'Categories', ne: 'वर्गहरू' },
  'sec.featured': { en: 'Featured near you', ne: 'तपाईं नजिक विशेष' },
  'sec.announcements': { en: 'Fresh announcements', ne: 'ताजा घोषणाहरू' },
  'sec.announcementsAll': { en: 'View all', ne: 'सबै हेर्नुहोस्' },
  'badge.featured': { en: 'Featured', ne: 'विशेष' },
  'badge.verified': { en: 'Verified', ne: 'प्रमाणित' },

  // browse
  'browse.title': { en: 'Browse businesses', ne: 'व्यवसायहरू हेर्नुहोस्' },
  'browse.all': { en: 'All', ne: 'सबै' },
  'browse.openNow': { en: 'Open now', ne: 'अहिले खुला छ' },
  'browse.openNowNote': {
    en: 'Based on owner-reported hours. When in doubt, call.',
    ne: 'व्यवसायले दिएको समय अनुसार। शंका लागे फोन गर्नुहोस्।',
  },
  'browse.noResults': { en: 'No businesses match those filters.', ne: 'यी फिल्टरसँग मिल्ने व्यवसाय भेटिएन।' },
  'browse.clearFilters': { en: 'Clear filters', ne: 'फिल्टर हटाउनुहोस्' },
  'browse.results': { en: 'businesses', ne: 'व्यवसायहरू' },

  // cards / detail
  'card.call': { en: 'Call', ne: 'फोन' },
  'card.noPhone': { en: 'phone not listed', ne: 'फोन नम्बर छैन' },
  'detail.services': { en: 'Services', ne: 'सेवाहरू' },
  'detail.hours': { en: 'Hours', ne: 'समय' },
  'detail.hoursUnknown': { en: 'Call for hours', ne: 'समयका लागि फोन गर्नुहोस्' },
  'detail.languages': { en: 'Languages', ne: 'भाषाहरू' },
  'detail.languagesNote': {
    en: 'Community-reported. Confirm when you call.',
    ne: 'समुदायले बताएअनुसार। फोन गर्दा पुष्टि गर्नुहोस्।',
  },
  'detail.directions': { en: 'Directions', ne: 'बाटो' },
  'detail.reviews': { en: 'Reviews', ne: 'समीक्षाहरू' },
  'detail.noReviews': {
    en: 'No reviews yet — be the first after you visit.',
    ne: 'अहिलेसम्म समीक्षा छैन — तपाईं गएपछि पहिलो लेख्नुहोस्।',
  },
  'detail.reviewsSoon': {
    en: 'Reviews open soon. For now, call or WhatsApp the business directly.',
    ne: 'समीक्षा चाँडै खुल्नेछ। अहिलेलाई व्यवसायलाई सिधै फोन वा व्हाट्सएप गर्नुहोस्।',
  },
  'detail.back': { en: 'Back to browse', ne: 'खोजीमा फर्कनुहोस्' },
  'detail.website': { en: 'Website', ne: 'वेबसाइट' },

  // announcements
  'ann.title': { en: 'Announcements', ne: 'घोषणाहरू' },
  'ann.sub': {
    en: 'New products, sales, and community news — free for every business to post.',
    ne: 'नयाँ उत्पादन, बिक्री र सामुदायिक समाचार — हरेक व्यवसायका लागि नि:शुल्क।',
  },
  'ann.empty': { en: 'No announcements yet.', ne: 'अहिलेसम्म कुनै घोषणा छैन।' },

  // request
  'req.title': { en: 'Request a service', ne: 'सेवा अनुरोध गर्नुहोस्' },
  'req.sub': {
    en: 'Tell us what you need. We open WhatsApp with your request ready to send.',
    ne: 'तपाईंलाई के चाहियो बताउनुहोस्। हामी तपाईंको अनुरोध तयार पारेर व्हाट्सएप खोलिदिन्छौं।',
  },
  'req.need': { en: 'What do you need?', ne: 'तपाईंलाई के चाहियो?' },
  'req.needPh': { en: 'e.g. A mechanic near Baldwin who speaks Nepali', ne: 'जस्तै: बाल्डविन नजिक नेपाली बोल्ने मेकानिक' },
  'req.hood': { en: 'Neighborhood', ne: 'छिमेक' },
  'req.lang': { en: 'Preferred language', ne: 'रुचाइएको भाषा' },
  'req.langAny': { en: 'No preference', ne: 'कुनै पनि' },
  'req.send': { en: 'Send via WhatsApp', ne: 'व्हाट्सएपबाट पठाउनुहोस्' },
  'req.note': {
    en: 'No account needed. Your request goes straight to our team on WhatsApp.',
    ne: 'खाता चाहिँदैन। तपाईंको अनुरोध सिधै हाम्रो टोलीकहाँ व्हाट्सएपमा जान्छ।',
  },

  // list-business
  'own.title': { en: 'List your business — free', ne: 'आफ्नो व्यवसाय नि:शुल्क सूचीबद्ध गर्नुहोस्' },
  'own.sub': {
    en: 'No dashboard. No forms. No English required.',
    ne: 'कुनै ड्यासबोर्ड छैन। कुनै फारम छैन। अंग्रेजी आवश्यक छैन।',
  },
  'own.step1t': { en: 'Say hello on WhatsApp', ne: 'व्हाट्सएपमा नमस्ते भन्नुहोस्' },
  'own.step1d': {
    en: 'Message us in Nepali, Hindi, or English — whichever is easiest.',
    ne: 'नेपाली, हिन्दी वा अंग्रेजी — जुन सजिलो छ त्यही भाषामा सन्देश पठाउनुहोस्।',
  },
  'own.step2t': { en: 'Two-minute chat', ne: 'दुई मिनेटको कुराकानी' },
  'own.step2d': {
    en: 'We ask about your services, hours, and photos. That is the whole process.',
    ne: 'हामी तपाईंका सेवा, समय र फोटोहरूबारे सोध्छौं। यति नै हो।',
  },
  'own.step3t': { en: 'We build your listing', ne: 'हामी तपाईंको सूची बनाइदिन्छौं' },
  'own.step3d': {
    en: 'You approve it with a thumbs-up. Updates anytime — just message us.',
    ne: 'तपाईं थम्स-अप दिएर स्वीकृत गर्नुहोस्। जुनबेला पनि अपडेट — सन्देश पठाउनुहोस्।',
  },
  'own.cta': { en: 'Start on WhatsApp', ne: 'व्हाट्सएपमा सुरु गर्नुहोस्' },
  'own.free': {
    en: 'Listing is free forever. Optional featured placement available later.',
    ne: 'सूचीकरण सधैं नि:शुल्क छ। विशेष स्थान पछि उपलब्ध हुनेछ।',
  },

  // owner CTA band (home)
  'band.title': { en: 'Own a business?', ne: 'व्यवसाय छ?' },
  'band.sub': {
    en: 'Get listed in front of the whole community — free, and we do the work.',
    ne: 'सम्पूर्ण समुदायसामु देखिनुहोस् — नि:शुल्क, र काम हामी गर्छौं।',
  },
  'band.cta': { en: 'List your business — free', ne: 'आफ्नो व्यवसाय नि:शुल्क सूचीबद्ध गर्नुहोस्' },

  // footer
  'foot.tag': { en: 'Hamro Bazaar · Pittsburgh pilot concept', ne: 'हाम्रो बजार · पिट्सबर्ग पाइलट' },
  'foot.made': {
    en: 'Built for the Nepali & Indian community of Pittsburgh.',
    ne: 'पिट्सबर्गको नेपाली र भारतीय समुदायका लागि निर्मित।',
  },

  // misc
  'misc.close': { en: 'Close', ne: 'बन्द गर्नुहोस्' },
  'misc.loading': { en: 'Loading…', ne: 'लोड हुँदैछ…' },
};

export function t(key, lang = 'en') {
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[lang] || entry.en;
}

export function getLang() {
  if (typeof window === 'undefined') return 'en';
  try {
    return localStorage.getItem('hb_lang') === 'ne' ? 'ne' : 'en';
  } catch {
    return 'en';
  }
}

export function setLang(lang) {
  try {
    localStorage.setItem('hb_lang', lang === 'ne' ? 'ne' : 'en');
  } catch {
    /* private mode — lang just won't persist */
  }
  applyLang(lang);
}

// Swaps every [data-i18n] string + [data-i18n-ph] placeholder on the page.
export function applyLang(lang) {
  const l = lang === 'ne' ? 'ne' : 'en';
  document.documentElement.lang = l === 'ne' ? 'ne' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (STRINGS[key]) el.textContent = t(key, l);
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const key = el.getAttribute('data-i18n-ph');
    if (STRINGS[key]) el.setAttribute('placeholder', t(key, l));
  });
  document.querySelectorAll('[data-lang-toggle]').forEach((el) => {
    el.setAttribute('aria-pressed', l === 'ne' ? 'true' : 'false');
    const label = el.querySelector('[data-lang-label]');
    if (label) label.textContent = l === 'ne' ? 'EN' : 'ने';
  });
  // Re-render dynamic regions that depend on language
  document.dispatchEvent(new CustomEvent('hb:lang', { detail: { lang: l } }));
}
