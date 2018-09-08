<template lang='pug'>
  q-page(padding)
    my-layout
      div(slot="settings")
        q-list
          q-list-header ISU Parameters
          q-item-separator

          q-collapsible(v-for="paramGroup in paramGroups" :key="paramGroup.label" group="parameters" :label="paramGroup.label" :icon="paramGroup.icon" separator)
            q-alert(v-if="paramGroup.label==='Populations'" type="info").q-mb-lg
              | Stroke and TIA numbers in 2017. These will be scaled up for annual population growth.
            q-field(v-for="param in Object.values(params).filter(p => p.group === paramGroup.label)" :key="param.name" :label="param.label" :helper="param | getHelper")
              .row.no-wrap
                .col-10
                  q-slider(v-if="param.type==='percent'" v-model="param.val" :min="0.00" :max="param.max ? param.max : 1.0" :step="param.decimals ? 1/10**(param.decimals+2) : 0.01" :decimals="param.decimals ? param.decimals + 2 : 2" label-always :label-value="(param.val*100).toFixed(param.decimals ? param.decimals : 0) + '%'")
                  q-slider(v-if="param.type==='slider'" v-model="param.val" :min="param.min" :max="param.max" :step="(param.max-param.min)/100" :decimals="param.decimals ? param.decimals : 0" label-always :label-value="(param.val).toFixed(param.decimals ? param.decimals : 0)")
                  q-input(v-if="param.type==='number'" v-model="param.val")
                  q-select(v-if="param.type==='select'" v-model="param.val" :options="param.options")
                .col-2
                  q-chip(v-if="param.tip" small) ?
                    q-tooltip(:delay="200")
                      span(v-html="param.tip")

        q-list.q-mt-lg
          q-list-header Settings
          q-item-separator
          q-collapsible(group="settings" label="Presets" icon="settings" separator)
            q-field(label="Parameter Presets").q-mb-lg
              q-select(v-model="paramPreset" :options="paramPresetOptions")
          q-collapsible(group="Flowchart" opened label="Flowchart" icon="mdi-sitemap" separator)
            .row.justify-center
              q-option-group(inline v-model="year" :options=`[
                {label: '2018', value: 2018},
                {label: '2020', value: 2020},
                {label: '2022', value: 2022},
                {label: '2024', value: 2024},
                {label: '2030', value: 2030}
                ]`)
            .row.justify-center.q-mt-lg(style="overflow:auto")
              table.q-table-old
                thead
                  tr
                    th
                    th HASU
                    th ASU
                    th Rehab
                    th Total
                tbody
                  tr
                    td Beds
                    td(data-th="HASU") {{ nHASUBeds(year) }}
                    td(data-th="ASU") {{ nASUBeds(year) }}
                    td(data-th="Rehab") {{ nRehabBeds(year) }}
                    td(data-th="Total") {{ nTotalBeds(year) }}

      div(slot="graph")
        flow-chart-viewer(title="PSI" :flowchartData="{nodes, edges}")

      div(slot="table" style="overflow:scroll;")
        .row.justify-center
          table.q-table-old
            thead
              tr
                th.headcol
                th 2018
                th 2019
                th 2020
                th 2021
                th 2022
                th 2023
                th 2024
            tbody
              tr
                td <b>Patients</b>
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
                td <b>Bed Days</b>
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
                td <b>Beds @ target occupancy</b>
              tr
                td HASU
                td(v-for="year in tableYears") {{ nHASUBeds(year) }}
              tr
                td ASU
                td(v-for="year in tableYears") {{ nASUBeds(year) }}
              tr
                td Rehab
                td(v-for="year in tableYears") {{ nRehabBeds(year) }}
              tr
                td Total
                td(v-for="year in tableYears") {{ nTotalBeds(year) }}

</template>

<script>
import MyLayout from 'components/MyLayout'
import FlowChartViewer from 'components/FlowChartViewer'
import CustomParamTable from './CustomParamTable'
// import Params from './ISUParams'
import params from './userParams'
import paramFilters from './paramFilters'
import fcNodes from './nodes'
import fcEdges from './edges'
import psimodels from './psimodels'
import diversionmodels from './diversionmodels'
import ivtmodels from './ivtmodels'
import populationmodels from './populationmodels'

export default {
  name: 'beddays',
  components: {
    CustomParamTable,
    FlowChartViewer,
    MyLayout
  },
  mixins: [
    params,
    paramFilters,
    fcNodes,
    fcEdges,
    psimodels,
    diversionmodels,
    ivtmodels,
    populationmodels
  ],
  data () {
    return {
      tableYears: [2018, 2019, 2020, 2021, 2022, 2022, 2023],
      paramGroups: [
        {label: 'Populations', icon: 'people'},
        {label: 'ED', icon: 'mdi-ambulance'},
        {label: 'Neuroradiology', icon: 'mdi-radioactive'},
        {label: 'HASU/ASU', icon: 'mdi-needle'},
        {label: 'Rehab', icon: 'favorite'},
        {label: 'Beds', icon: 'mdi-hotel'}
      ],
      paramPreset: 'Defaults',
      paramPresetOptions: [{value: 'Defaults', label: 'Defaults'}],
      year: 2018
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
    nPASTAPosADHB: function (year) {
      return Math.round(this.nADHBStroke(year) * this.params.pPASTAPos.val)
    },
    nPASTAPos: function (year) {
      return Math.round(
        this.nPASTAPosADHB(year) +
          this.getDiversions(this.params.mDiversions.val, year) +
          this.nPSITransfer(year)
      )
    },
    nPSIIVT: function (year) {
      return this.nPSI(year) + this.nIVT(year)
    },
    nPSIIVTExternal: function (year) {
      return this.nPSIExternal(year) + this.nIVTExternal(year)
    },
    nPSIIVTNegExternal: function (year) {
      return Math.round(
        this.getDiversions(this.params.mDiversions.val, year) -
          this.nPSIDiversions(year) -
          this.nIVTDiversions(year)
      )
    },
    nPSIIVTNegADHB: function (year) {
      return Math.round(
        this.nPASTAPos(year) -
          this.nPSIIVT(year) -
          this.nPSIIVTNegExternal(year)
      )
    },
    nPASTANeg: function (year) {
      return Math.round(
        this.nADHBStroke(year) * (1.0 - this.params.pPASTAPos.val)
      )
    },
    nHASU: function (year) {
      return Math.round(
        this.nPSIIVTNegADHB(year) * this.params.pPSIIVTNegHASU.val +
          this.nPSIIVT(year)
      )
    },
    nASU: function (year) {
      return Math.round(this.nASUStroke(year) + this.nASUTIA(year))
    },
    nASUStroke: function (year) {
      return Math.round(
        this.nPASTANeg(year) +
          this.nPSIIVTNegADHB(year) * (1.0 - this.params.pPSIIVTNegHASU.val) +
          this.nHASU(year) -
          this.nPSIIVTExternal(year)
      )
    },
    nASUTIA: function (year) {
      return Math.round(this.nADHBTIA(year)) // * this.params.pTIAAdmitted.val)
    },
    nRepatriation: function (year) {
      return Math.round(
        this.nPSIIVTNegExternal(year) + this.nPSIIVTExternal(year)
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

    // =========================================================================

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

    nHASUBeds: function (year) {
      return Math.ceil(
        this.nHASUBedDays(year) * 1 / this.params.pHASUOccupancy.val / 365
      )
    },
    nASUBeds: function (year) {
      return Math.ceil(
        this.nASUBedDays(year) * 1 / this.params.pASUOccupancy.val / 365
      )
    },
    nRehabBeds: function (year) {
      return Math.ceil(
        this.nRehabBedDays(year) * 1 / this.params.pASUOccupancy.val / 365.0
      )
    },
    nTotalBeds: function (year) {
      return this.nHASUBeds(year) + this.nASUBeds(year) + this.nRehabBeds(year)
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
