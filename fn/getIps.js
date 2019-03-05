const { getHtml, saveIps, check } = require('./common.js')
const _ = require('lodash')

async function getIp (ipsFn) {
  let ips = []
  for (let i = 0, len = ipsFn.length; i < len; i++) {
    let ipFn = ipsFn[i]
    if (ipFn.url && ipFn.callback) {
      try {
        const $ = await getHtml({
          url: ipFn.url
        })
        ips = ips.concat(_.isArray(ipFn.callback($)) ? ipFn.callback($) : [])
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log('缺少 url 或 callback', JSON.stringify(ipFn))
    }
  }
  return ips
}

async function getIps (ipsFn, path) {
  const startTime = new Date()
  let ips = await getIp(ipsFn)
  ips = await check(ips) // 验证代理可用性
  await saveIps(ips, path)
  console.log(
    `获取、验证并存入 ip 池共耗时 ${new Date() - startTime} ms` + '\n------'
  )
  return ips
}

module.exports = getIps
