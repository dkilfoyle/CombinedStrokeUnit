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
        flow-chart-viewer(title="PSI" :flowchartData="flowchartData" :presets=`[
          { label: 'Zoom: Demographics', icon: 'people', nodes: ['Population', 'Adults', 'Strokes', 'Ischemic', 'LVO'] },
          { label: 'Zoom: Early presenters', icon: 'timer', nodes: ['KTO', 'LT4h', 'GT4h', 'EarlyInclusion', 'EarlyExclusion', 'PSIReqd', 'PSINotReqd', 'TotalPSI']},
          { label: 'Zoom: Late presenters', icon: 'timer_off', nodes: ['SUTO', 'TooLate', 'CTPBad', 'TotalPSI'] }
        ]`)
</template>

<script>
import MyLayout from 'components/MyLayout'
import PopulationSelector from 'components/PopulationSelector'
import FlowChartViewer from 'components/FlowChartViewer'
import CustomParamTable from './CustomParamTable'
import numeral from 'numeral'
import DHBs from 'components/dhbs.js'
import Params from './ISUParams'
import paramFilters from './paramFilters'

var n = function (mynum) {
  return numeral(mynum).format('0,0')
}
var p = function (mynum) {
  return numeral(mynum).format('0%')
}

export default {
  name: 'beddays',
  components: {
    CustomParamTable,
    FlowChartViewer,
    MyLayout,
    PopulationSelector
  },
  mixins: [paramFilters],
  data () {
    return {
      numeral: numeral,
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
      population: {
        regions: ['Metro'],
        dhbs: ['Auckland', 'Counties Manukau', 'Waitemata'],
        year: 2018
      },
      params: Params,
      DHBs: DHBs,
      psi: {
        metro: {
          statusquo: 123,
          pragmatic: 166,
          expanded: 249,
          future: 39
        },
        nonmetro: {
          statusquo: 14,
          pragmatic: 34,
          expanded: 108,
          future: 219
        }
      }
    }
  },
  computed: {
    nPASTAPosADHB: function () {
      return this.params.nADHBStroke.val * this.params.pPASTAPos.val
    },
    nPASTAPos: function () {
      return (
        this.nPASTAPosADHB + this.params.nDiversions.val + this.nPSITransfer
      )
    },
    nPSI: function () {
      return (
        this.psi.metro[this.params.mPSI.val] +
        this.psi.nonmetro[this.params.mPSI.val]
      )
    },
    nPSITransfer: function () {
      // all nonmetro + in hours metro - adhb
      return (
        this.psi.metro[this.params.mPSI.val] * 0.7 * 0.39 +
        this.psi.nonmetro[this.params.mPSI.val]
      )
    },
    nPSIDiversions: function () {
      // non adhb after hours
      return this.psi.metro[this.params.mPSI.val] * 0.7 * 0.61
    },
    nPSINegExternal: function () {
      return this.params.nDiversions.val - this.nPSIDiversions
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
        nodes: [
          // ===================== Inputs
          {
            id: 'psitransfer',
            label: '*PSI Transfer*\nN=' + n(this.nPSITransfer),
            level: 0,
            group: 'start'
          },
          {
            id: 'diversions',
            label: '*Diversions*\nN=' + n(this.params.nDiversions.val),
            level: 0,
            group: 'start'
          },
          {
            id: 'adhbstroke',
            label: '*Stroke (ADHB)*\nN=' + n(this.params.nADHBStroke.val),
            level: 0,
            font: {multi: 'md'},
            group: 'start'
          },
          {
            id: 'blank1',
            level: 0,
            hidden: true
          },
          {
            id: 'adhbtia',
            label: '*TIA (ADHB)*\nN=' + n(this.params.nADHBTIA.val),
            level: 0,
            group: 'start'
          },
          {
            id: 'wdhbstroke',
            label: `*WDHB <65y\nn = ${n(this.params.nWDHBUnder65.val)}`,
            level: 0,
            group: 'start'
          },
          // ===================== ED
          {
            id: 'psinegexternal',
            label: '*PSI -ve*\nExternal: ' + n(this.nPSINegExternal),
            level: 1,
            group: 'norm'
          },
          {
            id: 'pastapos',
            label: '*PASTA +ve*\nn = ' + n(this.nPASTAPos),
            level: 1,
            group: 'ed'
          },
          {
            id: 'psinegadhb',
            label: '*PSI -ve\nADHB: ' + n(this.nPSINegADHB),
            level: 1,
            group: 'norm'
          },
          {
            id: 'pastaneg',
            label: '*PASTA -ve*\nADHB: ' + n(this.nPASTANeg),
            level: 1,
            group: 'norm'
          },
          {
            id: 'tiaed',
            label: '*TIA*\nADHB:' + n(this.nTIA),
            level: 1,
            group: 'norm'
          },
          // ==================== NR
          {id: 'psipos2', hidden: true, level: 2},
          {
            id: 'psipos',
            label: '*PSI*\nN= ' + n(this.nPSI),
            level: 2,
            group: 'ed'
          },
          {id: 'psipos3', hidden: true, level: 2},
          // {id: 'psipos3', label: '*PSI*\nN= ' + n(this.nPSI), level: 2},
          // ==================== ISU
          {
            id: 'repat',
            label: '*REPATRIATION*\nN = ' + n(this.nRepatriation),
            level: 3,
            group: 'end',
            y: 2
          },
          {
            id: 'blank2',
            level: 3,
            hidden: true
          },
          {
            id: 'hasu',
            label: `*HASU* n=${n(this.nHASU)}\nPSI External: ${n(
              this.nPSIExternal
            )}\nLOS: ${n(this.params.nHASULOS.val)}`,
            level: 3,
            group: 'norm'
          },
          {
            id: 'asu',
            label: `*ASU*\nStroke = ${n(this.nASUStroke)}, LOS: ${n(
              this.params.nASULOSStroke.val
            )}\nTIA = ${n(this.nASUTIA)}, LOS: ${n(
              this.params.nASULOSTIA.val
            )}`,
            level: 3,
            group: 'norm'
          },
          {
            id: 'rehab',
            label: `*Rehab*\nn = ${n(this.nRehab)}, LOS: ${n(
              this.params.nRehabLOS.val
            )}`,
            level: 3,
            group: 'norm'
          },
          // ================== discharge
          {
            id: 'discharge',
            label: `*Discharge*\nn = ${n(this.nDischarge)}`,
            level: 4,
            group: 'end'
          }
        ],
        edges: [
          {
            from: 'psitransfer',
            to: 'pastapos',
            value: this.nPSITransfer
          },
          {
            from: 'diversions',
            to: 'pastapos',
            value: this.params.nDiversions.val
          },
          {
            from: 'adhbstroke',
            to: 'pastapos',
            label:
              p(this.params.pPASTAPos.val) + ' +ve\nn = ' + this.nPASTAPosADHB,
            value: this.nPASTAPosADHB
          },
          {
            from: 'adhbstroke',
            to: 'pastaneg',
            label:
              p(1.0 - this.params.pPASTAPos.val) +
              ' -ve\nn = ' +
              this.nPASTANeg,
            value: this.nPASTANeg
          },
          {
            from: 'adhbtia',
            to: 'tiaed'
          },
          {
            from: 'wdhbstroke',
            to: 'rehab',
            value: this.nWDHBUnder65
          },
          // ======================== Inside ED
          {
            from: 'pastapos',
            to: 'psinegexternal',
            value: this.nPSINegExternal
          },
          {
            from: 'pastapos',
            to: 'psinegadhb',
            value: this.nPSINegADHB
          },
          // ======================= ED to PSI
          {
            from: 'pastapos',
            to: 'psipos',
            value: this.nPSI
          },
          // ==================== ED TO ISU
          {
            from: 'psinegexternal',
            to: 'repat',
            value: this.nPSINegExternal
          },
          {
            from: 'psipos',
            to: 'hasu',
            value: this.nPSI
          },
          {
            from: 'psipos',
            to: 'repat',
            dashes: true,
            label: 'Future?'
          },
          {
            from: 'psinegadhb',
            to: 'hasu',
            label:
              p(this.params.pPSINegHASU.val) +
              '\nn = ' +
              n(this.params.pPSINegHASU.val * this.nPSINegADHB)
          },
          {
            from: 'psinegadhb',
            to: 'asu',
            label:
              p(1.0 - this.params.pPSINegHASU.val) +
              '\nn = ' +
              n((1.0 - this.params.pPSINegHASU.val) * this.nPSINegADHB)
          },
          {
            from: 'pastaneg',
            to: 'asu',
            value: this.nPASTANeg
          },
          {
            from: 'tiaed',
            to: 'asu',
            label: p(this.params.pTIAAdmitted.val) + ' Admitted',
            value: this.params.pTIAAdmitted.val * this.nTIA
          },
          {
            from: 'hasu',
            to: 'repat',
            label: n(this.nPSIExternal) + ' PSI',
            value: this.nPSIExternal
          },
          {
            from: 'hasu',
            to: 'asu',
            label: n(this.nHASU - this.nPSIExternal),
            value: this.nHASU - this.nPSIExternal
          },
          {
            from: 'asu',
            to: 'rehab',
            label: p(this.params.pRehab.val) + ' Stroke',
            value: this.nASUStroke * this.params.pRehab.val
          },
          {
            from: 'asu',
            to: 'discharge',
            label: n(
              this.nASUTIA + this.nASUStroke * (1 - this.params.pRehab.val)
            ),
            value: this.nASUTIA + this.nASUStroke * (1 - this.params.pRehab.val)
          },
          {
            from: 'rehab',
            to: 'discharge',
            value: this.nRehab
          }
        ]
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
          this.population.regions = ['Metro']
          this.population.dhbs = ['Auckland', 'Counties Manukau', 'Waitemata']
          this.params.pAvailability2018.val = 0.58
          this.params.pAvailability2022.val = 1.0
          break
        case 'PragmaticNonMetro':
          this.resetDefaults()
          this.population.regions = ['MidNorth']
          this.population.dhbs = [
            'Waikato',
            'BOP',
            'Tairawhiti',
            'Lakes',
            'Taranaki',
            'Northland'
          ]
          this.params.pAvailability2018.val = 0.2
          this.params.pAvailability2022.val = 0.7
          this.params.pKTO.val = 0.68
          this.params.pLT4h.val = 0.37
          break
        case 'OptimalMetro':
          this.resetDefaults()
          this.population.regions = ['Metro']
          this.population.dhbs = ['Auckland', 'Counties Manukau', 'Waitemata']
          this.params.pAvailability2018.val = 1.0
          this.params.pAvailability2022.val = 1.0
          break
        case 'OptimalNonMetro':
          this.resetDefaults()
          this.population.regions = ['MidNorth']
          this.population.dhbs = [
            'Waikato',
            'BOP',
            'Tairawhiti',
            'Lakes',
            'Taranaki',
            'Northland'
          ]
          this.params.pAvailability2018.val = 1.0
          this.params.pAvailability2022.val = 1.0
          this.params.pKTO.val = 0.7
          this.params.pLT4h.val = 0.5
          break
        case 'FutureMetro':
          this.resetDefaults()
          this.population.regions = ['Metro']
          this.population.dhbs = ['Auckland', 'Counties Manukau', 'Waitemata']
          this.params.pAvailability2018.val = 1.0
          this.params.pAvailability2022.val = 1.0
          this.params.pKTO.val = 0.82
          this.params.pLT4h.val = 0.85
          break
        case 'FutureNonMetro':
          this.resetDefaults()
          this.population.regions = ['MidNorth']
          this.population.dhbs = [
            'Waikato',
            'BOP',
            'Tairawhiti',
            'Lakes',
            'Taranaki',
            'Northland'
          ]
          this.params.pAvailability2018.val = 1.0
          this.params.pAvailability2022.val = 1.0
          this.params.pKTO.val = 0.82
          this.params.pLT4h.val = 0.85
          break
      }
    }
  },
  methods: {
    resetDefaults: function () {
      this.population.regions = ['Metro']
      this.population.dhbs = ['Auckland', 'Counties Manukau', 'Waitemata']
      this.population.year = 2018
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
