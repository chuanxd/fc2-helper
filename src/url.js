const url = {
  login: 'fc2.com/tw/login.php',
  videoList: 'video.fc2.com/tw/list_mycont',
  videoPageList: function(pages = 1) {
    return `video.fc2.com/tw/list.php?page=${pages}&m=mycont`
  }
}

module.exports = url
