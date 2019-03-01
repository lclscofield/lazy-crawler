/*
callback 参数接收的是 cheerio 解析出的类似 jq 的实例，像使用 jq 一样使用它吧
callback 返回值是一个数组，数组元素是对象，必须包括 ip 属性
{
  ip: 'xxx.xxx.xxx.xxx'
}
*/
module.exports = [
  {
    url: 'https://www.xicidaili.com/nn/',  // 获取 ip 的地址
    callback: ($) => {  // 处理页面获取 ip 并返回 ip 数组
      let ips = []
      $('#ip_list tr').each((index, e) => {
        if (index === 0) return
        let ipObj = {}
        $(e).children('td').each((idx, event) => {
          switch (true) {
            case idx === 1:
              ipObj.ip = $(event).text().trim()
              break
            case idx === 2:
              ipObj.ip = `${ipObj.ip}:${$(event).text().trim()}`
              break
            case idx === 3:
              ipObj.location = $(event).text().trim()
              break
            case idx === 5:
              ipObj.protocol = $(event).text().trim()
              break
          }
        })
        ips.push(ipObj)
      })
      return ips
    }
  }
]
