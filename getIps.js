const { getHtml, saveIps } = require('./fn/common.js')
const ipsFn = require('./target/testIps.js')

async function getIps(ipsFn) {
  if (!ipsFn || !ipsFn.length) {
    console.log('请先写入获取 ip 的规则')
    return
  }
  let ips = []
  const startTime = new Date()
  for (let i = 0, len = ipsFn.length; i < len; i++) {
    let ipFn = ipsFn[i]
    if (ipFn.url && ipFn.callback) {
      const $ = await getHtml({
        url: ipFn.url
      })
      ips.push(await ipFn.callback($))
    }
  }
  await saveIps(ips)
  console.log(`获取并存入 ip 池共耗时 ${new Date() - startTime} ms`)
}

getIps(ipsFn)
