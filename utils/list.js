exports.urlResults = async function (page) {
  const urlResult = await page.evaluate(() => {
    let items = []
    const nodes = document.querySelectorAll('.itg tr .itd .it5 a')
    if(nodes.length) {
      document.querySelectorAll('.itg tr .itd .it5 a').forEach(v => {
        items.push(v.getAttribute('href'))
      })
      return items
    }else {
      return false
    }
  })
  return urlResult
}