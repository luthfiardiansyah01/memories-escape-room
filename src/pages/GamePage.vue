<script setup lang="ts">
import { useGameStore } from '../stores/game';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Inventory from '../components/Inventory.vue';
import { Howl, Howler } from 'howler';

const store = useGameStore();
const { currentRoom, items, stories, inventory, reward } = storeToRefs(store);
const router = useRouter();

const showStory = ref(true);
const currentStoryIndex = ref(0);
const isMuted = ref(false);

// Audio setup
const bgm = new Howl({
  src: ['https://assets.mixkit.co/music/preview/mixkit-piano-reflections-22.mp3'], // Placeholder
  loop: true,
  volume: 0.3,
  html5: true
});

const sfxClick = new Howl({
  src: ['https://assets.mixkit.co/sfx/preview/mixkit-retro-game-notification-212.mp3'], // Placeholder
  volume: 0.5
});

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  Howler.mute(isMuted.value);
};

onMounted(async () => {
  if (!store.sessionId) {
    router.push('/');
    return;
  }
  
  try {
    bgm.play();
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
  
  try {
    if (!currentRoom.value) {
      await store.fetchRooms();
      await store.fetchProgress();
    }
    
    if (currentRoom.value) {
      await store.loadRoom(currentRoom.value.id);
    }
  } catch (e) {
    console.error('Failed to load game data:', e);
    // Maybe show error UI
  }
});

watch(currentRoom, () => {
  showStory.value = true;
  currentStoryIndex.value = 0;
});

watch(reward, (newVal) => {
  if (newVal) {
    router.push('/reward');
  }
});

const nextStory = async () => {
  if (currentStoryIndex.value < stories.value.length - 1) {
    currentStoryIndex.value++;
  } else {
    showStory.value = false;
    
    // If there are no items in the room (e.g. final room), completing the story completes the room
    if (items.value.length === 0) {
      await store.completeRoom(currentRoom.value.id);
    }
  }
};

const handleItemClick = async (item: any) => {
  sfxClick.play();
  await store.collectItem(item);
  // Check if all required items collected to unlock next room?
  // Requirement: "Unlock next room when required items are found."
  // Currently simplified: Collecting ANY required item triggers completion check?
  // Actually, usually you collect ALL required items in a room.
  
  const requiredItems = items.value.filter((i: any) => i.is_required);
  const collectedRequired = requiredItems.filter((i: any) => 
    inventory.value.find((inv: any) => inv.id === i.id)
  );
  
  if (collectedRequired.length === requiredItems.length) {
    // All required items found!
    // Show success message or transition?
    setTimeout(async () => {
      await store.completeRoom(currentRoom.value.id);
    }, 1000);
  }
};

const isCollected = (itemId: string) => {
  return inventory.value.some((i: any) => i.id === itemId);
};
</script>

<template>
  <div class="h-screen w-full bg-[#F4F1EA] relative overflow-hidden flex">
    <!-- Mute Button -->
    <button 
      class="absolute top-4 left-4 z-50 bg-white/50 p-2 rounded-full shadow-md hover:bg-white transition-colors"
      @click="toggleMute"
    >
      {{ isMuted ? '🔇' : '🔊' }}
    </button>
    
    <!-- Main Game Area -->
    <div class="flex-1 relative h-full">
      <div v-if="currentRoom" class="w-full h-full relative">
        <!-- Room Background (Placeholder color based on index) -->
        <div 
          class="w-full h-full bg-cover bg-center transition-all duration-1000"
          :style="{ 
            backgroundColor: ['#D8CFC4', '#A3B18A', '#6B705C', '#CB997E', '#B5838D'][currentRoom.order_index - 1] || '#F4F1EA',
            backgroundImage: `url(${currentRoom.background_image})` 
          }"
        >
          <!-- Room Title (Subtle) -->
          <div class="absolute top-8 left-8 text-white/50 text-4xl font-serif font-bold pointer-events-none mix-blend-overlay">
            {{ currentRoom.title }}
          </div>
        </div>

        <!-- Items -->
        <div 
          v-for="item in items" 
          :key="item.id"
          v-show="!isCollected(item.id)"
          class="absolute w-16 h-16 bg-white/80 rounded-full shadow-lg cursor-pointer hover:scale-110 hover:bg-white transition-all flex items-center justify-center text-2xl animate-bounce"
          :style="{ left: item.pos_x + 'px', top: item.pos_y + 'px', animationDuration: '3s' }"
          @click="handleItemClick(item)"
          v-motion
          :initial="{ opacity: 0, scale: 0 }"
          :enter="{ opacity: 1, scale: 1, transition: { delay: 500 } }"
        >
           <!-- Icons -->
          <span v-if="item.item_name.includes('Coffee')">🧾</span>
          <span v-else-if="item.item_name.includes('Napkin')">📄</span>
          <span v-else-if="item.item_name.includes('Letter')">✉️</span>
          <span v-else-if="item.item_name.includes('Pinecone')">🌲</span>
          <span v-else-if="item.item_name.includes('Note')">📝</span>
          <span v-else-if="item.item_name.includes('Ring')">💍</span>
          <span v-else>✨</span>
        </div>

        <!-- Story Overlay -->
        <div 
          v-if="showStory && stories.length > 0" 
          class="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-8"
          @click="nextStory"
        >
          <div 
            class="max-w-3xl text-center text-white cursor-pointer"
            v-motion
            :key="currentStoryIndex"
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0 }"
          >
            <p class="text-3xl font-serif leading-relaxed italic">
              "{{ stories[currentStoryIndex].narrative_text }}"
            </p>
            <p class="mt-8 text-sm opacity-50 uppercase tracking-widest">Click to continue</p>
          </div>
        </div>
      </div>

      <div v-else class="flex items-center justify-center h-full">
        <div class="animate-spin text-4xl">⏳</div>
      </div>
    </div>

    <!-- Inventory Sidebar -->
    <Inventory />
  </div>
</template>
