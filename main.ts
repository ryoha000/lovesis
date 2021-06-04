import { getDatas } from './lib/scrape.ts'
import { searchData } from './lib/data.ts'

const BASE_URL = "https://raw.githubusercontent.com/ryoha000/lovesis/master/public"

const handleRequest = async (request: Request) => {
  switch (request.method) {
    case "GET": {
      const url = new URL(request.url)
      const pathname = url.pathname
      let res: ArrayBuffer
      if (pathname.startsWith('/api')) {
        if (pathname === '/api/search') {
          const queryTitle = url.searchParams.get('title')
          if (!queryTitle) {
            return new Response(null, { status: 400 })
          }
          const data = searchData(queryTitle, datas)
          if (!data) {
            return new Response(null, { status: 404 })
          }
          return new Response(JSON.stringify(data), {
            headers: { "content-type": "application/json" }
          });
        }
        return new Response(null, { status: 405 })
      } else if (pathname && pathname !== '/') {
        res = await (await fetch(`${BASE_URL}/${pathname}`)).arrayBuffer()
      } else {
        res = await (await fetch(`${BASE_URL}/index.html`)).arrayBuffer()
      }
      return new Response(res, {
        headers: { "content-type": "text/html" },
      });
    }
    default: {
      return new Response(null, { status: 405 })
    }
  }
}

let datas = await getDatas()
setInterval(async () => {
  datas = await getDatas()
})

const isRequestEvent = (e: Event): e is RequestEvent => {
  return 'request' in e && 'respondWith' in e
}

addEventListener("fetch", async (event) => {
  if (isRequestEvent(event)) {
    event.respondWith(await handleRequest(event.request));
  }
});

interface RequestEvent extends Event {
  request: Request
  respondWith: (req: Response) => void
}
