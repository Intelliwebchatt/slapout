export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  const storyOverlay = `
  /* Darker overlay for the church/story image so text reads better on mobile */
  #story.bg-photo::after{
    background:linear-gradient(to bottom, rgba(11,10,8,.98) 0%, rgba(11,10,8,.90) 34%, rgba(11,10,8,.93) 70%, var(--asphalt) 100%) !important;
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
`;

  html = html.replace("</style>", `${storyOverlay}</style>`);

  const headers = new Headers(response.headers);
  headers.set("content-type", contentType);
  headers.set("cache-control", "no-cache, no-store, must-revalidate");

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
