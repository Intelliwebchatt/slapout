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

  /* Heavier depth pass: cards, tags, track log, field notes */
  .genre-tag,
  .member,
  .log,
  .fn-doc,
  .reel{
    background:linear-gradient(180deg, rgba(36,29,22,.99), rgba(9,8,7,.99)) !important;
    box-shadow:
      0 28px 58px rgba(0,0,0,.62),
      0 9px 18px rgba(0,0,0,.52),
      inset 0 1px 0 rgba(255,255,255,.065),
      inset 0 -1px 0 rgba(0,0,0,.72),
      inset 0 0 0 1px rgba(138,75,50,.08) !important;
  }
  .genre-tag{
    border-color:rgba(138,75,50,.55) !important;
    box-shadow:0 14px 30px rgba(0,0,0,.50), inset 0 1px 0 rgba(255,255,255,.04) !important;
  }
  .genre-tag.hot{color:#D9D2C3 !important;border-color:rgba(255,138,42,.48) !important;}
  .log{border-color:rgba(138,75,50,.46) !important;}
  .log-head{
    background:linear-gradient(180deg, rgba(46,36,27,.88), rgba(13,10,8,.94));
    box-shadow:inset 0 -1px 0 rgba(0,0,0,.65), 0 8px 18px rgba(0,0,0,.25);
  }
  .track{
    background:linear-gradient(180deg, rgba(255,255,255,.025), rgba(0,0,0,.14));
    box-shadow:inset 0 1px 0 rgba(255,255,255,.025);
  }
  .track:hover{
    background:linear-gradient(180deg, rgba(138,75,50,.16), rgba(0,0,0,.18)) !important;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.04), 0 10px 20px rgba(0,0,0,.22) !important;
  }
  .track.active{
    background:linear-gradient(180deg, rgba(138,75,50,.20), rgba(0,0,0,.22)) !important;
    box-shadow:
      inset 5px 0 0 #8A4B32,
      inset 0 1px 0 rgba(255,255,255,.06),
      0 12px 26px rgba(0,0,0,.35) !important;
  }
  .member,
  .fn-doc,
  .reel{
    border-color:rgba(138,75,50,.44) !important;
  }
  .member{transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;}
  .member:hover{
    transform:translateY(-4px);
    border-color:rgba(138,75,50,.82) !important;
    box-shadow:
      0 34px 70px rgba(0,0,0,.68),
      0 0 28px rgba(138,75,50,.18),
      inset 0 1px 0 rgba(255,255,255,.08),
      inset 0 -1px 0 rgba(0,0,0,.72) !important;
  }
  .fn-doc{
    background:linear-gradient(180deg, rgba(18,15,12,.99), rgba(5,5,4,.99)) !important;
    box-shadow:
      0 30px 60px rgba(0,0,0,.66),
      0 9px 22px rgba(0,0,0,.46),
      inset 0 1px 0 rgba(255,255,255,.055),
      inset 0 0 0 1px rgba(138,75,50,.08) !important;
  }
  .reel:hover,.reel:focus-within{
    transform:translateY(-3px);
    box-shadow:
      0 34px 70px rgba(0,0,0,.68),
      0 0 28px rgba(138,75,50,.20),
      inset 0 1px 0 rgba(255,255,255,.08) !important;
  }

  /* Button rebuild: heavier shade, still flatter than neon */
  .btn,
  #bookingLink{
    position:relative !important;
    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;
    min-height:50px !important;
    padding:14px 25px !important;
    border:1px solid rgba(138,75,50,.96) !important;
    border-radius:2px !important;
    background:linear-gradient(180deg, rgba(33,26,20,.98), rgba(5,5,4,.99)) !important;
    color:#D9D2C3 !important;
    font-family:'Special Elite', monospace !important;
    font-size:.74rem !important;
    font-weight:400 !important;
    letter-spacing:.18em !important;
    line-height:1.2 !important;
    text-transform:uppercase !important;
    text-decoration:none !important;
    text-shadow:none !important;
    box-shadow:
      0 20px 38px rgba(0,0,0,.62),
      0 6px 13px rgba(0,0,0,.48),
      inset 0 1px 0 rgba(255,255,255,.075),
      inset 0 -2px 0 rgba(0,0,0,.62),
      inset 0 0 0 1px rgba(255,194,122,.045) !important;
    overflow:hidden !important;
  }
  .btn::before,
  #bookingLink::before{
    content:"" !important;
    position:absolute !important;
    inset:0 !important;
    pointer-events:none !important;
    opacity:.25 !important;
    background:linear-gradient(110deg, transparent 0%, rgba(217,210,195,.18) 26%, transparent 45%, rgba(138,75,50,.20) 100%) !important;
  }
  .btn:hover,
  .btn:focus-visible,
  #bookingLink:hover,
  #bookingLink:focus-visible{
    color:#F0E6D2 !important;
    border-color:rgba(217,210,195,.75) !important;
    background:linear-gradient(180deg, rgba(48,35,25,.99), rgba(10,8,6,.99)) !important;
    transform:translateY(-2px) !important;
    box-shadow:
      0 26px 48px rgba(0,0,0,.70),
      0 0 22px rgba(138,75,50,.24),
      inset 0 1px 0 rgba(255,255,255,.09),
      inset 0 -2px 0 rgba(0,0,0,.60) !important;
  }
  .btn.solid,
  #zipBtn{
    background:linear-gradient(180deg, #6c281e, #210d09) !important;
    border-color:rgba(166,85,55,1) !important;
    color:#F0E6D2 !important;
    box-shadow:
      0 24px 48px rgba(0,0,0,.68),
      0 0 24px rgba(138,75,50,.20),
      inset 0 1px 0 rgba(255,255,255,.08),
      inset 0 -2px 0 rgba(0,0,0,.62) !important;
  }
  .btn.solid:hover,
  #zipBtn:hover,
  .btn.solid:focus-visible,
  #zipBtn:focus-visible{
    background:linear-gradient(180deg, #7d3324, #2a100b) !important;
    border-color:rgba(217,210,195,.66) !important;
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
