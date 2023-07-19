import "bootstrap/dist/css/bootstrap.css"
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';

const app = createApp(App)
app.use(PrimeVue, { unstyled: true });
app.component('InputText', InputText);

app.mount("#app");
import "bootstrap/dist/js/bootstrap.js"