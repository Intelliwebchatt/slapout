// Temporary homepage compatibility fixer.
// Purpose: keep legacy file references working without injecting layout, video, or visual patches.
// Next cleanup step: fix these strings directly in index.html, then remove this Edge Function.

export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  html = html
    .replaceAll('file: "12 - Crazy Girl Crazy Night.mp3"', 'file: "12 - Crazy Girl, Crazy Night.mp3"')
    .replaceAll('file: "who so ever will church..mp3"', 'file: "who  so ever will church..mp3"')
    .replaceAll('href="glass-rose-sessions.html"', 'href="glass-rose.html"');

  const headers = new Headers(response.headers);
  headers.set("content-type", contentType);

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};
