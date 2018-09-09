const psiParams = {
  eligibility: {
    statusquo: 0.09,
    pragmatic: 0.11,
    expanded: 0.14,
    future: 0.19
  },
  availability: {
    Metro: {
      statusquo: 0.725,
      pragmatic: 0.8,
      expanded: 0.9,
      future: 1.0
    },
    MetroNonADHB: {
      statusquo: 0.725,
      pragmatic: 0.8,
      expanded: 0.9,
      future: 1.0
    },
    NonMetro: {
      statusquo: 0.13,
      pragmatic: 0.25,
      expanded: 0.6,
      future: 0.75
    }
  },
  diversionRate: {
    statusquo: 0.22, // first 12 months audit
    pragmatic: 0.22,
    expanded: 0.28, // expanded timeframe
    future: 0.33 // increase eligibility distal clots etc
  }
}

export default {
  data () {
    return {
      psiUserParams: {
        yPSIExpandedStart: {
          name: 'yPSIExpandedStart',
          val: 2021,
          default: 2021,
          group: 'Neuroradiology',
          label: 'PSI Expanded Year',
          helper: 'Year that diversions reach eExpanded model',
          type: 'number'
        },
        yPSIFutureStart: {
          name: 'yPSIFutureStart',
          val: 2030,
          default: 2030,
          group: 'Neuroradiology',
          label: 'PSI Future Year',
          helper: 'Year that diversions reach Future model',
          type: 'number'
        }
      }
    }
  },
  methods: {
    pPSICriteria: function (region, model) {
      return psiParams.eligibility[model] * psiParams.availability[region][model]
    },
    getPSIByRegion: function (region, year) {
      // N_psi = N_ischemic * elibility * availability
      let interpolatedCriteria = 0
      if (year > this.params.yPSIFutureStart.val) {
        interpolatedCriteria = this.pPSICriteria(region, 'future')
      } else if (year > this.params.yPSIExpandedStart.val) {
        // interpolate expanded to future
        const yeardiff = year - this.params.yPSIExpandedStart.val
        const criteriadiff = this.pPSICriteria(region, 'future') - this.pPSICriteria(region, 'expanded')
        interpolatedCriteria = this.pPSICriteria(region, 'expanded') + criteriadiff * yeardiff / (this.params.yPSIFutureStart.val - this.params.yPSIExpandedStart.val)
      } else {
        // interpolate pragmatic to expanded
        const yeardiff = year - 2018
        const criteriadiff = this.pPSICriteria(region, 'expanded') - this.pPSICriteria(region, 'pragmatic')
        interpolatedCriteria = this.pPSICriteria(region, 'pragmatic') + criteriadiff * yeardiff / (this.params.yPSIExpandedStart.val - 2018)
      }
      return Math.round(
        this.getIschemicAdultStrokeByRegion(region, year, this.params.popGrowth.val) * interpolatedCriteria
      )
    },
    nPSI: function (year) {
      return (
        this.getPSIByRegion('Metro', year) +
        this.getPSIByRegion('NonMetro', year)
      )
    },
    nPSIExternal: function (year) {
      return (
        this.getPSIByRegion('MetroNonADHB', year) +
        this.getPSIByRegion('NonMetro', year)
      )
    },
    nPSIDiversions: function (year) {
      let interpolatedCriteria = 0
      if (year > this.params.yPSIFutureStart.val) {
        interpolatedCriteria = psiParams.diversionRate.future
      } else if (year > this.params.yPSIExpandedStart.val) {
        // interpolate expanded to future
        const yeardiff = year - this.params.yPSIExpandedStart.val
        const criteriadiff = psiParams.diversionRate.future - psiParams.diversionRate.expanded
        interpolatedCriteria = psiParams.diversionRate.expanded + criteriadiff * yeardiff / (this.params.yPSIFutureStart.val - this.params.yPSIExpandedStart.val)
      } else {
        // interpolate pragmatic to expanded
        const yeardiff = year - 2018
        const criteriadiff = psiParams.diversionRate.expanded - psiParams.diversionRate.pragmatic
        interpolatedCriteria = psiParams.diversionRate.pragmatic + criteriadiff * yeardiff / (this.params.yPSIExpandedStart.val - 2018)
      }
      return Math.round(this.getDiversions(year) * interpolatedCriteria)
    },
    nPSITransfer: function (year) {
      return this.nPSIExternal(year) - this.nPSIDiversions(year)
    },
    nPSIADHB: function (year) {
      return this.nPSI(year) - this.nPSIExternal(year)
    }

  }
}
