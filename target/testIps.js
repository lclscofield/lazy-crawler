module.exports = [
  {
    url: 'https://www.xicidaili.com/nn/',
    callback: ($) => {
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
