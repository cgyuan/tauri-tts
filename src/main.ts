import { createApp } from "vue";
import "./styles.css";
import 'uno.css';
import App from "./App.vue";
import '@arco-design/web-vue/dist/arco.css';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import SvgIcon from './components/Icons/Icon.vue'


const app = createApp(App);
const pinia = createPinia();
pinia.use(createPersistedState());
app.use(pinia);
app.use(ArcoVue).use(ArcoVueIcon);
app.component('mo-icon', SvgIcon)
app.mount("#app");
