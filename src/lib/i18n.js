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

  // submit announcement (public)
  'ann.postOwn': { en: 'Post your own announcement', ne: 'आफ्नै घोषणा पोस्ट गर्नुहोस्' },
  'annsub.title': { en: 'Post an announcement', ne: 'घोषणा पोस्ट गर्नुहोस्' },
  'annsub.sub': {
    en: 'Free for every business. We review each post before it goes live.',
    ne: 'हरेक व्यवसायका लागि नि:शुल्क। प्रत्यक्ष हुनुअघि हामी हरेक पोस्ट जाँच्छौं।',
  },
  'annsub.biz': { en: 'Business name', ne: 'व्यवसायको नाम' },
  'annsub.cat': { en: 'Category', ne: 'वर्ग' },
  'annsub.titleField': { en: 'Announcement title', ne: 'घोषणाको शीर्षक' },
  'annsub.titlePh': { en: 'e.g. Fresh sel roti every Saturday', ne: 'जस्तै: हरेक शनिबार ताजा सेलरोटी' },
  'annsub.details': { en: 'Details', ne: 'विवरण' },
  'annsub.detailsPh': { en: 'Dates, prices, anything useful…', ne: 'मिति, मूल्य, उपयोगी जानकारी…' },
  'annsub.contact': { en: 'Your contact (phone or WhatsApp)', ne: 'तपाईंको सम्पर्क (फोन वा व्हाट्सएप)' },
  'annsub.send': { en: 'Submit for review', ne: 'जाँचका लागि पठाउनुहोस्' },
  'annsub.ok': {
    en: "Received! We'll review it and post it soon.",
    ne: 'प्राप्त भयो! हामी जाँचेर चाँडै पोस्ट गर्नेछौं।',
  },
  'annsub.err': { en: 'Something went wrong. Please try again.', ne: 'केही गलत भयो। कृपया पुन: प्रयास गर्नुहोस्।' },
  'annsub.note': {
    en: 'No account needed. Posts go live after a quick review — usually within a day.',
    ne: 'खाता चाहिँदैन। छिटो जाँचपछि पोस्ट प्रत्यक्ष हुन्छ — सामान्यतया एक दिनभित्र।',
  },

  // reviews (public)
  'rev.name': { en: 'Your name', ne: 'तपाईंको नाम' },
  'rev.rating': { en: 'Rating', ne: 'मूल्याङ्कन' },
  'rev.text': { en: 'Your review', ne: 'तपाईंको समीक्षा' },
  'rev.textPh': { en: 'What was your experience like?', ne: 'तपाईंको अनुभव कस्तो रह्यो?' },
  'rev.send': { en: 'Submit review', ne: 'समीक्षा पठाउनुहोस्' },
  'rev.ok': {
    en: 'Thanks! Your review is waiting for approval.',
    ne: 'धन्यवाद! तपाईंको समीक्षा स्वीकृतिको प्रतीक्षामा छ।',
  },
  'rev.note': {
    en: 'Reviews are moderated to keep things fair.',
    ne: 'निष्पक्षताका लागि समीक्षाहरू जाँचिन्छन्।',
  },

  // feature my business
  'feat.title': { en: 'Feature my business', ne: 'मेरो व्यवसाय विशेष बनाउनुहोस्' },
  'feat.sub': {
    en: '$25/month. Get seen first by the whole community.',
    ne: '$२५/महिना। सम्पूर्ण समुदायले पहिले देख्नुहोस्।',
  },
  'feat.b1t': { en: 'Top of your category', ne: 'तपाईंको वर्गको शीर्षमा' },
  'feat.b1d': {
    en: 'Your listing appears first whenever someone browses your category.',
    ne: 'कसैले तपाईंको वर्ग हेर्दा तपाईंको सूची सबैभन्दा पहिले देखिन्छ।',
  },
  'feat.b2t': { en: 'Homepage carousel', ne: 'होमपेज क्यारोसेल' },
  'feat.b2d': {
    en: 'A rotating spot on the home page, seen by every visitor.',
    ne: 'होम पेजमा घुम्ने स्थान — हरेक आगन्तुकले देख्छ।',
  },
  'feat.b3t': { en: 'Featured badge', ne: 'विशेष ब्याज' },
  'feat.b3d': {
    en: 'A gold badge that marks you as a community favorite.',
    ne: 'तपाईंलाई समुदायको रोजाइ भनेर चिनाउने सुनौलो ब्याज।',
  },
  'feat.pay': { en: 'How to pay', ne: 'कसरी भुक्तानी गर्ने' },
  'feat.payd': {
    en: 'Pay $25/month by Zelle or Venmo. Then send the request below and mention your payment — we confirm and activate your spot, usually within a day.',
    ne: '$२५/महिना Zelle वा Venmo बाट तिर्नुहोस्। त्यसपछि तलको फारम पठाउनुहोस् र आफ्नो भुक्तानी उल्लेख गर्नुहोस् — हामी पुष्टि गरेर तपाईंको स्थान सक्रिय पार्नेछौं, सामान्यतया एक दिनभित्र।',
  },
  'feat.formTitle': { en: 'Request featured placement', ne: 'विशेष स्थानका लागि अनुरोध' },
  'feat.biz': { en: 'Business name', ne: 'व्यवसायको नाम' },
  'feat.contact': { en: 'Your contact (phone or WhatsApp)', ne: 'तपाईंको सम्पर्क (फोन वा व्हाट्सएप)' },
  'feat.msg': { en: 'Anything we should know (optional)', ne: 'हामीले जान्नुपर्ने केही छ? (वैकल्पिक)' },
  'feat.send': { en: 'Send request', ne: 'अनुरोध पठाउनुहोस्' },
  'feat.ok': {
    en: "Request received! We'll reach out to confirm your spot.",
    ne: 'अनुरोध प्राप्त भयो! तपाईंको स्थान पुष्टि गर्न हामी सम्पर्क गर्नेछौं।',
  },
  'feat.link': { en: 'Feature this business', ne: 'यो व्यवसाय विशेष बनाउनुहोस्' },
  'band.feat': { en: 'Get featured — $25/mo', ne: 'विशेष बन्नुहोस् — $२५/महिना' },

  // community spending survey
  'sv.cta': { en: 'Take the 2-minute survey', ne: '२-मिनेटको सर्वेक्षण भर्नुहोस्' },
  'sv.title': { en: 'Community spending survey', ne: 'सामुदायिक खर्च सर्वेक्षण' },
  'sv.sub': {
    en: '2 minutes. Help us understand how our community shops — so we build the right thing.',
    ne: '२ मिनेट। हाम्रो समुदायले कसरी किनमेल गर्छ बुझ्न मद्दत गर्नुहोस् — ताकि हामी सही कुरा बनाउन सकौं।',
  },
  'sv.answered': { en: '{n} of 8 answered', ne: '{n} / ८ उत्तर दिइयो' },
  'sv.optional': { en: 'optional', ne: 'वैकल्पिक' },
  'sv.q1': {
    en: 'Where did your household’s last ~$100 of desi groceries go?',
    ne: 'तपाईंको घरको पछिल्लो ~$१०० को देसी किराना कहाँ खर्च भयो?',
  },
  'sv.q1o1': { en: 'A desi store listed on Hamro Bazaar', ne: 'हाम्रो बजारमा सूचीबद्ध देसी पसल' },
  'sv.q1o2': { en: 'Another Nepali/Indian grocery store', ne: 'अर्को नेपाली/भारतीय किराना पसल' },
  'sv.q1o3': { en: 'A mainstream supermarket', ne: 'मुख्यधाराको सुपरमार्केट' },
  'sv.q1o4': { en: 'Online', ne: 'अनलाइन' },
  'sv.q1o5': { en: 'A mix of these', ne: 'यीमध्ये धेरै ठाउँ' },
  'sv.q2': {
    en: 'Where did your last service need go? (mechanic, tax, salon…)',
    ne: 'तपाईंको पछिल्लो सेवा आवश्यकता कहाँ गयो? (मेकानिक, कर, सैलुन…)',
  },
  'sv.q2o1': { en: 'A Nepali/Indian-owned business', ne: 'नेपाली/भारतीय स्वामित्वको व्यवसाय' },
  'sv.q2o2': { en: 'A mainstream business', ne: 'मुख्यधाराको व्यवसाय' },
  'sv.q2o3': { en: 'Did it myself / asked a friend', ne: 'आफैं गरें / साथीलाई सोधें' },
  'sv.q2o4': { en: 'Haven’t needed one recently', ne: 'हालसालै आवश्यक परेन' },
  'sv.q3': {
    en: 'How do you usually FIND a desi business today?',
    ne: 'तपाईं आजकल देसी व्यवसाय कसरी खोज्नुहुन्छ?',
  },
  'sv.q3o1': { en: 'WhatsApp group', ne: 'व्हाट्सएप ग्रुप' },
  'sv.q3o2': { en: 'Facebook', ne: 'फेसबुक' },
  'sv.q3o3': { en: 'Google / maps', ne: 'गुगल / नक्सा' },
  'sv.q3o4': { en: 'Friend or family', ne: 'साथी वा परिवार' },
  'sv.q3o5': { en: 'Hamro Bazaar', ne: 'हाम्रो बजार' },
  'sv.q4': {
    en: 'What would make you try a NEW desi business?',
    ne: 'तपाईंलाई नयाँ देसी व्यवसाय प्रयास गर्न के ले उत्प्रेरित गर्छ?',
  },
  'sv.q4ph': { en: 'Optional — a sentence or two is plenty', ne: 'वैकल्पिक — एक-दुई वाक्य पर्याप्त छ' },
  'sv.q5': {
    en: 'Would you order groceries or book services online if it were in Nepali or Hindi?',
    ne: 'नेपाली वा हिन्दीमा भए किराना अनलाइन अर्डर वा सेवा बुक गर्नुहुन्छ?',
  },
  'sv.q5o1': { en: 'Yes', ne: 'हुन्छ' },
  'sv.q5o2': { en: 'Maybe', ne: 'सायद' },
  'sv.q5o3': { en: 'No', ne: 'हुँदैन' },
  'sv.q6': { en: 'Home zip code', ne: 'घरको जिप कोड' },
  'sv.q6ph': { en: 'e.g. 15236', ne: 'जस्तै: 15236' },
  'sv.q7': { en: 'Preferred language', ne: 'रुचाइएको भाषा' },
  'sv.q7o1': { en: 'Nepali', ne: 'नेपाली' },
  'sv.q7o2': { en: 'Hindi', ne: 'हिन्दी' },
  'sv.q7o3': { en: 'English', ne: 'अंग्रेजी' },
  'sv.q8': { en: 'Phone', ne: 'फोन' },
  'sv.q8note': {
    en: 'Optional — only for the raffle. We never share it.',
    ne: 'वैकल्पिक — केवल चिट्ठाका लागि। हामी कहिल्यै साझा गर्दैनौं।',
  },
  'sv.send': { en: 'Submit survey', ne: 'सर्वेक्षण पठाउनुहोस्' },
  'sv.ok': {
    en: 'Thank you! Your answers help us build what the community actually wants.',
    ne: 'धन्यवाद! तपाईंका उत्तरहरूले समुदायले साँच्चै चाहेको कुरा बनाउन मद्दत गर्छ।',
  },
  'sv.err': { en: 'Something went wrong. Please try again.', ne: 'केही गलत भयो। कृपया पुन: प्रयास गर्नुहोस्।' },
  'sv.note': {
    en: 'No account needed. Anonymous unless you share your phone.',
    ne: 'खाता चाहिँदैन। फोन नदिएसम्म गोप्य रहन्छ।',
  },
  // footer columns
  'foot.explore': { en: 'Explore', ne: 'अन्वेषण' },
  'foot.owners': { en: 'For owners', ne: 'व्यवसायीहरूका लागि' },
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
