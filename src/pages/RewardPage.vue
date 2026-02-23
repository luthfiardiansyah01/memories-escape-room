<script setup lang="ts">
import { useGameStore } from '../stores/game';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import QrcodeVue from 'qrcode.vue';

const store = useGameStore();
const { reward } = storeToRefs(store);
const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="h-screen w-full bg-[#F4F1EA] flex flex-col items-center justify-center relative overflow-hidden text-center px-4">
    <div 
      v-if="reward"
      class="bg-white p-12 rounded-3xl shadow-2xl max-w-lg w-full border-4 border-[#A3B18A] relative"
      v-motion
      :initial="{ scale: 0.8, opacity: 0 }"
      :enter="{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 100 } }"
    >
      <div class="absolute -top-6 -right-6 text-6xl rotate-12">🎁</div>
      
      <h1 class="text-3xl font-serif text-[#6B705C] mb-6">Congratulations!</h1>
      <p class="text-[#CB997E] mb-8 italic">You have unlocked all the memories.</p>
      
      <div class="bg-[#F4F1EA] p-6 rounded-xl border-2 border-dashed border-[#D8CFC4] mb-8 flex flex-col items-center">
        <p class="text-xs text-[#6B705C] uppercase tracking-widest mb-4">Your Reward Code</p>
        
        <div class="bg-white p-2 rounded-lg mb-4">
          <QrcodeVue :value="reward.reward_code" :size="150" level="H" />
        </div>
        
        <div class="text-3xl font-mono font-bold text-[#A3B18A] tracking-wider">{{ reward.reward_code }}</div>
      </div>
      
      <p class="text-sm text-[#6B705C] mb-8 leading-relaxed">
        Show this code at our wedding celebration to receive a special gift.
        <br>Thank you for being part of our story.
      </p>

      <button 
        @click="goHome"
        class="text-[#CB997E] hover:text-[#B5838D] font-medium transition-colors"
      >
        Return to Home
      </button>
    </div>

    <div v-else class="text-[#6B705C] animate-pulse">
      Loading reward...
    </div>

    <!-- Confetti effect placeholders -->
    <div class="absolute top-10 left-10 w-4 h-4 bg-[#B5838D] rounded-full animate-bounce"></div>
    <div class="absolute bottom-20 right-20 w-4 h-4 bg-[#A3B18A] rounded-full animate-bounce" style="animation-delay: 0.5s"></div>
  </div>
</template>
