<script setup lang="ts">
import Editor from './components/editor/Editor.vue'
</script>

<template>
  <div class="min-h-screen max-w-4xl mx-auto">
    <div class="py-8 px-4">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-light">
          Notion Like Editor
        </h1>
        <ThemeToggler />
      </div>

      <Editor />
    </div>
  </div>
</template>
