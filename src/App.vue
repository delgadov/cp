<script lang="ts">
import MainImage from '@/components/MainImage.vue'
import { onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useTokenStore } from '@/store'
import { pingDatabase } from '@/services/UserService.js'

export default {
  components: {
    MainImage
  },
  setup() {
    const store = useTokenStore()
    const router = useRouter()
    const isLoggedIn = ref(false)

    onMounted(() => {
      const sessionToken = localStorage.getItem('sessionToken')
      store.setLoggedIn(!!sessionToken)
      isLoggedIn.value = !!sessionToken
    })

    onMounted(() => {
      setInterval(pingDb, 15 * 1000)
    })

    const logout = () => {
      localStorage.removeItem('sessionToken')
      localStorage.removeItem('email')
      store.setLoggedIn(false)
      isLoggedIn.value = false
      router.push('/')
    }

    const pingDb = () => {
      pingDatabase()
        .then((response: any) => {
          console.log(response)
        })
        .catch((err: any) => {
          console.log(err)
        })
    }

    return {
      store,
      logout,
      isLoggedIn
    }
  }
}
</script>

<template>
  <RouterLink to="/" style="text-decoration: none; color: inherit">
    <MainImage coupleName="Vinicius e Larissa" date="30.07" />
  </RouterLink>
  <header>
    <div class="header-container">
      <div class="logo">
        <RouterLink to="/">
          <img src="./components/img/logo.png" alt="Logo" />
        </RouterLink>
      </div>
      <nav class="header-nav">
        <ul>
          <li>
            <RouterLink class="header-hover" to="/myGift">Meus Presentes</RouterLink>
          </li>
          <li v-if="!store.isLoggedIn">
            <RouterLink class="login" to="/login">Entrar</RouterLink>
          </li>
          <li v-if="store.isLoggedIn">
            <a class="login" @click="logout">Sair</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
  <footer>
    <div class="footer-container">
      <p>&copy; 2023 Comemoração Perfeita. All rights reserved.</p>
    </div>
  </footer>
</template>

<style>
header {
  background-color: rgb(203, 229, 255);
  text-align: center;
  font-size: 1.6rem;
  width: 100%;
  box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
}

.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo img {
  height: 2em;
}

.header-nav ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}

.header-nav li {
  margin-left: 20px;
}

.header-nav a {
  text-decoration: none;
  color: #333;
  font-size: 14px;
  transition: all 0.2s ease 0s;
}

.header-hover:hover {
  color: #fff;
}

.login {
  display: flex;
  align-items: center;
  height: 1em;
  padding: 0.8em;
  margin: 0;
  background-color: white;
  width: 3rem;
  border-radius: 0.8em;
  font-weight: 500;
  color: #000;
  border: none;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease 0s;
  cursor: pointer;
  text-align: center;
  justify-content: center;
}

.login:hover {
  box-shadow: 0px 10px 18px rgba(0, 0, 0, 0.4);
  transform: translateY(-0.2em);
}

footer {
  background-color: rgb(203, 229, 255);
  padding: 1em;
  text-align: center;
  font-size: 0.8rem;
  color: #333;
  font-family: 'Helvetica Neue', sans-serif;
  margin-top: auto;
}

.footer-container {
  max-width: calc(98rem);
  margin: 0 auto;
}
</style>
