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
          q-collapsible(group="settings" label="Presets" icon="settings" separator)
            q-field(label="Parameter Presets").q-mb-lg
              q-select(v-model="paramPreset" :options="paramPresetOptions")
          q-collapsible(group="Flowchart" opened label="Flowchart" icon="mdi-sitemap" separator)
            .row.justify-center
              q-option-group(inline v-model="year" :options=`[
                {label: '2018', value: 2018},
                {label: '2020', value: 2020},
                {label: '2022', value: 2022},
                {label: '2024', value: 2024}
                ]`)
            .row.justify-center.q-mt-lg(style="overflow-x:auto")
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

      div(slot="table" style="overflow-x:auto;")
        .row.justify-center
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
        {label: 'Rehab', icon: 'favorite'},
        {label: 'Beds', icon: 'mdi-hotel'}
      ],
      paramPreset: 'Defaults',
      paramPresetOptions: [{value: 'Defaults', label: 'Defaults'}],
      params: Params,
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
    nADHBStroke: function (year) {
      return Math.round(
        this.params.nADHBStroke.val *
          (1.0 + this.params.popGrowth.val) ** (year - 2017)
      )
    },
    nTIA: function (year) {
      return Math.round(this.nADHBTIA(year))
    },
    nADHBTIA: function (year) {
      return Math.round(
        this.params.nADHBTIA.val *
          (1.0 + this.params.popGrowth.val) ** (year - 2017)
      )
    },
    nWDHBUnder65: function (year) {
      return Math.round(
        this.params.nWDHBUnder65.val *
          (1.0 + this.params.popGrowth.val) ** (year - 2017)
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

    // =====================================================================

    nPSI: function (year) {
      return Math.round(
        this.getPSI(year, 'metro', this.params.mPSI.val) +
          this.getPSI(year, 'nonmetro', this.params.mPSI.val)
      )
    },
    nPSIExternal: function (year) {
      // external PSI = 70% of metro + all nonmetro
      return Math.round(
        this.getPSI(year, 'metro', this.params.mPSI.val) * 0.7 +
          this.getPSI(year, 'nonmetro', this.params.mPSI.val)
      )
    },
    nPSIDiversions: function (year) {
      switch (this.params.mDiversions.val) {
        case 'statusquo': // WTK only
          return Math.round(
            this.getPSI(year, 'metro', this.params.mPSI.val) * 0.15
          )
        case 'pragmatic': // WDHB + CMDHB after hours without the 0-24h duration
          return Math.round(
            this.getPSI(year, 'metro', this.params.mPSI.val) *
              0.7 *
              0.61 *
              (11 / 14)
          )
        case 'expanded': // WDHB + CMDHB after hours including the 0-24h duration
          return Math.round(
            this.getPSI(year, 'metro', this.params.mPSI.val) * 0.7 * 0.61
          )
        case 'future': // WDHB + CMDHB all hours
          return Math.round(
            this.getPSI(year, 'metro', this.params.mPSI.val) * 0.7
          )
        default:
          stop('nPSIDiversions: invalid diversion model')
      }
    },
    nPSITransfer: function (year) {
      return this.nPSIExternal(year) - this.nPSIDiversions(year)
    },
    nPSIADHB: function (year) {
      return this.nPSI(year) - this.nPSIExternal(year)
    },

    // ==================================================================================

    nIVT: function (year) {
      return this.nIVTDiversions(year) + this.nIVTADHB(year)
    },
    nIVTDiversions: function (year) {
      return this.nDiversions(year) * this.params.pIVTOnly.val
    },
    nIVTExternal: function (year) {
      return this.nIVTDiversions(year)
    },
    nIVTADHB: function (year) {
      return this.getIschemic(year, 'metro') * 0.3 * this.params.pIVTOnly.val
    },

    // ==================================================================================

    nPSIIVT: function (year) {
      return this.nPSI(year) + this.nIVT(year)
    },
    nPSIIVTExternal: function (year) {
      return this.nPSIExternal(year) + this.nIVTExternal(year)
    },

    // ===================================================================================

    nPSIIVTNegExternal: function (year) {
      return Math.round(
        this.getDiversions(year, this.params.mDiversions.val) -
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

    // ====================================================================================

    nDiversions: function (year) {
      return Math.round(this.getDiversions(year, this.params.mDiversions.val))
    },

    // ====================================================================================

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
      return Math.round(this.nTIA(year) * 0.5)
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
