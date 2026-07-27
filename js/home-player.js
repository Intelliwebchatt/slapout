(function(){
  'use strict';
  var foundations = window.RYDER_FOUNDATIONS || [];
  if(!window.RyderPlayback) return;

  var pages = ['/warning/','/glass-rose/','/fall/','/woods/','/other-place/'];
  var tracks = foundations.map(function(track,index){
    return Object.assign({}, track, {
      album: track.rec.split(' \u00b7 ')[1] || track.rec,
      page: pages[index] || '/',
      art: track.art || '/ryder-mccoy-logo-hero-square.webp'
    });
  });
  var audio = document.getElementById('fAudio');
  var list = document.getElementById('fList');
  var playerBar = document.getElementById('fplayer');
  var title = document.getElementById('fpTitle');
  var fill = document.getElementById('fpFill');
  var bar = document.getElementById('fpBar');
  var time = document.getElementById('fpTime');
  var icon = document.getElementById('fpIcon');
  var currentLocal = -1;
  var paused = true;
  var releaseFooterSpace = null;
  var PLAY = 'M3 2l11 6-11 6z';
  var PAUSE = 'M3 2h3.5v12H3zM9.5 2H13v12H9.5z';

  function fmt(seconds){
    if(!isFinite(seconds)) return '0:00';
    seconds = Math.floor(seconds);
    return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2,'0');
  }
  function esc(value){
    return String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function drawState(){
    document.querySelectorAll('.f-track').forEach(function(row,index){
      var on = index === currentLocal;
      row.classList.toggle('active', on);
      var path = row.querySelector('.f-play svg path');
      if(path) path.setAttribute('d', on && !paused ? PAUSE : PLAY);
    });
    var path = icon && icon.querySelector('path');
    if(path) path.setAttribute('d', paused ? PLAY : PAUSE);
  }

  foundations.forEach(function(track,index){
    var row = document.createElement('div');
    row.className = 'f-track';
    row.innerHTML =
      '<button class="f-play" data-i="' + index + '" aria-label="Play ' + esc(track.title) + '"><svg viewBox="0 0 16 16"><path d="' + PLAY + '"/></svg></button>' +
      '<div class="f-meta"><div class="f-rec">' + esc(track.rec) + '</div><div class="f-title">' + esc(track.title) + '</div><div class="f-why">' + esc(track.why) + '</div></div>' +
      '<div class="f-dur" id="fdur' + index + '">--:--</div>' +
      '<div class="f-prog"><div class="f-fill" id="ffill' + index + '"></div></div>';
    list.appendChild(row);
  });

  var controller = window.RyderPlayback.create({
    audio: audio,
    tracks: tracks,
    album: 'The Ryder McCoy Band',
    art: '/ryder-mccoy-logo-hero-square.webp',
    page: '/',
    contextId: '/',
    onTrack: function(state){
      currentLocal = state.localIndex;
      paused = state.paused;
      document.querySelectorAll('.f-fill').forEach(function(item){ item.style.width = '0%'; });
      title.textContent = state.track.title + ' \u2014 ' + state.track.album;
      playerBar.classList.add('show');
      if(!releaseFooterSpace && window.RyderPlayback.reserveFooterSpace){
        releaseFooterSpace = window.RyderPlayback.reserveFooterSpace(playerBar, 40);
      }
      drawState();
    },
    onState: function(state){
      currentLocal = state.localIndex;
      paused = state.paused;
      drawState();
    },
    onMetadata: function(state){
      if(state.localIndex < 0) return;
      var duration = document.getElementById('fdur' + state.localIndex);
      if(duration && state.duration) duration.textContent = fmt(state.duration);
    },
    onTime: function(state){
      var pct = state.progress * 100;
      fill.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', Math.round(pct));
      time.textContent = fmt(state.currentTime) + ' / ' + fmt(state.duration);
      if(state.localIndex >= 0){
        var trackFill = document.getElementById('ffill' + state.localIndex);
        if(trackFill) trackFill.style.width = pct + '%';
      }
    }
  });

  list.addEventListener('click', function(event){
    var button = event.target.closest('.f-play');
    if(button) controller.toggleLocal(parseInt(button.dataset.i,10));
  });
  document.getElementById('fpPlay').addEventListener('click', controller.toggle);
  document.getElementById('fpNext').addEventListener('click', controller.next);
  document.getElementById('fpPrev').addEventListener('click', controller.previous);
  bar.addEventListener('click', function(event){
    var rect = bar.getBoundingClientRect();
    var ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    if(audio.duration) controller.seekTo(ratio * audio.duration);
  });
  bar.addEventListener('keydown', function(event){
    if(event.key === 'ArrowRight') controller.seekBy(5);
    if(event.key === 'ArrowLeft') controller.seekBy(-5);
  });
})();