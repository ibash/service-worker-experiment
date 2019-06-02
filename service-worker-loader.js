// creates a file in the filesystem using the html5 file api
function createFile(name, type, content) {
  let file;
  return new Promise(function (resolve, reject) {
    window.webkitRequestFileSystem(window.PERSISTENT, 5*1024*1024, resolve, reject)
  }).then(function(fs) {
    // TODO(ibash) might need to delete the file before writing new contents,
    // otherwise it seems like it's possible for the old contents and new
    // contents to get mixed.
    return new Promise(function(resolve, reject) {
      fs.root.getFile(name, {create: true}, resolve, reject)
    })
  }).then(function(_file) {
    file = _file
    return new Promise(function(resolve, reject) {
      file.createWriter(resolve, reject)
    })
  }).then(function(fileWriter) {
    return new Promise(function(resolve, reject) {
      fileWriter.onwriteend = resolve
      fileWriter.onerror = reject
      var blob = new Blob([content], {type: type})
      fileWriter.write(blob)
    })
  }).then(function()  {
    return file
  })
}

var serviceWorkerJs = `
  self.addEventListener('install', function(event) {
    console.log('got install')
    self.skipWaiting()
  })
                                                     
  self.addEventListener('activate', function() {
    console.log('activate')
    self.clients.claim()
  })
                                                     
  self.addEventListener('fetch', function(event) {
    console.log('got fetch')
    return fetch(event.request)
  })
`

createFile('script.js', 'text/javascript', serviceWorkerJs).then(function(file) {
  navigator.serviceWorker.register(file.toURL(), {scope: '/'})
})
