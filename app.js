(()=>{
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const rok=$('#rok'); if(rok) rok.textContent=new Date().getFullYear();

  // menu mobilne
  const burger=$('.burger'), menu=$('#menu-mob');
  const zamknij=()=>{burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');menu.hidden=true;document.body.style.overflow=''};
  burger.addEventListener('click',()=>{
    const otw=burger.getAttribute('aria-expanded')==='true';
    if(otw) zamknij(); else {burger.setAttribute('aria-expanded','true');burger.setAttribute('aria-label','Zamknij menu');menu.hidden=false;document.body.style.overflow='hidden'}
  });
  $$('a',menu).forEach(a=>a.addEventListener('click',zamknij));
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden)zamknij()});

  // aktywna pozycja menu
  const linki=$$('.nav a'); const sekcje=linki.map(a=>$(a.getAttribute('href')));
  const io=new IntersectionObserver(w=>{w.forEach(x=>{if(x.isIntersecting){linki.forEach(a=>a.classList.toggle('akt',a.getAttribute('href')==='#'+x.target.id))}})},{rootMargin:'-45% 0px -50% 0px'});
  sekcje.forEach(s=>s&&io.observe(s));

  // pasek dolny po minięciu przycisku hero
  const pasek=$('.pasek'), cta=$('.hero-akcje .btn');
  if(pasek&&cta){new IntersectionObserver(([e])=>{const w=!e.isIntersecting&&e.boundingClientRect.top<0;pasek.classList.toggle('widac',w);pasek.setAttribute('aria-hidden',w?'false':'true');$$('a',pasek).forEach(a=>a.tabIndex=w?0:-1)}).observe(cta)}

  // przeciąganie myszą
  function przeciagaj(tor){
    let x0=0,s0=0,ruch=false,wcis=false;
    tor.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;wcis=true;ruch=false;x0=e.clientX;s0=tor.scrollLeft});
    addEventListener('pointermove',e=>{if(!wcis)return;const dx=e.clientX-x0;if(Math.abs(dx)>5){ruch=true;tor.classList.add('ciag')}if(ruch)tor.scrollLeft=s0-dx});
    addEventListener('pointerup',()=>{if(!wcis)return;wcis=false;if(ruch){tor.classList.remove('ciag');const it=tor.children[0];if(it){const w=it.getBoundingClientRect().width+(parseFloat(getComputedStyle(tor).columnGap)||0);tor.scrollTo({left:Math.round(tor.scrollLeft/w)*w,behavior:'smooth'})}setTimeout(()=>{ruch=false},0)}});
    tor.addEventListener('click',e=>{if(ruch){e.preventDefault();e.stopPropagation()}},true);
  }

  // karuzela kategorii
  $$('[data-karuzela]').forEach(k=>{
    const tor=$('.kar-tor',k); przeciagaj(tor);
    const [l,p]=$$('.kar-btn',k);
    const krok=()=>tor.children[0].getBoundingClientRect().width+16;
    l.addEventListener('click',()=>tor.scrollBy({left:-krok()*2,behavior:'smooth'}));
    p.addEventListener('click',()=>tor.scrollBy({left:krok()*2,behavior:'smooth'}));
    const stan=()=>{l.disabled=tor.scrollLeft<4;p.disabled=tor.scrollLeft+tor.clientWidth>=tor.scrollWidth-4};
    tor.addEventListener('scroll',stan,{passive:true});addEventListener('resize',stan);stan();
    tor.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();tor.scrollBy({left:krok(),behavior:'smooth'})}if(e.key==='ArrowLeft'){e.preventDefault();tor.scrollBy({left:-krok(),behavior:'smooth'})}});
  });

  // galerie w kartach produktów
  $$('[data-galeria]').forEach(g=>{
    const tor=$('.gal-tor',g), imgs=$$('img',tor); if(imgs.length<2)return;
    przeciagaj(tor);
    const kropki=document.createElement('div');kropki.className='gal-kropki';
    imgs.forEach((im,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Zdjęcie '+(i+1)+' z '+imgs.length);b.addEventListener('click',()=>tor.scrollTo({left:i*tor.clientWidth,behavior:'smooth'}));kropki.appendChild(b)});
    const licz=document.createElement('span');licz.className='gal-licz';
    const mk=(c,kier,lab)=>{const b=document.createElement('button');b.type='button';b.className='gal-strz '+c;b.setAttribute('aria-label',lab);b.innerHTML='<svg aria-hidden="true"'+(kier<0?' style="transform:scaleX(-1)"':'')+'><use href="#strz"/></svg>';b.addEventListener('click',()=>tor.scrollBy({left:kier*tor.clientWidth,behavior:'smooth'}));return b};
    g.append(kropki,licz,mk('l',-1,'Poprzednie zdjęcie'),mk('p',1,'Następne zdjęcie'));
    const stan=()=>{const i=Math.round(tor.scrollLeft/Math.max(1,tor.clientWidth));$$('button',kropki).forEach((b,j)=>b.setAttribute('aria-current',j===i?'true':'false'));licz.textContent=(i+1)+'/'+imgs.length};
    tor.addEventListener('scroll',stan,{passive:true});stan();
  });

  // formularz pokazowy (bez wysyłki)
  const f=$('#form');
  f.addEventListener('submit',e=>{e.preventDefault();$('.form-info',f).textContent='To podgląd strony. W docelowej wersji zgłoszenie trafi od razu na biuro@gitserwis.pl.'});
})();
