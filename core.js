(function(){
  const KEY='dramaRoadKidsDataV2';
  const seed=()=>JSON.parse(JSON.stringify(window.DRAMA_ROAD_SEED||[]));
  function getData(){
    try{const raw=localStorage.getItem(KEY); if(raw){const parsed=JSON.parse(raw); if(Array.isArray(parsed)) return parsed;}}
    catch(e){}
    return seed();
  }
  function saveData(data){localStorage.setItem(KEY,JSON.stringify(data));}
  function resetData(){localStorage.removeItem(KEY);return seed();}
  function genderLabel(v){return v==='female'?'بنت':v==='male'?'ولد':'غير محدد';}
  function yearsLabel(n){return Number(n)===3?'3 سنوات':Number(n)===4?'4 سنوات':`${n} سنوات`;}
  function slugifyArabic(s){return String(s||'talent').trim().toLowerCase().replace(/\s+/g,'-').replace(/[^\u0600-\u06FFa-z0-9-]/g,'').replace(/-+/g,'-')||('talent-'+Date.now());}
  function esc(value){return String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  window.DR={KEY,getData,saveData,resetData,genderLabel,yearsLabel,slugifyArabic,esc};
})();
