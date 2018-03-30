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
          q-collapsible(group="Flowchart" opened label="Flowchart" icon="view_quilt" separator)
            q-field(label="Year")
              q-option-group(inline v-model="year" :options=`[
                {label: '2018', value: 2018},
                {label: '2020', value: 2020},
                {label: '2022', value: 2022},
                {label: '2024', value: 2024}
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
                td(v-for="year in tableYears") {{ nPSI(year) }}
              tr
                td Diversions
                td(v-for="year in tableYears") {{ nDiversions(year) }}
              tr
                td HASU
                td(v-for="year in tableYears") {{ nHASU(year) }}
              tr
                td ASU
                td(v-for="year in tableYears") {{ nASU(year) }}
              tr
                td Rehab
                td(v-for="year in tableYears") {{ nRehab(year) }}
              tr
                td Discharges
                td(v-for="year in tableYears") {{ nDischarge(year) }}
              tr
                td Repatriations
                td(v-for="year in tableYears") {{ nRepatriation(year) }}
              tr
                td Bed Days
              tr
                td HASU
                td(v-for="year in tableYears") {{ nHASUBedDays(year) }}
              tr
                td ASU
                td(v-for="year in tableYears") {{ nASUBedDays(year) }}
              tr
                td Rehab
                td(v-for="year in tableYears") {{ nRehabBedDays(year) }}
              tr
                td Beds @ 90% Occupancy (HASU 80%)
              tr
                td HASU
                td(v-for="year in tableYears") {{ Math.ceil(nHASUBedDays(year) *100/80 / 365) }}
              tr
                td ASU
                td(v-for="year in tableYears") {{ Math.ceil(nASUBedDays(year) *100/90 / 365) }}
              tr
                td Rehab
                td(v-for="year in tableYears") {{ Math.ceil(nRehabBedDays(year) *100/90/ 365.0) }}
              tr
                td Total
                td(v-for="year in tableYears") {{ Math.ceil((nHASUBedDays(year) + nASUBedDays(year) + nRehabBedDays(year)) *100/90/ 365.0) }}

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
      tableYears: [2018, 2019, 2020, 2021, 2022, 2022, 2023],
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
      return Math.round(
        this.params.nADHBStroke.val * this.popGrowth ** (year - 2017)
      )
    },
    nADHBTIA: function (year) {
      return Math.round(
        this.params.nADHBTIA.val * this.popGrowth ** (year - 2017)
      )
    },
    nWDHBUnder65: function (year) {
      return Math.round(
        this.params.nWDHBUnder65.val * this.popGrowth ** (year - 2017)
      )
    },
    nPASTAPosADHB: function (year) {
      return Math.round(this.nADHBStroke(year) * this.params.pPASTAPos.val)
    },
    nPASTAPos: function (year) {
      return Math.round(
        this.nPASTAPosADHB(year) +
          this.getDiversions(year, this.params.mDiversions.val) +
          this.nPSITransfer(year)
      )
    },
    nPSI: function (year) {
      return Math.round(
        this.getPSI(year, 'metro', this.params.mPSI.val) +
          this.getPSI(year, 'nonmetro', this.params.mPSI.val)
      )
    },
    nPSITransfer: function (year) {
      if (this.params.mDiversions.val === 'statusquo') {
        // all nonmetro + allhours non-adhb metro
        return Math.round(
          this.getPSI(year, 'metro', this.params.mPSI.val) * 0.7 * 1.0 +
            this.getPSI(year, 'nonmetro', this.params.mPSI.val)
        )
      } else {
        // all nonmetro + in hours non-adhb metro
        return Math.round(
          this.getPSI(year, 'metro', this.params.mPSI.val) * 0.7 * 0.39 +
            this.getPSI(year, 'nonmetro', this.params.mPSI.val)
        )
      }
    },
    nDiversions: function (year) {
      return Math.round(this.getDiversions(year, this.params.mDiversions.val))
    },
    nPSIDiversions: function (year) {
      if (this.params.mDiversions.val === 'statusquo') {
        // wtk afterhours only
        return Math.round(
          this.getPSI(year, 'metro', this.params.mPSI.val) * 0.15 * 0.61
        )
      } else {
        // non adhb after hours
        return Math.round(
          this.getPSI(year, 'metro', this.params.mPSI.val) * 0.7 * 0.61
        )
      }
    },
    nPSINegExternal: function (year) {
      return Math.round(
        this.getDiversions(year, this.params.mDiversions.val) -
          this.nPSIDiversions(year)
      )
    },
    nPSIPosADHB: function (year) {
      return Math.round(
        this.nPSI(year) - this.nPSITransfer(year) - this.nPSIDiversions(year)
      )
    },
    nPSINegADHB: function (year) {
      return Math.round(
        this.nPASTAPos(year) - this.nPSI(year) - this.nPSINegExternal(year)
      )
    },
    nPSIExternal: function (year) {
      return Math.round(this.nPSI(year) - this.nPSIPosADHB(year))
    },
    nPASTANeg: function (year) {
      return Math.round(
        this.nADHBStroke(year) * (1.0 - this.params.pPASTAPos.val)
      )
    },
    nHASU: function (year) {
      return Math.round(
        this.nPSINegADHB(year) * this.params.pPSINegHASU.val + this.nPSI(year)
      )
    },
    nTIA: function (year) {
      return Math.round(this.nADHBTIA(year))
    },
    nASU: function (year) {
      return Math.round(this.nASUStroke(year) + this.nASUTIA(year))
    },
    nASUStroke: function (year) {
      return Math.round(
        this.nPASTANeg(year) +
          this.nPSINegADHB(year) * 0.5 +
          this.nHASU(year) -
          this.nPSIExternal(year)
      )
    },
    nASUTIA: function (year) {
      return Math.round(this.nTIA(year) * 0.5)
    },
    nRepatriation: function (year) {
      return Math.round(
        this.nPSINegExternal(year) + this.nPSI(year) - this.nPSIPosADHB(year)
      )
    },
    nRehab: function (year) {
      return Math.round(
        this.nASUStroke(year) * this.params.pRehab.val + this.nWDHBUnder65(year)
      )
    },
    nDischarge: function (year) {
      return Math.round(
        this.nASUStroke(year) + this.nASUTIA(year) + this.nWDHBUnder65(year)
      )
    },
    nHASUBedDays: function (year) {
      return Math.round(this.nHASU(year) * this.params.nHASULOS.val)
    },
    nASUBedDays: function (year) {
      return Math.round(
        this.nASUStroke(year) * this.params.nASULOSStroke.val +
          this.nASUTIA(year) * this.params.nASULOSTIA.val
      )
    },
    nRehabBedDays: function (year) {
      return Math.round(this.nRehab(year) * this.params.nRehabLOS.val)
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
