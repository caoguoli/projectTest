import timer from '../index'
import timingPage from '../pages/Timing'
import Choose from '../pages/Choose'
import PowerSwitch from '../pages/PowerSwitch'
const routes = [
  {
    path: '/timer',
    name: 'timer',
    component: timer
  },
  {
    path: '/timingPage',
    name: 'timingPage',
    component: timingPage
  },
  {
    path: '/choose',
    name: 'Choose',
    component: Choose
  },
  {
    path: '/choosePowerSwitch',
    name: 'ChoosePowerSwitch',
    component: PowerSwitch
  }
  // {
  //   path: '/TimerNoticePage',
  //   name: 'TimerNoticePage',
  //   component: TimerNoticePage,
  // },
  // {
  //   path: '/TimerTaskPage',
  //   name: 'TimerTaskPage',
  //   component: TimerTaskPage,
  // },
]

export default routes
