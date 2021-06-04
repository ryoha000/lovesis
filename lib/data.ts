import { getDistance } from './distance.ts'
import type { Data } from './type.ts'

const toLowerAndHankaku = (str: string) => {
  const retStr = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  })
  return retStr.toLowerCase()
}

export const searchData = (queryTitle: string, datas: Data[]) => {
  let res: Data | null = null
  const sourceTitle = validateTitle(queryTitle)

  // 編集距離は最小でも0.8欲しい
  let maxDistance = 0.8
  for (const data of datas) {
    const gameTitle = toLowerAndHankaku(data.erogamescapeTitle)
    const distance = getDistance(sourceTitle, gameTitle)
    if (distance > maxDistance) {
      res = data
      maxDistance = distance
    }
  }
  if (res) return res
  for (const data of datas) {
    const gameTitle = toLowerAndHankaku(data.erogamescapeTitle)
    if (sourceTitle.length > 5 && gameTitle.includes(sourceTitle)) {
      return data
    }
  }
  return res
}

const validateTitle = (queryTitle: string) => {
  let res = toLowerAndHankaku(queryTitle)

  const windowsStrings: string[] = []
  for (const win of ['Windows', 'windows']) {
    windowsStrings.push(...([7, 8, 10].map(ver =>
      [`${win}${ver}`, `${win}${ver}対応`]
    ).flat()))
  }

  const regexes = [/=【(.*?)】/g, /=-(.*?)-/g];
  for (const regex of regexes) {
    const matched = regex.exec(res)
    if (matched) {
      res = res.replace(matched[0], '')
    }
  }

  const removeStrings = ['を起動', 'の起動', '_単独動作版', '「', '」', ' ', '　', '普及版', '対応版'].concat(windowsStrings)
  removeStrings.forEach(v => {
    res = res.replace(v, '')
  })
  return res
}
