// Data access layer — the ONLY module that touches listings/announcements JSON.
// Swap this file's internals for a real DB client later; pages/components must not
// import the JSON files directly.
import listings from '../data/listings.json';
import announcements from '../data/announcements.json';

export const CATEGORIES = [
  'restaurant',
  'grocery',
  'home_care',
  'real_estate',
  'tax_service',
  'loan_officer',
  'insurance',
  'other',
];

export function getListings() {
  return listings;
}

export function getListing(id) {
  return listings.find((l) => l.id === id) || null;
}

export function getFeatured() {
  return listings.filter((l) => l.featured);
}

export function searchListings(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return listings;
  return listings.filter((l) =>
    [l.name, l.address, l.category].join(' ').toLowerCase().includes(q)
  );
}

export function filterListings({ category, neighborhood, openNow } = {}) {
  return listings.filter((l) => {
    if (category && category !== 'all' && l.category !== category) return false;
    if (neighborhood && neighborhood !== 'all' && neighborhoodOf(l) !== neighborhood)
      return false;
    // Honest v1: "open now" is backed by owner-reported hours only.
    // Listings without hours are excluded rather than guessed.
    if (openNow && !l.hours) return false;
    return true;
  });
}

export function countByCategory() {
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
  for (const l of listings) {
    if (counts[l.category] !== undefined) counts[l.category] += 1;
  }
  return counts;
}

export function neighborhoodOf(listing) {
  const m = /,\s*([A-Za-z .'-]+),\s*PA/i.exec(listing.address || '');
  return m ? m[1].trim() : 'Pittsburgh';
}

export function neighborhoods() {
  const set = new Set(listings.map(neighborhoodOf));
  return [...set].sort();
}

export function getAnnouncements({ publishedOnly = true } = {}) {
  const rows = publishedOnly ? announcements.filter((a) => a.published) : announcements;
  return [...rows].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

export function categoryLabel(category, lang = 'en') {
  const labels = {
    restaurant: { en: 'Restaurants & Momo', ne: 'रेस्टुरेन्ट र म:म' },
    grocery: { en: 'Grocery', ne: 'किराना पसल' },
    home_care: { en: 'Home Care', ne: 'होम केयर' },
    real_estate: { en: 'Real Estate', ne: 'घरजग्गा' },
    tax_service: { en: 'Tax Services', ne: 'कर सेवा' },
    loan_officer: { en: 'Loans', ne: 'ऋण सेवा' },
    insurance: { en: 'Insurance', ne: 'बीमा' },
    other: { en: 'Other Services', ne: 'अन्य सेवा' },
  };
  return (labels[category] || labels.other)[lang] || labels[category].en;
}
