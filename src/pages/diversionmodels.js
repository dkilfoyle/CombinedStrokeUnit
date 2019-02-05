const diversionParams = {
  catchment: {
    statusquo: 'WTK', // wtk
    pragmatic: 'MetroNonADHB', // wdhb + cmdhb
    expanded: 'MetroNonADHB', // wdhb + cmdhb
    future: 'MetroNonADHB' // wdhb + cmdhb
  },
  acuity: {
    statusquo: 0.49,
    pragmatic: 0.49 * 0.9, // 0-4h from WDHB registry. From McMeekin = 81% known onset, 60% < 4h = 49%, reducing by 10% (*0.9) following 2018 audit
    expanded: 0.6 * 0.9, // 6h
    future: 0.75 * 0.9 // 12h
  },
  hours: {
    statusquo: 0.61, // after hours
    pragmatic: 0.61,
    expanded: 0.61,
    future: 1.0 // all hours
  },
  deficit: 0.44 * 0.9, // Reeves et al = 44% NIHSS > 6 but PASTA is approximately twice as selective = 0.22
  baselinefunction: 0.79 * 0.9, // Basedline adequate function from Quinn et al
  mimics: 1.14 // 20% mimics adjusted to 1.14 based on 14% mimics in first 4 months of 2018 citywide diversions
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
          helper:
            'Year that diversions reach Expanded model (symptom duration 6h)',
          type: 'number'
        },
        yDiversionsFutureStart: {
          name: 'yDiversionsFutureStart',
          val: 2025,
          default: 2025,
          group: 'Prehospital',
          label: 'Diversion Future Year',
          helper:
            'Year that diversions reach Future model (duration 12h, all day)',
          type: 'number'
        }
      }
    }
  },
  methods: {
    pDiversionCriteria: function (model) {
      return (
        diversionParams.acuity[model] *
        diversionParams.hours[model] *
        diversionParams.deficit *
        diversionParams.baselinefunction *
        diversionParams.mimics
      )
    },
    getDiversions: function (year) {
      // diversion models change abruptly based on policy
      let interpolatedCriteria = 0
      if (year > this.params.yDiversionsFutureStart.val) {
        console.log('future')
        interpolatedCriteria = this.pDiversionCriteria('future')
      } else if (year > this.params.yDiversionsExpandedStart.val) {
        console.log('expanded')
        interpolatedCriteria = this.pDiversionCriteria('expanded')
      } else {
        console.log('pragmatic')
        // interpolate pragmatic to expanded
        interpolatedCriteria = this.pDiversionCriteria('pragmatic')
      }
      console.assert(interpolatedCriteria <= 1.0, interpolatedCriteria)
      return Math.round(
        this.getAllAdultStrokeByRegion(
          'MetroNonADHB',
          year,
          this.params.popGrowth.val
        ) * interpolatedCriteria
      )
    },
    nDiversions: function (year) {
      return this.getDiversions(year)
    },
    percentDiversions: function (year) {
      return Math.round(
        (this.nDiversions(year) /
          this.getAllAdultStrokeByRegion(
            'MetroNonADHB',
            year,
            this.params.popGrowth.val
          )) *
          100,
        0
      )
    }
  }
}
