const url = process.argv.splice(2)[0] || 'https://exhentai.org/'
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const { getResourceContent, downLoadImage } = require('./utils/save')
const { getAllItems } = require('./utils/item')
const { reset, setCookies } = require('./utils/helper')
const { urlResults } = require('./utils/list')
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

let imgCount = 0, itemList = {}

;(async () => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    timeout: 150000,
  })
  const page = await browser.newPage()
  //设置cookie
  await setCookies(page)
  //列表页
  await page.goto(url)
  await sleep(3000)
  const urlResult = await urlResults(page)
  //展示页
  if(urlResult) {
    for(let i = 0; i < urlResult.length; i++) {
      const data = await getAllItems(page, urlResult[i])
      await downLoadImage(page, data)  
    }
  }else {
    const data = await getAllItems(page, url, itemList)
    await downLoadImage(page, data)  
  }
})()