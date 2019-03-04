# lazy-crawler

## 说明

### 规则

引用的 [**cheerio**](https://github.com/cheeriojs/cheerio) 库，会将页面解析为一个类似 jq 的实例，基本用 [**jq 的语法**](https://www.jquery123.com/)就能获取页面的各种信息。

所有爬虫规则都要自己写。

请求都使用了伪造的 UA，每次请求都会随机抽取一条，所有 UA 都放在 [**userAgents.js**](fn/userAgents.js) 中。

### 获取 ip 池

在爬取目标之前，需要先获取 ip 池。获取可以见例子 [**testIps.js**](target/testIps.js)。只需要写入 url 和 callback 函数，callback 就是爬取的规则。获取后会输出 [**ips.json**](data/ips.json)（此文件路径可选）。

## API 及配置

### 全局配置

分为控制器配置和请求配置。

控制器配置:

```
let config = {
  timeout: 10000,  // 超时时间默认 10s
  connections: 10,  // 并发数默认 10
  rateLimit: 0  // 请求间隔默认 0
}
```

请求配置同 [request](https://github.com/request/request#requestoptions-callback)。（所有请求默认随机使用伪造的 User-Agent）。

使用:

```
let config = {
  timeout: 10000,  // 超时时间默认 10s
  connections: 10,  // 并发数默认 10
  rateLimit: 0,  // 请求间隔默认 0
  header: {}
}
let crawler = new Crawler(config)
```

### 请求队列

分为获取 ip 请求和普通爬取请求

ip 请求:

```
/*
callback 参数接收的是 cheerio 解析出的类似 jq 的实例，像使用 jq 一样使用它吧
callback 返回值是一个数组，数组元素是对象，必须包括 ip 属性
{
  ip: 'xxx.xxx.xxx.xxx'
}
*/
let ipsFn = [  // 也可为数组，获取多个源的 ip
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
```

普通请求:

```

```

## 例子

```
const Crawler = require('lazy-crawler')

let crawler = new Crawler()  // 爬虫实例

// 获取 ip 的规则
let ipsFn = [
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
// 添加获取 ip 的规则进入队列，获取 ip 的请求不受自定义的全局控制器配置（如 timeout）影响。
crawler.queueIps(ipsFn, './')

crawler.start()  // 开始运行
```
