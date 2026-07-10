(function(){
  'use strict';
  var notes = window.RYDER_NOTES || [];
  var grid = document.getElementById('grid');
  var filterWrap = document.getElementById('filters');
  var activeWho = 'All';

  function esc(value){ return String(value || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function lines(value){ return esc(value).replace(/\n/g,'<br>'); }

  function cardHTML(note){
    var who = note.who ? esc(note.who) : '';
    var date = note.date ? '<span class="date">' + esc(note.date) + '</span>' : '';
    var type = (note.type || 'note').toLowerCase();
    if(type === 'quote'){
      return '<article class="card c-quote" data-who="' + who.toLowerCase() + '"><div class="body">' + esc(note.text) + '</div>' +
        (who ? '<div class="who">&mdash; ' + who + '</div>' : '') + '</article>';
    }
    if(type === 'lyric'){
      return '<article class="card c-lyric" data-who="' + who.toLowerCase() + '"><span class="stamp">Work Tape</span><div class="body">' +
        lines(note.lyric || note.text) + '</div>' + (who ? '<div class="who">' + who + '</div>' : '') + '</article>';
    }
    if(type === 'photo'){
      var image = note.img ? '<img class="ph" src="' + esc(note.img) + '" alt="' + esc(note.text || '') + '" loading="lazy">' :
        '<div class="ph ph-missing">no image set</div>';
      return '<article class="card c-photo" data-who="' + who.toLowerCase() + '">' + image +
        (note.text ? '<div class="cap">' + esc(note.text) + '</div>' : '') +
        (who ? '<div class="who">' + who + '</div>' : '') + '</article>';
    }
    return '<article class="card c-note" data-who="' + who.toLowerCase() + '"><div class="who">' + who + date +
      '</div><div class="body">' + esc(note.text) + '</div></article>';
  }

  function render(){
    var visible = notes.filter(function(note){
      return activeWho === 'All' || (note.who || '').toLowerCase() === activeWho.toLowerCase();
    });
    if(!visible.length){
      grid.innerHTML = '<div class="empty">Nothing tacked up here yet.</div>';
      return;
    }
    grid.innerHTML = visible.map(cardHTML).join('');
    grid.querySelectorAll('img.ph').forEach(function(image){
      image.addEventListener('error', function(){
        var missing = document.createElement('div');
        missing.className = 'ph ph-missing';
        missing.innerHTML = 'image not found:<br>' + esc(image.getAttribute('src') || '');
        image.replaceWith(missing);
      });
    });
  }

  var names = ['All'];
  notes.forEach(function(note){ if(note.who && names.indexOf(note.who) < 0) names.push(note.who); });
  names.forEach(function(name){
    var chip = document.createElement('button');
    chip.className = 'chip' + (name === 'All' ? ' on' : '');
    chip.textContent = name;
    chip.addEventListener('click', function(){
      activeWho = name;
      Array.prototype.forEach.call(filterWrap.children, function(child){
        child.classList.toggle('on', child.textContent === name);
      });
      render();
    });
    filterWrap.appendChild(chip);
  });
  render();
})();