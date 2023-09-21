import { createApp } from 'vue'
import App from './App.vue'
// import GAuth from 'vue3-google-oauth2'
const app = createApp(App)

// const gAuthOptions = { clientId: 'XYZ.apps.googleusercontent.com', scope: 'email', prompt: 'consent', fetch_basic_profile: false }
// app.use(GAuth, gAuthOptions)

// Mount the app to the DOM
app.mount('#app');

