<template lang="pug">
  div
    q-field(label="Regions")
      q-select(multiple chips v-model="sRegions" :options="Regions")
    q-field(label="DHBs")
      q-select(multiple chips v-model="sDHBs" :options="DHBs")
    q-field(label="Population Growth" helper="Annual %")
      q-input(v-model="pPopulationGrowth")
    q-field(label="Analysis Year")
      q-select(v-model="nYear" :options=`[
        { label: '2017', value: 2017 },
        { label: '2018', value: 2018 },
        { label: '2019', value: 2019 },
        { label: '2020', value: 2020 },
        { label: '2021', value: 2021 },
        { label: '2022', value: 2022 },
      ]`)
    q-field(label="Total Population" helper="Selected population @ selected year")
      q-input(readonly v-model="getCalculatedN")
</template>

<script>
import DHBs from './dhbs.js'
import Regions from './regions.js'

export default {
  name: 'my-layout',
  props: ['value'],
  data () {
    return {
      DHBs: DHBs,
      Regions: Regions,
      sRegions: [],
      sDHBs: [],
      pPopulationGrowth: 2.5,
      nYear: 2018
    }
  },
  computed: {
    getCalculatedN: function () {
      var x = 0
      this.sDHBs.forEach(o1 => {
        x = x + this.DHBs.find(o2 => o2.value === o1).n
      })
      x = x * Math.pow(1.0 + this.pPopulationGrowth / 100, this.nYear - 2017)
      return Math.round(x)
    }
  },
  mounted: function () {
    this.sRegions = this.value.regions
    this.sDHBs = this.value.dhbs // ['Auckland', 'Counties Manukau', 'Waitemata']
  },
  watch: {
    value: function () {
      this.sRegions = this.value.regions
      this.sDHBs = this.value.dhbs
    },
    sRegions: function (newRegions) {
      if (newRegions.length > 0) {
        var self = this
        this.sDHBs = []
        newRegions.forEach(function (region) {
          self.sDHBs = self.sDHBs.concat(self.getRegionDHBs(region))
        })
      }
    },
    getCalculatedN: function (newn) {
      this.$emit('input', {
        regions: this.sRegions,
        dhbs: this.sDHBs,
        growth: this.pPopulationGrowth,
        year: this.nYear,
        n: newn
      })
    }
  },
  methods: {
    getRegionDHBs: function (regionName) {
      var region = this.Regions.find(region => region.value === regionName)
      if (region !== undefined) return region.dhbs
    }
  }
}
</script>

<style>
.layout-padding {
  padding: 2em 2em;
}
</style>
