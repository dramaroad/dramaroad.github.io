(function(){
  const page=document.body.dataset.page;
  const header=document.getElementById('siteHeader');const foot=document.getElementById('siteFooter');
  if(header)header.innerHTML=DRUI.nav(page==='profile'?'talents':page);
  if(foot)foot.innerHTML=DRUI.footer();
  DRUI.initMenu();
  const data=DR.getData();

  if(page==='home') initHome();
  if(page==='talents') initTalents();
  if(page==='profile') initProfile();
  if(page==='projects') initProjects();

  function initHome(){
    const grid=document.getElementById('featuredGrid'); if(grid) grid.innerHTML=data.slice(0,8).map(DRUI.talentCard).join('');
    setText('totalTalents',data.length); setText('ageRange',ageRange(data)); setText('threeYears',data.filter(x=>x.trainingYears===3).length); setText('fourYears',data.filter(x=>x.trainingYears===4).length);
    const age=document.getElementById('homeAge'); if(age) populateAges(age,data);
    const form=document.getElementById('homeSearch'); if(form) form.addEventListener('submit',e=>{e.preventDefault();const q=new URLSearchParams(); const g=document.getElementById('homeGender').value,a=document.getElementById('homeAge').value,y=document.getElementById('homeYears').value; if(g)q.set('gender',g);if(a)q.set('age',a);if(y)q.set('years',y);location.href='talents.html?'+q.toString();});
  }

  function initTalents(){
    const refs={grid:el('talentGrid'),search:el('searchFilter'),gender:el('genderFilter'),age:el('ageFilter'),years:el('yearsFilter'),skill:el('skillFilter'),count:el('resultCount'),chips:el('activeChips')};
    populateAges(refs.age,data); populateSkills(refs.skill,data);
    const qs=new URLSearchParams(location.search); ['gender','age','years','skill'].forEach(k=>{const target=refs[k==='years'?'years':k];if(target&&qs.get(k))target.value=qs.get(k);});
    if(qs.get('q')) refs.search.value=qs.get('q');
    [refs.search,refs.gender,refs.age,refs.years,refs.skill].forEach(x=>x&&x.addEventListener(x===refs.search?'input':'change',render));
    el('resetFilters')?.addEventListener('click',()=>{refs.search.value='';refs.gender.value='';refs.age.value='';refs.years.value='';refs.skill.value='';render();});
    render();
    function render(){
      const q=norm(refs.search.value),g=refs.gender.value,a=refs.age.value,y=refs.years.value,s=refs.skill.value;
      const out=data.filter(t=>(!q||norm(t.name).includes(q)||(t.skills||[]).some(x=>norm(x).includes(q)))&&(!g||t.gender===g)&&(!a||String(t.age)===a)&&(!y||String(t.trainingYears)===y)&&(!s||(t.skills||[]).includes(s)));
      refs.grid.innerHTML=out.length?out.map(DRUI.talentCard).join(''):`<div class="empty-state"><strong>لا توجد نتائج مطابقة</strong><span>غيّر أحد الفلاتر أو امسحها لعرض المواهب من جديد.</span></div>`;
      refs.count.textContent=`${out.length} موهبة`;
      const items=[]; if(g)items.push(DR.genderLabel(g));if(a)items.push(`${a} سنة`);if(y)items.push(`${y} سنوات دراسة`);if(s)items.push(s);if(q)items.push(`بحث: ${refs.search.value}`);
      refs.chips.innerHTML=items.length?items.map(x=>`<span class="active-chip">${DR.esc(x)}</span>`).join(''):'<span>لا توجد فلاتر نشطة.</span>';
    }
  }

  function initProfile(){
    const id=new URLSearchParams(location.search).get('id'); const t=data.find(x=>x.id===id) || data[0];
    if(!t){el('profileRoot').innerHTML='<div class="empty-state"><strong>لا توجد بيانات.</strong></div>';return;}
    document.title=`${t.name} | Drama Road`;
    const projects=(t.projects||[]);
    const skills=(t.skills||[]);
    el('profileRoot').innerHTML=`<div class="profile-card"><div class="profile-image"><img src="${DR.esc(t.image)}" alt="${DR.esc(t.name)}"><a class="back-link" href="talents.html">← العودة إلى المواهب</a></div><div class="profile-content"><span class="eyebrow">Drama Road Talent</span><h1>${DR.esc(t.name)}</h1><p class="profile-intro">طالب/ة في قسم الأطفال واليافعين في معهد Drama Road. هذا الملف مخصص لعرض المعلومات الأساسية والخبرة والمشاريع أمام جهات الإنتاج والكاستينغ.</p><div class="profile-facts"><div class="fact"><span>العمر</span><strong>${t.age} سنة</strong></div><div class="fact"><span>مدة الدراسة في المعهد</span><strong>${DR.yearsLabel(t.trainingYears)}</strong></div><div class="fact"><span>النوع</span><strong>${DR.genderLabel(t.gender)}</strong></div><div class="fact"><span>الطول</span><strong>${t.heightCm?`${t.heightCm} سم`:'غير مضاف'}</strong></div></div><div class="profile-skills">${skills.length?skills.map(x=>`<span class="badge red">${DR.esc(x)}</span>`).join(''):'<span class="badge">لم تُضف مهارات خاصة بعد</span>'}</div><div class="profile-actions"><a class="btn btn-primary" href="contact.html?talent=${encodeURIComponent(t.name)}">اطلب ترشيح هذه الموهبة</a><a class="btn btn-outline" href="talents.html">استعرض مواهب أخرى</a></div></div></div>
      <section class="profile-section"><h2>الأعمال والمشاريع</h2>${projects.length?`<div class="profile-projects">${projects.map(p=>`<div class="mini-project"><strong>${DR.esc(p.title||'مشروع')}</strong><span>${DR.esc(p.type||'')} ${p.role?'• '+DR.esc(p.role):''} ${p.year?'• '+DR.esc(p.year):''}</span></div>`).join('')}</div>`:`<div class="placeholder-panel"><strong>لم تُضف مشاريع لهذه الموهبة بعد</strong><span>يمكن لإدارة Drama Road إضافتها من لوحة الإدارة في أي وقت.</span></div>`}</section>`;
  }

  function initProjects(){
    const projects=[]; data.forEach(t=>(t.projects||[]).forEach(p=>projects.push({...p,talent:t.name,talentId:t.id})));
    const root=el('projectsRoot');
    root.innerHTML=projects.length?projects.map(p=>`<article class="project-card"><div class="project-cover">▶</div><div class="project-body"><h3>${DR.esc(p.title||'مشروع')}</h3><p>${DR.esc(p.type||'عمل تمثيلي')} ${p.role?'• '+DR.esc(p.role):''} ${p.year?'• '+DR.esc(p.year):''}<br>الموهبة: <a class="card-link" href="profile.html?id=${encodeURIComponent(p.talentId)}">${DR.esc(p.talent)}</a></p></div></article>`).join(''):`<div class="placeholder-panel" style="grid-column:1/-1"><strong>قسم المشاريع جاهز</strong><span>عند إضافة أي مشروع لطفل من لوحة الإدارة سيظهر هنا تلقائياً على هذا الجهاز.</span></div>`;
  }

  function el(id){return document.getElementById(id)}
  function setText(id,v){const x=el(id);if(x)x.textContent=v}
  function norm(s){return String(s||'').trim().toLowerCase().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه')}
  function populateAges(select,arr){if(!select)return;const ages=[...new Set(arr.map(x=>x.age))].sort((a,b)=>a-b);select.innerHTML='<option value="">كل الأعمار</option>'+ages.map(a=>`<option value="${a}">${a} سنة</option>`).join('')}
  function populateSkills(select,arr){if(!select)return;const skills=[...new Set(arr.flatMap(x=>x.skills||[]))].sort();select.innerHTML='<option value="">كل المهارات</option>'+skills.map(s=>`<option value="${DR.esc(s)}">${DR.esc(s)}</option>`).join('')}
  function ageRange(arr){if(!arr.length)return'-';const v=arr.map(x=>x.age);return `${Math.min(...v)}–${Math.max(...v)}`}
})();
