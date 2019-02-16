import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Lyrics from './views/Lyrics.vue'
import Search from './views/Search.vue'
import LyricsAdd from './views/LyricsAdd.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/lyrics/new',
      name: 'lyrics-new',
      component: LyricsAdd
    },{
      path: '/lyrics/:sid(\\d+)',
      name: 'lyrics',
      component: Lyrics
    },
    {
      path: '/',
      name: '',
      component: Home
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
  ]
})