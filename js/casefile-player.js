(function(){
  'use strict';
  var album = window.RYDER_ALBUM;
  if(!album || !window.RyderPlayback) return;

  var tracks = album.tracks || [];
  var audio = document.getElementById('audio');
  var list = document.getElementById('trackList');
  var deck = document.getElementById('deck');
  var deckText = document.getElementById('deckText');
  var deckProg = document.getElementById('deckProg');
  var deckFill = document.getElementById('deckFill');
  var deckBar = document.getElementById('deckBar');
  var deckTime = document.getElementById('deckTime');
  var deckIcon = document.getElementById('deckIcon');
  var count = document.getElementById('trackCount');
  var year = document.getElementById('yr');
  var currentLocal = -1;
  var hasTrack = false;
  var paused = true;
  var PLAY = 'M3 2l11 6-11 6z';
  var PAUSE = 'M3 2h3.5v12H3zM9.5 2H13v12H9.5z';

  if(count) count.textContent = tracks.length;
  if(year) year.textContent = new Date().getFullYear();

  function fmt(seconds){
    if(!isFinite(seconds)) return '0:00';
    seconds = Math.floor(seconds);
    return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2,'0');
  }
  function esc(value){
    return String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function drawState(){
    document.querySelectorAll('.card').forEach(function(card,index){
      var on = index === currentLocal;
      card.classList.toggle('playing', on && !paused);
      var path = card.querySelector('.c-play svg path');
      if(path) path.setAttribute('d', on && !paused ? PAUSE : PLAY);
    });
    var deckPath = deckIcon && deckIcon.querySelector('path');
    if(deckPath) deckPath.setAttribute('d', paused ? PLAY : PAUSE);
    if(deck) deck.classList.toggle('playing', hasTrack && !paused);
  }

  // Replace any server-rendered track headers in one synchronous pass.
  // This keeps the list's initial height stable while preserving the full player UI.
  list.textContent = '';

  tracks.forEach(function(track,index){
    var card = document.createElement('article');
    card.className = 'card';
    card.id = 'card' + index;
    card.innerHTML =
      '<div class="card-head">' +
        '<button class="c-play" data-play="' + index + '" aria-label="Play ' + esc(track.title) + '"><svg viewBox="0 0 16 16"><path d="' + PLAY + '"/></svg></button>' +
        '<span class="c-num">' + String(index + 1).padStart(2,'0') + '</span>' +
        '<span class="c-titlewrap"><span class="c-title">' + esc(track.title) + '</span><span class="c-dur" id="dur' + index + '"></span></span>' +
        '<button class="c-fn" data-fn="' + index + '" aria-expanded="false">Notes <span class="chev">&#9662;</span></button>' +
      '</div>' +
      '<div class="c-prog"><div class="c-prog-fill" id="prog' + index + '"></div></div>' +
      '<div class="c-note"><div class="c-note-inner">' + (track.notes || '') +
        '<a class="c-save" href="' + track.file + '" download aria-label="Download ' + esc(track.title) + '"><svg viewBox="0 0 16 16"><path d="M7 1h2v6.6l1.8-1.8 1.4 1.4L8 11.4 3.8 7.2l1.4-1.4L7 7.6z"/><path d="M2 13h12v2H2z"/></svg> Save this track</a>' +
      '</div></div>';
    list.appendChild(card);
  });

  var player = window.RyderPlayback.create({
    audio: audio,
    tracks: tracks,
    album: album.name,
    art: album.art,
    page: album.page,
    contextId: album.page,
    onTrack: function(state){
      currentLocal = state.localIndex;
      hasTrack = state.hasTrack;
      paused = state.paused;
      document.querySelectorAll('.c-prog-fill').forEach(function(fill){ fill.style.width = '0%'; });
      deckText.textContent = state.track.title;
      deckProg.innerHTML = 'PROG <b>' + (state.index + 1) + '</b>/' + state.playlistLength;
      deck.classList.add('show');
      drawState();
    },
    onState: function(state){
      currentLocal = state.localIndex;
      hasTrack = state.hasTrack;
      paused = state.paused;
      drawState();
    },
    onMetadata: function(state){
      if(state.localIndex < 0) return;
      var cell = document.getElementById('dur' + state.localIndex);
      if(cell && state.duration) cell.textContent = fmt(state.duration);
    },
    onTime: function(state){
      var pct = state.progress * 100;
      deckFill.style.width = pct + '%';
      deckBar.setAttribute('aria-valuenow', Math.round(pct));
      deckTime.textContent = fmt(state.currentTime) + ' / ' + fmt(state.duration);
      if(state.localIndex >= 0){
        var fill = document.getElementById('prog' + state.localIndex);
        if(fill) fill.style.width = pct + '%';
      }
    }
  });

  list.addEventListener('click', function(event){
    var noteButton = event.target.closest('[data-fn]');
    if(noteButton){
      var card = document.getElementById('card' + noteButton.dataset.fn);
      var open = card.classList.toggle('open');
      noteButton.setAttribute('aria-expanded', open ? 'true' : 'false');
      return;
    }
    var playButton = event.target.closest('[data-play]');
    if(playButton) player.toggleLocal(parseInt(playButton.dataset.play,10));
  });

  document.getElementById('deckPlay').addEventListener('click', player.toggle);
  document.getElementById('deckNext').addEventListener('click', player.next);
  document.getElementById('deckPrev').addEventListener('click', player.previous);

  function seek(clientX){
    var rect = deckBar.getBoundingClientRect();
    var ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    if(audio.duration) player.seekTo(ratio * audio.duration);
  }
  deckBar.addEventListener('click', function(event){ seek(event.clientX); });
  deckBar.addEventListener('keydown', function(event){
    if(event.key === 'ArrowRight') player.seekBy(5);
    if(event.key === 'ArrowLeft') player.seekBy(-5);
  });

  var heroVideo = document.getElementById('heroVideo');
  var hero = document.querySelector('.album-hero');
  var savesData = !!(navigator.connection && navigator.connection.saveData);
  var reducesMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  if(heroVideo && hero && !savesData && !reducesMotion){
    var heroSource = heroVideo.querySelector('source[data-src]');
    var heroStarted = false;

    function stopWaitingForHero(){
      window.removeEventListener('scroll', startHeroVideo);
      hero.removeEventListener('pointerdown', startHeroVideo);
      document.removeEventListener('keydown', startHeroVideo);
    }

    function startHeroVideo(){
      if(heroStarted) return;
      heroStarted = true;
      stopWaitingForHero();
      if(heroSource && !heroSource.getAttribute('src')){
        heroSource.setAttribute('src', heroSource.getAttribute('data-src'));
      }
      heroVideo.addEventListener('playing', function(){
        hero.classList.add('video-ready');
      }, {once:true});
      heroVideo.load();
      var promise = heroVideo.play();
      if(promise && promise.catch) promise.catch(function(){});
    }

    window.addEventListener('scroll', startHeroVideo, {once:true, passive:true});
    hero.addEventListener('pointerdown', startHeroVideo, {once:true, passive:true});
    document.addEventListener('keydown', startHeroVideo, {once:true});
  }
})();