const puppeteer = require('puppeteer')
const fs = require('fs')
const request = require('request')
const path = require('path')
const keepUri = process.env.NODE_ENV === 'development' ? '../../../../../' : '../../'
const searchCralwer = async (url, mainWindow) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      ignoreHTTPSErrors: true,
      timeout: 150000,
      headless: false,
      executablePath: process.env.NODE_ENV === 'development' ? null : './chromium/chrome.exe'
    })
    const page = await browser.newPage()
    await page.setCookie(
      {
        name: 'ipb_member_id',
        value: '1962713',
        domain: 'exhentai.org',
        path: '/'
      },
      {
        name: 'ipb_pass_hash',
        value: '0c1b295fad4c35e74f2ec993ab023dbc',
        domain: 'exhentai.org',
        path: '/'
      },
      {
        name: 'ipb_session_id',
        value: 'baa01a6c87f96ac436c343373005a35e',
        expires: Date.now() + 3600 * 1000,
        domain: 'exhentai.org',
        path: '/'
      }
    )
    await page.goto(url)
    const docName = await page.evaluate(() => {
      const mainTxt = document.querySelector('#gj').innerText
      const subTxt = document.querySelector('#gn').innerText
      return mainTxt || subTxt
    })
    fs.mkdirSync(path.join(process.argv[0], `${keepUri}${docName}`))
    const pageTotal = await page.evaluate(() => {
      return document.querySelectorAll('.ptt tr td').length - 2
    })
    let imgCurrentCount = 1

    for (let i = 0; i < pageTotal; i++) {
      if (i) await page.goto(`${url}?p=${i}`)
      const urls = await page.evaluate(() => {
        const els = document.querySelectorAll('#gdt .gdtm a')
        const urlArr = Array.prototype.slice.call(els).map(v => v.href)
        return urlArr
      })
      for (let index = 0; index < urls.length; index++) {
        await page.goto(urls[index])
        const url = await page.$eval('#img', i => i.src)
        request(url).pipe(fs.createWriteStream(path.join(process.argv[0], `${keepUri}${docName}`, `${imgCurrentCount}.jpg`)))
        imgCurrentCount++
      }
    }
    browser.close()
    mainWindow.webContents.send('getPicsFinish', '下载完成')
  } catch (err) {
    mainWindow.webContents.send('getPicsFinish', `err: ${err}`)
  }
}
export default searchCralwer
