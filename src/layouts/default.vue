<template lang="pug">
  q-layout(view="hHh Lpr lFf")
    q-layout-header
      q-toolbar(color="primary" glossy)
        //- q-btn(flat dense round @click="leftDrawerOpen = !leftDrawerOpen")
        //-   q-icon(name="menu")

        q-toolbar-title ADHB ISU Bed Modelling
          div(slot="subtitle") ADHB Integrated Stroke Unit Bed Modelling and Simulation E-Tool (v{{ version }})

    //- q-layout-drawer(v-model="leftDrawerOpen" content-class="bg-grey-2")
    //-   q-list(no-border link inset-delimiter)
    //-     q-item(to="/")
    //-       q-item-side(icon="home")
    //-       q-item-main(label="Home")
    //-     q-item(to="/beddays")
    //-       q-item-side(icon="mdi-account-multiple")
    //-       q-item-main(label="Bed Days Per Year" sublabel="Bed Day Modeling")
    //-     q-item(to="/bedoccupancy")
    //-       q-item-side(icon="mdi-ambulance")
    //-       q-item-main(label="Bed Occupancy" sublabel="Bed occupancy simulation")

    q-page-container
      transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" :duration="300" @leave="resetScroll")
        router-view
</template>

<script>
require('vue-animate/dist/vue-animate.min.css')
import {version} from './version'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: true,
      version
    }
  },
  computed: {},
  methods: {
    resetScroll (el, done) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      done()
    }
  }
}
</script>

<style lang="stylus">
</style>
