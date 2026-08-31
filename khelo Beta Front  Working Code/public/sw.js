
let CACHE_NAME = 'codePwa';

var urlCache = [
        '/static/js/bundle.js',
        '/manifest.json',
        '/',
        '/home',
 
]


/// install service worker 
this.addEventListener('install',(event)=>{
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache)=>{
            return cache.addAll(urlCache)
        })
    )
})

// fetch cache data

