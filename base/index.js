const url = "https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=%E6%AD%A6&f_apply=Apply+Filter"
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

async function getResourceTree(page) {
  var resource = await page._client.send('Page.getResourceTree');
  return resource.frameTree;
}

const assert = require('assert')
async function getResourceContent(page, url) {
  const { content, base64Encoded } = await page._client.send(
      'Page.getResourceContent',
      { frameId: String(page.mainFrame()._id), url },
  );
  assert.equal(base64Encoded, true);
  return content;
}
let imgCount = 0, itemList = {}

//获取总图片数
async function reset() {
  imgCount = 0
  itemList = {}
}

async function getAllItems(page, baseUrl) {
  //第一页
  await page.goto(`${baseUrl}?p=0`)
  await page.waitForSelector('#gdt')
  const item1 = await page.evaluate(() => {
    let items = [], name = document.title.replace(' - ExHentai.org', '')
    name = name.replace(/[*`+<>?:"{},.\/;]/g,'')
    name = name.replace(/[·！#￥——：；“”‘、，|《。》？、【】[\]]/g, '')
    document.querySelectorAll('#gdt .gdtm div a').forEach(v => {
      items.push(v.getAttribute('href'))
    })
    return {
      items,
      name,
    }
  })
  itemList = item1
  if(item1.items.length < 40) {
    await fs.mkdirSync(itemList.name)
  }else {
    //第二页
    await fs.mkdirSync(itemList.name)
    await page.goto(`${baseUrl}?p=1`)
    await page.waitForSelector('#gdt')
    const item2 = await page.evaluate(() => {
      let items = []
      document.querySelectorAll('#gdt .gdtm div a').forEach(v => {
        items.push(v.getAttribute('href'))
      })
      return items
    })
    if(item2.length < 40) {
      itemList.items = [...item1.items, ...item2]
    }
  }
}
async function downLoadImage(page) {
  await page.setDefaultNavigationTimeout(300000000) 
  if(imgCount < itemList.items.length) {
    await page.goto(itemList.items[imgCount++])
    await page.waitForSelector('#img')
    const url = await page.$eval('#img', i => i.src)
    const content = await getResourceContent(page, url)
    const contentBuffer = Buffer.from(content, 'base64')
    fs.writeFileSync(`${itemList.name}/${imgCount}.jpg`, contentBuffer, 'base64')
    await downLoadImage(page)
  }
}

;(async () => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    timeout: 150000,
    headless: false,
  })
  const page = await browser.newPage()
  await page.setCookie(
    {
      name: 'ipb_member_id',
      value:'1962713',
      domain: 'exhentai.org', 
      path: '/'   
    },
    {
      name: 'ipb_pass_hash',
      value:'0c1b295fad4c35e74f2ec993ab023dbc',
      domain: 'exhentai.org', 
      path: '/'
    },
    {
      name: 'ipb_session_id',
      value:'baa01a6c87f96ac436c343373005a35e',
      expires: Date.now() + 3600 * 1000,    
      domain: 'exhentai.org', 
      path: '/'
    },
  )
  //列表页
  await page.goto('https://exhentai.org/')
  await sleep(1000) 
  await page.waitForSelector('.itg')
  
  const urlResult = await page.evaluate(() => {
    let items = []
    document.querySelectorAll('.itg tr .itd .it5 a').forEach(v => {
      items.push(v.getAttribute('href'))
    })
    return items
  })
  //展示页
  for(let i = 0; i < urlResult.length; i++) {
    await getAllItems(page, urlResult[i])
    await downLoadImage(page)  
    await reset()
  }
})()