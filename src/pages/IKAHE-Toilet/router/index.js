import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/index.vue'
import DeviceDetail from '@/views/deviceDetail.vue'
import NewScene from '@/bizComponents/Light/Scene/NewScene.vue'
import NewMusciScene from '@/bizComponents/Light/Music-Scene/NewScene.vue'
import Attach from '../views/attach'
import SeatHeating from '../views/seatHeating'
import Filter from '../views/filter'

Vue.use(VueRouter)

const routes = [
  {
    path: '/filter',
    name: 'Filter',
    component: Filter
  },
  {
    path: '/seatHeating',
    name: 'SeatHeating',
    component: SeatHeating
  },
  {
    path: '/attach',
    name: 'Attach',
    component: Attach
  },
  {
    path: '/device-detail',
    name: 'DeviceDetail',
    component: DeviceDetail
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  { path: '/NewScene', name: 'NewScene', component: NewScene },
  { path: '/NewMusciScene', name: 'NewMusciScene', component: NewMusciScene }
]

const router = new VueRouter({
  routes
})

export default router
