<script lang="ts">
import { saveUser } from '../services/UserService.js'
import { useRouter } from 'vue-router'
import { ref, watch, computed } from 'vue'
import GLogin from '@/components/GoogleLogin.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
export default {
  components: {
    GLogin,
    LoaderComponent
  },
  setup() {
    const password = ref('')
    const confirmedPassword = ref('')
    const confirmPasswordErrorMessage = ref('')
    const validationMessage = ref('')
    const showPassword = ref(false)
    const firstName = ref('')
    const firstNameFill = ref(false)
    const surname = ref('')
    const surnameFill = ref(false)
    const email = ref('')
    const emailFill = ref(false)
    const emailMessage = ref('')
    const passwordFill = ref(false)
    const confirmedPasswordFill = ref(false)
    const exceptionMessage = ref('')

    const passwordFieldType = computed(() => (showPassword.value ? 'text' : 'password'))
    const canCreateAccount = computed(
      () =>
        firstNameFill.value &&
        surnameFill.value &&
        emailFill.value &&
        passwordFill.value &&
        confirmedPasswordFill.value
    )

    const validateConfirmPassword = () => {
      if (password.value !== confirmedPassword.value) {
        confirmPasswordErrorMessage.value = 'Por favor, digite novamente.'
        confirmedPasswordFill.value = false
        return false
      }
      confirmPasswordErrorMessage.value = ''
      confirmedPasswordFill.value = true
      return true
    }

    const validatePassword = () => {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()\-_=+{}[\]|;:'",.<>/?`~]{8,}$/
      if (password.value != '' && !passwordRegex.test(password.value)) {
        validationMessage.value =
          'A senha deve conter ao menos 8 caracteres compostos por uma letra maiúscula, uma letra minúscula e um número.'
        passwordFill.value = false
        return false
      }

      if (password.value != '') {
        passwordFill.value = true
      }

      validationMessage.value = ''
      return true
    }

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    watch(
      () => firstName.value,
      () => {
        if (firstName.value != '') {
          firstNameFill.value = firstName.value != ''
        }
      }
    )

    watch(
      () => surname.value,
      () => {
        if (surname.value != '') {
          surnameFill.value = surname.value != ''
        }
      }
    )

    watch(
      () => email.value,
      () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.value)) {
          emailMessage.value = 'Por favor, insira um email válido.'
          return
        }

        emailMessage.value = ''
        emailFill.value = true
      }
    )

    const router = useRouter()
    const isLoading = ref(false)

    const createAccount = async () => {
      exceptionMessage.value = ''
      isLoading.value = true

      try {
        const userData = {
          name: firstName.value,
          surName: surname.value,
          email: email.value,
          password: password.value
        }

        const saveResponse = await saveUser(userData)

        if (saveResponse.status === 201) {
          const sessionToken = saveResponse.data.token
          localStorage.setItem('sessionToken', sessionToken)
          router.push('/')
        }
      } catch (err: any) {
        if (err.response.data.error) {
          exceptionMessage.value = err.response.data.error
        } else {
          exceptionMessage.value = err
        }
      } finally {
        isLoading.value = false
      }
    }

    function fillFormFieldsFromGoogle(credentials: any) {
      const fullName = credentials.name
      const spaceIndex = fullName.indexOf(' ')

      firstName.value = fullName.substring(0, spaceIndex)
      surname.value = fullName.substring(spaceIndex + 1)
      email.value = credentials.email
    }

    const handleGoogleLogin = (credentials: any) => {
      fillFormFieldsFromGoogle(credentials)
    }

    return {
      firstName,
      firstNameFill,
      surname,
      surnameFill,
      email,
      emailFill,
      emailMessage,
      password,
      passwordFill,
      confirmedPassword,
      confirmedPasswordFill,
      showPassword,
      validationMessage,
      confirmPasswordErrorMessage,
      validateConfirmPassword,
      validatePassword,
      passwordFieldType,
      togglePasswordVisibility,
      canCreateAccount,
      createAccount,
      exceptionMessage,
      handleGoogleLogin,
      isLoading
    }
  }
}
</script>

<template>
  <div class="create-account-container">
    <div class="create-account-area">
      <h2>Criar Conta</h2>
      <form @submit.prevent="createAccount">
        <div class="glogin-area">
          <GLogin @credentials-success="handleGoogleLogin" />
        </div>
        <div class="or-line">
          <div class="or-line-inner"></div>
          <div class="or-text">OU</div>
          <div class="or-line-inner"></div>
        </div>
        <div class="form-group">
          <label for="firstName">Primeiro nome</label>
          <input
            type="text"
            id="firstName"
            v-model="firstName"
            tabindex="1"
            :disabled="isLoading"
          />
        </div>
        <div class="form-group">
          <label for="surname">Sobrenome</label>
          <input
            type="text"
            id="surname"
            v-model="surname"
            :disabled="!firstNameFill || isLoading"
            tabindex="2"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            :disabled="!surnameFill || isLoading"
            tabindex="3"
          />
          <p v-if="emailMessage" class="error-message">{{ emailMessage }}</p>
        </div>
        <div class="form-group">
          <div class="input-container">
            <label for="password">Senha</label>
            <input
              class="password-input"
              id="password"
              v-model="password"
              @input="validatePassword"
              :type="passwordFieldType"
              :disabled="!emailFill || isLoading"
              tabindex="3"
            />
            <button
              @click="togglePasswordVisibility"
              :class="
                showPassword
                  ? 'password-toggle-btn hide-password'
                  : 'password-toggle-btn show-password'
              "
              type="button"
            ></button>
            <p v-if="validationMessage" class="error-message">{{ validationMessage }}</p>
          </div>
        </div>
        <div class="form-group">
          <label for="password">Confirme a senha</label>
          <input
            type="password"
            id="confirmePassword"
            v-model="confirmedPassword"
            @input="validateConfirmPassword"
            :disabled="!passwordFill || isLoading"
            tabindex="4"
          />
          <p v-if="confirmPasswordErrorMessage" class="error-message">
            {{ confirmPasswordErrorMessage }}
          </p>
        </div>
        <button
          class="create-account-button"
          :disabled="!canCreateAccount"
          tabindex="5"
          v-if="!isLoading"
        >
          Criar Conta
        </button>
        <LoaderComponent v-else />
        <p v-if="exceptionMessage" class="error-message">{{ exceptionMessage }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.create-account-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.create-account-area {
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

input:disabled {
  background-color: #ccc;
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

.create-account-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  width: 100%;
  transition: background-image 0.3s ease, transform 0.3s ease;
}

.create-account-button:disabled {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #ccc;
  color: #fff;
  width: 100%;
  cursor: default;
}

.create-account-button:not(:disabled):hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  text-align: left;
  position: relative;
  transition: all 0.3s ease;
}

.input-container {
  position: relative;
}

.password-toggle-btn {
  position: absolute;
  display: grid;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  cursor: pointer;
  height: 1.25rem;
  width: 1.5rem;
  right: 0.5rem;
  top: 1.8rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.show-password {
  background-image: url('@/components/img/showPassword.png');
  background-repeat: no-repeat;
  background-position: center;
}

.hide-password {
  background-image: url('@/components/img/hidePassword.png');
  background-repeat: no-repeat;
  background-position: center;
}

.password-input-enabled:hover + .password-toggle-btn,
.password-toggle-btn:hover {
  opacity: 1;
}

.glogin-area {
  margin-top: 1rem;
  margin-bottom: 1rem;
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
</style>
