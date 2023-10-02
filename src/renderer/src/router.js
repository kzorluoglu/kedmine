import { createRouter, createWebHistory } from 'vue-router';
import Setup from "./components/Setup.vue";
import Tickets from "./components/Tickets.vue";
const routes = [
  {
    path: '/',
    name: 'Tickets',
    component: Tickets,
    meta: { requiresSetup: true }
  },
  {
    path: '/setup',
    name: 'Setup',
    component: Setup,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isSetupComplete = localStorage.getItem('redmineURL') && localStorage.getItem('apiToken'); // and other checks if necessary

  if (to.matched.some(record => record.meta.requiresSetup) && !isSetupComplete) {
    next({ path: '/setup' }); // Redirect to setup page if setup is not complete
  } else {
    next(); // Otherwise continue
  }
});

export default router;
