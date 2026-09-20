/* Drama Road - additional students + WhatsApp/share update */
(function(){
  const NEW_STUDENTS = [
    {id:'rama-sherif-salloum',name:'راما شريف سلوم',age:9,trainingYears:0.5,image:'rama-sherif-salloum.webp',heightCm:null,skills:[],gender:'أنثى',notes:'',phone:'0935122700'},
    {id:'basel-wael-naqrash',name:'باسل وائل نقرش',age:8,trainingYears:0.5,image:'basel-wael-naqrash.webp',heightCm:null,skills:[],gender:'ذكر',notes:'',phone:'0951950333'},
    {id:'sham-botros-shneis',name:'شام بطرس شنيص',age:13,trainingYears:0.5,image:'sham-botros-shneis.webp',heightCm:null,skills:[],gender:'أنثى',notes:'',phone:'0939247448'},
    {id:'yousef-khaled-algharib',name:'يوسف خالد الغريب',age:9.5833,ageText:'9 سنوات و7 أشهر',trainingYears:1,image:'yousef-khaled-algharib.webp',heightCm:null,skills:[],gender:'ذكر',notes:'',phone:'0988884392'},
    {id:'maria-hossam-alsaada',name:'ماريا حسام الدين سعدة',age:15,trainingYears:0.5,image:'maria-hossam-alsaada.webp',heightCm:null,skills:[],gender:'أنثى',notes:'',phone:'0957738863'},
    {id:'alhassan-raafat-haroub',name:'الحسن رافت حروب',age:15,trainingYears:0.5,image:'alhassan-raafat-haroub.webp',heightCm:null,skills:[],gender:'ذكر',notes:'',phone:'0986061370'}
  ];

  // Add only if not already present.
  NEW_STUDENTS.forEach(t=>{
    if(!talents.some(x=>x.id===t.id || x.name===t.name)) talents.push(t);
  });

  // Better Arabic study-duration labels.
  trainingLabel = function(t){
    if(t.trainingYears===0.5) return '6 أشهر';
    if(t.trainingYears===1) return 'سنة';
    if(t.trainingYears===2) return 'سنتان';
    return `${t.trainingYears} سنوات`;
  };

  function studentMessage(t){
    return [
      'مرحباً معهد Drama Road،',
      'أرغب بالتواصل بخصوص هذه الموهبة:',
      `الاسم: ${t.name}`,
      `العمر: ${ageLabel(t)}`,
      `مدة الدراسة: ${trainingLabel(t)}`,
      t.gender ? `الجنس: ${t.gender==='أنثى'?'بنت':'ولد'}` : '',
      t.phone ? `رقم موبايل الطالب/ـة: ${t.phone}` : '',
      t.skills?.length ? `المهارات: ${t.skills.join('، ')}` : '',
      `ملف الموهبة: ${talentProfileUrl(t)}`,
      '',
      'أرجو تأكيد التواصل بخصوص هذه الموهبة.'
    ].filter(Boolean).join('\n');
  }

  // Direct WhatsApp chat: text only. Phone appears in the composed message only when available.
  whatsappTalentUrl = function(t){
    return `https://wa.me/963996308308?text=${encodeURIComponent(studentMessage(t))}`;
  };

  // Share the ACTUAL image file + the same data via the native share sheet.
  // On iPhone/Android choose WhatsApp, then choose the Drama Road chat.
  window.shareTalentWithImage = async function(id){
    const t=talents.find(x=>x.id===id);
    if(!t) return;
    try{
      const response=await fetch(t.image||'logo.webp',{cache:'force-cache'});
      const blob=await response.blob();
      const type=blob.type||'image/webp';
      const ext=type.includes('jpeg')?'jpg':type.includes('png')?'png':'webp';
      const file=new File([blob],`${t.id}.${ext}`,{type});
      const shareData={title:`Drama Road - ${t.name}`,text:studentMessage(t),files:[file]};
      if(navigator.share && (!navigator.canShare || navigator.canShare({files:[file]}))){
        await navigator.share(shareData);
      }else{
        window.open(whatsappTalentUrl(t),'_blank','noopener');
      }
    }catch(err){
      window.open(whatsappTalentUrl(t),'_blank','noopener');
    }
  };

  // Profile modal: keep phone hidden from the site UI; add image-share action.
  openProfile = function(id){
    const t=talents.find(x=>x.id===id);if(!t)return;
    const tp=projects.filter(p=>p.talentId===id);
    $('#profileContent').innerHTML=`<div class="profile-wrap"><div class="profile-image"><img src="${esc(t.image||'logo.webp')}" alt="${esc(t.name)}" onerror="this.src='logo.webp'"></div><div class="profile-info"><span class="eyebrow">DRAMA ROAD TALENT</span><div class="profile-title-row"><h2>${esc(t.name)}</h2>${tp.length?`<button class="profile-projects-jump" type="button" onclick="document.getElementById('profileProjectsSection').scrollIntoView({behavior:'smooth',block:'start'})">مشاريع ${esc(t.name.split(' ')[0])}</button>`:''}</div><div class="meta"><span class="chip red">${ageLabel(t)}</span><span class="chip">${trainingLabel(t)} دراسة</span>${t.heightCm?`<span class="chip">${t.heightCm} سم</span>`:''}${t.gender?`<span class="chip">${esc(t.gender==='أنثى'?'بنت':'ولد')}</span>`:''}</div><div class="profile-details"><div class="detail compact-detail"><small>العمر</small><b>${ageLabel(t)}</b></div><div class="detail compact-detail"><small>مدة الدراسة</small><b>${trainingLabel(t)} في Drama Road</b></div><div class="detail"><small>المهارات</small><b>${t.skills?.length?esc(t.skills.join('، ')):'—'}</b></div><div class="detail"><small>ملاحظات</small><b>${esc(t.notes||'—')}</b></div></div><div class="talent-contact-actions"><button class="share-image-whatsapp" type="button" onclick="shareTalentWithImage('${esc(t.id)}')"><span>📷</span><div><b>إرسال الصورة والبيانات</b><small>اختر واتساب ثم محادثة معهد Drama Road</small></div></button><a class="whatsapp-talent-btn" href="${whatsappTalentUrl(t)}" target="_blank" rel="noopener"><span>واتساب</span><div><b>فتح واتساب المعهد</b><small>رسالة جاهزة بالبيانات${t.phone?' ورقم الطالب/ـة':''}</small></div></a></div><div class="profile-projects" id="profileProjectsSection"><h4>المشاريع والأعمال</h4>${tp.length?tp.map(p=>`<div class="mini-project"><b>${esc(p.title)}</b><div>${esc(p.type||'')} ${p.year?'• '+p.year:''}${p.role?' • '+esc(p.role):''}</div>${p.url?`<a class="project-link-btn" href="${esc(p.url)}" target="_blank" rel="noopener">▶ مشاهدة المشروع</a>`:''}</div>`).join(''):'<p style="color:#888">لا توجد مشاريع مضافة بعد.</p>'}</div></div></div>`;
    $('#profileModal').classList.add('show');
    $('#profileModal').setAttribute('aria-hidden','false');
    history.replaceState(null,'',talentProfileUrl(t));
  };

  const style=document.createElement('style');
  style.textContent=`
    .talent-contact-actions{display:grid;grid-template-columns:1fr;gap:9px;margin:18px 0 8px}
    .talent-contact-actions .whatsapp-talent-btn{margin:0}
    .share-image-whatsapp{width:100%;border:1px solid #e9e9e9;background:#fff;color:#161616;border-radius:18px;padding:14px 17px;display:flex;align-items:center;gap:14px;text-align:right;cursor:pointer}
    .share-image-whatsapp>span{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:#fff0f1;font-size:22px;flex:0 0 auto}
    .share-image-whatsapp div{display:flex;flex-direction:column;gap:3px}.share-image-whatsapp b{font-size:15px}.share-image-whatsapp small{font-size:11px;color:#777;line-height:1.5}
  `;
  document.head.appendChild(style);

  // Refresh current UI and counts.
  if(typeof renderTalents==='function') renderTalents();
  if(typeof updateStats==='function') updateStats();
  const heroCount=document.querySelector('.hero-visual .float-card strong');
  if(heroCount) heroCount.textContent=talents.length;
  const talentsIntro=document.querySelector('#talents .page-head p');
  if(talentsIntro) talentsIntro.textContent=`${talents.length} موهبة من قسم الأطفال في Drama Road.`;
  const studyStat=document.querySelector('.stats article:nth-child(3) b');
  if(studyStat) studyStat.textContent='6 أشهر–4 سنوات';

  const initialTalent=new URLSearchParams(location.search).get('talent');
  if(initialTalent && NEW_STUDENTS.some(t=>t.id===initialTalent)) setTimeout(()=>openProfile(initialTalent),100);
})();
