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
          //- q-collapsible(group="settings" label="Models" icon="settings" separator)
            //- q-field(label="Model Parameters").q-mb-lg
            //-   q-select(v-model="showmodel" :options="allmodels")

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

      div(slot="plots")
        .row.q-mt-lg.justify-center
          div(style="width:800px; max-width: 90vw;")
            .row.q-mt-lg
              highcharts(:options="patientsChartData")
            .row.q-mt-lg
              highcharts(:options="dischargesChartData")
            .row.q-mt-lg
              highcharts(:options="beddaysChartData")

      div(slot="table")
        table.q-table-old
          thead
            tr
              th
              th(v-for="year in tableYears") {{ year }}
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
              td WDHB
              td(v-for="year in tableYears") {{ nWDHBUnder65(year) }}
            tr
              td <b>Acute Ward Discharges</b>
            tr
              td Repatriations
              td(v-for="year in tableYears") {{ nRepatriation(year) - nPSIIVTNegExternal(year) }}
            tr
              td TIA
              td(v-for="year in tableYears") {{ nADHBTIA(year) }}
            tr
              td Stroke no Rehab
              td(v-for="year in tableYears") {{ nADHBStroke(year) - nRehab(year) }}
            tr
              td Stroke with Rehab
              td(v-for="year in tableYears") {{ nRehab(year) }}
            tr
              td Total
              td(v-for="year in tableYears") {{ nDischarge(year) - nWDHBUnder65(year) }}

            tr
              td <b>Intervention Rates</b>
            tr
              td PSI Metro
              td(v-for="year in tableYears") {{ percentPSI('Metro', year) }}
            tr
              td PSI Non-Metro
              td(v-for="year in tableYears") {{ percentPSI('NonMetro', year) }}
            tr
              td Diversions
              td(v-for="year in tableYears") {{ percentDiversions(year) }}

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

      div(slot="models")
        .row.q-mt-lg.justify-center
          div(style="width:800px; max-width: 90vw;")
            .row.q-mt-lg
              q-card(style="width:800px; max-width: 90vw;")
                q-card-title PSI
                q-card-separator
                q-card-main
                  p Rates are proportion of ischemic stroke.<br>Eligibility measures patient factors such as large vs small vessel occlusion, stroke duration.<br>Availability measures external factors such as distance from hospital, hospital resources including advanced CT<br>Diversion rate is the proportion of diversions that receive a PSI. This will increase only slightly as increasing diversion strategies target absolute numbers not proportion.
                  .row.justify-center.q-mt-lg(style="overflow:auto")
                    table.q-table-old
                      thead
                        tr
                          th
                          th Eligibility
                          th Availability
                          th DiversionRate
                      tbody
                        tr
                          td <b>Metro</b>
                        tr(v-for="model in ['pragmatic', 'expanded', 'future']")
                          td {{ model }}
                          td(data-th="Eligibility") {{ psiParams.eligibility[model] }}
                          td(data-th="Availability") {{ psiParams.availability.Metro[model] }}
                          td(data-th="DiversionRate") {{ psiParams.diversionRate[model] }}
                        tr
                          td <b>NonMetro</b>
                        tr(v-for="model in ['pragmatic', 'expanded', 'future']")
                          td {{ model }}
                          td(data-th="Eligibility") {{ psiParams.eligibility[model] }}
                          td(data-th="Availability") {{ psiParams.availability.NonMetro[model] }}
                          td(data-th="DiversionRate") {{ psiParams.diversionRate[model] }}
            .row.q-mb-lg.q-mt-lg
              q-card(style="width:800px; max-width: 90vw;")
                q-card-title Diversions
                q-card-separator
                q-card-main
                  p Rates are proportion of all stroke presentation.<br>Acuity measures the accepted duration of stroke symptoms (4, 6, 12h).<br>OpHours measures the proportion of the day that diversions are active (afterhours vs 24h).<br>Deficit measures the required clinical deficit (LAMS etc).<br>Mimics is 1.0 + ratio of mimics to stroke.
                  .row.justify-center(style="overflow:auto")
                    table.q-table-old
                      thead
                        tr
                          th
                          th Acuity
                          th OpHours
                          th Deficit
                          th Baseline
                          th Mimics
                      tbody
                        tr(v-for="model in ['pragmatic', 'expanded', 'future']")
                          td {{ model }}
                          td(data-th="Acuity") {{ diversionParams.acuity[model] }}
                          td(data-th="OpHours") {{ diversionParams.hours[model] }}
                          td(data-th="Deficit") {{ diversionParams.deficit }}
                          td(data-th="Baseline") {{ diversionParams.baselinefunction }}
                          td(data-th="Mimics") {{ diversionParams.mimics }}

      div(slot="export")
        | Year, StrokeNoRehab, StrokeWithRehab, TIA, Repatriations, WDHBRehab, HASUBedDays, ASUBedDays, RehabBedDays<br>
        span(v-for="year in tableYears") {{ year }}, {{ nADHBStroke(year) - nRehab(year) }}, {{ nRehab(year) }}, {{ nADHBTIA(year) }}, {{ nRepatriation(year) - nPSIIVTNegExternal(year) }}, {{ nWDHBUnder65(year) }}, {{ nHASUBedDays(year) }}, {{ nASUBedDays(year) }}, {{ nRehabBedDays(year) }} <br>

</template>

<script>
import MyLayout from 'components/MyLayout'
import FlowChartViewer from 'components/FlowChartViewer'
import CustomParamTable from './CustomParamTable'
import params from './userParams'
import fcNodes from './nodes'
import fcEdges from './edges'
import psimodels from './psimodels'
import diversionmodels from './diversionmodels'
import ivtmodels from './ivtmodels'
import populationmodels from './populationmodels'
import bedmodels from './bedmodels'
import {Chart} from 'highcharts-vue'

export default {
  name: 'beddays',
  components: {
    CustomParamTable,
    FlowChartViewer,
    MyLayout,
    highcharts: Chart
  },
  mixins: [
    params,
    fcNodes,
    fcEdges,
    psimodels,
    diversionmodels,
    ivtmodels,
    populationmodels,
    bedmodels
  ],
  data () {
    return {
      tableYears: [
        2018,
        2019,
        2020,
        2021,
        2022,
        2023,
        2024,
        2025,
        2026,
        2027,
        2028,
        2029,
        2030
      ],
      paramGroups: [
        {label: 'Populations', icon: 'people'},
        {label: 'Prehospital', icon: 'mdi-ambulance'},
        {label: 'ED', icon: 'mdi-hospital'},
        {label: 'Neuroradiology', icon: 'mdi-radioactive'},
        {label: 'HASU/ASU', icon: 'mdi-needle'},
        {label: 'Rehab', icon: 'favorite'},
        {label: 'Beds', icon: 'mdi-hotel'}
      ],
      showmodel: 'pragmatic',
      allmodels: [
        {value: 'pragmatic', label: 'Pragmatic'},
        {value: 'expanded', label: 'Expanded'},
        {value: 'future', label: 'Future'}
      ],
      year: 2018
    }
  },
  computed: {
    patientsChartData: function () {
      return {
        title: {text: 'Patients'},
        xAxis: {categories: this.tableYears},
        yAxis: {title: {text: 'Patients per year'}},
        series: [
          {name: 'PSI', data: this.tableYears.map(year => this.nPSI(year))},
          {
            name: 'Diversions',
            data: this.tableYears.map(year => this.nDiversions(year))
          }
        ]
      }
    },
    beddaysChartData: function () {
      return {
        title: {text: 'Bed Days'},
        xAxis: {categories: this.tableYears},
        yAxis: {title: {text: 'Bed Days per Year'}},
        series: [
          {
            name: 'HASU',
            data: this.tableYears.map(year => this.nHASUBedDays(year))
          },
          {
            name: 'ASU',
            data: this.tableYears.map(year => this.nASUBedDays(year))
          },
          {
            name: 'Rehab',
            data: this.tableYears.map(year => this.nRehabBedDays(year))
          },
          {
            name: 'Total',
            data: this.tableYears.map(
              year =>
                this.nHASUBedDays(year) +
                this.nASUBedDays(year) +
                this.nRehabBedDays(year)
            )
          }
        ]
      }
    },
    dischargesChartData: function () {
      return {
        title: {text: 'Discharges'},
        xAxis: {categories: this.tableYears},
        yAxis: {title: {text: 'Patients per year'}},
        series: [
          {
            name: 'Repatriations',
            data: this.tableYears.map(year => this.nRepatriation(year))
          },
          {
            name: 'TIA',
            data: this.tableYears.map(year => this.nADHBTIA(year))
          },
          {
            name: 'Stroke no Rehab',
            data: this.tableYears.map(
              year => this.nADHBStroke(year) - this.nRehab(year)
            )
          },
          {
            name: 'Stroke with Rehab',
            data: this.tableYears.map(year => this.nRehab(year))
          }
        ]
      }
    },
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
      return (
        this.nPASTAPosADHB(year) +
        this.getDiversions(year) +
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
      return (
        this.getDiversions(year) -
        this.nPSIDiversions(year) -
        this.nIVTDiversions(year)
      )
    },
    nPSIIVTNegADHB: function (year) {
      return (
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
    nRepatriation: function (year) {
      return this.nPSIIVTNegExternal(year) + this.nPSIIVTExternal(year)
    },
    nDischarge: function (year) {
      return (
        this.nPSIIVTExternal(year) +
        this.nADHBStroke(year) +
        this.nADHBTIA(year) +
        this.nWDHBUnder65(year)
      )
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
