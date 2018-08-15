

const fs = require('fs')

let imgCount = 0, itemList = {}

async function nextPage(page, baseUrl, num) {
  await fs.mkdirSync(itemList.name)
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
  await page.goto(`${baseUrl}?p=0`)
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
  if(item1.items.length < 40) {
    await fs.mkdirSync(itemList.name)
  }else {
    //第二页
    let t = 20
    for(let p = 1; p < t; p++) {
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