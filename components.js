(function(){
  function nav(active){
    const items=[['index.html','الرئيسية','home'],['talents.html','المواهب','talents'],['projects.html','المشاريع','projects'],['about.html','عن المعهد','about'],['contact.html','تواصل معنا','contact']];
    return `<header class="topbar"><div class="container nav">
      <a class="brand" href="index.html"><img src="assets/images/logo.webp" alt="Drama Road"><span class="brand-copy"><strong>Drama Road</strong><span>KIDS • YOUNG TALENTS</span></span></a>
      <nav class="desktop-nav" aria-label="التنقل الرئيسي">${items.map(([href,label,key])=>`<a class="nav-link ${active===key?'active':''}" href="${href}">${label}</a>`).join('')}<a class="btn btn-primary nav-cta" href="talents.html">استكشف المواهب</a></nav>
      <button class="mobile-menu" id="mobileMenu" type="button" aria-label="فتح القائمة">☰</button>
    </div><div class="mobile-panel" id="mobilePanel">${items.map(([href,label,key])=>`<a class="nav-link ${active===key?'active':''}" href="${href}">${label}</a>`).join('')}<a class="btn btn-primary" href="talents.html">استكشف المواهب</a></div></header>`;
  }
  function footer(){return `<footer class="footer"><div class="container footer-main">
    <div class="footer-brand"><img src="assets/images/logo.webp" alt="Drama Road"><div><h3>Drama Road Kids</h3><p>دليل مواهب تمثيلية للأطفال واليافعين، مصمم لتسهيل وصول المخرجين وشركات الإنتاج إلى الموهبة المناسبة بسرعة ووضوح.</p></div></div>
    <div class="footer-col"><h4>روابط سريعة</h4><a href="talents.html">المواهب</a><a href="projects.html">المشاريع</a><a href="about.html">عن المعهد</a><a href="contact.html">تواصل معنا</a></div>
    <div class="footer-col"><h4>الإدارة</h4><a href="admin.html">لوحة إدارة المواهب</a><span>إضافة وتعديل الأطفال والمشاريع</span><span>Drama Road © 2026</span></div>
  </div><div class="container footer-bottom"><span>جميع الحقوق محفوظة لمعهد Drama Road.</span><span>معلومات التواصل الرسمية تُضاف من لوحة الإدارة عند اعتمادها.</span></div></footer>`;}
  function initMenu(){const b=document.getElementById('mobileMenu'),p=document.getElementById('mobilePanel');if(b&&p)b.addEventListener('click',()=>p.classList.toggle('open'));}
  function talentCard(t){
    const gender=t.gender?`<span class="badge">${DR.genderLabel(t.gender)}</span>`:`<span class="badge">النوع غير محدد</span>`;
    const skills=(t.skills||[]).slice(0,2).map(s=>`<span class="badge red">${DR.esc(s)}</span>`).join('');
    return `<article class="talent-card"><a href="profile.html?id=${encodeURIComponent(t.id)}" aria-label="فتح ملف ${DR.esc(t.name)}"><div class="talent-photo"><img src="${DR.esc(t.image)}" alt="صورة ${DR.esc(t.name)}"><span class="photo-badge">${t.age} سنة</span></div><div class="talent-body"><h3 class="talent-name">${DR.esc(t.name)}</h3><div class="talent-meta"><span class="badge dark">${DR.yearsLabel(t.trainingYears)} دراسة</span>${gender}${skills}</div><div class="card-footer"><span class="card-link">عرض الملف ←</span><span class="muted-link">Drama Road</span></div></div></a></article>`;
  }
  window.DRUI={nav,footer,initMenu,talentCard};
})();
