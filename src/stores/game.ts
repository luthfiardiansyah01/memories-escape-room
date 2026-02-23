import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export const useGameStore = defineStore('game', () => {
  const sessionId = ref<string>(localStorage.getItem('memories_session') || '');
  const rooms = ref<any[]>([]);
  const currentRoom = ref<any>(null);
  const items = ref<any[]>([]); // Items in the current room
  const inventory = ref<any[]>([]); // Items collected
  const stories = ref<any[]>([]); // Stories for the current room
  const completedRooms = ref<string[]>([]);
  const reward = ref<any>(null);

  if (!sessionId.value) {
    sessionId.value = uuidv4();
    localStorage.setItem('memories_session', sessionId.value);
  }

  const fetchRooms = async () => {
    const res = await fetch('/api/rooms');
    const data = await res.json();
    if (data.success) {
      rooms.value = data.data;
    }
  };

  const fetchProgress = async () => {
    const res = await fetch(`/api/progress/${sessionId.value}`);
    const data = await res.json();
    if (data.success) {
      const progress = data.data;
      inventory.value = JSON.parse(progress.items_found || '[]');
      completedRooms.value = JSON.parse(progress.completed_rooms || '[]');
      
      // Determine current room
      if (progress.current_room) {
        currentRoom.value = rooms.value.find((r: any) => r.id === progress.current_room);
      } else if (rooms.value.length > 0) {
        // Start at first room if not set
        currentRoom.value = rooms.value[0];
      }
    }
  };

  const loadRoom = async (roomId: string) => {
    // Fetch room details if needed, or just set from rooms array
    const room = rooms.value.find((r: any) => r.id === roomId);
    if (room) {
      currentRoom.value = room;
      // Fetch items and stories
      const [itemsRes, storiesRes] = await Promise.all([
        fetch(`/api/rooms/${roomId}/items`),
        fetch(`/api/rooms/${roomId}/story`)
      ]);
      
      const itemsData = await itemsRes.json();
      const storiesData = await storiesRes.json();
      
      if (itemsData.success) items.value = itemsData.data;
      if (storiesData.success) stories.value = storiesData.data;
    }
  };

  const collectItem = async (item: any) => {
    if (!inventory.value.find((i: any) => i.id === item.id)) {
      inventory.value.push(item);
      await saveProgress();
    }
  };

  const completeRoom = async (roomId: string) => {
    if (!completedRooms.value.includes(roomId)) {
      completedRooms.value.push(roomId);
      
      // Unlock next room logic
      const currentIndex = rooms.value.findIndex((r: any) => r.id === roomId);
      if (currentIndex < rooms.value.length - 1) {
        const nextRoom = rooms.value[currentIndex + 1];
        currentRoom.value = nextRoom;
        // Save progress with new room
        await saveProgress();
        // Load next room data
        await loadRoom(nextRoom.id);
      } else {
        // Game Complete
        await saveProgress();
        await generateReward();
      }
    }
  };

  const saveProgress = async () => {
    await fetch('/api/progress/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId.value,
        current_room: currentRoom.value?.id,
        items_found: inventory.value,
        completed_rooms: completedRooms.value
      })
    });
  };

  const generateReward = async () => {
    const res = await fetch('/api/progress/reward/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId.value })
    });
    const data = await res.json();
    if (data.success) {
      reward.value = data.data;
    }
  };

  return {
    sessionId,
    rooms,
    currentRoom,
    items,
    inventory,
    stories,
    completedRooms,
    reward,
    fetchRooms,
    fetchProgress,
    loadRoom,
    collectItem,
    completeRoom,
    saveProgress
  };
});
