<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import { ref } from 'vue';

const router = useRouter();
const store = useGameStore();
const isLoading = ref(false);
const error = ref('');

const start = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    await store.fetchRooms();
    await store.fetchProgress();
    router.push('/game');
  } catch (err) {
    console.error('Failed to start game:', err);
    error.value = 'Failed to load game. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="h-screen w-full bg-[#F4F1EA] flex flex-col items-center justify-center relative overflow-hidden">
    <!-- Background particles effect could go here -->
    
    <div 
      class="z-10 text-center max-w-2xl px-6"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 1000 } }"
    >
      <h1 class="text-6xl font-serif text-[#6B705C] mb-4 tracking-tighter">Memories</h1>
      <h2 class="text-2xl font-light text-[#CB997E] mb-8 italic">An Escape Room Story</h2>
      
      <p class="text-[#6B705C] mb-12 leading-relaxed">
        Explore the rooms of a shared past. Uncover hidden objects, piece together the story, 
        and find the way to a new beginning.
      </p>

      <button 
        @click="start"
        :disabled="isLoading"
        class="bg-[#A3B18A] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#6B705C] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? 'Loading...' : 'Begin Journey' }}
      </button>

      <p v-if="error" class="text-red-500 mt-4 text-sm font-medium animate-pulse">
        {{ error }}
      </p>
    </div>

    <!-- Decorative elements -->
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-[#CB997E]/20 rounded-full blur-3xl"></div>
    <div class="absolute top-0 right-0 w-96 h-96 bg-[#A3B18A]/20 rounded-full blur-3xl"></div>
  </div>
</template>
