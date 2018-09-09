const diversionParams = {
  catchment: {
    statusquo: 'WTK', // wtk
    pragmatic: 'MetroNonADHB', // wdhb + cmdhb
    expanded: 'MetroNonADHB', // wdhb + cmdhb
    future: 'MetroNonADHB' // wdhb + cmdhb
  },
  acuity: {
    statusquo: 0.49,
    pragmatic: 0.49, // from WDHB registry. From McMeekin = 81% known onset, 60% < 4h = 49%
    expanded: 0.82,
    future: 0.82
  },
  hours: {
    statusquo: 0.61,
    pragmatic: 0.61,
    expanded: 0.61,
    future: 1.0
  },
  deficit: 0.22, // Reeves et al = 44% NIHSS > 6 but PASTA is approximately twice as selective = 0.22
  baselinefunction: 0.79, // Basedline adequate function from Quinn et al
  mimics: 1.2 // 20% mimics
}

export default {
  data () {
    return {
      diversionUserParams: {
        yDiversionsExpandedStart: {
          name: 'yDiversionsExpandedStart',
          val: 2021,
          default: 2021,
          group: 'Prehospital',
          label: 'Diversion Expanded Year',
          helper: 'Year that diversions reach eExpanded model',
          type: 'number'
        },
        yDiversionsFutureStart: {
          name: 'yDiversionsFutureStart',
          val: 2025,
          default: 2025,
          group: 'Prehospital',
          label: 'Diversion Future Year',
          helper: 'Year that diversions reach Future model',
          type: 'number'
        }
        // mDiversions: {
        //   name: 'mDiversions',
        //   val: 'pragmatic',
        //   default: 'pragmatic',
        //   group: 'ED',
        //   label: 'Diversion Model',
        //   helper: 'Number of Ambulance Diversions from WDHB and CMDHB / year',
        //   tip: 'Pragmatic: acuity 49%, hours 61%.<br>Expanded: acuity 82%, hours 61%.<br>Future: acuity 82%, hours 100%.<br>All: 22% deficit, 79% mRS, mimics 1:5',
        //   type: 'select',
        //   options: [{
        //     label: 'Status Quo (6%, WTK)',
        //     value: 'statusquo'
        //   },
        //   {
        //     label: 'Pragmatic (6%, WDHB+CMDHB)',
        //     value: 'pragmatic'
        //   },
        //   {
        //     label: 'Expanded (10%, 0-24h duration)',
        //     value: 'expanded'
        //   },
        //   {
        //     label: 'Future (17%, 24/7)',
        //     value: 'future'
        //   }
        //   ]
        // }
      }
    }
  },
  methods: {
    pDiversionCriteria: function (model) {
      return diversionParams.acuity[model] *
        diversionParams.hours[model] *
        diversionParams.deficit *
        diversionParams.baselinefunction *
        diversionParams.mimics
    },
    getDiversions: function (year) {
      let interpolatedCriteria = 0
      if (year > this.params.yDiversionsFutureStart.val) {
        interpolatedCriteria = this.pDiversionCriteria('future')
      } else if (year > this.params.yDiversionsExpandedStart.val) {
        // interpolate expanded to future
        const yeardiff = year - this.params.yDiversionsExpandedStart.val
        const criteriadiff = this.pDiversionCriteria('future') - this.pDiversionCriteria('expanded')
        interpolatedCriteria = this.pDiversionCriteria('expanded') + criteriadiff * yeardiff / (this.params.yDiversionsFutureStart.val - this.params.yDiversionsExpandedStart.val)
      } else {
        // interpolate pragmatic to expanded
        const yeardiff = year - 2018
        const criteriadiff = this.pDiversionCriteria('expanded') - this.pDiversionCriteria('pragmatic')
        interpolatedCriteria = this.pDiversionCriteria('pragmatic') + criteriadiff * yeardiff / (this.params.yDiversionsExpandedStart.val - 2018)
      }
      return Math.round(
        this.getAllAdultStrokeByRegion('MetroNonADHB', year, this.params.popGrowth.val) * interpolatedCriteria
      )
    },
    nDiversions: function (year) {
      return this.getDiversions(year)
    }
  }
}
