<script lang="ts">
import { decodeCredential } from 'vue3-google-login'

export default {
  emits: ['credentials-success'],
  setup(_, { emit }) {
    const callback = (response: any) => {
      const userData: any = decodeCredential(response.credential)

      if (userData.name && userData.email) {
        const userName = userData.name
        const userEmail = userData.email
        const userToken = response.credential

        emit('credentials-success', {
          name: userName,
          email: userEmail,
          accessToken: userToken
        })
      }
    }

    return {
      callback
    }
  }
}
</script>

<template>
  <GoogleLogin :callback="callback" />
</template>

<style scoped></style>
