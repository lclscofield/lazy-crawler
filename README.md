# common-crawler

## 使用

```
npm install  // 安装依赖
node getIps.js  // 获取 ip 池并存入文件中
```

## 说明

### 规则

引用的 [**cheerio**](https://github.com/cheeriojs/cheerio) 库，会将页面解析为一个类似 jq 的实例，基本用 [**jq 的语法**](https://www.jquery123.com/)就能获取页面的各种信息。

所有爬虫规则都要自己写，可以见例子 [**testIps.js**](target/testIps.js)。只需要写入 url 和 callback 函数，callback 就是爬取的规则。

请求都使用了伪造的 UA，每次请求都会随机抽取一条，所有 UA 都放在 [**userAgents.js**](fn/userAgents.js) 中，也可以自己添加。

### 获取 ip 池

在爬取目标之前，需要先获取 ip 池。获取 ip 池的规则定义在 [**testIps.js**](target/testIps.js) 中，获取后会输出 [**ips.json**](data/ips.json)。
