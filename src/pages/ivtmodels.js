// const ivtParams = {
//   diversionRate: {
//     statusquo: 0.33, // first 12 months audit
//     pragmatic: 0.33,
//     expanded: 0.33,
//     future: 0.40 // better public awareness
//   }
// }

export default {
  data () {
    return {
      ivtUserParams: {
        pIVTOnly: {
          name: 'pIVTOnly',
          val: 0.04,
          default: 0.04,
          type: 'percent',
          group: 'ED',
          label: 'IVT Only',
          helper: '% of ischemic stroke having IVT without PSI'
        },
        pDiversionIVTOnly: {
          name: 'pDiversionIVTOnly',
          val: 0.11, // = 2 out of 18 in first 2 month audit
          default: 0.11,
          type: 'percent',
          group: 'ED',
          label: 'Diversions IVT Only',
          helper: '% of diversions having IVT without PSI'
        }
      }
    }
  },
  methods: {
    nIVTADHB: function (year) {
      return Math.round(this.nADHBStroke(year) *
        this.poplnParams.pIschemic *
        this.params.pIVTOnly.val)
    },
    nIVTDiversions: function (year) {
      return Math.round(this.nDiversions(year) * this.params.pDiversionIVTOnly.val)
    },
    nIVT: function (year) {
      return Math.round(this.nIVTDiversions(year) + this.nIVTADHB(year))
    },
    nIVTExternal: function (year) {
      return Math.round(this.nIVTDiversions(year))
    }
  }
}
