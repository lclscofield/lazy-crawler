const { getHtml, saveIps } = require('./common.js')

async function getIps (ipsFn) {
  let ips = []
  const startTime = new Date()
  for (let i = 0, len = ipsFn.length; i < len; i++) {
    let ipFn = ipsFn[i]
    if (ipFn.url && ipFn.callback) {
      const $ = await getHtml({
        url: ipFn.url
      })
      ips = ips.concat(await ipFn.callback($))
    }
  }
  await saveIps(ips)
  console.log(`获取并存入 ip 池共耗时 ${new Date() - startTime} ms`)
}

module.exports = getIps
