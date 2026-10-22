(function(){
  var d=document.documentElement, top=document.getElementById('top');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine=window.matchMedia('(pointer: fine)');
  function setTop(){ if(top) d.style.setProperty('--top-h', top.offsetHeight+'px'); }
  setTop(); window.addEventListener('resize', setTop);

  var btn=document.querySelector('.burger'), menu=document.getElementById('menu');
  if(btn && menu){
    var close=function(){ btn.setAttribute('aria-expanded','false'); menu.hidden=true; setTop(); };
    btn.addEventListener('click', function(){
      if(btn.getAttribute('aria-expanded')==='true'){ close(); }
      else { btn.setAttribute('aria-expanded','true'); menu.hidden=false; setTop(); }
    });
    menu.addEventListener('click', function(e){ if(e.target.closest('a')) close(); });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function(m){ if(m.matches) close(); });
  }

  /* warm light spot: follows a precise pointer, rests calmly on touch */
  var glow=document.querySelector('.glow');
  if(glow && fine.matches && !reduce.matches){
    d.classList.add('has-pointer');
    var tx=innerWidth*0.7, ty=innerHeight*0.35, x=tx, y=ty, raf=0;
    var step=function(){
      x+=(tx-x)*0.14; y+=(ty-y)*0.14;
      glow.style.transform='translate3d('+(x-300)+'px,'+(y-300)+'px,0)';
      raf=(Math.abs(tx-x)+Math.abs(ty-y)>0.5)?requestAnimationFrame(step):0;
    };
    window.addEventListener('pointermove', function(e){ tx=e.clientX; ty=e.clientY; if(!raf) raf=requestAnimationFrame(step); }, {passive:true});
    step();
  }

  /* pinned note tilts with a precise pointer, held button turns it harder */
  var pin=document.getElementById('pin');
  if(pin && fine.matches && !reduce.matches){
    var held=false, last=null;
    var apply=function(e){
      var r=pin.getBoundingClientRect();
      var px=(e.clientX-(r.left+r.width/2))/r.width, py=(e.clientY-(r.top+r.height/2))/r.height;
      px=Math.max(-1,Math.min(1,px)); py=Math.max(-1,Math.min(1,py));
      var k=held?2.4:1;
      pin.style.transform='rotate('+(3+px*2*k)+'deg) perspective(900px) rotateY('+(px*6*k)+'deg) rotateX('+(-py*6*k)+'deg)';
    };
    pin.addEventListener('pointermove', function(e){ last=e; apply(e); });
    pin.addEventListener('pointerdown', function(e){ held=true; apply(e); });
    window.addEventListener('pointerup', function(){ held=false; if(last) apply(last); });
    pin.addEventListener('pointerleave', function(){ held=false; pin.style.transform=''; });
  }

  /* reviews carousel */
  var car=document.querySelector('.carousel');
  if(car){
    var slides=[].slice.call(car.querySelectorAll('.note-card'));
    var dots=[].slice.call(car.querySelectorAll('.carousel__dots button'));
    var cur=0;
    var go=function(i){
      cur=(i+slides.length)%slides.length;
      slides.forEach(function(s,j){ var on=j===cur; s.classList.toggle('is-on',on); if(on) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden','true'); });
      dots.forEach(function(b,j){ if(j===cur) b.setAttribute('aria-current','true'); else b.removeAttribute('aria-current'); });
    };
    car.querySelectorAll('.carousel__arrow').forEach(function(a){ a.addEventListener('click', function(){ go(cur+ +a.dataset.dir); }); });
    dots.forEach(function(b,j){ b.addEventListener('click', function(){ go(j); }); });
    var sx=null;
    car.addEventListener('touchstart', function(e){ sx=e.touches[0].clientX; }, {passive:true});
    car.addEventListener('touchend', function(e){ if(sx===null) return; var dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>40) go(cur+(dx<0?1:-1)); sx=null; });
    go(0);
  }

  /* map loads on click */
  var ml=document.getElementById('map-load');
  if(ml){
    ml.addEventListener('click', function(){
      var f=document.createElement('iframe');
      f.src=ml.dataset.src; f.title='Tanika Team на карте'; f.setAttribute('allowfullscreen','');
      ml.replaceWith(f);
    });
  }

  /* section shots on the board settle into their tilt when they enter */
  var items=document.querySelectorAll('.card, .facts li');
  if('IntersectionObserver' in window && !reduce.matches){
    d.classList.add('js-enter');
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, {rootMargin:'0px 0px -8% 0px'});
    items.forEach(function(el){ io.observe(el); });
  }
})();
