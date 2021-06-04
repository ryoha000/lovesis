function handleRequest(request: Request) {
  const pathname: URL = new URL(request.url);
  const txt = ` Hello DenoDeploy!\n path : ${pathname}\n`;
  return new Response(txt, {
    headers: { "content-type": "text/plain" },
  });
}

const isRequestEvent = (e: Event): e is RequestEvent => {
  return 'request' in e && 'respondWith' in e
}

addEventListener("fetch", (event) => {
  if (isRequestEvent(event)) {
    event.respondWith(handleRequest(event.request));
  }
});

interface RequestEvent extends Event {
  request: Request
  respondWith: (req: Response) => void
}
