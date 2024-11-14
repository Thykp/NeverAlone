import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';
import './style.css'
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';
import { initializeApp } from "firebase/app";
import "primeflex/primeflex.css";
import axios from 'axios'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'

const base_url = import.meta.env.VITE_ENDPOINT ?? `http://localhost:${import.meta.env.VITE_PORT}`;

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
      950: '#0b3d91'
    }
  }
});
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

axios.defaults.baseURL = `${base_url}`;
axios.defaults.headers.post['Content-Type'] ='application/json';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

initializeApp(firebaseConfig);

const vuetify = createVuetify({ components, directives })

createApp(App)
    .use(ToastService)
    .use(router)
    .use(store)
    .use(PrimeVue, {
      theme: {
        preset: MyPreset
      }
    })
    .use(vuetify)
    .mount('#app')
