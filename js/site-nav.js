(function(){
  'use strict';
  var links = [
    { file:'index.html', label:'Home' },
    { file:'warning.html', label:'The Warning' },
    { file:'glass-rose.html', label:'The Glass Rose' },
    { file:'fall.html', label:'The Fall' },
    { file:'woods.html', label:'Welcome to the Woods', isNew:true },
    { file:'wall.html', label:'The Wall' },
    { file:'dirt-road.html', label:'The Dirt Road' }
  ];
  var nav = document.getElementById('slapNav');
  if(!nav) return;
  var path = location.pathname.replace(/^\/+|\/+$/g,'').split('/').pop().toLowerCase();
  if(path && !/\.html$/.test(path)) path += '.html';
  if(!path) path = 'index.html';
  var html = '<a class="slap-nav-home" href="/"><span class="rose">&#129685;</span> Ryder McCoy Band</a><div class="slap-nav-links">';
  links.forEach(function(link){
    var here = link.file.toLowerCase() === path;
    var href = link.file === 'index.html' ? '/' : '/' + link.file.replace(/\.html$/,'') + '/';
    html += '<a class="lnk' + (here ? ' here' : '') + '" href="' + href + '"' + (here ? ' aria-current="page"' : '') + '>' +
      link.label + (link.isNew ? '<span class="new">New</span>' : '') + '</a>';
  });
  nav.innerHTML = html + '</div>';
})();