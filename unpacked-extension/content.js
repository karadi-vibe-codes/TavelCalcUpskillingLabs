// content.js — runs on Google Maps pages, lets the popup import the current route

function parseGoogleMapsRoute() {
  const url = window.location.href;
  let origin = null, destination = null;

  // Strategy 1: Read the visible directions input fields Google renders on the page.
  const inputs = document.querySelectorAll('input[aria-label], input[placeholder]');
  const startInput = [...inputs].find(el => {
    const label = (el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').toLowerCase();
    return label.includes('starting point') || label.includes('origin') || label.includes('from');
  });
  const endInput = [...inputs].find(el => {
    const label = (el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').toLowerCase();
    return label.includes('destination') || label.includes('end point');
  });

  if (startInput && startInput.value.trim()) origin = startInput.value.trim();
  if (endInput && endInput !== startInput && endInput.value.trim()) destination = endInput.value.trim();

  // Positional fallback: take all filled directions inputs in DOM order.
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

  // Strategy 2: Clean /maps/dir/ORIGIN/DESTINATION/ URL slugs.
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

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_MAPS_ROUTE') {
    sendResponse({ route: parseGoogleMapsRoute() });
  }
});
