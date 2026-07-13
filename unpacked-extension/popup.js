const DISTANCES = {
  "Washington DC": {
    "Baltimore, MD":61,"Silver Spring, MD":13,"Bethesda, MD":11,"Rockville, MD":24,
    "Gaithersburg, MD":34,"Germantown, MD":43,"College Park, MD":19,"Greenbelt, MD":21,
    "Laurel, MD":35,"Bowie, MD":32,"Upper Marlboro, MD":30,"Annapolis, MD":48,
    "Frederick, MD":80,"Hagerstown, MD":127,"Takoma Park, MD":11,"Alexandria, VA":12,
    "Arlington, VA":8,"Falls Church, VA":16,"McLean, VA":19,"Tysons, VA":22,
    "Vienna, VA":24,"Fairfax, VA":30,"Reston, VA":34,"Herndon, VA":38,
    "Chantilly, VA":42,"Centreville, VA":46,"Burke, VA":36,"Springfield, VA":28,
    "Manassas, VA":65,"Ashburn, VA":55,"Sterling, VA":52,"Leesburg, VA":67,"Richmond, VA":177
  },
  "Baltimore, MD": {
    "Washington DC":61,"Annapolis, MD":43,"Silver Spring, MD":52,"Bethesda, MD":68,
    "Rockville, MD":79,"College Park, MD":48,"Greenbelt, MD":47,"Laurel, MD":35,
    "Bowie, MD":43,"Upper Marlboro, MD":50,"Frederick, MD":100,"Hagerstown, MD":130,
    "Richmond, VA":230,"Arlington, VA":65,"Alexandria, VA":67
  }
};

const MODES = [
  { id:"walking",   emoji:"🚶", name:"Walking",        sub:"On foot",                      co2:0,   costKm:0,    speed:5,  cc:"green" },
  { id:"bike",      emoji:"🚲", name:"Bike / Scooter", sub:"Capital Bikeshare · e-scooter", co2:8,   costKm:0.25, speed:15, cc:"green" },
  { id:"metro",     emoji:"🚇", name:"Metro / Rail",   sub:"WMATA · MARC · VRE",           co2:41,  costKm:0.18, speed:45, cc:"green", best:true },
  { id:"bus",       emoji:"🚌", name:"Bus",            sub:"Metrobus · local transit",      co2:68,  costKm:0.10, speed:25, cc:"amber" },
  { id:"rideshare", emoji:"🚕", name:"Rideshare",      sub:"Uber · Lyft · taxi",            co2:150, costKm:1.20, speed:55, cc:"red" },
  { id:"car",       emoji:"🚗", name:"Personal Car",   sub:"Average sedan",                 co2:192, costKm:0.65, speed:60, cc:"red" }
];

function getDist(a, b) {
  return DISTANCES[a]?.[b] || DISTANCES[b]?.[a] || 40;
}

function getActiveModes() {
  const active = new Set();
  document.querySelectorAll(".mode-toggle.active").forEach(el => active.add(el.dataset.mode));
  return MODES.filter(m => active.has(m.id));
}

function fmtTime(h) {
  const hr = Math.floor(h), mn = Math.round((h - hr) * 60);
  if (hr === 0) return `${mn}m`;
  return mn === 0 ? `${hr}h` : `${hr}h ${mn}m`;
}

function fmtCost(v) {
  return v === 0 ? "Free" : `$${v < 10 ? v.toFixed(2) : Math.round(v)}`;
}

function swapLocations() {
  const f = document.getElementById("from-select");
  const t = document.getElementById("to-select");
  const fText = f.options[f.selectedIndex]?.text;
  const tText = t.options[t.selectedIndex]?.text;
  if (fText) for (let o of t.options) if (o.text === fText) { t.selectedIndex = o.index; break; }
  if (tText) for (let o of f.options) if (o.text === tText) { f.selectedIndex = o.index; break; }
  autoCompare();
}

function setRoute(from, to) {
  const f = document.getElementById("from-select");
  const t = document.getElementById("to-select");
  for (let o of f.options) if (o.text === from) { f.selectedIndex = o.index; break; }
  for (let o of t.options) if (o.text === to)   { t.selectedIndex = o.index; break; }
  autoCompare();
}

function autoCompare() {
  const f = document.getElementById("from-select");
  const t = document.getElementById("to-select");
  if (f.selectedIndex > 0 && t.selectedIndex > 0 &&
      f.options[f.selectedIndex].text !== t.options[t.selectedIndex].text) {
    doCompare();
  }
}

function doCompare() {
  const fEl = document.getElementById("from-select");
  const tEl = document.getElementById("to-select");
  const from = fEl.options[fEl.selectedIndex].text;
  const to   = tEl.options[tEl.selectedIndex].text;

  if (fEl.selectedIndex <= 0 || tEl.selectedIndex <= 0) {
    alert("Please select both locations."); return;
  }
  if (from === to) {
    alert("Please choose different locations."); return;
  }

  const dist = getDist(from, to);

  const chip = document.getElementById("dist-chip");
  chip.textContent = `~${dist} km`;
  chip.style.display = "block";

  const activeModes = getActiveModes();
  if (activeModes.length === 0) { alert("Please select at least one mode to compare."); return; }

  const modes = activeModes.map(m => ({
    ...m,
    co2Total:  Math.round(m.co2 * dist),
    costTotal: m.costKm * dist,
    timeTotal: dist / m.speed
  }));

  const co2s  = modes.map(m => m.co2Total);
  const costs = modes.map(m => m.costTotal);
  const times = modes.map(m => m.timeTotal);
  const [minCo2,  maxCo2]  = [Math.min(...co2s),  Math.max(...co2s)];
  const [minCost, maxCost] = [Math.min(...costs), Math.max(...costs)];
  const [minTime, maxTime] = [Math.min(...times), Math.max(...times)];

  const bCo2  = modes.find(m => m.co2Total  === minCo2);
  const wCo2  = modes.find(m => m.co2Total  === maxCo2);
  const bCost = modes.find(m => m.costTotal === minCost);
  const wCost = modes.find(m => m.costTotal === maxCost);
  const bTime = modes.find(m => m.timeTotal === minTime);
  const wTime = modes.find(m => m.timeTotal === maxTime);

  // Summary strip
  document.getElementById("s-co2-best").textContent = minCo2 === 0 ? "0 g" : `${minCo2.toLocaleString()} g`;
  document.getElementById("s-co2-vs").textContent   = `vs ${maxCo2.toLocaleString()} g (${wCo2.name})`;
  document.getElementById("s-co2-bl").textContent   = `${bCo2.emoji} ${bCo2.name}`;
  document.getElementById("s-co2-wl").textContent   = `${wCo2.emoji} ${wCo2.name}`;
  document.getElementById("s-co2-bar").style.width  = maxCo2 > 0 ? `${Math.round(minCo2/maxCo2*100)}%` : "0%";
  document.getElementById("s-co2-note").textContent = minCo2 === 0
    ? "Zero emissions 🌍"
    : `${Math.round((1-minCo2/maxCo2)*100)}% less CO₂ vs ${wCo2.name}`;

  document.getElementById("s-cost-best").textContent = fmtCost(minCost);
  document.getElementById("s-cost-vs").textContent   = `vs ${fmtCost(maxCost)} (${wCost.name})`;
  document.getElementById("s-cost-bl").textContent   = `${bCost.emoji} ${bCost.name}`;
  document.getElementById("s-cost-wl").textContent   = `${wCost.emoji} ${wCost.name}`;
  document.getElementById("s-cost-bar").style.width  = `${Math.round(minCost/maxCost*100)}%`;
  document.getElementById("s-cost-note").textContent = `Save up to ${fmtCost(maxCost - minCost)}`;

  document.getElementById("s-time-best").textContent = fmtTime(minTime);
  document.getElementById("s-time-vs").textContent   = `vs ${fmtTime(maxTime)} (${wTime.name})`;
  document.getElementById("s-time-bl").textContent   = `${bTime.emoji} ${bTime.name}`;
  document.getElementById("s-time-wl").textContent   = `${wTime.emoji} ${wTime.name}`;
  document.getElementById("s-time-bar").style.width  = `${Math.round(minTime/maxTime*100)}%`;
  document.getElementById("s-time-note").textContent = `${wTime.name} takes ${fmtTime(maxTime-minTime)} longer`;

  document.getElementById("summary-strip").classList.add("visible");

  // Results header
  document.getElementById("results-hdr").innerHTML =
    `All modes &nbsp;·&nbsp; <strong>${from} → ${to}</strong>`;

  // Transport cards
  const grid = document.getElementById("transport-grid");
  grid.innerHTML = "";

  modes.forEach(m => {
    const barPct = maxCo2 > 0 ? Math.round(m.co2Total / maxCo2 * 100) : 0;
    const co2B  = m.co2Total  === minCo2  ? `<span class="rank-pip best">Best</span>`     : m.co2Total  === maxCo2  ? `<span class="rank-pip worst">High</span>`    : "";
    const costB = m.costTotal === minCost ? `<span class="rank-pip best">Cheapest</span>` : m.costTotal === maxCost ? `<span class="rank-pip worst">Priciest</span>` : "";
    const timeB = m.timeTotal === minTime ? `<span class="rank-pip best">Fastest</span>`  : m.timeTotal === maxTime ? `<span class="rank-pip worst">Slowest</span>`  : "";
    const warn  = (m.id === "walking" && dist > 8)  ? `<div class="t-warn">⚠️ Very long walk</div>`      :
                  (m.id === "bike"    && dist > 30) ? `<div class="t-warn">⚠️ E-bike recommended</div>` : "";

    const card = document.createElement("div");
    card.className = "t-card" + (m.best ? " hero-card" : "");
    card.innerHTML = `
      ${m.best ? '<div class="best-tag">Best overall</div>' : ''}
      <div class="t-top">
        <div class="t-emoji-wrap">${m.emoji}</div>
        <div>
          <div class="t-name">${m.name}</div>
          <div class="t-sub">${m.sub}</div>
        </div>
      </div>
      <div class="t-stats">
        <div>
          <div class="t-stat-label">🌱 CO₂</div>
          <div class="t-stat-val ${m.cc}">${m.co2Total === 0 ? "Zero" : m.co2Total.toLocaleString()}<span class="t-stat-unit"> g</span>${co2B}</div>
        </div>
        <div>
          <div class="t-stat-label">💵 Cost</div>
          <div class="t-stat-val">${fmtCost(m.costTotal)}${costB}</div>
        </div>
        <div>
          <div class="t-stat-label">⏱ Time</div>
          <div class="t-stat-val">${fmtTime(m.timeTotal)}${timeB}</div>
        </div>
      </div>
      <div class="t-bar-wrap">
        <div class="t-bar-label">Carbon footprint</div>
        <div class="t-bar-track"><div class="t-bar-fill ${m.cc}" style="width:${barPct}%"></div></div>
      </div>
      ${warn}
    `;
    grid.appendChild(card);
  });

  document.getElementById("results-panel").classList.add("visible");
  document.getElementById("summary-strip").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ── IMPORT ROUTE FROM GOOGLE MAPS ─────────────────────────────────────────────

function showImportMsg(text, kind) {
  const msg = document.getElementById("import-msg");
  msg.textContent = text;
  msg.className = kind || "";
  if (!kind) msg.style.display = "none";
}

// Normalize punctuation/whitespace so "Washington, DC 20500" and "Washington DC" compare equal.
function normalizeLoc(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

// Match free-text Maps location against a select's options (case-insensitive, partial).
function matchOptionToSelect(selectEl, text) {
  if (!text) return false;
  const needle = normalizeLoc(text);
  for (const opt of selectEl.options) {
    if (!opt.value) continue;
    const key = normalizeLoc(opt.value.split(",")[0]);
    if (needle.includes(key) || key.includes(needle)) {
      selectEl.value = opt.value;
      return true;
    }
  }
  return false;
}

function importFromMaps() {
  if (typeof chrome === "undefined" || !chrome.tabs) {
    showImportMsg("Not running inside Chrome.", "err");
    return;
  }
  const btn = document.getElementById("import-maps-btn");
  const originalHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = "Checking Maps…";

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs && tabs[0];
    const reset = () => { btn.disabled = false; btn.innerHTML = originalHTML; };

    if (chrome.runtime.lastError || !tab) {
      reset();
      showImportMsg("Could not access the current tab.", "err");
      return;
    }
    if (!tab.url || !tab.url.includes("google.com/maps")) {
      reset();
      showImportMsg("Open a Google Maps directions page first.", "err");
      return;
    }
    chrome.tabs.sendMessage(tab.id, { type: "GET_MAPS_ROUTE" }, function (resp) {
      reset();
      if (chrome.runtime.lastError || !resp || !resp.route) {
        showImportMsg("No route found — enter origin and destination on Google Maps first.", "err");
        return;
      }
      const { origin, destination } = resp.route;
      const fromSel = document.getElementById("from-select");
      const toSel = document.getElementById("to-select");
      const fromMatched = matchOptionToSelect(fromSel, origin);
      const toMatched = matchOptionToSelect(toSel, destination);

      if (fromMatched || toMatched) {
        showImportMsg(
          `Imported: ${fromMatched ? fromSel.options[fromSel.selectedIndex].text : (origin || "?")} → ${toMatched ? toSel.options[toSel.selectedIndex].text : (destination || "?")}`,
          "ok"
        );
        autoCompare();
      } else {
        showImportMsg("Couldn't match the Maps route to a supported location.", "err");
      }
    });
  });
}

// Wire up all event listeners after DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("import-maps-btn").addEventListener("click", importFromMaps);
  document.getElementById("from-select").addEventListener("change", autoCompare);
  document.getElementById("to-select").addEventListener("change", autoCompare);
  document.getElementById("swap-btn").addEventListener("click", swapLocations);
  document.getElementById("compare-btn").addEventListener("click", doCompare);
  document.getElementById("pill-dc-balt").addEventListener("click", function () { setRoute("Washington DC", "Baltimore, MD"); });
  document.getElementById("pill-dc-rich").addEventListener("click",  function () { setRoute("Washington DC", "Richmond, VA"); });
  document.getElementById("pill-arl-ann").addEventListener("click", function () { setRoute("Arlington, VA", "Annapolis, MD"); });
  document.getElementById("pill-tys-dc").addEventListener("click",  function () { setRoute("Tysons, VA", "Washington DC"); });

  document.querySelectorAll(".mode-toggle").forEach(function(toggle) {
    toggle.addEventListener("click", function() {
      const active = document.querySelectorAll(".mode-toggle.active");
      if (toggle.classList.contains("active") && active.length === 1) return; // keep at least one
      toggle.classList.toggle("active");
    });
  });
});
