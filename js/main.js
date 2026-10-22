(function(){
  var d=document.documentElement, top=document.getElementById('top');
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
})();
