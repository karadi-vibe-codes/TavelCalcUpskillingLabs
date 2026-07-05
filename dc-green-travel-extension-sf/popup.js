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
  if(!a||!b||a===b)return null;
  // try lookup table first, then coordinate calculation
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

function makeLocOptions(sel=''){
  const groups=[
    {label:'DC Neighborhoods',items:['Adams Morgan','Anacostia','Brookland','Capitol Hill','Chinatown','Columbia Heights','Dupont Circle','Eastern Market','Foggy Bottom','Georgetown','H Street NE','Logan Circle','Mount Vernon Square','Navy Yard','NoMa','Penn Quarter','Petworth','Shaw','Tenleytown','The Wharf','U Street','Woodley Park']},
    {label:'DC Landmarks & Venues',items:['National Mall','Union Station','Convention Center','Capital One Arena','Nationals Park','Reagan Airport (DCA)','Howard University','Georgetown University','GW University','Walter Reed Med. Ctr']},
    {label:'Virginia — Inner Suburbs',items:['Alexandria, VA','Arlington, VA','Ballston, VA','Crystal City, VA','Falls Church, VA','McLean, VA','Rosslyn, VA','Tysons Corner, VA','Vienna, VA']},
    {label:'Virginia — Outer',items:['Annandale, VA','Burke, VA','Centreville, VA','Chantilly, VA','Dale City, VA','Dulles Airport (IAD)','Fairfax, VA','Fredericksburg, VA','Herndon, VA','Leesburg, VA','Manassas, VA','Reston, VA','Springfield, VA','Warrenton, VA','Winchester, VA','Woodbridge, VA']},
    {label:'Maryland — Inner Suburbs',items:['Bethesda, MD','Chevy Chase, MD','College Park, MD','Greenbelt, MD','Hyattsville, MD','Rockville, MD','Silver Spring, MD','Takoma Park, MD','Wheaton, MD']},
    {label:'Maryland — Outer',items:['Annapolis, MD','Bowie, MD','BWI Airport','Frederick, MD','Gaithersburg, MD','Germantown, MD','Hagerstown, MD','La Plata, MD','Laurel, MD','Upper Marlboro, MD','Waldorf, MD']},
    {label:'West Virginia',items:['Charles Town, WV','Harpers Ferry, WV','Martinsburg, WV']},
    {label:'Delaware & Pennsylvania',items:['Gettysburg, PA','Lancaster, PA','Newark, DE','Wilmington, DE','York, PA']},
  ];
  let h='<option value="">Select location…</option>';
  groups.forEach(g=>{h+=`<optgroup label="${g.label}">`;g.items.forEach(p=>{h+=`<option${p===sel?' selected':''}>${p}</option>`;});h+='</optgroup>';});
  return h;
}

let legCount=0,lastResults=null,currentTab='co2',legsOpen=false;

function toggleLegs(){
  legsOpen=!legsOpen;
  document.getElementById('legs-panel').style.display=legsOpen?'block':'none';
  document.getElementById('legs-toggle-icon').textContent=legsOpen?'－ Collapse':'＋ Expand';
}

function addLeg(fromVal='',toVal='',modeVal='metro'){
  legCount++;const id=legCount;
  const dist=getDist(fromVal,toVal);
  const div=document.createElement('div');
  div.className='leg-card';div.id='leg-'+id;
  div.innerHTML=`
    <div class="leg-header">
      <span class="leg-num">Leg ${id}</span>
      <span class="leg-dist-badge" id="badge-${id}"><i class="ti ti-map-pin" style="font-size:11px;margin-right:3px;"></i>${dist?dist+' mi':'Select stops'}</span>
    </div>
    <div class="leg-grid">
      <select id="lfrom-${id}" data-legid="${id}" class="leg-from">${makeLocOptions(fromVal)}</select>
      <span class="leg-arrow"><i class="ti ti-arrow-right"></i></span>
      <select id="lto-${id}" data-legid="${id}" class="leg-to">${makeLocOptions(toVal)}</select>
    </div>
    <div class="leg-mode-row">
      <i class="ti ti-route" style="font-size:15px;color:#aaa;flex-shrink:0;"></i>
      <select id="lmode-${id}">
        <option value="walk"${modeVal==='walk'?' selected':''}>Walking</option>
        <option value="bike"${modeVal==='bike'?' selected':''}>Bike / Scooter</option>
        <option value="metro"${modeVal==='metro'?' selected':''}>Metro / Rail</option>
        <option value="bus"${modeVal==='bus'?' selected':''}>Bus</option>
        <option value="rideshare"${modeVal==='rideshare'?' selected':''}>Rideshare</option>
        <option value="car"${modeVal==='car'?' selected':''}>Personal car</option>
      </select>
      <button class="rm-btn" data-legid="${id}"><i class="ti ti-trash" style="font-size:13px;"></i> Remove</button>
    </div>
    <div id="err-${id}" class="err-msg">Distance unknown for this pair — using 2 mi estimate.</div>`;
  document.getElementById('legs-container').appendChild(div);
}

function removeLeg(id){const el=document.getElementById('leg-'+id);if(el)el.remove();}

function updateLegDist(id){
  const f=document.getElementById('lfrom-'+id).value,t=document.getElementById('lto-'+id).value;
  const badge=document.getElementById('badge-'+id),err=document.getElementById('err-'+id);
  if(!f||!t){badge.innerHTML=`<i class="ti ti-map-pin" style="font-size:11px;margin-right:3px;"></i>Select stops`;err.style.display='none';return;}
  if(f===t){badge.innerHTML=`<i class="ti ti-map-pin" style="font-size:11px;margin-right:3px;"></i>Same location`;err.style.display='none';return;}
  const d=getDist(f,t);
  badge.innerHTML=`<i class="ti ti-map-pin" style="font-size:11px;margin-right:3px;"></i>${d?d+' mi':'~2 mi est.'}`;
  err.style.display=d?'none':'block';
}

function syncFirstLeg(){const f=document.getElementById('from-loc').value;const el=document.getElementById('lfrom-1');if(el&&!el.value){el.value=f;updateLegDist(1);}}
function syncLastLeg(){const t=document.getElementById('to-loc').value;const legs=document.querySelectorAll('#legs-container .leg-card');if(legs.length>0){const lastId=legs[legs.length-1].id.replace('leg-','');const el=document.getElementById('lto-'+lastId);if(el&&!el.value){el.value=t;updateLegDist(lastId);}}}
function swapLocs(){const f=document.getElementById('from-loc'),t=document.getElementById('to-loc'),tmp=f.value;f.value=t.value;t.value=tmp;}

function buildMultiModalRow(legEls,freq){
  let co2g=0,costD=0,timeMins=0,valid=true,legDescs=[];
  legEls.forEach(el=>{
    const id=el.id.replace('leg-','');
    const lf=document.getElementById('lfrom-'+id).value,lt=document.getElementById('lto-'+id).value,mkey=document.getElementById('lmode-'+id).value;
    if(!lf||!lt){valid=false;return;}
    const d=getDist(lf,lt)||2,m=MODES[mkey];
    co2g+=m.co2pm*d*freq;costD+=m.costPm*d*freq;timeMins+=(d/m.mph)*60*freq;
    legDescs.push(m.label);
  });
  if(!valid)return null;
  const trees=co2g===0?0:parseFloat(((co2g)/1000/21).toFixed(3));
  let totalScore=0;legEls.forEach(el=>{const id=el.id.replace('leg-','');totalScore+=MODES[document.getElementById('lmode-'+id).value].score;});
  const score=Math.round(totalScore/legEls.length);
  return{key:'multimodal',label:'Your route ('+legDescs.join(' + ')+')',icon:'ti-route',color:'#7B5EA7',textCol:'#3b1f6e',score,co2g,costD,timeMins,trees,savings:0,isRoute:true};
}

function runCompare(){
  const from=document.getElementById('from-loc').value,to=document.getElementById('to-loc').value;
  if(!from||!to){alert('Please select a starting point and destination.');return;}
  if(from===to){alert('Starting point and destination cannot be the same.');return;}
  const freq=parseInt(document.getElementById('freq').value),baselineKey=document.getElementById('baseline').value;
  const legEls=document.querySelectorAll('#legs-container .leg-card');
  let totalDist=0,trips=[];
  if(legEls.length>0){
    let valid=true;
    legEls.forEach(el=>{const id=el.id.replace('leg-','');const lf=document.getElementById('lfrom-'+id).value,lt=document.getElementById('lto-'+id).value,mkey=document.getElementById('lmode-'+id).value;if(!lf||!lt){valid=false;return;}const d=getDist(lf,lt)||2;trips.push({dist:d,mkey,from:lf,to:lt});totalDist+=d;});
    if(!valid){alert('Please select both a from and to location for each leg.');return;}
  } else {const d=getDist(from,to)||5;totalDist=d;trips=[{dist:d,mkey:'car',from,to}];}

  const straightDist=getDist(from,to)||totalDist;
  const results=Object.keys(MODES).map(key=>{
    const m=MODES[key];
    const co2g=m.co2pm*straightDist*freq,costD=m.costPm*straightDist*freq,timeMins=(straightDist/m.mph)*60*freq;
    return{key,label:m.label,icon:m.icon,color:m.color,textCol:m.textCol,score:m.score,co2g,costD,timeMins,trees:co2g===0?0:parseFloat(((co2g)/1000/21).toFixed(3)),savings:0};
  });

  let multiRow=null;
  if(legEls.length>0){multiRow=buildMultiModalRow(legEls,freq);if(multiRow){results.unshift(multiRow);}}

  const baseline=results.find(r=>r.key===baselineKey);
  results.forEach(r=>{r.savings=Math.max(0,baseline.costD-r.costD);r.co2saved=Math.max(0,baseline.co2g-r.co2g);});

  const freqLabel={1:'trip',5:'week',22:'month',260:'year'}[freq]||'period';
  const singleResults=results.filter(r=>!r.isRoute);
  const best=singleResults.reduce((a,b)=>a.score>b.score?a:b);
  const bestSaving=baseline.costD-best.costD;
  const co2Saving=baseline.co2g-best.co2g;

  document.getElementById('baseline-lbl').textContent=MODES[baselineKey].label.toLowerCase();
  document.getElementById('savings-banner').innerHTML=`<div style="font-size:26px;flex-shrink:0;"><i class="ti ti-plant-2" style="font-size:26px;color:#1D9E75;"></i></div><div style="flex:1;"><div style="display:flex;gap:24px;flex-wrap:wrap;"><div><div class="sav-big">${bestSaving>0?'$'+bestSaving.toFixed(0)+' saved':'Free!'}</div><div class="sav-sub">vs. ${MODES[baselineKey].label} per ${freqLabel} switching to ${best.label}</div></div><div><div class="sav-big">${co2Saving>0?(co2Saving<1000?Math.round(co2Saving)+'g':(co2Saving/1000).toFixed(1)+'kg')+' CO\u2082':'0g CO\u2082'}</div><div class="sav-sub">carbon saved per ${freqLabel}</div></div></div></div>`;

  const fmtT=v=>v<0.01?'~0':v<1?v.toFixed(2):v.toFixed(1);
  const treesGreen=fmtT(best.trees),treesCar=fmtT(baseline.trees);
  document.getElementById('metrics-row').innerHTML=`<div class="mc"><div class="mc-icon">\u{1F333}</div><div class="mc-val">${treesGreen}</div><div class="mc-lbl">trees impacted/yr \u2014 ${best.label}</div></div><div class="mc"><div class="mc-icon">\u{1F333}</div><div class="mc-val">${treesCar}</div><div class="mc-lbl">trees impacted/yr \u2014 ${MODES[baselineKey].label}</div></div><div class="mc"><div class="mc-icon">\u{1F4CD}</div><div class="mc-val">${straightDist.toFixed(1)} mi</div><div class="mc-lbl">straight-line distance</div></div>${multiRow?`<div class="mc"><div class="mc-icon">\u{1F504}</div><div class="mc-val">${multiRow.score}/100</div><div class="mc-lbl">your multi-modal route score</div></div>`:''}`;

  lastResults={results,freq,freqLabel,baseline,best,totalDist,straightDist,trips,from,to,baselineKey,multiRow};
  renderTable(results,freqLabel);

  const tips={walk:'Walking generates zero emissions \u2014 perfect for DC trips under 2 miles.',bike:'Capital Bikeshare has 700+ stations across DC, Arlington & Alexandria. E-scooters are widely available.',metro:'WMATA Metro emits ~90% less CO\u2082 than driving solo. Great for longer cross-city trips.',bus:'DC Circulator + Metrobus are affordable and low-carbon. Best combined with a short walk.',rideshare:'Pooled rideshares cut emissions nearly in half. For regular commutes, Metro or bus is far greener.',car:'Carpooling or switching to an EV dramatically reduces your carbon per mile.'};
  document.getElementById('tip-txt').textContent=tips[best.key]+(multiRow?' Your multi-modal route scored '+multiRow.score+'/100 \u2014 see the purple row in the chart and table below.':'');

  const shareLines=['Route: '+from+' \u2192 '+to+' | '+freqLabel,'Greenest option: '+best.label+' (score '+best.score+'/100)','Carbon saved vs. '+MODES[baselineKey].label+': '+(co2Saving>0?(co2Saving<1000?Math.round(co2Saving)+'g':(co2Saving/1000).toFixed(1)+'kg')+' CO\u2082 per '+freqLabel:'already greenest'),bestSaving>0?'Money saved: $'+bestSaving.toFixed(0)+' per '+freqLabel:'',multiRow?'Your multi-modal route: '+multiRow.label+' \u2014 CO\u2082 '+(multiRow.co2g<1000?Math.round(multiRow.co2g)+'g':(multiRow.co2g/1000).toFixed(2)+'kg')+' per '+freqLabel:'','Calculated with DC Green Travel Planner'].filter(Boolean).join('\n');
  document.getElementById('share-text').textContent=shareLines;

  document.getElementById('results').classList.add('show');
  document.getElementById('results').scrollIntoView({behavior:'smooth',block:'start'});

  // Send carbon badge to Google Maps tab if open
  const co2SavedStr = co2Saving>0?(co2Saving<1000?Math.round(co2Saving)+'g CO₂':(co2Saving/1000).toFixed(1)+'kg CO₂'):'0g CO₂';
  const moneySavedStr = bestSaving>0?'$'+bestSaving.toFixed(0):'$0';
  const treesStr = fmtT(baseline.trees);
  sendCarbonBadgeToMaps({
    from, to,
    bestMode: best.label,
    co2Saved: co2SavedStr,
    moneySaved: moneySavedStr,
    trees: treesStr,
    freqLabel
  });
}

function switchTab(type,btn){currentTab=type;document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));btn.classList.add('on');renderChart(type);}

function renderChart(type){
  if(!lastResults)return;
  const{results}=lastResults;
  const getVal=r=>({co2:r.co2g,trees:r.trees,cost:r.costD,time:r.timeMins,savings:r.savings})[type];
  const fmt=(v,t)=>{if(t==='co2')return v<1000?Math.round(v)+'g':(v/1000).toFixed(2)+'kg';if(t==='trees')return v<0.01?'~0':v<1?v.toFixed(2):v.toFixed(1);if(t==='cost'||t==='savings')return '$'+v.toFixed(2);return v<1?'<1m':Math.round(v)+'m';};
  const maxV=Math.max(...results.map(getVal),0.001);
  document.getElementById('chart-area').innerHTML=results.map(r=>{
    const v=getVal(r),w=Math.round((v/maxV)*100),dv=fmt(v,type);
    const barColor=r.isRoute?'#7B5EA7':r.color;
    const tc=(r.key==='rideshare'||r.isRoute)?'#fff':'#fff';
    const prefix=r.isRoute?'<span style="font-size:10px;background:#7B5EA720;color:#7B5EA7;border-radius:4px;padding:1px 5px;margin-right:4px;">Your route</span>':'';
    return`<div class="hbar-row" style="${r.isRoute?'border-top:1px dashed #ccc;padding-top:6px;margin-top:4px;':''}"><span class="hbl">${prefix}<i class="ti ${r.icon}" style="font-size:13px;margin-right:4px;"></i>${r.isRoute?'Your route':r.label}</span><div class="hbt"><div class="hbf" style="width:${w}%;background:${barColor};color:${tc};min-width:${w>0?'32px':'0'};">${w>14?dv:''}</div></div><span class="hbn">${w<=14?dv:''}</span></div>`;
  }).join('');
}

function renderTable(results,freqLabel){
  const singleScores=results.filter(r=>!r.isRoute).map(r=>r.score);
  const bestScore=Math.max(...singleScores);
  document.getElementById('tbl-body').innerHTML=results.map(r=>{
    const isBest=!r.isRoute&&r.score===bestScore;
    const co2s=r.co2g===0?'0g':r.co2g<1000?Math.round(r.co2g)+'g':(r.co2g/1000).toFixed(2)+'kg';
    const ts=r.trees<0.01?'~0':r.trees<1?r.trees.toFixed(2):r.trees.toFixed(1);
    const sc=r.score>=80?'#1D9E75':r.score>=60?'#639922':r.score>=40?'#EF9F27':'#E24B4A';
    const tmFmt=r.timeMins<1?'<1m':r.timeMins<60?Math.round(r.timeMins)+'m':(r.timeMins/60).toFixed(1)+'hr';
    const pillStyle=r.isRoute?'background:#7B5EA720;color:#3b1f6e;':`background:${r.color}20;color:${r.textCol};`;
    const rowClass=isBest?'best':r.isRoute?'your-route':'';
    const routeBadge=r.isRoute?'<span class="your-route-badge">YOUR ROUTE</span>':'';
    const greenBadge=isBest?'<div style="font-size:10px;color:#1D9E75;margin-top:2px;">\u2713 Greenest</div>':'';
    const label=r.isRoute?'Your route':r.label;
    return`<tr class="${rowClass}"><td><span class="pill" style="${pillStyle}"><i class="ti ${r.icon}" style="font-size:12px;"></i>${label}</span>${routeBadge}${greenBadge}</td><td>${co2s}<div class="msub">/${freqLabel}</div></td><td>${ts}<div class="msub">trees impacted/yr</div></td><td>$${r.costD.toFixed(2)}<div class="msub">/${freqLabel}</div></td><td>${tmFmt}<div class="msub">/${freqLabel}</div></td><td><span style="font-size:14px;font-weight:500;color:${sc};">${r.score}</span><span style="font-size:10px;color:#aaa;">/100</span></td></tr>`;
  }).join('');
}
function copyShare(){const txt=document.getElementById('share-text').textContent;navigator.clipboard.writeText(txt).then(()=>{const btn=event.target.closest('.act-btn'),orig=btn.innerHTML;btn.innerHTML='<i class="ti ti-check"></i> Copied!';setTimeout(()=>{btn.innerHTML=orig;},2000);});}

// Legs are optional — user expands the panel to add them



  const fromEnc=encodeURIComponent(from+', Washington DC area');
  const toEnc=encodeURIComponent(to+', Washington DC area');

  // Embed: use OpenStreetMap directions via a static map image approach
  // Google Maps embed requires API key — use OSM-based embed instead
  const fromCoords=COORDS[from];
  const toCoords=COORDS[to];

  if(fromCoords&&toCoords){
    const midLat=((fromCoords[0]+toCoords[0])/2).toFixed(4);
    const midLng=((fromCoords[1]+toCoords[1])/2).toFixed(4);
    const distMi=haversineMiles(from,to)||5;
    // zoom level based on distance
    const zoom=distMi<3?14:distMi<8?13:distMi<20?11:distMi<50?9:8;

    // OpenStreetMap embed with markers
    const osmUrl=`https://www.openstreetmap.org/export/embed.html?bbox=${(midLng-0.15)},${(midLat-0.1)},${(parseFloat(midLng)+0.15)},${(parseFloat(midLat)+0.1)}&layer=mapnik&marker=${fromCoords[0]},${fromCoords[1]}`;
    iframe.src=osmUrl;
    iframe.style.display='block';
    placeholder.style.display='none';
    actions.style.display='flex';

    // Google Maps full route link
    const gmUrl=`https://www.google.com/maps/dir/?api=1&origin=${fromEnc}&destination=${toEnc}&travelmode=transit`;
    mapsLink.href=gmUrl;
  }
}


// ── GOOGLE MAPS INTEGRATION ───────────────────────────────────────────────────

// On popup open: check if current tab is Google Maps and pre-fill route
function tryReadMapsRoute() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tab = tabs[0];
    if (!tab || !tab.url) return;
    if (!tab.url.includes('google.com/maps')) return;

    chrome.tabs.sendMessage(tab.id, { type: 'GET_MAPS_ROUTE' }, function(response) {
      if (chrome.runtime.lastError || !response || !response.route) return;
      const { origin, destination } = response.route;
      if (!origin || !destination) return;

      // Try to match to dropdown options
      const fromSel = document.getElementById('from-loc');
      const toSel = document.getElementById('to-loc');

      let fromMatched = false, toMatched = false;

      // Case-insensitive partial match against dropdown options
      Array.from(fromSel.options).forEach(opt => {
        if (opt.value && origin.toLowerCase().includes(opt.value.toLowerCase().split(',')[0])) {
          fromSel.value = opt.value;
          fromMatched = true;
        }
      });
      Array.from(toSel.options).forEach(opt => {
        if (opt.value && destination.toLowerCase().includes(opt.value.toLowerCase().split(',')[0])) {
          toSel.value = opt.value;
          toMatched = true;
        }
      });

      // Show detected banner
      const banner = document.getElementById('maps-detected-banner');
      const bannerText = document.getElementById('maps-detected-text');
      if (banner) {
        const fromLabel = fromMatched ? fromSel.value : origin;
        const toLabel = toMatched ? toSel.value : destination;
        bannerText.textContent = `Route detected: ${fromLabel} → ${toLabel}`;
        banner.style.display = 'flex';
      }
    });
  });
}

// After compare: send carbon badge to Google Maps tab
function sendCarbonBadgeToMaps(data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tab = tabs[0];
    if (!tab || !tab.url || !tab.url.includes('google.com/maps')) return;
    chrome.tabs.sendMessage(tab.id, { type: 'SHOW_CARBON_BADGE', data });
  });
}

// ── EVENT WIRING (Chrome extension CSP requires no inline handlers) ──────────
document.addEventListener('DOMContentLoaded', function() {
  tryReadMapsRoute();

  // Location selectors — sync first/last leg AND update map
  document.getElementById('from-loc').addEventListener('change', function(){
    syncFirstLeg();
  });
  document.getElementById('to-loc').addEventListener('change', function(){
    syncLastLeg();
  });

  // Static buttons
  document.getElementById('swap-btn').addEventListener('click', function(){
    swapLocs();
  });
  document.getElementById('go-btn').addEventListener('click', runCompare);
  document.getElementById('legs-toggle').addEventListener('click', toggleLegs);
  document.getElementById('add-leg-btn').addEventListener('click', function(){ addLeg(); });
  const copyBtn=document.getElementById('copy-btn');
  if(copyBtn) copyBtn.addEventListener('click', copyShare);

  // Event delegation for dynamically added leg elements
  document.getElementById('legs-container').addEventListener('change', function(e) {
    const id = e.target.dataset.legid;
    if(id && (e.target.classList.contains('leg-from') || e.target.classList.contains('leg-to'))) {
      updateLegDist(id);
    }
  });
  document.getElementById('legs-container').addEventListener('click', function(e) {
    const btn = e.target.closest('.rm-btn');
    if(btn) removeLeg(btn.dataset.legid);
  });
});
