/*
callback 参数接收的是 cheerio 解析出的类似 jq 的实例，像使用 jq 一样使用它吧
callback 返回值是一个数组，数组元素是对象，必须包括 ip 属性
{
  ip: 'xxx.xxx.xxx.xxx'
}
*/
function callback ($) {
  let ips = []
  $('.table tbody tr').each((index, e) => {
    let ipObj = {}
    $(e)
      .children('td')
      .each((idx, event) => {
        switch (true) {
          case idx === 0:
            ipObj.ip = $(event)
              .text()
              .trim()
            break
          case idx === 4:
            ipObj.location = $(event)
              .text()
              .trim()
            break
          case idx === 3:
            ipObj.ip = `${$(event)
              .text()
              .trim()
              .toLowerCase()}://${ipObj.ip}`
            break
          case idx === 1:
            ipObj.ip = `${ipObj.ip}:${$(event)
              .text()
              .trim()}`
        }
      })
    ips.push(ipObj)
  })
  return ips
}

let ipsFn = []
for (let i = 1; i <= 1000; i++) {
  ipsFn.push({
    url: `https://www.kuaidaili.com/free/inha/${i}/`,
    callback
  })
}

module.exports = ipsFn
