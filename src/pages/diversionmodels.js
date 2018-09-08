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
        mDiversions: {
          name: 'mDiversions',
          val: 'pragmatic',
          default: 'pragmatic',
          group: 'ED',
          label: 'Diversion Model',
          helper: 'Number of Ambulance Diversions from WDHB and CMDHB / year',
          tip: 'Pragmatic: acuity 49%, hours 61%.<br>Expanded: acuity 82%, hours 61%.<br>Future: acuity 82%, hours 100%.<br>All: 22% deficit, 79% mRS, mimics 1:5',
          type: 'select',
          options: [{
            label: 'Status Quo (6%, WTK)',
            value: 'statusquo'
          },
          {
            label: 'Pragmatic (6%, WDHB+CMDHB)',
            value: 'pragmatic'
          },
          {
            label: 'Expanded (10%, 0-24h duration)',
            value: 'expanded'
          },
          {
            label: 'Future (17%, 24/7)',
            value: 'future'
          }
          ]
        }
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
    getDiversions: function (model, year) {
      return Math.round(
        this.getAllAdultStrokeByRegion(diversionParams.catchment[model], year, this.params.popGrowth.val) * this.pDiversionCriteria(model)
      )
    },
    nDiversions: function (year) {
      return Math.round(this.getDiversions(this.params.mDiversions.val, year))
    }
  }
}
