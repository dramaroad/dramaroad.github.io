const SEED_TALENTS=[
{id:'zina-zidan',name:'زينة زيدان',age:12,trainingYears:3,image:'zina-zidan.webp',heightCm:null,skills:[],gender:'أنثى',notes:''},
{id:'inji-ibrahim',name:'إنجي إبراهيم',age:15,trainingYears:4,image:'inji-ibrahim.webp',heightCm:null,skills:[],gender:'أنثى',notes:''},
{id:'jad-alrajoula',name:'جاد الرجولة',age:10,trainingYears:4,image:'jad-alrajoula.webp',heightCm:null,skills:[],gender:'ذكر',notes:''},
{id:'omar-tarkhoum',name:'عمر طرخوم',age:15,trainingYears:4,image:'omar-tarkhoum.webp',heightCm:null,skills:[],gender:'ذكر',notes:''},
{id:'zuhair-allaham',name:'زهير اللحام',age:15,trainingYears:3,image:'zuhair-allaham.webp',heightCm:190,skills:[],gender:'ذكر',notes:'الطول: 190 سم'},
{id:'jawad-khattab',name:'جواد خطاب',age:15,trainingYears:4,image:'jawad-khattab.webp',heightCm:null,skills:[],gender:'ذكر',notes:''},
{id:'nasser-abboud',name:'ناصر عبود',age:8,trainingYears:4,image:'nasser-abboud.webp',heightCm:null,skills:[],gender:'ذكر',notes:''},
{id:'ali-yakhoukh',name:'علي ياخوخ',age:16,trainingYears:4,image:'ali-yakhoukh.webp',heightCm:null,skills:[],gender:'ذكر',notes:''},
{id:'jamil-almarai',name:'جميل المرعي',age:11,trainingYears:4,image:'jamil-almarai.webp',heightCm:null,skills:[],gender:'ذكر',notes:''},
{id:'mahmoud-ali-jannad',name:'محمود علي جناد',age:12,trainingYears:4,image:'mahmoud-ali-jannad.webp',heightCm:null,skills:['غناء'],gender:'ذكر',notes:'غناء أيضاً'},
{id:'mohammad-saif-khaled',name:'محمد سيف خالد',age:13,trainingYears:4,image:'mohammad-saif-khaled.webp',heightCm:null,skills:[],gender:'ذكر',notes:''},
{id:'rita-ismail',name:'ريتا إسماعيل',age:13,trainingYears:3,image:'rita-ismail.webp',heightCm:null,skills:[],gender:'أنثى',notes:''},
{id:'alaa-sabsoub',name:'علاء سبسوب',age:16,trainingYears:3,image:'alaa-sabsoub.webp',heightCm:null,skills:[],gender:'ذكر',notes:''},
{id:'rinad-saleh',name:'ريناد صالح',age:14,trainingYears:3,image:'rinad-saleh.webp',heightCm:null,skills:[],gender:'أنثى',notes:''},
{id:'ali-ismail',name:'علي إسماعيل',age:14,trainingYears:3,image:'ali-ismail.webp',heightCm:null,skills:[],gender:'ذكر',notes:''},
{id:'rashid-alhamwi',name:'راشد الحموي',age:16,trainingYears:3,image:'rashid-alhamwi.webp',heightCm:null,skills:[],gender:'ذكر',notes:''},
{id:'esterfan-tamer',name:'استرفان تامر',age:13,trainingYears:3,image:'esterfan-tamer.webp',heightCm:null,skills:[],gender:'أنثى',notes:''},
{id:'mazen-malham',name:'مازن ملحم',age:13,trainingYears:3,image:'mazen-malham.webp',heightCm:null,skills:[],gender:'ذكر',notes:''},
{id:'zein-malham',name:'زين ملحم',age:11,trainingYears:3,image:'zein-malham.webp',heightCm:null,skills:[],gender:'ذكر',notes:''},
{id:'fajr-qais',name:'فجر قيس',age:17,trainingYears:3,image:'fajr-qais.webp',heightCm:null,skills:[],gender:'ذكر',notes:''}
];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let talents=[...SEED_TALENTS];
let projects=[];
let ageAscending=true;
function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]))}
function view(id){$$('.view').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active');$$('.nav-btn').forEach(x=>x.classList.toggle('active',x.dataset.view===id));window.scrollTo({top:0,behavior:'smooth'});if(id==='talents')renderTalents();if(id==='projects')renderProjects();}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view)));
$$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.scroll).scrollIntoView({behavior:'smooth'})));
function talentCard(t){const skills=t.skills?.length?t.skills.map(s=>`<span class="chip">${esc(s)}</span>`).join(''):'';return `<article class="talent-card" data-id="${esc(t.id)}"><div class="talent-photo"><img src="${esc(t.image||'logo.webp')}" alt="${esc(t.name)}" onerror="this.src='logo.webp'"><span class="years-badge">${t.trainingYears} سنوات في المعهد</span></div><div class="talent-body"><h3>${esc(t.name)}</h3><div class="meta"><span class="chip red">${t.age} سنة</span>${t.heightCm?`<span class="chip">${t.heightCm} سم</span>`:''}${skills}</div><p class="talent-note">${esc(t.notes||'Drama Road Young Talent')}</p></div></article>`}
function wireCards(){$$('.talent-card').forEach(c=>c.onclick=()=>openProfile(c.dataset.id))}
function renderFeatured(){const list=[talents[0],talents[1],talents[9],talents[19]].filter(Boolean);$('#featuredGrid').innerHTML=list.map(talentCard).join('');wireCards()}
function renderTalents(){let name=$('#nameFilter').value.trim(),age=$('#ageFilter').value,years=$('#yearsFilter').value,gender=$('#genderFilter').value,skill=$('#skillFilter').value.trim();let list=talents.filter(t=>(!name||t.name.includes(name))&&(!age||t.age===+age)&&(!years||t.trainingYears===+years)&&(!gender||t.gender===gender)&&(!skill||((t.skills||[]).join(' ').includes(skill))));list.sort((a,b)=>ageAscending?a.age-b.age:b.age-a.age);$('#resultsInfo').textContent=`${list.length} نتيجة من ${talents.length} موهبة`;$('#talentGrid').innerHTML=list.length?list.map(talentCard).join(''):`<div class="empty">لا توجد مواهب مطابقة لهذه المواصفات.</div>`;wireCards()}
['#nameFilter','#ageFilter','#yearsFilter','#genderFilter','#skillFilter'].forEach(s=>$(s).addEventListener('input',renderTalents));
$('#clearFilters').onclick=()=>{['nameFilter','ageFilter','yearsFilter','genderFilter','skillFilter'].forEach(id=>$('#'+id).value='');renderTalents()};
$('#sortBtn').onclick=()=>{ageAscending=!ageAscending;$('#sortBtn').textContent=`ترتيب حسب العمر ${ageAscending?'↑':'↓'}`;renderTalents()};
$('#quickSearch').onclick=()=>{$('#ageFilter').value=$('#quickAge').value;$('#yearsFilter').value=$('#quickYears').value;$('#genderFilter').value=$('#quickGender').value;$('#nameFilter').value='';$('#skillFilter').value='';view('talents')};
function talentProfileUrl(t){
  const base=location.origin+location.pathname;
  return `${base}?talent=${encodeURIComponent(t.id)}`;
}
function talentImageUrl(t){
  return new URL(t.image||'logo.webp', location.href).href;
}
function whatsappTalentUrl(t){
  const message=[
    'مرحباً معهد Drama Road،',
    'أرغب بالتواصل بخصوص هذه الموهبة:',
    `الاسم: ${t.name}`,
    `العمر: ${t.age} سنة`,
    `مدة الدراسة: ${t.trainingYears} سنوات`,
    t.gender?`الجنس: ${t.gender==='أنثى'?'بنت':'ولد'}`:'',
    t.skills?.length?`المهارات: ${t.skills.join('، ')}`:'',
    `صورة الموهبة: ${talentImageUrl(t)}`,
    `ملف الموهبة: ${talentProfileUrl(t)}`,
    '',
    'أرجو تأكيد التواصل بخصوص هذه الموهبة.'
  ].filter(Boolean).join('\n');
  return `https://wa.me/963996308308?text=${encodeURIComponent(message)}`;
}
function openProfile(id){const t=talents.find(x=>x.id===id);if(!t)return;const tp=projects.filter(p=>p.talentId===id);$('#profileContent').innerHTML=`<div class="profile-wrap"><div class="profile-image"><img src="${esc(t.image||'logo.webp')}" alt="${esc(t.name)}" onerror="this.src='logo.webp'"></div><div class="profile-info"><span class="eyebrow">DRAMA ROAD TALENT</span><h2>${esc(t.name)}</h2><div class="meta"><span class="chip red">${t.age} سنة</span><span class="chip">${t.trainingYears} سنوات دراسة</span>${t.heightCm?`<span class="chip">${t.heightCm} سم</span>`:''}${t.gender?`<span class="chip">${esc(t.gender==='أنثى'?'بنت':'ولد')}</span>`:''}</div><div class="profile-details"><div class="detail"><small>العمر</small><b>${t.age} سنة</b></div><div class="detail"><small>مدة الدراسة</small><b>${t.trainingYears} سنوات في Drama Road</b></div><div class="detail"><small>المهارات</small><b>${t.skills?.length?esc(t.skills.join('، ')):'—'}</b></div><div class="detail"><small>ملاحظات</small><b>${esc(t.notes||'—')}</b></div></div><a class="whatsapp-talent-btn" href="${whatsappTalentUrl(t)}" target="_blank" rel="noopener"><span>واتساب</span><div><b>طلب هذه الموهبة</b><small>إرسال الاسم والصورة إلى معهد Drama Road</small></div></a><div class="profile-projects"><h4>المشاريع والأعمال</h4>${tp.length?tp.map(p=>`<div class="mini-project"><b>${esc(p.title)}</b><div>${esc(p.type||'')} ${p.year?'• '+p.year:''}${p.role?' • '+esc(p.role):''}</div></div>`).join(''):'<p style="color:#888">لا توجد مشاريع مضافة بعد.</p>'}</div></div></div>`;$('#profileModal').classList.add('show');$('#profileModal').setAttribute('aria-hidden','false');history.replaceState(null,'',talentProfileUrl(t))}
function closeProfile(){ $('#profileModal').classList.remove('show'); $('#profileModal').setAttribute('aria-hidden','true'); history.replaceState(null,'',location.pathname); }
$('#closeProfile').onclick=closeProfile;$('#profileModal').onclick=e=>{if(e.target===$('#profileModal'))closeProfile()};
function renderProjects(){if(!projects.length){$('#projectsGrid').innerHTML='<div class="empty">لم تتم إضافة مشاريع بعد. يمكنك إضافة أول مشروع من قسم الإدارة.</div>';return}$('#projectsGrid').innerHTML=projects.map(p=>{const t=talents.find(x=>x.id===p.talentId);return `<article class="project-card"><span class="eyebrow">${esc(p.type||'PROJECT')}</span><h3>${esc(p.title)}</h3><p><b>${esc(t?.name||'موهبة')}</b>${p.role?' • '+esc(p.role):''}${p.year?' • '+p.year:''}</p></article>`}).join('')}
function updateStats(){$('#talentCount').textContent=talents.length;$('#projectCount').textContent=projects.length}
$('#year').textContent=new Date().getFullYear();renderFeatured();renderTalents();renderProjects();updateStats();const initialTalent=new URLSearchParams(location.search).get('talent');if(initialTalent&&talents.some(t=>t.id===initialTalent))setTimeout(()=>openProfile(initialTalent),80);
