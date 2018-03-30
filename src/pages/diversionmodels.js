export default {
  data: function () {
    return {
      totalPoplnDiversions: {
        statusquo: 217402, // wtk
        pragmatic: 1181415, // wdhb + cmdhb
        expanded: 1181415, // wdhb + cmdhb
        fuiture: 1181415 // wdhb + cmdhb
      },
      acuity: {
        statusquo: 0.52,
        pragmatic: 0.52,
        expanded: 0.82,
        future: 0.82
      },
      hours: {
        statusquo: 0.61,
        pragmatic: 0.61,
        expanded: 0.61,
        future: 1.0
      }
    }
  },
  methods: {
    getAllStroke: function (model) {
      // N_ischemic = totalpopln * adults * incidence * hospitalised * ischemic
      return this.totalPoplnDiversions[model] * 0.8 * 192 / 100000 * 0.86
    },
    getDiversions: function (model) {
      // N_diversions = allstroke * acuity * hours * deficit * mRS * mimics
      return (
        this.getAllStroke(model) *
        this.acuity[model] *
        this.hours[model] *
        0.44 *
        0.79 *
        1.25
      )
    }
  }
}
