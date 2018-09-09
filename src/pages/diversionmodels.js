const diversionParams = {
  catchment: {
    statusquo: 'WTK', // wtk
    pragmatic: 'MetroNonADHB', // wdhb + cmdhb
    expanded: 'MetroNonADHB', // wdhb + cmdhb
    future: 'MetroNonADHB' // wdhb + cmdhb
  },
  acuity: {
    statusquo: 0.49,
    pragmatic: 0.49, // 0-4h from WDHB registry. From McMeekin = 81% known onset, 60% < 4h = 49%
    expanded: 0.60, // 6h
    future: 0.75 // 12h
  },
  hours: {
    statusquo: 0.61, // after hours
    pragmatic: 0.61,
    expanded: 0.61,
    future: 1.0 // all hours
  },
  deficit: 0.22, // Reeves et al = 44% NIHSS > 6 but PASTA is approximately twice as selective = 0.22
  baselinefunction: 0.79, // Basedline adequate function from Quinn et al
  mimics: 1.2 // 20% mimics
}

export default {
  data () {
    return {
      diversionParams,
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
      // diversion models change abruptly based on policy
      let interpolatedCriteria = 0
      if (year > this.params.yDiversionsFutureStart.val) {
        interpolatedCriteria = this.pDiversionCriteria('future')
      } else if (year > this.params.yDiversionsExpandedStart.val) {
        interpolatedCriteria = this.pDiversionCriteria('expanded')
      } else {
        // interpolate pragmatic to expanded
        interpolatedCriteria = this.pDiversionCriteria('pragmatic')
      }
      console.assert(interpolatedCriteria <= 1.0, interpolatedCriteria)
      return Math.round(
        this.getAllAdultStrokeByRegion('MetroNonADHB', year, this.params.popGrowth.val) * interpolatedCriteria
      )
    },
    nDiversions: function (year) {
      return this.getDiversions(year)
    },
    percentDiversions: function (year) {
      return Math.round(this.nDiversions(year) / this.getAllAdultStrokeByRegion('MetroNonADHB', year, this.params.popGrowth.val) * 100, 0)
    }
  }
}
