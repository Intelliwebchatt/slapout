export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  // Patch track filenames where the uploaded file names differ from index.html.
  html = html.replace('file: "12 - Crazy Girl Crazy Night.mp3"', 'file: "12 - Crazy Girl, Crazy Night.mp3"');
  html = html.replace('file: "who so ever will church..mp3"', 'file: "who  so ever will church..mp3"');

  const visualUpgrade = `
  /* Darker story image overlay */
  #story.bg-photo::after{
    background:linear-gradient(to bottom, rgba(11,10,8,.98) 0%, rgba(11,10,8,.90) 34%, rgba(11,10,8,.93) 70%, var(--asphalt) 100%) !important;
  }
  #story .lede{
    color:rgba(233,224,207,.88);
    text-shadow:0 2px 12px rgba(0,0,0,.85);
  }
  #story .lede p{margin-bottom:1.35rem;}
  #story .lede p:last-child{margin-bottom:0;}

  /* Dirt-road static texture */
  body::before{
    content:"";
    position:fixed;
    inset:0;
    z-index:49;
    pointer-events:none;
    opacity:.065;
    mix-blend-mode:screen;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(255,138,42,.16) 0 1px, transparent 1px),
      radial-gradient(circle at 80% 70%, rgba(255,255,255,.10) 0 1px, transparent 1px);
    background-size:34px 34px,47px 47px;
    animation:slapoutSignal 8s steps(6,end) infinite;
  }
  @keyframes slapoutSignal{
    0%{transform:translate3d(0,0,0)}
    25%{transform:translate3d(-7px,4px,0)}
    50%{transform:translate3d(5px,-6px,0)}
    75%{transform:translate3d(8px,5px,0)}
    100%{transform:translate3d(0,0,0)}
  }

  /* Cards keep depth, but no glossy button look */
  .genre-tag,
  .member,
  .log,
  .fn-doc,
  .reel{
    background:linear-gradient(180deg, rgba(31,25,20,.98), rgba(12,10,8,.98)) !important;
    box-shadow:0 18px 38px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.045), inset 0 -1px 0 rgba(0,0,0,.55);
  }
  .genre-tag{border-color:rgba(138,75,50,.45) !important;}
  .genre-tag.hot{color:#D9D2C3 !important;border-color:rgba(255,138,42,.42) !important;}
  .log{border-color:rgba(138,75,50,.38) !important;}
  .log-head{background:linear-gradient(180deg, rgba(34,28,22,.80), rgba(15,12,10,.92));box-shadow:inset 0 -1px 0 rgba(0,0,0,.5);}
  .track{background:linear-gradient(180deg, rgba(255,255,255,.018), rgba(0,0,0,.08));}
  .track:hover{background:linear-gradient(180deg, rgba(138,75,50,.10), rgba(0,0,0,.12)) !important;}
  .track.active{background:linear-gradient(180deg, rgba(138,75,50,.14), rgba(0,0,0,.16)) !important;box-shadow:inset 4px 0 0 #8A4B32, inset 0 1px 0 rgba(255,255,255,.045) !important;}
  .member{border-color:rgba(138,75,50,.30) !important;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;}
  .member:hover{transform:translateY(-3px);border-color:rgba(138,75,50,.72) !important;box-shadow:0 24px 48px rgba(0,0,0,.52), 0 0 22px rgba(138,75,50,.14), inset 0 1px 0 rgba(255,255,255,.06);}
  .fn-doc{border-color:rgba(138,75,50,.38) !important;box-shadow:0 18px 34px rgba(0,0,0,.48), inset 0 1px 0 rgba(255,255,255,.04);}
  .reel{border-color:rgba(138,75,50,.35) !important;}
  .reel:hover,.reel:focus-within{transform:translateY(-2px);box-shadow:0 22px 45px rgba(0,0,0,.55), 0 0 24px rgba(138,75,50,.16), inset 0 1px 0 rgba(255,255,255,.06);}

  /* Button rebuild: flatter, dirtier, more record-label */
  .btn,
  #bookingLink{
    position:relative !important;
    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;
    min-height:48px !important;
    padding:13px 24px !important;
    border:1px solid rgba(138,75,50,.90) !important;
    border-radius:2px !important;
    background:linear-gradient(180deg, rgba(25,21,17,.96), rgba(8,7,6,.98)) !important;
    color:#D9D2C3 !important;
    font-family:'Special Elite', monospace !important;
    font-size:.74rem !important;
    font-weight:400 !important;
    letter-spacing:.18em !important;
    line-height:1.2 !important;
    text-transform:uppercase !important;
    text-decoration:none !important;
    text-shadow:none !important;
    box-shadow:0 12px 24px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.055), inset 0 0 0 1px rgba(255,194,122,.035) !important;
    overflow:hidden !important;
  }
  .btn::before,
  #bookingLink::before{
    content:"" !important;
    position:absolute !important;
    inset:0 !important;
    pointer-events:none !important;
    opacity:.22 !important;
    background:linear-gradient(110deg, transparent 0%, rgba(217,210,195,.16) 28%, transparent 46%, rgba(138,75,50,.16) 100%) !important;
  }
  .btn:hover,
  .btn:focus-visible,
  #bookingLink:hover,
  #bookingLink:focus-visible{
    color:#F0E6D2 !important;
    border-color:rgba(217,210,195,.72) !important;
    background:linear-gradient(180deg, rgba(39,29,22,.98), rgba(13,10,8,.98)) !important;
    transform:translateY(-1px) !important;
    box-shadow:0 16px 30px rgba(0,0,0,.52), 0 0 18px rgba(138,75,50,.20), inset 0 1px 0 rgba(255,255,255,.07) !important;
  }
  .btn.solid,
  #zipBtn{
    background:linear-gradient(180deg, #5b2119, #24100c) !important;
    border-color:rgba(166,85,55,.95) !important;
    color:#F0E6D2 !important;
    box-shadow:0 14px 30px rgba(0,0,0,.50), 0 0 20px rgba(138,75,50,.14), inset 0 1px 0 rgba(255,255,255,.06) !important;
  }
  .btn.solid:hover,
  #zipBtn:hover,
  .btn.solid:focus-visible,
  #zipBtn:focus-visible{
    background:linear-gradient(180deg, #733022, #2c120e) !important;
    border-color:rgba(217,210,195,.64) !important;
  }
  .cta-row{gap:12px !important;}

  /* Keep the bottom player heavy */
  .player{background:linear-gradient(180deg, rgba(22,18,14,.98), rgba(7,6,5,.99)) !important;box-shadow:0 -18px 45px rgba(0,0,0,.75), inset 0 1px 0 rgba(255,255,255,.05) !important;}

  @media(max-width:560px){.btn,#bookingLink{width:100% !important;max-width:360px !important;}}
  @media(prefers-reduced-motion:reduce){body::before{animation:none !important;}.btn,.member,.reel,#bookingLink{transition:none !important;transform:none !important;}}
`;

  html = html.replace("</style>", `${visualUpgrade}</style>`);

  const contactFooter = `
<!-- CONTACT & FOOTER SECTION -->
<section id="booking" style="background-color:#111111;color:#D9D2C3;font-family:'IBM Plex Sans',sans-serif;padding:80px 20px;text-align:center;border-top:1px solid #8A4B32;">
  <p style="font-family:'Cormorant Garamond',serif;font-size:14px;text-transform:uppercase;letter-spacing:4px;color:#8A4B32;margin-bottom:15px;">Cult Over Commodity</p>
  <h2 style="font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:400;color:#D9D2C3;margin:0 0 25px 0;letter-spacing:1px;">Get In Touch</h2>
  <p style="max-width:600px;margin:0 auto 40px auto;font-size:16px;line-height:1.6;color:#D9D2C3;opacity:.85;">For booking, press, vinyl distribution, or road business, reach out directly to the label.</p>
  <a id="bookingLink" href="mailto:info@biloxibluesrecords.com">Email Biloxi Blues Records</a>
  <div id="socialRow" style="display:none"></div>
  <div style="width:60px;height:1px;background-color:#8A4B32;margin:60px auto 40px auto;opacity:.5;"></div>
  <footer style="font-size:13px;letter-spacing:1px;line-height:1.8;opacity:.7;padding:0;border-top:none;color:#D9D2C3;">
    <p style="font-family:'Cormorant Garamond',serif;font-size:18px;letter-spacing:3px;color:#D9D2C3;margin-bottom:10px;text-transform:uppercase;">Biloxi Blues Records</p>
    <p style="margin:5px 0;">The Ryder McCoy Band &bull; Slapout, Alabama</p>
    <p style="margin:5px 0;font-size:12px;">&copy; <span id="yr"></span> Biloxi Blues Records. Free to download. Free to share for personal listening.</p>
    <p style="margin:20px 0 0 0;font-style:italic;color:#8A4B32;letter-spacing:2px;font-size:12px;text-transform:uppercase;">No fake saints. No clean endings. Backroads know.</p>
  </footer>
</section>
`;

  html = html.replace(/<!-- ============ BOOKING ============ -->[\s\S]*?<!-- ============ STICKY PLAYER ============ -->/, `${contactFooter}\n<!-- ============ STICKY PLAYER ============ -->`);

  const headers = new Headers(response.headers);
  headers.set("content-type", contentType);
  headers.set("cache-control", "no-cache, no-store, must-revalidate");

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
