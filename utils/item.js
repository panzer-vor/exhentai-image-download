

const fs = require('fs')

let imgCount = 0, itemList = {}

async function nextPage(page, baseUrl, num) {
  baseUrl = baseUrl.split('?')[0]
  await page.goto(`${baseUrl}?p=${num}`)
  await page.waitForSelector('#gdt')
  const i = await page.evaluate(() => {
    let items = []
    document.querySelectorAll('#gdt .gdtm div a').forEach(v => {
      items.push(v.getAttribute('href'))
    })
    return items
  })
  return i
}

exports.getAllItems = async function (page, baseUrl) {
  //第一页
  let pa = baseUrl.split('=')[1]
  if(pa) {
    pa = parseInt(pa)
  }else {
    pa = 0
    baseUrl = `${baseUrl}?p=0`
  }
  await page.goto(baseUrl)
  await page.waitForSelector('#gdt')
  const item1 = await page.evaluate(() => {
    let items = [], name = document.querySelector('.gm #gd2 #gj').innerText
    name = name.replace(/[*`+<>?:"{},.\/;]/g,'')
    document.querySelectorAll('#gdt .gdtm div a').forEach(v => {
      items.push(v.getAttribute('href'))
    })
    return {
      items,
      name,
    }
  })
  itemList = item1

  await fs.mkdirSync(itemList.name)
    //第二页

  if(item1.items.length>=40) {
    let t = 20
    for(let p = pa + 1; p < t; p++) {
      const i = await nextPage(page,baseUrl, p)
      itemList.items = [...itemList.items, ...i]
      if(i.length < 40) {
        break
      }
    }
  }
  
  
  return {
    itemList,
    imgCount,
  }
}