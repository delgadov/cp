<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { moveProductToUser } from '@/services/ProductService.js'
import { isLoggedIn } from '@/services/AuthenticateService.js'
import LoaderComponent from './LoaderComponent.vue'

export default {
  props: {
    product: Object
  },
  components: {
    LoaderComponent
  },
  data(props) {
    const title = ref(this.product?.title ?? 'Default Title')
    const description = ref(this.product?.description ?? 'Default Description')
    const id = ref(this.product?.id ?? '')
    const isLoading = ref(false)
    const router = useRouter()

    const closeModal = () => {
      this.$emit('close')
    }

    const moveProduct = async () => {
      isLoading.value = true
      const email = localStorage.getItem('email')
      const sessionToken = localStorage.getItem('sessionToken')

      if (email) {
        const loggedInRequest = {
          email,
          sessionToken: sessionToken || ''
        }

        isLoggedIn(loggedInRequest)
          .then((response: any) => {
            moveProductToUser(id.value, loggedInRequest.email)
              .then((response: any) => {
                isLoading.value = false
                this.$emit('completed', id.value)
              })
              .catch((err: any) => {
                console.log(err)
                isLoading.value = false
              })
          })
          .catch((err: any) => {
            router.push('/login')
          })
      } else {
        router.push('/login')
      }
    }

    return {
      title,
      closeModal,
      moveProduct,
      LoaderComponent,
      isLoading
    }
  }
}
</script>

<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-header">
            <h3>Presentear</h3>
            <button class="modal-default-close-button style-button" @click="closeModal">
              &times;
            </button>
          </div>
        </div>
        <div class="modal-body">
          <h4>Informações relevantes</h4>
          <ul class="modal-data">
            <li><strong>CEP: </strong>13034-140</li>
            <li><strong>Rua: </strong>Osmando Mascaro</li>
            <li><strong>Número: </strong>168</li>
            <li><strong>Complemento: </strong>Apartamento 52A</li>
            <li><strong>Bairro: </strong>Vila Aurocan</li>
            <li><strong>Cidade: </strong>Campinas</li>
          </ul>
          <br />
          <p>
            Caso achar melhor, pode enviar para a chave pix de
            <strong>Vinicius Martins Delgado</strong>
          </p>
          <ul class="modal-data">
            <li><strong>Chave (CPF): </strong>476.667.878-80</li>
            <li><strong>Banco: </strong>Itau</li>
          </ul>
          <br />
          <p>
            Você tem certeza que deseja presentea-los com <strong>{{ title }}</strong
            >?
          </p>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button
              v-if="!isLoading"
              class="modal-default-button style-button"
              @click="moveProduct"
            >
              Claro!
            </button>
            <LoaderComponent v-else />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.33);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-data {
  list-style-type: none;
  padding-left: 0;
}

.modal-data li {
  padding-left: 1rem;
}

.modal-container {
  min-width: 14rem;
  max-width: 30rem;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

@media (max-width: 35em) {
  .modal-container {
    margin: 1rem;
  }
}

@media (min-width: 30rem) {
  .modal-container {
    margin: 0 auto;
  }
}

.modal-header {
  position: relative;
}

.modal-header h3 {
  margin-top: 0;
  color: #ff4081;
}

.modal-body {
  margin: 20px 0;
  font-size: 0.9rem;
}

.modal-default-close-button {
  position: absolute;
  top: -0.25rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  background-color: transparent;
  color: #ff4081;
  border: none;
  cursor: pointer;
  outline: none;
}

.modal-default-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  border-radius: 1rem;
  padding: 1rem 3rem 1rem 3rem;
  width: 4rem;
  border: 0.5rem;
}

.style-button {
  background-color: white;
  color: #ff4081;
  border: 1px solid #ff4081;
  transition: all 0.3s ease-in-out;
}

.style-button:hover {
  background-color: #ff4081;
  transform: scale(1.1);
  color: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
