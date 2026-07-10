(function(){
  'use strict';
  if(!window.RyderPlayback || !window.RyderPlayback.read()) return;

  var style = document.createElement('style');
  style.textContent =
    '.ryder-resume{position:fixed;left:50%;bottom:14px;z-index:9999;transform:translateX(-50%);width:min(720px,calc(100% - 24px));padding:10px 12px 9px;border:1px solid rgba(220,190,120,.45);border-radius:12px;background:rgba(12,10,8,.95);box-shadow:0 10px 32px rgba(0,0,0,.55);color:#f1eadb;font:600 13px/1.25 system-ui,sans-serif;backdrop-filter:blur(12px)}' +
    '.ryder-resume-row{display:grid;grid-template-columns:38px minmax(0,1fr) 34px 34px;gap:8px;align-items:center}.ryder-resume button{border:0;border-radius:50%;width:34px;height:34px;background:#b83b35;color:white;font-weight:900;cursor:pointer}.ryder-resume .rr-close{background:transparent;color:#d8cdb7;font-size:20px}.ryder-resume-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ryder-resume-album{display:block;color:#bdae93;font-size:11px;font-weight:600;margin-top:2px}.ryder-resume-bar{height:5px;background:#3b3328;border-radius:9px;margin-top:8px;overflow:hidden;cursor:pointer}.ryder-resume-fill{height:100%;width:0;background:#d65248}.ryder-resume-time{display:block;margin-top:5px;color:#aa9d88;font-size:10px;text-align:right}@media(max-width:480px){.ryder-resume{bottom:8px}.ryder-resume-row{grid-template-columns:38px minmax(0,1fr) 32px}.ryder-resume .rr-next{display:none}}';
  document.head.appendChild(style);

  var wrap = document.createElement('aside');
  wrap.className = 'ryder-resume';
  wrap.setAttribute('aria-label','Resume music');
  wrap.innerHTML =
    '<div class="ryder-resume-row"><button class="rr-play" aria-label="Play or pause">&#9654;</button>' +
    '<div class="ryder-resume-title">Resume music<span class="ryder-resume-album"></span></div>' +
    '<button class="rr-next" aria-label="Next track">&#9654;&#9654;</button><button class="rr-close" aria-label="Close player">&times;</button></div>' +
    '<div class="ryder-resume-bar" role="slider" tabindex="0" aria-label="Track position" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="ryder-resume-fill"></div></div>' +
    '<span class="ryder-resume-time">0:00 / 0:00</span>';
  document.body.appendChild(wrap);

  var audio = document.createElement('audio');
  audio.preload = 'none';
  wrap.appendChild(audio);
  var play = wrap.querySelector('.rr-play');
  var title = wrap.querySelector('.ryder-resume-title');
  var album = wrap.querySelector('.ryder-resume-album');
  var bar = wrap.querySelector('.ryder-resume-bar');
  var fill = wrap.querySelector('.ryder-resume-fill');
  var time = wrap.querySelector('.ryder-resume-time');

  function fmt(seconds){
    if(!isFinite(seconds)) return '0:00';
    seconds = Math.floor(seconds);
    return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2,'0');
  }

  var controller = window.RyderPlayback.create({
    audio: audio,
    tracks: [],
    contextId: location.pathname,
    restore: true,
    onTrack: function(state){
      title.firstChild.nodeValue = state.track.title;
      album.textContent = state.track.album || 'The Ryder McCoy Band';
    },
    onState: function(state){ play.innerHTML = state.paused ? '&#9654;' : '&#10074;&#10074;'; },
    onTime: function(state){
      var pct = state.progress * 100;
      fill.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', Math.round(pct));
      time.textContent = fmt(state.currentTime) + ' / ' + fmt(state.duration);
    }
  });

  play.addEventListener('click', controller.toggle);
  wrap.querySelector('.rr-next').addEventListener('click', controller.next);
  wrap.querySelector('.rr-close').addEventListener('click', function(){
    controller.clear();
    wrap.remove();
    style.remove();
  });
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