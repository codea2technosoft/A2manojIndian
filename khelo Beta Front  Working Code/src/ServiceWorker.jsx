export default function ServiceWorker() {
  let swUrl = `${process.env.PUBLIC_URL}/sw.js`
  navigator.serviceWorker.register(swUrl)
  .then((response)=>{
      console.log("response done:-",response)
  })
}
