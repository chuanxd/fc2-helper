const got = require('got')
const cookie = require('cookie')
const cheerio = require('cheerio')
const url = require('./url')
const conf = require('./config.json')
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36'
const VIDEO_NUM_PER_PAGE = 8

got(url.videoList, {
  headers: {
    'user-agent': USER_AGENT,
    cookie: cookie.serialize('PHPSESSID', conf.fc2Token)
  }
}).then((res) => {
  const $ = cheerio.load(res.body)
  const maxPages = Math.ceil($('#content_ad_head_wide .pager strong').eq(0).text() / VIDEO_NUM_PER_PAGE)
  fetchAllVideo(maxPages)
})

async function fetchAllVideo (maxPages) {
  for(let index = maxPages;index >= 1 ;index--) {
    console.log(`Now on Page ${index}`)
    got(url.videoPageList(index), {
      headers: {
        'user-agent': USER_AGENT,
        cookie: cookie.serialize('PHPSESSID', conf.fc2Token)
      }
    }).then((res) => {
      const $ = cheerio.load(res.body)
      const $item = $('#content_ad_head_wide .video_list_comment')

      $('#content_ad_head_wide .video_list_comment a').each((index, el) => {
       const views = $('#content_ad_head_wide .video_list_comment')
                       .eq(index)
                       .children('ul')
                       .children()[0]
                       .children[0]
                       .data
                       .split(':')
                       .pop()

        if (views === '0') {
          const videoName = $(el).text()
          const videoUrl = $(el).attr('href')
          console.log(`${videoName}\n${videoUrl}`)
        }
      })
    })
    await sleep(8000)
  }
  console.log('Mission completed')
}

async function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}

