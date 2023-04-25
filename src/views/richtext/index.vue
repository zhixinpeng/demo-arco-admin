<template>
  <div> <Tinymce v-model="text" @change="handleChange"></Tinymce> </div>
</template>

<script setup lang="ts">
  import { Tinymce } from '@/components/Tinymce';
  import { ref } from 'vue';

  const text = ref('Hello world!');

  const handleChange = (value: string) => {
    console.log(value);
  };
</script>

<style scoped></style>
