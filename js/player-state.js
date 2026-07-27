(function(w){
  'use strict';

  var STORAGE_KEY = 'ryder-mccoy-player-v2';
  var MAX_AGE = 30 * 24 * 60 * 60 * 1000;

  function read(){
    try{
      var value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if(!value || !value.active || !value.current || !value.current.file) return null;
      if(value.updatedAt && Date.now() - value.updatedAt > MAX_AGE) return null;
      return value;
    }catch(e){ return null; }
  }

  function erase(){
    try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
  }

  function absolute(url){
    try{ return new URL(url, document.baseURI).href; }catch(e){ return url; }
  }

  function cleanTrack(track, defaults, index){
    track = track || {};
    defaults = defaults || {};
    return Object.assign({}, track, {
      title: track.title || 'Untitled',
      file: track.file || '',
      album: track.album || defaults.album || '',
      art: track.art || defaults.art || '',
      page: track.page || defaults.page || '',
      n: track.n || String(index + 1)
    });
  }

  function storedTrack(track){
    return {
      title: track.title,
      file: track.file,
      album: track.album,
      art: track.art,
      page: track.page,
      n: track.n
    };
  }

  // Keep the final footer action fully visible above any fixed audio player.
  // Measure the rendered player instead of guessing at mobile/desktop heights.
  function reserveFooterSpace(player, gap){
    var footer = document.querySelector('footer');
    if(!footer || !player) return function(){};

    var previousPadding = footer.style.paddingBottom;
    var frame = 0;
    var active = true;
    gap = isFinite(gap) ? Math.max(0, gap) : 40;

    function apply(){
      frame = 0;
      if(!active || !player.isConnected) return;
      var bottom = parseFloat(w.getComputedStyle(player).bottom);
      if(!isFinite(bottom) || bottom < 0) bottom = 0;
      var clearance = Math.ceil(player.offsetHeight + bottom + gap);
      footer.style.paddingBottom = clearance + 'px';
    }

    function schedule(){
      if(!active) return;
      if(frame) w.cancelAnimationFrame(frame);
      frame = w.requestAnimationFrame(apply);
    }

    schedule();
    w.addEventListener('resize', schedule);
    if(w.visualViewport) w.visualViewport.addEventListener('resize', schedule);

    return function(){
      active = false;
      if(frame) w.cancelAnimationFrame(frame);
      w.removeEventListener('resize', schedule);
      if(w.visualViewport) w.visualViewport.removeEventListener('resize', schedule);
      footer.style.paddingBottom = previousPadding;
    };
  }

  function create(options){
    options = options || {};
    var audio = options.audio;
    if(!audio) throw new Error('RyderPlayback requires an audio element.');

    var defaults = {
      album: options.album || '',
      art: options.art || '',
      page: options.page || ''
    };
    var contextId = options.contextId || defaults.page || location.pathname;
    var localTracks = (options.tracks || []).map(function(track,index){
      return cleanTrack(track, defaults, index);
    });
    var activeTracks = localTracks;
    var activeContext = contextId;
    var current = -1;
    var currentLocal = -1;
    var pendingTime = null;
    var pendingPlay = false;
    var loadingTrack = false;
    var lastSave = 0;

    function info(){
      var track = current >= 0 ? activeTracks[current] : null;
      return {
        track: track,
        index: current,
        playlistLength: activeTracks.length,
        localIndex: currentLocal,
        paused: audio.paused,
        hasTrack: !!track,
        contextId: activeContext
      };
    }

    function emitTrack(){ if(options.onTrack) options.onTrack(info()); }
    function emitState(){ if(options.onState) options.onState(info()); }
    function emitTime(){
      if(!options.onTime) return;
      var state = info();
      state.currentTime = isFinite(audio.currentTime) ? audio.currentTime : 0;
      state.duration = isFinite(audio.duration) ? audio.duration : 0;
      state.progress = state.duration > 0 ? state.currentTime / state.duration : 0;
      options.onTime(state);
    }
    function emitMetadata(){
      if(!options.onMetadata) return;
      var state = info();
      state.duration = isFinite(audio.duration) ? audio.duration : 0;
      options.onMetadata(state);
    }

    function save(force){
      if(current < 0 || !activeTracks[current] || !activeTracks[current].file) return;
      var now = Date.now();
      if(!force && now - lastSave < 1000) return;
      lastSave = now;
      try{
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          version: 2,
          active: true,
          contextId: activeContext,
          current: storedTrack(activeTracks[current]),
          playlist: activeTracks.map(storedTrack),
          index: current,
          time: isFinite(audio.currentTime) ? audio.currentTime : (pendingTime || 0),
          wasPlaying: !audio.paused || pendingPlay,
          updatedAt: now
        }));
      }catch(e){}
    }

    function setMetadata(){
      if(current < 0 || !activeTracks[current] || !('mediaSession' in navigator)) return;
      var track = activeTracks[current];
      try{
        if(typeof MediaMetadata !== 'undefined'){
          navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title,
            artist: 'The Ryder McCoy Band',
            album: track.album || 'The Ryder McCoy Band',
            artwork: track.art ? [{src:absolute(track.art)}] : []
          });
        }
      }catch(e){}
    }

    function setPosition(){
      if(!('mediaSession' in navigator) || !navigator.mediaSession.setPositionState) return;
      if(!isFinite(audio.duration) || audio.duration <= 0) return;
      try{
        navigator.mediaSession.setPositionState({
          duration: audio.duration,
          playbackRate: audio.playbackRate || 1,
          position: Math.min(audio.duration, Math.max(0, audio.currentTime || 0))
        });
      }catch(e){}
    }

    function setHandler(name, handler){
      if(!('mediaSession' in navigator)) return;
      try{ navigator.mediaSession.setActionHandler(name, handler); }catch(e){}
    }

    function updateMediaState(){
      if(!('mediaSession' in navigator)) return;
      try{ navigator.mediaSession.playbackState = audio.paused ? 'paused' : 'playing'; }catch(e){}
    }

    function findLocal(track){
      if(!track) return -1;
      for(var i=0;i<localTracks.length;i++){
        if(localTracks[i].file === track.file) return i;
      }
      return -1;
    }

    function selectTracks(tracks, nextContext){
      activeTracks = tracks;
      activeContext = nextContext || contextId;
    }

    function loadAt(index, shouldPlay, seekTime){
      if(!activeTracks.length) return;
      current = ((index % activeTracks.length) + activeTracks.length) % activeTracks.length;
      var track = activeTracks[current];
      currentLocal = activeContext === contextId ? findLocal(track) : -1;
      pendingTime = isFinite(seekTime) && seekTime > 0 ? seekTime : null;
      pendingPlay = !!shouldPlay;
      loadingTrack = true;
      audio.src = track.file;
      setMetadata();
      emitTrack();
      emitState();
      try{ audio.load(); }catch(e){}
      if(shouldPlay){
        var promise = audio.play();
        if(promise && promise.catch) promise.catch(function(){ emitState(); });
      }
      save(true);
    }

    function playLocal(index){
      selectTracks(localTracks, contextId);
      loadAt(index, true, 0);
    }

    function toggleLocal(index){
      var local = localTracks[index];
      if(currentLocal === index && activeTracks[current] && local && activeTracks[current].file === local.file){
        audio.paused ? audio.play().catch(function(){}) : audio.pause();
      }else{
        playLocal(index);
      }
    }

    function toggle(){
      if(current < 0){
        if(localTracks.length) playLocal(0);
        return;
      }
      audio.paused ? audio.play().catch(function(){}) : audio.pause();
    }

    function next(){
      if(current < 0){
        if(localTracks.length) playLocal(0);
        return;
      }
      loadAt(current + 1, true, 0);
    }

    function previous(){
      if(current < 0){
        if(localTracks.length) playLocal(0);
        return;
      }
      if(audio.currentTime > 3){
        audio.currentTime = 0;
        save(true);
        return;
      }
      loadAt(current - 1, true, 0);
    }

    function seekTo(seconds){
      if(!isFinite(seconds)) return;
      var max = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : seconds;
      audio.currentTime = Math.min(max, Math.max(0, seconds));
      save(true);
    }

    function seekBy(seconds){ seekTo((audio.currentTime || 0) + seconds); }

    function restore(){
      var saved = read();
      if(!saved) return false;
      var savedList = Array.isArray(saved.playlist) && saved.playlist.length ? saved.playlist : [saved.current];
      savedList = savedList.filter(function(track){ return track && track.file; }).map(function(track,index){
        return cleanTrack(track, {}, index);
      });
      if(!savedList.length) return false;

      var useLocal = false;
      var targetLocal = findLocal(saved.current);
      if(targetLocal >= 0 && (saved.contextId === contextId || saved.current.page === defaults.page)){
        useLocal = true;
      }
      if(useLocal){
        selectTracks(localTracks, contextId);
        targetLocal = findLocal(saved.current);
        loadAt(targetLocal, !!saved.wasPlaying, Number(saved.time) || 0);
      }else{
        selectTracks(savedList, saved.contextId || saved.current.page || 'saved');
        var target = -1;
        for(var i=0;i<savedList.length;i++){
          if(savedList[i].file === saved.current.file){ target = i; break; }
        }
        if(target < 0) target = Math.min(Math.max(Number(saved.index) || 0, 0), savedList.length - 1);
        loadAt(target, !!saved.wasPlaying, Number(saved.time) || 0);
      }
      return true;
    }

    function clear(){
      erase();
      current = -1;
      currentLocal = -1;
      activeTracks = [];
      pendingPlay = false;
      pendingTime = null;
      try{
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }catch(e){}
    }

    audio.addEventListener('loadedmetadata', function(){
      loadingTrack = false;
      if(pendingTime !== null){
        try{ audio.currentTime = Math.min(pendingTime, isFinite(audio.duration) ? audio.duration : pendingTime); }catch(e){}
      }
      var shouldPlay = pendingPlay;
      pendingTime = null;
      pendingPlay = false;
      emitMetadata();
      emitTime();
      setPosition();
      save(true);
      if(shouldPlay && audio.paused){
        var promise = audio.play();
        if(promise && promise.catch) promise.catch(function(){ emitState(); });
      }
    });
    audio.addEventListener('canplay', function(){ loadingTrack = false; });
    audio.addEventListener('error', function(){ loadingTrack = false; pendingPlay = false; emitState(); });
    audio.addEventListener('play', function(){ pendingPlay = false; updateMediaState(); emitState(); save(true); });
    audio.addEventListener('pause', function(){ updateMediaState(); emitState(); if(!loadingTrack) save(true); });
    audio.addEventListener('timeupdate', function(){ emitTime(); setPosition(); if(!loadingTrack) save(false); });
    audio.addEventListener('ratechange', setPosition);
    audio.addEventListener('ended', function(){
      if(current >= 0 && current < activeTracks.length - 1) loadAt(current + 1, true, 0);
      else { pendingPlay = false; emitState(); save(true); }
    });
    w.addEventListener('pagehide', function(){ save(true); });
    document.addEventListener('visibilitychange', function(){ if(document.hidden) save(true); });

    setHandler('play', function(){ audio.play().catch(function(){}); });
    setHandler('pause', function(){ audio.pause(); });
    setHandler('previoustrack', previous);
    setHandler('nexttrack', next);
    setHandler('seekbackward', function(details){ seekBy(-(details && details.seekOffset || 10)); });
    setHandler('seekforward', function(details){ seekBy(details && details.seekOffset || 10); });
    setHandler('seekto', function(details){
      if(!details || !isFinite(details.seekTime)) return;
      if(details.fastSeek && audio.fastSeek) audio.fastSeek(details.seekTime);
      else seekTo(details.seekTime);
    });

    var api = {
      playLocal: playLocal,
      toggleLocal: toggleLocal,
      toggle: toggle,
      next: next,
      previous: previous,
      seekTo: seekTo,
      seekBy: seekBy,
      restore: restore,
      clear: clear,
      save: function(){ save(true); },
      info: info,
      hasTrack: function(){ return current >= 0; }
    };

    if(options.restore !== false) restore();
    return api;
  }

  w.RyderPlayback = {
    create: create,
    read: read,
    clear: erase,
    reserveFooterSpace: reserveFooterSpace,
    storageKey: STORAGE_KEY
  };
})(window);