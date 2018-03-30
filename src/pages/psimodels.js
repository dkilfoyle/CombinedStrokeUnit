export default {
  data: function () {
    return {
      totalPopln: {
        metro: 1718002,
        nonmetro: 1118480
      },
      eligibility: {
        statusquo: 0.09,
        pragmatic: 0.11,
        expanded: 0.14,
        future: 0.19
      },
      availability: {
        metro: {
          statusquo: 0.725,
          pragmatic: 0.8,
          expanded: 0.9,
          future: 1.0
        },
        nonmetro: {
          statusquo: 0.13,
          pragmatic: 0.25,
          expanded: 0.6,
          future: 0.85
        }
      }
    }
  },
  methods: {
    getIschemic: function (year, popln) {
      // N_ischemic = totalpopln * adults * incidence * hospitalised * ischemic
      return (
        this.totalPopln[popln] *
        this.popGrowth ** (year - 2017) *
        0.8 *
        192 /
        100000 *
        0.86 *
        0.81
      )
    },
    getPSI: function (year, popln, model) {
      // N_psi = N_ischemic * elibility * availability
      return Math.round(
        this.getIschemic(year, popln) *
          this.eligibility[model] *
          this.availability[popln][model]
      )
    }
  }
}
