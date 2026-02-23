<script setup lang="ts">
import { useGameStore } from '../stores/game';
import { storeToRefs } from 'pinia';

const store = useGameStore();
const { inventory } = storeToRefs(store);
</script>

<template>
  <div class="fixed right-0 top-0 h-screen w-20 bg-[#F4F1EA] shadow-xl border-l border-[#D8CFC4] flex flex-col items-center py-4 z-40">
    <h3 class="text-xs font-bold text-[#6B705C] mb-4 uppercase tracking-widest">Bag</h3>
    
    <div class="space-y-4 w-full px-2">
      <div 
        v-for="item in inventory" 
        :key="item.id"
        class="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-xl cursor-help hover:scale-110 transition-transform relative group"
      >
        <!-- Placeholder icons based on item name -->
        <span v-if="item.item_name.includes('Coffee')">🧾</span>
        <span v-else-if="item.item_name.includes('Napkin')">📄</span>
        <span v-else-if="item.item_name.includes('Letter')">✉️</span>
        <span v-else-if="item.item_name.includes('Pinecone')">🌲</span>
        <span v-else-if="item.item_name.includes('Note')">📝</span>
        <span v-else-if="item.item_name.includes('Ring')">💍</span>
        <span v-else>📦</span>

        <!-- Tooltip -->
        <div class="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {{ item.item_name }}
        </div>
      </div>
      
      <!-- Empty slots -->
      <div v-for="i in Math.max(0, 5 - inventory.length)" :key="i" class="w-12 h-12 border-2 border-dashed border-[#D8CFC4] rounded-lg"></div>
    </div>
  </div>
</template>
