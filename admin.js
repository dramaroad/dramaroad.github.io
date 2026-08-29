(function(){
  let data=DR.getData();
  const $=id=>document.getElementById(id);
  const refs={
    form:$('talentForm'),editId:$('editId'),name:$('talentName'),age:$('talentAge'),gender:$('talentGender'),years:$('talentYears'),height:$('talentHeight'),skills:$('talentSkills'),image:$('talentImage'),preview:$('imagePreview'),title:$('talentFormTitle'),cancel:$('cancelEdit'),
    projectForm:$('projectForm'),projectTalent:$('projectTalent'),projectTitle:$('projectTitle'),projectType:$('projectType'),projectRole:$('projectRole'),projectYear:$('projectYear'),projectList:$('projectListAdmin'),table:$('adminTableBody'),search:$('adminSearch'),toast:$('toast')
  };
  renderAll();

  refs.image.addEventListener('change',async()=>{const f=refs.image.files?.[0];if(!f){refs.preview.style.display='none';return;}if(f.size>3*1024*1024){showToast('الصورة كبيرة. يُفضّل أقل من 3MB.');refs.image.value='';return;}const url=await fileToDataURL(f);refs.preview.src=url;refs.preview.style.display='block';});

  refs.form.addEventListener('submit',async e=>{
    e.preventDefault();
    const name=refs.name.value.trim();const age=Number(refs.age.value);const years=Number(refs.years.value);
    if(!name||!Number.isFinite(age)||age<4||age>25){showToast('تحقق من الاسم والعمر.');return;}
    const editing=refs.editId.value;
    let image=''; const f=refs.image.files?.[0]; if(f) image=await fileToDataURL(f);
    if(editing){
      const i=data.findIndex(x=>x.id===editing);if(i<0)return;
      data[i]={...data[i],name,age,gender:refs.gender.value,trainingYears:years,heightCm:refs.height.value?Number(refs.height.value):null,skills:splitSkills(refs.skills.value),image:image||data[i].image};
      showToast('تم تحديث الموهبة.');
    }else{
      if(!image){showToast('ارفع صورة للموهبة الجديدة.');return;}
      let id=DR.slugifyArabic(name); while(data.some(x=>x.id===id)) id=id+'-'+Math.floor(Math.random()*9999);
      data.push({id,name,age,gender:refs.gender.value,trainingYears:years,image,heightCm:refs.height.value?Number(refs.height.value):null,skills:splitSkills(refs.skills.value),projects:[]});
      showToast('تمت إضافة الموهبة.');
    }
    DR.saveData(data);clearTalentForm();renderAll();
  });

  refs.cancel.addEventListener('click',clearTalentForm);
  refs.search.addEventListener('input',renderTable);
  refs.projectTalent.addEventListener('change',renderProjectList);
  refs.projectForm.addEventListener('submit',e=>{
    e.preventDefault();const id=refs.projectTalent.value;const t=data.find(x=>x.id===id);if(!t)return;
    const title=refs.projectTitle.value.trim();if(!title){showToast('اكتب اسم المشروع.');return;}
    t.projects=t.projects||[];t.projects.push({id:'p-'+Date.now(),title,type:refs.projectType.value.trim(),role:refs.projectRole.value.trim(),year:refs.projectYear.value.trim()});
    DR.saveData(data);refs.projectForm.reset();refs.projectTalent.value=id;showToast('تمت إضافة المشروع.');renderAll();
  });

  $('exportData').addEventListener('click',()=>{
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='drama-road-kids-data.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
  });
  $('importData').addEventListener('change',async e=>{
    const f=e.target.files?.[0];if(!f)return;try{const parsed=JSON.parse(await f.text());if(!Array.isArray(parsed))throw new Error('bad');data=parsed;DR.saveData(data);clearTalentForm();renderAll();showToast('تم استيراد البيانات.');}catch(err){showToast('ملف البيانات غير صالح.');}e.target.value='';
  });

  function renderAll(){renderStats();renderTalentSelect();renderTable();renderProjectList();}
  function renderStats(){
    $('statTotal').textContent=data.length;
    $('statGirls').textContent=data.filter(x=>x.gender==='female').length;
    $('statBoys').textContent=data.filter(x=>x.gender==='male').length;
    $('statProjects').textContent=data.reduce((n,x)=>n+(x.projects||[]).length,0);
  }
  function renderTalentSelect(){
    const current=refs.projectTalent.value;refs.projectTalent.innerHTML='<option value="">اختر الموهبة</option>'+data.slice().sort((a,b)=>a.name.localeCompare(b.name,'ar')).map(t=>`<option value="${DR.esc(t.id)}">${DR.esc(t.name)} • ${t.age} سنة</option>`).join('');if(data.some(x=>x.id===current))refs.projectTalent.value=current;
  }
  function renderTable(){
    const q=norm(refs.search.value);const out=data.filter(t=>!q||norm(t.name).includes(q)||(t.skills||[]).some(s=>norm(s).includes(q)));
    refs.table.innerHTML=out.map(t=>`<tr><td><img class="admin-avatar" src="${DR.esc(t.image)}" alt=""></td><td><strong>${DR.esc(t.name)}</strong></td><td>${t.age}</td><td>${DR.genderLabel(t.gender)}</td><td>${DR.yearsLabel(t.trainingYears)}</td><td>${(t.skills||[]).length?DR.esc(t.skills.join('، ')):'—'}</td><td>${(t.projects||[]).length}</td><td><div class="actions"><button class="mini-btn" type="button" data-edit="${DR.esc(t.id)}">تعديل</button><button class="mini-btn red" type="button" data-delete="${DR.esc(t.id)}">حذف</button></div></td></tr>`).join('');
    refs.table.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>startEdit(b.dataset.edit)));
    refs.table.querySelectorAll('[data-delete]').forEach(b=>b.addEventListener('click',()=>deleteTalent(b.dataset.delete)));
  }
  function renderProjectList(){
    const t=data.find(x=>x.id===refs.projectTalent.value); if(!t){refs.projectList.innerHTML='<div style="font-size:12px;color:var(--muted)">اختر موهبة لعرض مشاريعها.</div>';return;}
    const ps=t.projects||[];refs.projectList.innerHTML=ps.length?ps.map(p=>`<div class="project-row-admin"><div><strong>${DR.esc(p.title)}</strong><span>${DR.esc(p.type||'')} ${p.role?'• '+DR.esc(p.role):''} ${p.year?'• '+DR.esc(p.year):''}</span></div><button class="mini-btn red" type="button" data-project-delete="${DR.esc(p.id)}">حذف</button></div>`).join(''):'<div style="font-size:12px;color:var(--muted)">لا توجد مشاريع لهذه الموهبة بعد.</div>';
    refs.projectList.querySelectorAll('[data-project-delete]').forEach(b=>b.addEventListener('click',()=>{t.projects=(t.projects||[]).filter(p=>p.id!==b.dataset.projectDelete);DR.saveData(data);renderAll();showToast('تم حذف المشروع.');}));
  }
  function startEdit(id){
    const t=data.find(x=>x.id===id);if(!t)return;refs.editId.value=t.id;refs.name.value=t.name;refs.age.value=t.age;refs.gender.value=t.gender||'';refs.years.value=t.trainingYears;refs.height.value=t.heightCm||'';refs.skills.value=(t.skills||[]).join('، ');refs.preview.src=t.image;refs.preview.style.display='block';refs.title.textContent='تعديل بيانات الموهبة';refs.cancel.style.display='inline-flex';document.getElementById('addTalent').scrollIntoView({behavior:'smooth'});
  }
  function clearTalentForm(){refs.form.reset();refs.editId.value='';refs.years.value='3';refs.preview.removeAttribute('src');refs.preview.style.display='none';refs.title.textContent='إضافة موهبة جديدة';refs.cancel.style.display='none';}
  function deleteTalent(id){const t=data.find(x=>x.id===id);if(!t)return;if(!confirm(`حذف ${t.name} من القائمة؟`))return;data=data.filter(x=>x.id!==id);DR.saveData(data);if(refs.editId.value===id)clearTalentForm();renderAll();showToast('تم حذف الموهبة.');}
  function splitSkills(s){return String(s||'').split(/[،,]/).map(x=>x.trim()).filter(Boolean)}
  function fileToDataURL(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=reject;r.readAsDataURL(file);});}
  function showToast(msg){refs.toast.textContent=msg;refs.toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>refs.toast.classList.remove('show'),2600)}
  function norm(s){return String(s||'').toLowerCase().trim().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه')}
})();
