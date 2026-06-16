export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  const storyOverlay = `\n  /* Darker overlay for the church/story image so text reads better on mobile */\n  #story.bg-photo::after{\n    background:linear-gradient(to bottom, rgba(11,10,8,.98) 0%, rgba(11,10,8,.90) 34%, rgba(11,10,8,.93) 70%, var(--asphalt) 100%) !important;\n  }\n  #story .lede{\n    color:rgba(233,224,207,.88);\n    text-shadow:0 2px 12px rgba(0,0,0,.85);\n  }\n`;

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
