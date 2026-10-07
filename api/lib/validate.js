// Server-side input validation for every admin write. Never trust the client.
export const CATEGORIES = [
  'restaurant', 'grocery', 'home_care', 'real_estate',
  'tax_service', 'loan_officer', 'insurance', 'other',
];

function str(v, max) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (s.length > max) throw new Error(`value too long (max ${max} chars)`);
  return s;
}

function strArray(v, maxItems, maxLen) {
  if (!Array.isArray(v)) return [];
  if (v.length > maxItems) throw new Error('too many items');
  return v.map((s) => {
    const t = String(s).trim();
    if (t.length > maxLen) throw new Error('item too long');
    return t;
  }).filter(Boolean);
}

export function validateListing(input, { isUpdate = false } = {}) {
  const name = str(input.name, 120);
  if (!name) throw new Error('name is required');
  const category = str(input.category, 30);
  if (!CATEGORIES.includes(category)) throw new Error('invalid category');

  const phone = str(input.phone, 25) || '';
  if (phone && !/^[\d\s()+.\-]{7,25}$/.test(phone)) throw new Error('invalid phone');

  const website = str(input.website, 300) || '';
  if (website && !/^https?:\/\//i.test(website)) throw new Error('website must start with http:// or https://');

  return {
    name,
    category,
    phone,
    address: str(input.address, 200) || '',
    website,
    hours: str(input.hours, 200),
    services: strArray(input.services, 20, 80),
    languages: strArray(input.languages, 10, 40),
  };
}

export function validateAnnouncement(input) {
  const title_en = str(input.title_en, 200);
  const title_ne = str(input.title_ne, 200);
  if (!title_en) throw new Error('English title is required');
  if (!title_ne) throw new Error('Nepali title is required');
  const category = str(input.category, 30);
  if (!CATEGORIES.includes(category)) throw new Error('invalid category');
  return {
    title: { en: title_en, ne: title_ne },
    category,
    published: input.published !== false,
  };
}

export function newId(name, phone) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'listing';
  const rand = Math.random().toString(36).slice(2, 6);
  return `${slug}-${rand}`;
}
