const MODES={
  walk:     {label:'Walking',      icon:'ti-walk',           co2pm:0,   costPm:0,     mph:3,  color:'#1D9E75',textCol:'#085041',score:100},
  bike:     {label:'Bike/Scooter', icon:'ti-bike',           co2pm:5,   costPm:0.10,  mph:10, color:'#639922',textCol:'#27500A',score:92},
  metro:    {label:'Metro/Rail',   icon:'ti-train',          co2pm:41,  costPm:0.18,  mph:22, color:'#378ADD',textCol:'#0C447C',score:80},
  bus:      {label:'Bus',          icon:'ti-bus',            co2pm:68,  costPm:0.12,  mph:14, color:'#5DCAA5',textCol:'#085041',score:70},
  rideshare:{label:'Rideshare',    icon:'ti-car',            co2pm:217, costPm:1.80,  mph:20, color:'#EF9F27',textCol:'#633806',score:42},
  car:      {label:'Personal car', icon:'ti-steering-wheel', co2pm:403, costPm:0.655, mph:18, color:'#E24B4A',textCol:'#501313',score:18},
};

// Coordinates for distance calculation (lat, lng)
const COORDS={
  'Adams Morgan':[38.921,-77.043],'Anacostia':[38.862,-76.982],'Brookland':[38.934,-76.994],
  'Capitol Hill':[38.888,-76.996],'Chinatown':[38.899,-77.022],'Columbia Heights':[38.928,-77.036],
  'Dupont Circle':[38.910,-77.043],'Eastern Market':[38.884,-76.997],'Foggy Bottom':[38.899,-77.056],
  'Georgetown':[38.906,-77.073],'H Street NE':[38.899,-76.995],'Logan Circle':[38.910,-77.031],
  'Mount Vernon Square':[38.905,-77.022],'Navy Yard':[38.876,-77.003],'NoMa':[38.907,-77.003],
  'Penn Quarter':[38.895,-77.022],'Petworth':[38.940,-77.022],'Shaw':[38.912,-77.022],
  'Tenleytown':[38.948,-77.079],'The Wharf':[38.876,-77.022],'U Street':[38.917,-77.032],
  'Woodley Park':[38.924,-77.052],
  'National Mall':[38.889,-77.035],'Union Station':[38.898,-77.007],'Convention Center':[38.905,-77.022],
  'Capital One Arena':[38.898,-77.021],'Nationals Park':[38.873,-77.008],
  'Reagan Airport (DCA)':[38.852,-77.037],'Howard University':[38.922,-77.020],
  'Georgetown University':[38.907,-77.073],'GW University':[38.900,-77.048],
  'Walter Reed Med. Ctr':[38.983,-77.031],
  'Alexandria, VA':[38.805,-77.047],'Arlington, VA':[38.880,-77.100],'Ballston, VA':[38.882,-77.112],
  'Crystal City, VA':[38.857,-77.050],'Falls Church, VA':[38.882,-77.171],'McLean, VA':[38.934,-77.177],
  'Rosslyn, VA':[38.896,-77.071],'Tysons Corner, VA':[38.919,-77.231],'Vienna, VA':[38.901,-77.265],
  'Annandale, VA':[38.830,-77.196],'Burke, VA':[38.784,-77.271],'Centreville, VA':[38.840,-77.429],
  'Chantilly, VA':[38.895,-77.432],'Dale City, VA':[38.638,-77.348],'Fairfax, VA':[38.846,-77.306],
  'Herndon, VA':[38.970,-77.386],'Leesburg, VA':[39.115,-77.563],'Manassas, VA':[38.751,-77.476],
  'Reston, VA':[38.968,-77.341],'Springfield, VA':[38.789,-77.188],'Woodbridge, VA':[38.658,-77.250],
  'Dulles Airport (IAD)':[38.944,-77.456],'Fredericksburg, VA':[38.301,-77.461],
  'Warrenton, VA':[38.721,-77.796],'Winchester, VA':[39.186,-78.164],
  'Bethesda, MD':[38.981,-77.096],'Chevy Chase, MD':[38.968,-77.078],'College Park, MD':[38.981,-76.937],
  'Greenbelt, MD':[39.004,-76.876],'Hyattsville, MD':[38.956,-76.945],'Rockville, MD':[39.084,-77.153],
  'Silver Spring, MD':[38.994,-77.031],'Takoma Park, MD':[38.978,-77.002],'Wheaton, MD':[39.044,-77.057],
  'Annapolis, MD':[38.978,-76.492],'Bowie, MD':[38.942,-76.729],'BWI Airport':[39.177,-76.668],
  'Frederick, MD':[39.414,-77.411],'Gaithersburg, MD':[39.143,-77.201],'Germantown, MD':[39.173,-77.272],
  'Hagerstown, MD':[39.641,-77.720],'Laurel, MD':[39.099,-76.848],'La Plata, MD':[38.527,-76.975],
  'Upper Marlboro, MD':[38.819,-76.749],'Waldorf, MD':[38.624,-76.921],
  'Charles Town, WV':[39.290,-77.860],'Harpers Ferry, WV':[39.325,-77.740],'Martinsburg, WV':[39.457,-77.964],
  'Gettysburg, PA':[39.831,-77.231],'Lancaster, PA':[40.038,-76.306],
  'Newark, DE':[39.683,-75.750],'Wilmington, DE':[39.745,-75.547],'York, PA':[39.962,-76.728],
};

function haversineMiles(a,b){
  const c=COORDS[a],d=COORDS[b];if(!c||!d)return null;
  const R=3958.8,dLat=(d[0]-c[0])*Math.PI/180,dLon=(d[1]-c[1])*Math.PI/180;
  const x=Math.sin(dLat/2)**2+Math.cos(c[0]*Math.PI/180)*Math.cos(d[0]*Math.PI/180)*Math.sin(dLon/2)**2;
  return parseFloat((R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))).toFixed(1));
}

function getDist(a,b){
  if(!a||!b)return null;
  const lut=(DIST[a]&&DIST[a][b])||(DIST[b]&&DIST[b][a])||null;
  return lut||haversineMiles(a,b);
}

const DIST={
  'Capitol Hill':{'Georgetown':4,'Dupont Circle':2.5,'Adams Morgan':3,'Navy Yard':1.5,'H Street NE':1.5,'National Mall':1.2,'Union Station':1,'Convention Center':1.8,'Nationals Park':1.8,'Capital One Arena':1.5,'Foggy Bottom':3,'Shaw':2,'U Street':2.5,'Tenleytown':6,'Brookland':3,'Anacostia':3,'Reston, VA':25,'Arlington, VA':5,'Bethesda, MD':10,'Silver Spring, MD':8,'Reagan Airport (DCA)':7,'Dulles Airport (IAD)':28,'Walter Reed Med. Ctr':6,'Howard University':3,'Georgetown University':5,'GW University':3,'The Wharf':3},
  'Georgetown':{'Dupont Circle':1.5,'Adams Morgan':2.5,'Foggy Bottom':1,'National Mall':3,'Convention Center':4,'Capitol Hill':4,'Navy Yard':5,'Union Station':4.5,'Reagan Airport (DCA)':8,'Dulles Airport (IAD)':26,'Reston, VA':22,'Arlington, VA':5,'Bethesda, MD':8,'Silver Spring, MD':13,'Tenleytown':3,'U Street':3,'Shaw':4,'Howard University':5,'Georgetown University':0.5,'GW University':1,'The Wharf':4,'Anacostia':7,'Brookland':6,'H Street NE':4.5,'Nationals Park':5,'Capital One Arena':4,'Walter Reed Med. Ctr':5},
  'Dupont Circle':{'Adams Morgan':1,'Georgetown':1.5,'Foggy Bottom':1.5,'National Mall':2,'Convention Center':1.5,'Capitol Hill':2.5,'Navy Yard':4,'Shaw':1,'U Street':1,'Tenleytown':4,'Reston, VA':23,'Arlington, VA':5,'Bethesda, MD':7,'Silver Spring, MD':8,'Reagan Airport (DCA)':7,'Dulles Airport (IAD)':27,'Union Station':2,'Howard University':2.5,'Georgetown University':2,'GW University':1.5,'The Wharf':3,'Anacostia':6,'Brookland':4,'H Street NE':3,'Nationals Park':4,'Capital One Arena':2,'Walter Reed Med. Ctr':4},
  'National Mall':{'Union Station':2,'Convention Center':1.5,'Capitol Hill':1.2,'Georgetown':3,'Dupont Circle':2,'Foggy Bottom':1.5,'Navy Yard':2.5,'Reagan Airport (DCA)':6,'Dulles Airport (IAD)':27,'Arlington, VA':4,'Reston, VA':24,'Bethesda, MD':9,'Silver Spring, MD':9,'The Wharf':2,'GW University':1.5},
  'Union Station':{'Capitol Hill':1,'Convention Center':1,'National Mall':2,'Georgetown':4.5,'Dupont Circle':2,'Adams Morgan':3,'Shaw':1.5,'H Street NE':1,'Brookland':3,'Howard University':2,'Reagan Airport (DCA)':7,'Silver Spring, MD':8},
  'Reagan Airport (DCA)':{'Capitol Hill':7,'Georgetown':8,'National Mall':6,'Convention Center':7,'Arlington, VA':4,'Reston, VA':20,'The Wharf':5,'Navy Yard':7,'Dupont Circle':7,'Foggy Bottom':6,'Alexandria, VA':3,'Crystal City, VA':1},
  'Dulles Airport (IAD)':{'Reston, VA':7,'Herndon, VA':5,'Chantilly, VA':6,'Georgetown':26,'Arlington, VA':22,'Capitol Hill':28,'National Mall':27,'Convention Center':27,'Dupont Circle':27,'Tysons Corner, VA':12,'McLean, VA':15},
  'Reston, VA':{'Arlington, VA':12,'Georgetown':22,'Capitol Hill':25,'Dulles Airport (IAD)':7,'National Mall':24,'Convention Center':25,'Bethesda, MD':18,'Silver Spring, MD':22,'Dupont Circle':23,'Foggy Bottom':22,'Reagan Airport (DCA)':20,'Herndon, VA':4,'Tysons Corner, VA':8,'Vienna, VA':7,'Fairfax, VA':8,'Chantilly, VA':8,'Leesburg, VA':18},
  'Arlington, VA':{'Georgetown':5,'Capitol Hill':5,'National Mall':4,'Dupont Circle':5,'Reston, VA':12,'Reagan Airport (DCA)':4,'Foggy Bottom':4,'Convention Center':6,'Navy Yard':6,'The Wharf':5,'Rosslyn, VA':1,'Ballston, VA':3,'Crystal City, VA':3,'Alexandria, VA':5,'Falls Church, VA':5,'McLean, VA':6,'Tysons Corner, VA':10},
  'Bethesda, MD':{'Dupont Circle':7,'Georgetown':8,'Capitol Hill':10,'National Mall':9,'Silver Spring, MD':8,'Reston, VA':18,'Convention Center':8,'Foggy Bottom':8,'Tenleytown':4,'Chevy Chase, MD':2,'Rockville, MD':6,'Wheaton, MD':6,'Gaithersburg, MD':15},
  'Silver Spring, MD':{'Dupont Circle':8,'Capitol Hill':8,'Union Station':8,'Brookland':5,'Howard University':6,'Bethesda, MD':8,'Reston, VA':22,'National Mall':9,'Takoma Park, MD':2,'Wheaton, MD':4,'College Park, MD':8,'Greenbelt, MD':10},
  'The Wharf':{'National Mall':2,'Capitol Hill':3,'Navy Yard':2,'Georgetown':4,'Arlington, VA':5,'Reagan Airport (DCA)':5,'Foggy Bottom':2,'Anacostia':4},
  'Convention Center':{'Capitol Hill':1.8,'Union Station':1,'National Mall':1.5,'Dupont Circle':1.5,'Shaw':0.8,'Howard University':2,'H Street NE':1.5,'Mount Vernon Square':0.3,'Penn Quarter':0.5},
  'Foggy Bottom':{'Georgetown':1,'GW University':0.5,'Dupont Circle':1.5,'National Mall':1.5,'Arlington, VA':4,'The Wharf':2,'Rosslyn, VA':1.5},
  'Adams Morgan':{'Dupont Circle':1,'U Street':1,'Shaw':1.5,'Georgetown':2.5,'Columbia Heights':1,'Woodley Park':1.5},
  'Shaw':{'U Street':0.5,'Dupont Circle':1,'Convention Center':0.8,'Howard University':1.5,'H Street NE':2,'Logan Circle':0.8,'Columbia Heights':1.5},
  'Navy Yard':{'Capitol Hill':1.5,'Nationals Park':0.5,'The Wharf':2,'Anacostia':2.5,'Eastern Market':1.5},
  'Alexandria, VA':{'Reagan Airport (DCA)':3,'Crystal City, VA':2,'Arlington, VA':5,'Springfield, VA':7,'Woodbridge, VA':15,'Annandale, VA':8,'Mount Vernon':6},
  'Tysons Corner, VA':{'McLean, VA':4,'Vienna, VA':4,'Falls Church, VA':5,'Arlington, VA':10,'Reston, VA':8,'Fairfax, VA':8,'Dulles Airport (IAD)':12},
  'Fredericksburg, VA':{'Woodbridge, VA':20,'Dale City, VA':15,'Capitol Hill':52,'Reagan Airport (DCA)':48,'Stafford, VA':10},
  'Annapolis, MD':{'Bowie, MD':16,'Upper Marlboro, MD':18,'BWI Airport':22,'College Park, MD':25,'Capitol Hill':33},
  'Frederick, MD':{'Gaithersburg, MD':22,'Germantown, MD':18,'Hagerstown, MD':28,'Bethesda, MD':30,'Capitol Hill':52},
  'BWI Airport':{'Annapolis, MD':22,'Laurel, MD':12,'Greenbelt, MD':14,'College Park, MD':16,'Silver Spring, MD':22,'Capitol Hill':32},
  'Martinsburg, WV':{'Charles Town, WV':12,'Harpers Ferry, WV':14,'Hagerstown, MD':18,'Winchester, VA':22,'Frederick, MD':35},
};



function runCompare() {
  const from = document.getElementById('from-loc').value.trim();
  const to   = document.getElementById('to-loc').value.trim();
  if (!from || !to) { alert('Please enter or import a starting point and destination.'); return; }
  if (from.toLowerCase() === to.toLowerCase()) { alert('Starting point and destination cannot be the same.'); return; }

  const freq        = parseInt(document.getElementById('freq').value);
  const baselineKey = document.getElementById('baseline').value;
  const straightDist = getDist(from, to) || 5;
  const freqLabel   = {1:'trip',5:'week',22:'month',260:'year'}[freq] || 'period';

  const results = Object.keys(MODES).map(key => {
    const m = MODES[key];
    const co2g     = m.co2pm   * straightDist * freq;
    const costD    = m.costPm  * straightDist * freq;
    const timeMins = (straightDist / m.mph) * 60 * freq;
    const trees    = co2g === 0 ? 0 : parseFloat(((co2g) / 1000 / 21).toFixed(3));
    return { key, label:m.label, icon:m.icon, color:m.color, textCol:m.textCol,
             score:m.score, co2g, costD, timeMins, trees, savings:0 };
  });

  const baseline = results.find(r => r.key === baselineKey);
  results.forEach(r => {
    r.savings   = Math.max(0, baseline.costD - r.costD);
    r.co2saved  = Math.max(0, baseline.co2g  - r.co2g);
  });

  const best        = results.reduce((a,b) => a.score > b.score ? a : b);
  const bestSaving  = baseline.costD - best.costD;
  const co2Saving   = baseline.co2g  - best.co2g;

  document.getElementById('baseline-lbl').textContent = MODES[baselineKey].label.toLowerCase();

  document.getElementById('savings-banner').innerHTML =
    '<div style="font-size:24px;flex-shrink:0;"><i class="ti ti-plant-2" style="color:#1D9E75;"></i></div>' +
    '<div style="flex:1;">' +
      '<div style="display:flex;gap:16px;flex-wrap:wrap;">' +
        '<div><div class="sav-big">' + (bestSaving>0 ? '$'+bestSaving.toFixed(0)+' saved' : 'Free!') + '</div>' +
        '<div class="sav-sub">vs. ' + MODES[baselineKey].label + ' per ' + freqLabel + ' → ' + best.label + '</div></div>' +
        '<div><div class="sav-big">' + (co2Saving>0 ? (co2Saving<1000?Math.round(co2Saving)+'g':(co2Saving/1000).toFixed(1)+'kg')+' CO₂' : '0g CO₂') + '</div>' +
        '<div class="sav-sub">carbon saved per ' + freqLabel + '</div></div>' +
      '</div>' +
    '</div>';

  const fmtT = v => v < 0.01 ? '~0' : v < 1 ? v.toFixed(2) : v.toFixed(1);
  document.getElementById('metrics-row').innerHTML =
    '<div class="mc"><div class="mc-icon">🌳</div><div class="mc-val">' + fmtT(best.trees) + '</div><div class="mc-lbl">trees/yr — ' + best.label + '</div></div>' +
    '<div class="mc"><div class="mc-icon">🌳</div><div class="mc-val">' + fmtT(baseline.trees) + '</div><div class="mc-lbl">trees/yr — ' + MODES[baselineKey].label + '</div></div>' +
    '<div class="mc"><div class="mc-icon">📍</div><div class="mc-val">' + straightDist.toFixed(1) + ' mi</div><div class="mc-lbl">distance</div></div>';

  lastResults = { results, freq, freqLabel, baseline, best, straightDist, from, to, baselineKey };
  renderTable(results, freqLabel);

  const tips = {
    walk:'Walking generates zero emissions — perfect for trips under 2 miles.',
    bike:'Capital Bikeshare has 700+ stations across DC, Arlington & Alexandria.',
    metro:'WMATA Metro emits ~90% less CO₂ than driving solo.',
    bus:'DC Circulator + Metrobus are affordable and low-carbon.',
    rideshare:'Pooled rideshares cut emissions nearly in half.',
    car:'Carpooling or switching to an EV dramatically reduces carbon per mile.'
  };
  document.getElementById('tip-txt').textContent = tips[best.key];

  document.getElementById('share-text').textContent = [
    'Route: ' + from + ' → ' + to + ' | ' + freqLabel,
    'Greenest: ' + best.label + ' (score ' + best.score + '/100)',
    'CO₂ saved vs. ' + MODES[baselineKey].label + ': ' + (co2Saving>0?(co2Saving<1000?Math.round(co2Saving)+'g':(co2Saving/1000).toFixed(1)+'kg')+' per '+freqLabel:'already greenest'),
    bestSaving > 0 ? 'Money saved: $' + bestSaving.toFixed(0) + ' per ' + freqLabel : '',
    'Calculated with DC Green Travel Planner'
  ].filter(Boolean).join('\n');

  // ── Bottom line impact statement ──
  const bottomline     = document.getElementById('bottomline');
  const bottomlineText = document.getElementById('bottomline-text');
  const bottomlineSub  = document.getElementById('bottomline-sub');

  // Compare best mode vs baseline in terms of trees
  // 1 tree absorbs ~21kg CO2/year = 21000g
  const TREE_G_PER_YEAR = 21000;
  const treeDiff = baseline.trees - best.trees; // positive = saved, negative = added

  if (bottomline && bottomlineText && bottomlineSub) {
    bottomline.style.display = 'block';
    if (best.key === baselineKey) {
      bottomlineText.textContent = 'You\'re already on the greenest mode 🌿';
      bottomlineText.style.color = '#1D9E75';
      bottomlineSub.textContent = 'Keep it up!';
    } else if (treeDiff > 0) {
      const saved = treeDiff < 1 ? (treeDiff * 365).toFixed(0) + ' tree-days' : treeDiff.toFixed(2) + (treeDiff >= 1 ? ' tree' + (treeDiff >= 2 ? 's' : '') : '');
      bottomlineText.innerHTML = '🌳 You saved <strong>' + (treeDiff >= 1 ? treeDiff.toFixed(1) + ' tree' + (treeDiff >= 2 ? 's' : '') : Math.round(treeDiff * 365) + ' tree-days') + '</strong>';
      bottomlineText.style.color = '#1D9E75';
      bottomlineSub.textContent = 'Switching from ' + MODES[baselineKey].label + ' to ' + best.label + ' per ' + freqLabel;
    } else {
      const added = Math.abs(treeDiff);
      bottomlineText.innerHTML = '🪓 You removed <strong>' + (added >= 1 ? added.toFixed(1) + ' tree' + (added >= 2 ? 's' : '') : Math.round(added * 365) + ' tree-days') + '</strong>';
      bottomlineText.style.color = '#E24B4A';
      bottomlineSub.textContent = 'vs. switching to ' + best.label + ' — consider a greener option';
    }
  }

  document.getElementById('results').classList.add('show');
  document.getElementById('results').scrollIntoView({ behavior:'smooth', block:'start' });
}



function renderTable(results, freqLabel) {
  const bestScore = Math.max(...results.map(r => r.score));
  document.getElementById('tbl-body').innerHTML = results.map(r => {
    const isBest = r.score === bestScore;
    const co2s   = r.co2g === 0 ? '0g' : r.co2g < 1000 ? Math.round(r.co2g)+'g' : (r.co2g/1000).toFixed(2)+'kg';
    const ts     = r.trees < 0.01 ? '~0' : r.trees < 1 ? r.trees.toFixed(2) : r.trees.toFixed(1);
    const sc     = r.score>=80?'#1D9E75':r.score>=60?'#639922':r.score>=40?'#EF9F27':'#E24B4A';
    const tm     = r.timeMins < 1 ? '<1m' : r.timeMins < 60 ? Math.round(r.timeMins)+'m' : (r.timeMins/60).toFixed(1)+'hr';
    return '<tr class="' + (isBest?'best':'') + '">' +
      '<td><span class="pill" style="background:' + r.color + '20;color:' + r.textCol + ';">' +
      '<i class="ti ' + r.icon + '" style="font-size:11px;"></i> ' + r.label + '</span>' +
      (isBest ? '<div style="font-size:10px;color:#1D9E75;">✓ Greenest</div>' : '') + '</td>' +
      '<td>' + co2s + '<div class="msub">/' + freqLabel + '</div></td>' +
      '<td>' + ts   + '<div class="msub">trees/yr</div></td>' +
      '<td>$' + r.costD.toFixed(2) + '<div class="msub">/' + freqLabel + '</div></td>' +
      '<td>' + tm   + '<div class="msub">/' + freqLabel + '</div></td>' +
      '<td><span style="font-size:13px;font-weight:500;color:' + sc + ';">' + r.score + '</span><span style="font-size:10px;color:#aaa;">/100</span></td>' +
    '</tr>';
  }).join('');
}



function copyShare() {
  const txt = document.getElementById('share-text').textContent;
  navigator.clipboard.writeText(txt).then(function() {
    const btn = document.getElementById('copy-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="ti ti-check"></i> Copied!';
    setTimeout(function() { btn.innerHTML = orig; }, 2000);
  });
}



function showMapsImportMsg(text, kind) {
  const msg = document.getElementById('maps-import-msg');
  if (!msg) return;
  msg.textContent = text;
  msg.className = kind || '';
  msg.style.display = 'block';
}

function setImportBtnLoading(btn, isLoading, originalHTML) {
  btn.disabled = isLoading;
  btn.classList.toggle('loading', isLoading);
  btn.innerHTML = isLoading ? '<i class="ti ti-loader-2"></i> Checking Maps…' : originalHTML;
}

// field: 'origin' | 'destination'
function importFromMaps(field) {
  if (typeof chrome === 'undefined' || !chrome.tabs) {
    showMapsImportMsg('Not running inside Chrome.', 'err'); return;
  }
  const btnId = field === 'origin' ? 'import-origin-btn' : 'import-dest-btn';
  const btn = document.getElementById(btnId);
  const originalHTML = btn.innerHTML;
  setImportBtnLoading(btn, true, originalHTML);

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tab = tabs && tabs[0];
    if (chrome.runtime.lastError || !tab) {
      setImportBtnLoading(btn, false, originalHTML);
      showMapsImportMsg('Could not access the current tab.', 'err'); return;
    }
    if (!tab.url || !tab.url.includes('google.com/maps')) {
      setImportBtnLoading(btn, false, originalHTML);
      showMapsImportMsg('Open a Google Maps directions page first.', 'err'); return;
    }
    chrome.tabs.sendMessage(tab.id, { type: 'GET_MAPS_ROUTE' }, function(resp) {
      setImportBtnLoading(btn, false, originalHTML);
      if (chrome.runtime.lastError || !resp || !resp.route) {
        showMapsImportMsg('No route found yet — enter origin and destination on Google Maps first.', 'err'); return;
      }
      const { origin, destination } = resp.route;
      if (field === 'origin') {
        if (origin) {
          document.getElementById('from-loc').value = origin;
          showMapsImportMsg('✓ Start imported: ' + origin, 'ok');
        } else {
          showMapsImportMsg('Could not read a starting point from Maps.', 'err');
        }
      } else {
        if (destination) {
          document.getElementById('to-loc').value = destination;
          showMapsImportMsg('✓ Destination imported: ' + destination, 'ok');
        } else {
          showMapsImportMsg('Could not read a destination from Maps.', 'err');
        }
      }
    });
  });
}

function sendCarbonBadgeToMaps(data) {
  if (typeof chrome === 'undefined' || !chrome.tabs) return;
  chrome.tabs.query({ active:true, currentWindow:true }, function(tabs) {
    if (chrome.runtime.lastError) return;
    const tab = tabs && tabs[0];
    if (!tab || !tab.url || !tab.url.includes('google.com/maps')) return;
    chrome.tabs.sendMessage(tab.id, { type:'SHOW_CARBON_BADGE', data }, function() {
      if (chrome.runtime.lastError) return;
    });
  });
}



let lastResults = null;

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('go-btn').addEventListener('click', runCompare);
  document.getElementById('swap-btn').addEventListener('click', function() {
    const f = document.getElementById('from-loc');
    const t = document.getElementById('to-loc');
    const tmp = f.value; f.value = t.value; t.value = tmp;
  });
  document.getElementById('copy-btn').addEventListener('click', copyShare);
  document.getElementById('import-origin-btn').addEventListener('click', function() { importFromMaps('origin'); });
  document.getElementById('import-dest-btn').addEventListener('click',   function() { importFromMaps('destination'); });
});
