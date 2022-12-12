import HomePage from "../../components/HomePage.vue"
import RaceImages from "../../components/RaceImages.vue"

export default [
  { path: "/", component: HomePage, name:'homepage' },
  { path: '/races/:raceid/:racealias', component: RaceImages, name:'racedetails'}
]


