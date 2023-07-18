<script lang="ts">
import GLogin from './GoogleLogin.vue'
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'

export default {
  components: {
    GLogin
  }
}
</script>

<template>
  <header>
    <div class="header-container">
      <div class="logo">
        <img src="./img/logo.png" alt="Logo" />
      </div>
      <nav class="header-nav">
        <ul>
          <li><a href="#" class="header-hover">Meus Presentes</a></li>
          <li>
            <div class="signin">
              <a href="#" class="header-hover">Entrar</a>
            </div>
          </li>
          <li>
            <RouterLink class="create-account" to="/login">Criar conta</RouterLink>
          </li>
          <li>
            <GLogin />
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
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

.signin {
  font-weight: bold;
}

.create-account {
  display: flex;
  align-items: center;
  height: 1em;
  padding: 0.8em;
  margin: 0;
  background-color: white;
  border-radius: 0.8em;
  font-weight: 500;
  color: #000;
  border: none;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease 0s;
  cursor: pointer;
}

.create-account:hover {
  box-shadow: 0px 10px 18px rgba(0, 0, 0, 0.4);
  transform: translateY(-0.2em);
}
</style>
