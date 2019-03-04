/*
callback 参数接收的是 cheerio 解析出的类似 jq 的实例，像使用 jq 一样使用它吧
*/
module.exports = [
  {
    url: 'https://www.xicidaili.com', // 目标网站地址
    // 处理页面获取 ip 并返回 ip 数组
    callback: $ => {
      $('#header h1').each((index, e) => {
        console.log($(e).text())
      })
    }
  },
  {
    url: 'https://www.xicidaili.com/nn/', // 目标网站地址
    // 处理页面获取 ip 并返回 ip 数组
    callback: $ => {
      $('#header h1').each((index, e) => {
        console.log($(e).text())
      })
    }
  },
  {
    url: 'https://www.xicidaili.com/api', // 目标网站地址
    // 处理页面获取 ip 并返回 ip 数组
    callback: $ => {
      $('#header h1').each((index, e) => {
        console.log($(e).text())
      })
    }
  },
  {
    url: 'https://www.xicidaili.com/nt/', // 目标网站地址
    // 处理页面获取 ip 并返回 ip 数组
    callback: $ => {
      $('#header h1').each((index, e) => {
        console.log($(e).text())
      })
    }
  },
  {
    url: 'https://www.xicidaili.com/wn/', // 目标网站地址
    // 处理页面获取 ip 并返回 ip 数组
    callback: $ => {
      $('#header h1').each((index, e) => {
        console.log($(e).text())
      })
    }
  }
]
