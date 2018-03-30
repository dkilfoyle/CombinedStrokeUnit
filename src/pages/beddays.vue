<template lang='pug'>
  q-page(padding)
    my-layout
      div(slot="settings")
        q-list
          q-list-header PSI Parameters
          q-item-separator

          q-collapsible(v-for="paramGroup in paramGroups" :key="paramGroup.label" group="parameters" :label="paramGroup.label" :icon="paramGroup.icon" separator)
            q-field(v-for="param in Object.values(params).filter(p => p.group === paramGroup.label)" :key="param.name" :label="param.label" :helper="param | getHelper")
              q-slider(v-if="param.type==='percent'" v-model="param.val" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(param.val*100)}%`")
              q-slider(v-if="param.type==='slider'" v-model="param.val" :min="param.min" :max="param.max" :step="(param.max-param.min)/100" :decimals="0" label-always :label-value="`${Math.round(param.val)}`")
              q-input(v-if="param.type==='number'" v-model="param.val")
              q-select(v-if="param.type==='select'" v-model="param.val" :options="param.options")

          q-collapsible(group="parameters" label="Defaults" icon="settings" separator)
            q-field(label="Parameter Presets")
              q-select(v-model="paramPreset" :options="paramPresetOptions")
            q-btn(@click="resetDefaults()" color="secondary" class="full-width") Reset All

        q-list
          q-list-header Settings
          q-item-separator
          q-collapsible(group="settings" label="Table" icon="view_quilt" separator)
            q-field(label="Show Custom Parameters" helper="Show parameters that vary from defaults")
              q-checkbox(v-model="bShowCustomParams")

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
      bShowCustomParams: true,
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
      params: Params
    }
  },
  computed: {
    nPASTAPosADHB: function () {
      return this.params.nADHBStroke.val * this.params.pPASTAPos.val
    },
    nPASTAPos: function () {
      return (
        this.nPASTAPosADHB +
        this.getDiversions(this.params.mDiversions.val) +
        this.nPSITransfer
      )
    },
    nPSI: function () {
      return (
        this.getPSI('metro', this.params.mPSI.val) +
        this.getPSI('nonmetro', this.params.mPSI.val)
      )
    },
    nPSITransfer: function () {
      if (this.params.mDiversions.val === 'statusquo') {
        // all nonmetro + allhours non-adhb metro
        return (
          this.getPSI('metro', this.params.mPSI.val) * 0.7 * 1.0 +
          this.getPSI('nonmetro', this.params.mPSI.val)
        )
      } else {
        // all nonmetro + in hours non-adhb metro
        return (
          this.getPSI('metro', this.params.mPSI.val) * 0.7 * 0.39 +
          this.getPSI('nonmetro', this.params.mPSI.val)
        )
      }
    },
    nPSIDiversions: function () {
      if (this.params.mDiversions.val === 'statusquo') {
        // wtk afterhours only
        return this.getPSI('metro', this.params.mPSI.val) * 0.15 * 0.61
      } else {
        // non adhb after hours
        return this.getPSI('metro', this.params.mPSI.val) * 0.7 * 0.61
      }
    },
    nPSINegExternal: function () {
      return (
        this.getDiversions(this.params.mDiversions.val) - this.nPSIDiversions
      )
    },
    nPSIPosADHB: function () {
      return this.nPSI - this.nPSITransfer - this.nPSIDiversions
    },
    nPSINegADHB: function () {
      return this.nPASTAPos - this.nPSI - this.nPSINegExternal
    },
    nPSIExternal: function () {
      return this.nPSI - this.nPSIPosADHB
    },
    nPASTANeg: function () {
      return this.params.nADHBStroke.val * (1.0 - this.params.pPASTAPos.val)
    },
    nHASU: function () {
      return this.nPSINegADHB * this.params.pPSINegHASU.val + this.nPSI
    },
    nTIA: function () {
      return this.params.nADHBTIA.val
    },
    nASUStroke: function () {
      return (
        this.nPASTANeg +
        this.nPSINegADHB * 0.5 +
        this.nHASU -
        this.nRepatriation
      )
    },
    nASUTIA: function () {
      return this.nTIA * 0.5
    },
    nRepatriation: function () {
      return this.nPSINegExternal + this.nPSI - this.nPSIPosADHB
    },
    nRehab: function () {
      return this.nASUStroke * this.params.pRehab.val
    },
    nDischarge: function () {
      return this.nASUStroke + this.nASUTIA + this.nRehab
    },
    flowchartData: function () {
      return {
        nodes: fcNodes,
        edges: fcEdges
      }
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
  },
  methods: {
    resetDefaults: function () {
      var self = this
      Object.keys(this.params).forEach(function (paramName) {
        self.params[paramName].val = self.params[paramName].default
      })
    }
  }
}
</script>

<style>

</style>
