// content.js — runs on Google Maps pages

// ── READ ROUTE FROM GOOGLE MAPS ──────────────────────────────────────────────
function parseGoogleMapsRoute() {
  const url = window.location.href;
  let origin = null, destination = null;

  // Diagnostic: log all inputs found on the page
  const allInputs = document.querySelectorAll('input');
  console.log('[DC Green] All inputs found:', allInputs.length);
  allInputs.forEach((el, i) => {
    console.log(`[DC Green] Input ${i}:`, {
      id: el.id,
      name: el.name,
      type: el.type,
      ariaLabel: el.getAttribute('aria-label'),
      placeholder: el.getAttribute('placeholder'),
      value: el.value,
      class: el.className
    });
  });

  // Strategy 1: Read the visible input fields Google renders on the page.
  const inputs = document.querySelectorAll('input[aria-label], input[placeholder]');
  const startInput = [...inputs].find(el => {
    const label = (el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').toLowerCase();
    return label.includes('starting point') || label.includes('origin') || label.includes('from');
  });
  const endInput = [...inputs].find(el => {
    const label = (el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').toLowerCase();
    return label.includes('destination') || label.includes('end point');
  });

  console.log('[DC Green] startInput:', startInput ? { label: startInput.getAttribute('aria-label'), value: startInput.value } : null);
  console.log('[DC Green] endInput:', endInput ? { label: endInput.getAttribute('aria-label'), value: endInput.value } : null);

  if (startInput && startInput.value.trim()) origin = startInput.value.trim();
  if (endInput && endInput !== startInput && endInput.value.trim()) destination = endInput.value.trim();

  // Positional fallback: if label matching didn't find two distinct filled inputs,
  // take all filled directions inputs in DOM order — first = origin, second = destination.
  if (!origin || !destination) {
    const allDirInputs = [...document.querySelectorAll('input')].filter(el => {
      const label = (el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').toLowerCase();
      return (label.includes('point') || label.includes('destination') || label.includes('origin') ||
              label.includes('from') || label.includes('starting') || label.includes('search')) &&
             el.value.trim();
    });
    if (!origin      && allDirInputs[0]) origin      = allDirInputs[0].value.trim();
    if (!destination && allDirInputs[1]) destination = allDirInputs[1].value.trim();
  }

  // Strategy 2: Clean /maps/dir/ORIGIN/DESTINATION/ URL slugs (older-style URLs).
  if (!origin || !destination) {
    const dirMatch = url.match(/maps\/dir\/([^?#]+)/);
    if (dirMatch) {
      const segments = dirMatch[1]
        .split('/')
        .map(s => decodeURIComponent(s.replace(/\+/g, ' ')).trim())
        .filter(s =>
          s && s !== 'data' && !s.startsWith('!') && !s.startsWith('@') &&
          !/^[a-z]{1,2}$/.test(s) && !/^data=/.test(s) && !/^[\d,@]/.test(s)
        );
      if (!origin      && segments[0]) origin      = segments[0].replace(/@[\d.,\-]+$/, '').trim();
      if (!destination && segments.length > 1)
        destination = segments[segments.length - 1].replace(/@[\d.,\-]+$/, '').trim();
    }
  }

  // Strategy 3: ?origin=&destination= query params.
  if (!origin || !destination) {
    const params = new URLSearchParams(window.location.search);
    if (!origin)      origin      = params.get('origin')      || params.get('saddr') || null;
    if (!destination) destination = params.get('destination') || params.get('daddr') || null;
    if (origin)      origin      = decodeURIComponent(origin).replace(/\+/g, ' ').trim();
    if (destination) destination = decodeURIComponent(destination).replace(/\+/g, ' ').trim();
  }

  // Reject garbage values (encoded data blobs, empty strings, etc.)
  const isGarbage = s => !s || s === 'data' || s.startsWith('!') || s.startsWith('data=') || s.length > 120;
  if (isGarbage(origin))      origin      = null;
  if (isGarbage(destination)) destination = null;

  if (!origin && !destination) return null;
  return { origin, destination };
}

// ── INJECT CARBON BADGE ───────────────────────────────────────────────────────
function injectCarbonBadge(data) {
  const existing = document.getElementById('dc-green-travel-badge');
  if (existing) existing.remove();

  const badge = document.createElement('div');
  badge.id = 'dc-green-travel-badge';
  badge.innerHTML = `
    <div style="
      position: fixed; bottom: 24px; left: 24px; z-index: 99999;
      background: #fff; border: 1.5px solid #1D9E75; border-radius: 12px;
      padding: 12px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px; color: #1a1a18; max-width: 280px; line-height: 1.4;
    ">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="background:#1D9E75;color:#fff;border-radius:6px;padding:3px 7px;font-size:11px;font-weight:600;">🌿 Green Travel</span>
        <span style="font-size:11px;color:#888;">${data.from} → ${data.to}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
        <div style="background:#E1F5EE;border-radius:8px;padding:8px 10px;text-align:center;">
          <div style="font-size:18px;font-weight:600;color:#0F6E56;">${data.bestMode}</div>
          <div style="font-size:10px;color:#085041;margin-top:2px;">Greenest option</div>
        </div>
        <div style="background:#f5f5f0;border-radius:8px;padding:8px 10px;text-align:center;">
          <div style="font-size:18px;font-weight:600;color:#1a1a18;">${data.co2Saved}</div>
          <div style="font-size:10px;color:#888;margin-top:2px;">CO₂ saved vs. car</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
        <div style="background:#f5f5f0;border-radius:8px;padding:6px 10px;text-align:center;">
          <div style="font-size:14px;font-weight:600;color:#1a1a18;">${data.moneySaved}</div>
          <div style="font-size:10px;color:#888;margin-top:1px;">saved per ${data.freqLabel}</div>
        </div>
        <div style="background:#f5f5f0;border-radius:8px;padding:6px 10px;text-align:center;">
          <div style="font-size:14px;font-weight:600;color:#1a1a18;">${data.trees}</div>
          <div style="font-size:10px;color:#888;margin-top:1px;">trees impacted/yr</div>
        </div>
      </div>
      <div style="font-size:11px;color:#888;text-align:center;">Powered by DC Green Travel Planner</div>
      <button id="dc-green-close-btn" style="
        position:absolute;top:8px;right:10px;background:none;border:none;
        font-size:16px;color:#bbb;cursor:pointer;line-height:1;padding:2px 5px;
      ">✕</button>
    </div>
  `;
  document.body.appendChild(badge);
  document.getElementById('dc-green-close-btn').addEventListener('click', () => badge.remove());
  setTimeout(() => { if (badge.parentNode) badge.remove(); }, 30000);
}

// ── MESSAGE LISTENER ──────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_MAPS_ROUTE') {
    const route = parseGoogleMapsRoute();
    sendResponse({ route });
  }
  if (msg.type === 'SHOW_CARBON_BADGE') {
    injectCarbonBadge(msg.data);
    sendResponse({ ok: true });
  }
});
