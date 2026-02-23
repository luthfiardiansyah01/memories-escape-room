import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import './style.css';
import App from './App.vue';
import { MotionPlugin } from '@vueuse/motion';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(MotionPlugin);

app.mount('#app');
