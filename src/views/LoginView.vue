<script lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import GLogin from '@/components/GoogleLogin.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { authenticateUser, authenticateGoogle } from '@/services/AuthenticateService.js'
import { ref } from 'vue'
import { useTokenStore } from '@/store'
export default {
  components: {
    GLogin,
    LoaderComponent
  },
  setup() {
    const store = useTokenStore()
    const isLoading = ref(false)
    const failLoginMessage = ref('')
    const disableFields = ref(false)
    const emailField = ref('')
    const passwordField = ref('')
    const sessionToken = ref('')
    const router = useRouter()

    function authenticateLogin() {
      isLoading.value = true
      disableFields.value = true
      failLoginMessage.value = ''

      const auth = {
        email: emailField.value,
        password: passwordField.value
      }

      if (auth.email && auth.password) {
        authenticateUser(auth)
          .then((response: any) => {
            sessionToken.value = response.data.token
            localStorage.setItem('sessionToken', sessionToken.value)
            localStorage.setItem('email', emailField.value)
            store.setLoggedIn(true)
            router.push('/')
          })
          .catch((err: any) => {
            if (err.response && err.response.data && err.response.data.error) {
              failLoginMessage.value = err.response.data.error
            } else if (err.message) {
              failLoginMessage.value = err.message
            } else {
              failLoginMessage.value = 'An error occurred'
            }
          })
          .finally(() => {
            isLoading.value = false
            disableFields.value = false
          })
      }
    }

    function authenticateGoogleLogin(credentials: any) {
      isLoading.value = true
      disableFields.value = true

      failLoginMessage.value = ''

      const auth = {
        accessToken: credentials.accessToken
      }

      authenticateGoogle(auth)
        .then((response: any) => {
          sessionToken.value = response.data.sessionToken
          localStorage.setItem('sessionToken', sessionToken.value)
          localStorage.setItem('email', response.data.email)
          store.setLoggedIn(true)
          router.push('/')
        })
        .catch((err: any) => {
          if (err.response && err.response.data && err.response.data.error) {
            failLoginMessage.value = err.response.data.error
          } else if (err.message) {
            failLoginMessage.value = err.message
          } else {
            failLoginMessage.value = 'An error occurred'
          }
        })
        .finally(() => {
          isLoading.value = false
          disableFields.value = false
        })
    }

    const handleGoogleLogin = (credentials: any) => {
      authenticateGoogleLogin(credentials)
    }

    return {
      passwordField,
      emailField,
      failLoginMessage,
      disableFields,
      isLoading,
      authenticateLogin,
      handleGoogleLogin
    }
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-area">
      <h2>Entrar</h2>
      <form class="login-form" @submit.prevent="authenticateLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" :disabled="disableFields" v-model="emailField" />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input type="password" id="password" :disabled="disableFields" v-model="passwordField" />
        </div>
        <button class="login-button" v-if="!isLoading">Entrar</button>
        <LoaderComponent v-else />
        <p v-if="failLoginMessage" class="error-message">{{ failLoginMessage }}</p>
        <div class="or-line">
          <div class="or-line-inner"></div>
          <div class="or-text">OU</div>
          <div class="or-line-inner"></div>
        </div>
        <div class="glogin-area">
          <GLogin
            @credentials-success="handleGoogleLogin"
            :class="{ 'disable-element': disableFields }"
          />
        </div>
      </form>

      <p class="create-account-text">
        Ainda nao tem conta?
        <router-link to="/create-account" :class="{ 'disable-element': disableFields }"
          >Criar conta</router-link
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-area {
  width: 18rem;
  text-align: center;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
  color: #888;
}

label {
  text-align: left;
  color: #888;
}

.login-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.login-area:disabled {
  background-color: red;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.2rem;
}

input {
  width: 94%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}

.login-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #0056b3;
}

.glogin-area {
  margin-top: 1rem;
}

.or-line {
  display: flex;
  align-items: center;
  margin: 1rem 0;
}

.or-line-inner {
  flex-grow: 1;
  height: 1px;
  background-color: #ccc;
}

.or-text {
  padding: 0 0.5rem;
  font-weight: bold;
  color: #888;
}

.create-account-text {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #888;
}

.create-account-text a {
  color: #007bff;
  text-decoration: none;
}

.create-account-text a:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

input:disabled {
  background-color: #ccc;
}

.disable-element {
  pointer-events: none;
  color: #ccc;
  text-decoration: none;
  cursor: not-allowed;
}
</style>
