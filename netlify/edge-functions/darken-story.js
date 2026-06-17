export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  // Patch two track filenames where the live file names differ from the index.html references.
  html = html.replace('file: "12 - Crazy Girl Crazy Night.mp3"', 'file: "12 - Crazy Girl, Crazy Night.mp3"');
  html = html.replace('file: "who so ever will church..mp3"', 'file: "who  so ever will church..mp3"');

  const visualUpgrade = `
  /* Darker overlay for the church/story image so text reads better on mobile */
  #story.bg-photo::after{
    background:linear-gradient(
      to bottom,
      rgba(11,10,8,.98) 0%,
      rgba(11,10,8,.90) 34%,
      rgba(11,10,8,.93) 70%,
      var(--asphalt) 100%
    ) !important;
  }

  #story .lede{
    color:rgba(233,224,207,.88);
    text-shadow:0 2px 12px rgba(0,0,0,.85);
  }

  #story .lede p{
    margin-bottom:1.35rem;
  }

  #story .lede p:last-child{
    margin-bottom:0;
  }

  /* Subtle Slapout background static */
  body::before{
    content:"";
    position:fixed;
    inset:0;
    z-index:49;
    pointer-events:none;
    opacity:.045;
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

  /* Depth pass: buttons, cards, track log, field notes */
  .btn{
    position:relative;
    overflow:hidden;
    border-color:rgba(255,138,42,.72) !important;
    background:linear-gradient(180deg, rgba(255,138,42,.10), rgba(0,0,0,.10)) !important;
    box-shadow:
      0 10px 24px rgba(0,0,0,.42),
      inset 0 1px 0 rgba(255,255,255,.08),
      inset 0 -1px 0 rgba(0,0,0,.55);
    text-shadow:0 1px 8px rgba(255,138,42,.25);
    transform:translateY(0);
  }

  .btn::before{
    content:"";
    position:absolute;
    inset:0;
    pointer-events:none;
    background:linear-gradient(
      115deg,
      rgba(255,255,255,.16),
      transparent 32%,
      transparent 68%,
      rgba(255,138,42,.10)
    );
    opacity:.65;
  }

  .btn:hover,
  .btn:focus-visible{
    transform:translateY(-2px);
    box-shadow:
      0 16px 34px rgba(0,0,0,.55),
      0 0 28px rgba(255,138,42,.35),
      inset 0 1px 0 rgba(255,255,255,.12);
  }

  .btn.solid{
    background:linear-gradient(180deg, #b52828, #781313) !important;
    border-color:#c83a2f !important;
    box-shadow:
      0 13px 28px rgba(0,0,0,.48),
      0 0 22px rgba(163,31,31,.22),
      inset 0 1px 0 rgba(255,255,255,.10),
      inset 0 -2px 0 rgba(0,0,0,.35);
  }

  .btn.solid:hover,
  .btn.solid:focus-visible{
    background:linear-gradient(180deg, #d03535, #8b1717) !important;
    color:var(--bone) !important;
  }

  .genre-tag,
  .member,
  .log,
  .fn-doc,
  .reel{
    background:linear-gradient(180deg, rgba(31,25,20,.98), rgba(12,10,8,.98)) !important;
    box-shadow:
      0 18px 38px rgba(0,0,0,.42),
      inset 0 1px 0 rgba(255,255,255,.045),
      inset 0 -1px 0 rgba(0,0,0,.55);
  }

  .genre-tag{
    border-color:rgba(255,138,42,.22) !important;
  }

  .genre-tag.hot{
    box-shadow:
      0 10px 22px rgba(0,0,0,.35),
      0 0 18px rgba(255,138,42,.08),
      inset 0 1px 0 rgba(255,255,255,.06);
  }

  .log{
    border-color:rgba(255,138,42,.18) !important;
  }

  .log-head{
    background:linear-gradient(180deg, rgba(34,28,22,.80), rgba(15,12,10,.92));
    box-shadow:inset 0 -1px 0 rgba(0,0,0,.5);
  }

  .track{
    background:linear-gradient(180deg, rgba(255,255,255,.018), rgba(0,0,0,.08));
  }

  .track:hover{
    background:linear-gradient(180deg, rgba(255,138,42,.07), rgba(0,0,0,.12)) !important;
  }

  .track.active{
    background:linear-gradient(180deg, rgba(255,138,42,.11), rgba(0,0,0,.16)) !important;
    box-shadow:
      inset 4px 0 0 var(--neon),
      inset 0 1px 0 rgba(255,255,255,.045) !important;
  }

  .icon-btn{
    background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.28)) !important;
    box-shadow:
      0 8px 18px rgba(0,0,0,.32),
      inset 0 1px 0 rgba(255,255,255,.06);
  }

  .icon-btn:hover,
  .icon-btn:focus-visible{
    transform:translateY(-1px);
    background:linear-gradient(180deg, rgba(255,138,42,.14), rgba(0,0,0,.25)) !important;
    box-shadow:
      0 12px 24px rgba(0,0,0,.45),
      0 0 20px rgba(255,138,42,.16),
      inset 0 1px 0 rgba(255,255,255,.08);
  }

  .member{
    border-color:rgba(255,138,42,.16) !important;
    transition:transform .18s ease, border-color .18s ease, box-shadow .18s ease;
  }

  .member:hover{
    transform:translateY(-3px);
    border-color:rgba(255,138,42,.45) !important;
    box-shadow:
      0 24px 48px rgba(0,0,0,.52),
      0 0 22px rgba(255,138,42,.08),
      inset 0 1px 0 rgba(255,255,255,.06);
  }

  .fn-doc{
    border-color:rgba(255,138,42,.20) !important;
    box-shadow:
      0 18px 34px rgba(0,0,0,.48),
      inset 0 1px 0 rgba(255,255,255,.04);
  }

  .reel{
    border-color:rgba(255,138,42,.18) !important;
  }

  .reel:hover,
  .reel:focus-within{
    transform:translateY(-2px);
    box-shadow:
      0 22px 45px rgba(0,0,0,.55),
      0 0 24px rgba(255,138,42,.10),
      inset 0 1px 0 rgba(255,255,255,.06);
  }

  .player{
    background:linear-gradient(180deg, rgba(22,18,14,.98), rgba(7,6,5,.99)) !important;
    box-shadow:
      0 -18px 45px rgba(0,0,0,.75),
      inset 0 1px 0 rgba(255,255,255,.05) !important;
  }

  @media (prefers-reduced-motion: reduce){
    body::before{
      animation:none !important;
    }

    .btn,
    .member,
    .reel,
    .icon-btn{
      transition:none !important;
      transform:none !important;
    }
  }
`;

  html = html.replace("</style>", `${visualUpgrade}</style>`);

  const headers = new Headers(response.headers);
  headers.set("content-type", contentType);
  headers.set("cache-control", "no-cache, no-store, must-revalidate");

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
