const assert = require('assert')
const fs = require('fs')
async function getResourceContent(page, url) {
  const { content, base64Encoded } = await page._client.send(
      'Page.getResourceContent',
      { frameId: String(page.mainFrame()._id), url },
  )
  assert.equal(base64Encoded, true);
  return content;
}

exports.downLoadImage = async function downLoadImage(page, {itemList, imgCount}) {
  await page.setDefaultNavigationTimeout(300000000) 
  if(imgCount < itemList.items.length) {
    await page.goto(itemList.items[imgCount++])
    await page.waitForSelector('#img')
    const url = await page.$eval('#img', i => i.src)
    const content = await getResourceContent(page, url)
    const contentBuffer = Buffer.from(content, 'base64')
    fs.writeFileSync(`${itemList.name}/${imgCount}.jpg`, contentBuffer, 'base64')
    await downLoadImage(page, {itemList, imgCount})
  }
}