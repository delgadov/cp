<script lang="ts">
import { saveProduct } from '@/services/ProductService.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { ref } from 'vue'
export default {
  components: {
    LoaderComponent
  },
  data() {
    const isLoading = ref(false)
    const failMessage = ref('')
    const disableFields = ref(false)

    const product = {
      title: '',
      description: '',
      reference: '',
      image: ''
    }

    const handleImageUpload = (event: any) => {
      const file = event.target.files[0]
      product.image = file
    }

    const addProduct = async () => {
      isLoading.value = true
      failMessage.value = ''
      disableFields.value = true

      const formData = new FormData()
      formData.append('title', product.title)
      formData.append('description', product.description)
      formData.append('reference', product.reference)
      formData.append('image', product.image)

      saveProduct(formData)
        .then((response) => {
          console.log(response)
        })
        .catch((err: any) => {
          if (err.response && err.response.data && err.response.data.error) {
            failMessage.value = err.response.data.error
          } else if (err.message) {
            failMessage.value = err.message
          } else {
            failMessage.value = 'An error occurred'
          }
        })
        .finally(() => {
          isLoading.value = false
          disableFields.value = false
        })
    }

    return {
      product,
      handleImageUpload,
      addProduct,
      isLoading,
      failMessage,
      LoaderComponent,
      disableFields
    }
  }
}
</script>

<template>
  <main>
    <div class="product-form">
      <h2>Add a New Product</h2>
      <form @submit.prevent="addProduct">
        <div class="form-group">
          <label for="title">Title</label>
          <input
            type="text"
            id="title"
            v-model="product.title"
            :disabled="disableFields"
            required
          />
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="product.description"
            :disabled="disableFields"
            required
          ></textarea>
        </div>
        <div class="form-group">
          <label for="reference">Reference Link</label>
          <input
            type="text"
            id="reference"
            v-model="product.reference"
            :disabled="disableFields"
            required
          />
        </div>
        <div class="form-group">
          <label for="image">Image</label>
          <input
            type="file"
            id="image"
            @change="handleImageUpload"
            :disabled="disableFields"
            accept="image/*"
            required
          />
        </div>
        <button type="submit" v-if="!isLoading">Add Product</button>
        <LoaderComponent v-else />
        <p class="error-message">{{ failMessage }}</p>
      </form>
    </div>
  </main>
</template>

<style scoped>
.product-form {
  max-width: 400px;
  margin: 0 auto;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
}

input[type='text'],
textarea {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  text-align: left;
  position: relative;
  transition: all 0.3s ease;
}

input:disabled {
  background-color: #ccc;
}
</style>
