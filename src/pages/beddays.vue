<template lang='pug'>
  q-page(padding)
    my-layout
      div(slot="settings")
        q-list
          q-list-header PSI Parameters
          q-item-separator

          q-collapsible(v-for="paramGroup in paramGroups" :key="paramGroup.label" group="parameters" :label="paramGroup.label" :icon="paramGroup.icon" separator)
            q-alert(v-if="paramGroup.label==='Populations'" type="info").q-mb-lg
              | Populations numbers in 2017
            q-field(v-for="param in Object.values(params).filter(p => p.group === paramGroup.label)" :key="param.name" :label="param.label" :helper="param | getHelper")
              q-slider(v-if="param.type==='percent'" v-model="param.val" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(param.val*100)}%`")
              q-slider(v-if="param.type==='slider'" v-model="param.val" :min="param.min" :max="param.max" :step="(param.max-param.min)/100" :decimals="0" label-always :label-value="`${Math.round(param.val)}`")
              q-input(v-if="param.type==='number'" v-model="param.val")
              q-select(v-if="param.type==='select'" v-model="param.val" :options="param.options")

        q-list.q-mt-lg
          q-list-header Settings
          q-item-separator
          q-collapsible(group="settings" label="Parameters" icon="view_quilt" separator)
            q-field(label="Parameter Presets").q-mb-lg
              q-select(v-model="paramPreset" :options="paramPresetOptions")
            q-btn(@click="resetDefaults()" color="secondary" class="full-width") Reset All
          q-collapsible(group="Flowchart" label="Flowchart" icon="view_quilt" separator)
            q-field(label="Year")
              q-option-group(inline v-model="year" :options=`[
                {label: '2018', value: 2018},
                {label: '2020', value: 2020},
                {label: '2022', value: 2022},
                {label: '2024', value: 2024},
                {label: '2026', value: 2026}
                ]`)

      div(slot="graph")
        flow-chart-viewer(title="PSI" :flowchartData="{nodes, edges}")

      div(slot="table")
        table.q-table-old
          thead
            tr
              th
              th 2018
              th 2019
              th 2020
              th 2021
              th 2022
              th 2023
              th 2024
          tbody
            tr
              td Patients
            tr
              td PSI
            tr
              td Diversions
            tr
              td HASU
            tr
              td ASU
            tr
              td Rehab
            tr
              td Discharges
            tr
              td Repatriations
            tr
              td Bed Days
            tr
              td HASU
            tr
              td ASU
            tr
              td Rehab
            tr
              td Beds
            tr
              td HASU
            tr
              td ASU
            tr
              td Rehab

</template>

<script>
import MyLayout from 'components/MyLayout'
import FlowChartViewer from 'components/FlowChartViewer'
import CustomParamTable from './CustomParamTable'
import Params from './ISUParams'
import paramFilters from './paramFilters'
import fcNodes from './nodes'
import fcEdges from './edges'
import psimodels from './psimodels'
import diversionmodels from './diversionmodels'

export default {
  name: 'beddays',
  components: {
    CustomParamTable,
    FlowChartViewer,
    MyLayout
  },
  mixins: [paramFilters, fcNodes, fcEdges, psimodels, diversionmodels],
  data () {
    return {
      tableYears: [2018, 2019, 2020, 2021, 2022],
      paramGroups: [
        {label: 'Populations', icon: 'people'},
        {label: 'ED', icon: 'mdi-ambulance'},
        {label: 'Neuroradiology', icon: 'mdi-radioactive'},
        {label: 'HASU/ASU', icon: 'mdi-needle'},
        {label: 'Rehab', icon: 'favorite'}
      ],
      paramPreset: 'Defaults',
      paramPresetOptions: [
        {value: 'Defaults', label: 'Defaults'},
        {value: 'PragmaticMetro', label: 'PragmaticMetro'},
        {value: 'PragmaticNonMetro', label: 'PragmaticNonMetro'},
        {value: 'OptimalMetro', label: 'OptimalMetro'},
        {value: 'OptimalNonMetro', label: 'OptimalNonMetro'},
        {value: 'FutureMetro', label: 'FutureMetro'},
        {value: 'FutureNonMetro', label: 'FutureNonMetro'}
      ],
      params: Params,
      year: 2018,
      popGrowth: 1.02
    }
  },
  computed: {
    flowchartData: function () {
      return {
        nodes: fcNodes,
        edges: fcEdges
      }
    }
  },
  methods: {
    nADHBStroke: function (year) {
      return this.params.nADHBStroke.val * this.popGrowth ** (year - 2017)
    },
    nADHBTIA: function (year) {
      return this.params.nADHBTIA.val * this.popGrowth ** (year - 2017)
    },
    nWDHBUnder65: function (year) {
      return this.params.nWDHBUnder65.val * this.popGrowth ** (year - 2017)
    },
    nPASTAPosADHB: function (year) {
      return this.nADHBStroke(year) * this.params.pPASTAPos.val
    },
    nPASTAPos: function (year) {
      return (
        this.nPASTAPosADHB(year) +
        this.getDiversions(year, this.params.mDiversions.val) +
        this.nPSITransfer(year)
      )
    },
    nPSI: function (year) {
      return (
        this.getPSI(year, 'metro', this.params.mPSI.val) +
        this.getPSI(year, 'nonmetro', this.params.mPSI.val)
      )
    },
    nPSITransfer: function (year) {
      if (this.params.mDiversions.val === 'statusquo') {
        // all nonmetro + allhours non-adhb metro
        return (
          this.getPSI(year, 'metro', this.params.mPSI.val) * 0.7 * 1.0 +
          this.getPSI(year, 'nonmetro', this.params.mPSI.val)
        )
      } else {
        // all nonmetro + in hours non-adhb metro
        return (
          this.getPSI(year, 'metro', this.params.mPSI.val) * 0.7 * 0.39 +
          this.getPSI(year, 'nonmetro', this.params.mPSI.val)
        )
      }
    },
    nPSIDiversions: function (year) {
      if (this.params.mDiversions.val === 'statusquo') {
        // wtk afterhours only
        return this.getPSI(year, 'metro', this.params.mPSI.val) * 0.15 * 0.61
      } else {
        // non adhb after hours
        return this.getPSI(year, 'metro', this.params.mPSI.val) * 0.7 * 0.61
      }
    },
    nPSINegExternal: function (year) {
      return (
        this.getDiversions(year, this.params.mDiversions.val) -
        this.nPSIDiversions(year)
      )
    },
    nPSIPosADHB: function (year) {
      return (
        this.nPSI(year) - this.nPSITransfer(year) - this.nPSIDiversions(year)
      )
    },
    nPSINegADHB: function (year) {
      return this.nPASTAPos(year) - this.nPSI(year) - this.nPSINegExternal(year)
    },
    nPSIExternal: function (year) {
      return this.nPSI(year) - this.nPSIPosADHB(year)
    },
    nPASTANeg: function (year) {
      return this.nADHBStroke(year) * (1.0 - this.params.pPASTAPos.val)
    },
    nHASU: function (year) {
      return (
        this.nPSINegADHB(year) * this.params.pPSINegHASU.val + this.nPSI(year)
      )
    },
    nTIA: function (year) {
      return this.nADHBTIA(year)
    },
    nASUStroke: function (year) {
      return (
        this.nPASTANeg(year) +
        this.nPSINegADHB(year) * 0.5 +
        this.nHASU(year) -
        this.nRepatriation(year)
      )
    },
    nASUTIA: function (year) {
      return this.nTIA(year) * 0.5
    },
    nRepatriation: function (year) {
      return (
        this.nPSINegExternal(year) + this.nPSI(year) - this.nPSIPosADHB(year)
      )
    },
    nRehab: function (year) {
      return this.nASUStroke(year) * this.params.pRehab.val
    },
    nDischarge: function (year) {
      return this.nASUStroke(year) + this.nASUTIA(year) + this.nRehab(year)
    },
    resetDefaults: function () {
      var self = this
      Object.keys(this.params).forEach(function (paramName) {
        self.params[paramName].val = self.params[paramName].default
      })
    }
  },
  watch: {
    paramPreset: function (newpreset) {
      switch (newpreset) {
        case 'Defaults':
          this.resetDefaults()
          break
        case 'PragmaticMetro':
          this.resetDefaults()
          break
      }
    }
  }
}
</script>

<style>

</style>
