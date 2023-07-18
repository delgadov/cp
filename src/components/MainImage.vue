<script setup lang="ts">
defineProps<{
  coupleName: string
  date: string
}>()
</script>

<template>
  <div class="couple-image">
    <div class="image-title">
      <li class="couple-name">{{ coupleName }}</li>
      <li class="list-date">{{ date }}</li>
    </div>
  </div>
</template>

<style scoped>
.couple-image {
  position: relative;
  width: 100%;
  height: 40em;
  overflow: hidden;
  text-decoration: none;
}

.couple-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('./img/casal.jpeg');
  background-size: cover;
  background-position: center;
  filter: brightness(50%);
}

.image-title {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgb(203, 229, 255);
  font-size: 1.3em;
  text-align: center;
  list-style-type: none;
  font-family: 'Courier New', Courier, monospace;
}

.list-date {
  padding-top: 1em;
  font-size: 1.1em;
}
</style>
