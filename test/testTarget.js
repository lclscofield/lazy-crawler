/*
callback 参数接收的是 cheerio 解析出的类似 jq 的实例，像使用 jq 一样使用它吧
*/
const callback = $ => {
  let title = []
  $('.co_content8 td a').each((index, e) => {
    title.push($(e).text())
  })
  return title
}

const target = []
for (let i = 1; i <= 2; i++) {
  target.push({
    url: `http://www.ygdy8.net/html/gndy/dyzz/list_23_${i}.html`,
    callback
  })
}
module.exports = target
