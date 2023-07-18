<script lang="ts">
// window.fbAsyncInit = function () {
//   FB.init({
//     appId: '228735343395227',
//     xfbml: true,
//     version: 'v17.0',
//     proxy: true
//   })
//   FB.AppEvents.logPageView()
// }
// ;(function (d, s, id) {
//   var js,
//     fjs = d.getElementsByTagName(s)[0]
//   if (d.getElementById(id)) {
//     return
//   }
//   js = d.createElement(s)
//   js.id = id
//   js.src = 'https://connect.facebook.net/en_US/sdk.js'
//   fjs.parentNode.insertBefore(js, fjs)
// })(document, 'script', 'facebook-jssdk')

export default {
  methods: {
    onLogin() {
      console.log('here')
    }
  }
}
</script>

<template>
  <div>
    <div
      class="fb-login-button"
      data-width=""
      data-size="large"
      data-button-type="continue_with"
      data-layout="default"
      data-auto-logout-link="false"
      data-use-continue-as="true"
      @login="onLogin"
    ></div>
  </div>
</template>
