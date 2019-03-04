const _ = require('lodash')
const path = require('path')
const { getHtml } = require('../fn/common.js')
const getIps = require('../fn/getIps.js')
const testIp = require('../test/testIps.js')
const testTarget = require('../test/testTarget.js')

const ctrlConfig = ['connections', 'rateLimit'] // 控制器配置
const defaultconfig = {
  timeout: 1000, // 超时时间默认 10s
  connections: 10, // 并发数默认 10，最大限制为100
  rateLimit: 0 // 请求间隔默认 0
}
const reqQueues = [] // 普通请求队列
const ipQueues = [] // ip 请求队列

// 错误日志
function log(str, obj) {
  throw new Error(str + JSON.stringify(obj))
}

// 分离请求与控制器配置
function separateConfig(config) {
  let arr = [{}, {}]
  for (let key in Object.keys(config)) {
    if (ctrlConfig.indexOf(key) === -1) {
      arr[0][key] = config[key]
    } else {
      arr[1][key] = config[key]
    }
  }
  return arr
}

// 请求 push 进队列
function pushQueue(options, queues) {
  options = _.isArray(options) ? options : [options]
  for (let i = 0, len = options.length; i < len; i++) {
    if (
      _.isNull(options[i]) ||
      _.isUndefined(options[i]) ||
      (!_.isString(options[i]) && !_.isPlainObject(options[i]))
    ) {
      log('options 格式错误', options[i])
    }
    if (queues === 'reqQueues') {
      queues.push(_.isString(options[i]) ? { url: options[i] } : options[i])
    } else {
      queues.push(options[i])
    }
  }
}

// 并发调度
async function limitDispatch(
  list = [],
  limit = 10,
  interval = 0,
  globalConfig
) {
  if (!limit) limit = 10

  let recursion = arr => {
    let options = arr.shift()
    let callback = options.callback || (globalConfig.callback || (() => {}))
    _.isFunction(callback) || (callback = () => {})

    return getHtml({
      ...globalConfig,
      ...options
    })
      .then(res => {
        callback(res)
        setTimeout(() => {
          if (arr.length !== 0) {
            recursion(arr)
          }
        }, interval)
      })
      .catch(err => {
        console.log(err)
      })
  }

  let listCopy = [].concat(list)
  let asyncList = []
  while (limit--) {
    asyncList.push(recursion(listCopy))
  }
  return Promise.all(asyncList)
}

class Crawler {
  constructor(config = {}) {
    !_.isPlainObject(config) && log('config not object', config)
    this.init(config)
  }

  init(config) {
    let allConfig = {
      ...defaultconfig,
      ...config
    }
    let configList = separateConfig(allConfig)
    this.ctrlConfig = configList[0] // 全局控制器配置
    this.reqConfig = configList[1] // 全局请求配置
  }

  // 添加获取 ip 的请求进入队列
  queueIps(options, path) {
    pushQueue(options, ipQueues)
    this.ipsPath = path
  }

  // 添加请求进入队列
  queue(options) {
    pushQueue(options, reqQueues)
  }

  // 启动
  async start() {
    if (ipQueues.length) {
      console.log('开始获取 ip 池')
      await getIps(ipQueues, this.ipsPath)
    }
    if (reqQueues.length) {
      console.log('开始爬取目标')
      limitDispatch(reqQueues, 3, 3000, this.reqConfig)
    }
  }

  // 测试用例
  test() {
    this.queueIps(testIp, path.join(__dirname, '../data'))
    this.queue(testTarget)
    this.start()
  }
}

module.exports = Crawler
