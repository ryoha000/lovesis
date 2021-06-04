import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { Data, ErogameScapeData } from './type.ts'

export const getDatas = async (): Promise<Data[]> => {
  try {
    const datas: Data[] = await getErogameScapeDatas()
    return datas
  } catch (e) {
    console.error(e)
    return []
  }
}

const getErogameScapeDatas = async () => {
  const query = `SELECT id, gamename FROM gamelist;`
  const formData = new FormData()
  formData.append("sql", query)
  const res = await fetch("https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/sql_for_erogamer_form.php", {
    method: "POST",
    body: formData
  })
  const text = await res.text()
  const dom = new DOMParser().parseFromString(text, "text/html")
  if (!dom) return []

  const datas: ErogameScapeData[] = []
  dom.querySelectorAll("#query_result_main tr").forEach((tr, i) => {
    if (i === 0) {
      return
    }
    const id = tr.ownerDocument?.querySelector("td:nth-child(1)")
    const numberId = Number(id?.textContent)
    const title = tr.ownerDocument?.querySelector("td:nth-child(2)")
    if (!numberId || !isNaN(numberId) || !title) return

    datas.push({ erogamescapeId: numberId, erogamescapeTitle: title.textContent })
  })
  return datas
}
