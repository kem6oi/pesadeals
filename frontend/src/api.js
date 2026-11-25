// Client-side API helper & Click Tracking handler
const getBackendUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return 'https://pesadeals.duckdns.org';
};

export const API_BASE = getBackendUrl();

// Retrieve or generate persistent visitor ID
export const getVisitorId = () => {
  if (typeof window === 'undefined') return 'anon';
  let vid = localStorage.getItem('pesadeals_vid');
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('pesadeals_vid', vid);
  }
  return vid;
};

// Parse and persist URL UTM/ad tracking params across client-side navigation
export const getTrackingParams = () => {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const urlUtms = {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || '',
    fbclid: params.get('fbclid') || ''
  };

  // Persist initial attribution in sessionStorage so clicks after navigating to / are still attributed to the ad
  if (urlUtms.utm_source || urlUtms.fbclid || urlUtms.utm_campaign) {
    sessionStorage.setItem('pesadeals_utms', JSON.stringify(urlUtms));
    return urlUtms;
  }

  try {
    const saved = sessionStorage.getItem('pesadeals_utms');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // ignore storage errors
  }

  return urlUtms;
};

// Detect if visitor session originated from Meta Ads (used for subtle UI badge & attribution)
export const isMetaTraffic = () => {
  if (typeof window === 'undefined') return false;
  const { utm_source, fbclid } = getTrackingParams();
  const ref = (document.referrer || '').toLowerCase();
  const src = (utm_source || '').toLowerCase();

  return (
    Boolean(fbclid) ||
    src.includes('meta') ||
    src.includes('facebook') ||
    src === 'fb' ||
    src.startsWith('fb_') ||
    src === 'ig' ||
    src.startsWith('ig_') ||
    src.includes('instagram') ||
    ref.includes('facebook.com') ||
    ref.includes('instagram.com') ||
    ref.includes('fb.com')
  );
};

// Fetch all active deals for the catalog
export const fetchDeals = async (category = 'all', search = '') => {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (search) params.append('search', search);

  // Only enforce meta_safe=1 if explicitly requested in the URL (?meta_safe=1)
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('meta_safe') === '1') {
      params.append('meta_safe', '1');
    }
  }

  try {
    const res = await fetch(`${API_BASE}/api/deals?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load deals');
    return await res.json();
  } catch (err) {
    console.error('API error:', err);
    return { deals: [], count: 0 };
  }
};

// Fetch single deal by slug
export const fetchDealBySlug = async (slug) => {
  try {
    const res = await fetch(`${API_BASE}/api/deals/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.deal;
  } catch (err) {
    console.error('API error fetching deal:', err);
    return null;
  }
};

// Track link click and redirect
export const trackAndOpenDeal = async (deal) => {
  const tracking = getTrackingParams();
  const visitorId = getVisitorId();

  try {
    const res = await fetch(`${API_BASE}/api/deals/${deal.id}/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Visitor-Id': visitorId
      },
      body: JSON.stringify({
        visitor_id: visitorId,
        referrer: document.referrer || '',
        ...tracking
      })
    });

    const data = await res.json();
    const destination = data.targetUrl || deal.affiliate_url;
    window.open(destination, '_blank', 'noopener,noreferrer');
    return destination;
  } catch (err) {
    console.error('Click tracking error, opening direct url:', err);
    window.open(deal.affiliate_url, '_blank', 'noopener,noreferrer');
    return deal.affiliate_url;
  }
};
