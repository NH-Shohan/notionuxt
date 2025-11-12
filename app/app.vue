<script setup lang="ts">
import Editor from './components/editor/Editor.vue';
</script>

<template>
  <div class="min-h-screen relative">
    <div class="texture" />
    <div class="py-8 px-4 max-w-4xl mx-auto relative z-10">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-light">
          Nuxt Notion Editor
        </h1>
        <ThemeToggler />
      </div>

      <Editor />
    </div>
  </div>
</template>
