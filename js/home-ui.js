(function(){
  'use strict';
  var menu = document.getElementById('menu');
  var hamburger = document.getElementById('hamb');
  var progress = document.getElementById('progress');
  var backToTop = document.getElementById('btt');
  if(hamburger) hamburger.addEventListener('click', function(){
    menu.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  if(menu) menu.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){
      menu.classList.remove('open');
      if(hamburger) hamburger.classList.remove('open');
    });
  });
  function update(){
    var y = scrollY;
    var distance = document.documentElement.scrollHeight - innerHeight;
    if(progress) progress.style.width = (distance > 0 ? y / distance * 100 : 0) + '%';
    if(backToTop) backToTop.classList.toggle('show', y > 600);
  }
  addEventListener('scroll', update, {passive:true});
  if(backToTop) backToTop.addEventListener('click', function(){ scrollTo({top:0,behavior:'smooth'}); });
  var year = document.getElementById('yr');
  if(year) year.textContent = new Date().getFullYear();
  update();
})();