// Link builders. Every tel:/wa.me/maps URL on the site comes from here,
// so QA can verify them mechanically against listings.json.
export function digits(phone) {
  return (phone || '').replace(/\D/g, '');
}

export function telLink(phone) {
  const d = digits(phone);
  if (!d) return null;
  const intl = d.length === 10 ? `1${d}` : d;
  return `tel:+${intl}`;
}

export function waLink(phone, message = '') {
  const d = digits(phone);
  if (!d) return null;
  const intl = d.length === 10 ? `1${d}` : d;
  const base = `https://wa.me/${intl}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function mapsLink(address) {
  if (!address) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function waGreeting(listing, lang = 'en') {
  const name = listing.name;
  return lang === 'ne'
    ? `नमस्ते! मैले हाम्रो बजारमा "${name}" भेटें।`
    : `Hello! I found "${name}" on Hamro Bazaar.`;
}
