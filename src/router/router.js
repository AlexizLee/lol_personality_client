import { createWebHistory, createRouter } from "vue-router";
import HomeVue from '../views/Home.vue';
import ResultVue from '../views/Results.vue'

const routes = [
  {
    path: "/",
    component: HomeVue,
  },
  {
    path: "/results",
    component: ResultVue,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 