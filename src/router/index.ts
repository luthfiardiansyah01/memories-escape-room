import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import GamePage from '../pages/GamePage.vue';
import RewardPage from '../pages/RewardPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/game', component: GamePage },
  { path: '/reward', component: RewardPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
