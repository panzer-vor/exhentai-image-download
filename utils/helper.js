exports.reset = async function(data) {
  data.map(v => {
    if({}.toString.call(v) === '[object Number]') {
      return 0
    }else if({}.toString.call(v) === '[object Object]' ){
      return {}
    }
  })
}

exports.setCookies = async function(page) {
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
    },
  )
}