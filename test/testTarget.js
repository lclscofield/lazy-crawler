/*
callback 参数接收的是 cheerio 解析出的类似 jq 的实例，像使用 jq 一样使用它吧
*/
const callback = $ => {
  let title = []
  $('.me1 li h3 a').each((index, e) => {
    title.push({
      title: $(e)
        .text()
        .trim(),
      href: `www.80s.tw${$(e).attr('href')}`
    })
  })
  return title
}

const target = []
for (let i = 1; i <= 5; i++) {
  target.push({
    url: `https://www.80s.tw/movie/list/-----p/${i}`,
    callback
  })
}
module.exports = target
