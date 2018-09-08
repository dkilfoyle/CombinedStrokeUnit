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
      future: 0.85
    }
  },
  diversionRate: {
    statusquo: 0.22, // first 12 months audit
    pragmatic: 0.22,
    expanded: 0.30, // expanded timeframe
    future: 0.30
  }
}

export default {
  data () {
    return {
      psiUserParams: {
        mPSI: {
          name: 'mPSI',
          val: 'pragmatic',
          default: 'pragmatic',
          group: 'Neuroradiology',
          label: 'PSI Model',
          helper: 'Number of PSI (all areas) / year',
          type: 'select',
          options: [{
            label: 'Status Quo',
            value: 'statusquo'
          },
          {
            label: 'Pragmatic',
            value: 'pragmatic'
          },
          {
            label: 'Expanded',
            value: 'expanded'
          },
          {
            label: 'Future',
            value: 'future'
          }
          ]
        }
      }
    }
  },
  methods: {
    getPSIByRegion: function (region, model, year) {
      // N_psi = N_ischemic * elibility * availability
      return Math.round(
        this.getIschemicAdultStrokeByRegion(region, year, this.params.popGrowth.val) *
        psiParams.eligibility[model] *
        psiParams.availability[region][model]
      )
    },
    nPSI: function (year) {
      return Math.round(
        this.getPSIByRegion('Metro', this.params.mPSI.val, year) +
        this.getPSIByRegion('NonMetro', this.params.mPSI.val, year)
      )
    },
    nPSIExternal: function (year) {
      return Math.round(
        this.getPSIByRegion('MetroNonADHB', this.params.mPSI.val, year) +
        this.getPSIByRegion('NonMetro', this.params.mPSI.val, year)
      )
    },
    nPSIDiversions: function (year) {
      return this.getDiversions(this.params.mDiversions.val, year) * psiParams.diversionRate[this.params.mDiversions.val]
    },
    nPSITransfer: function (year) {
      return this.nPSIExternal(year) - this.nPSIDiversions(year)
    },
    nPSIADHB: function (year) {
      return this.nPSI(year) - this.nPSIExternal(year)
    }

  }
}
