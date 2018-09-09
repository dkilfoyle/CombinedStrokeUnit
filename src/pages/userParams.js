import numeral from 'numeral'

export default {
  filters: {
    getHelper: function (param) {
      var x = ''
      if (param.type === undefined) {
        x = param.helper + ' (' + numeral(param.default).format('0%') + ')'
      } else {
        x = param.helper + ' (' + param.default + ')'
      }
      return x
    }
  },
  computed: {
    params: function () {
      return {
        ...this.poplnUserParams,
        ...this.psiUserParams,
        ...this.ivtUserParams,
        ...this.diversionUserParams,
        ...this.bedUserParams,
        pPASTAPos: {
          name: 'pPASTAPos',
          val: 0.3,
          default: 0.3,
          type: 'percent',
          group: 'ED',
          label: '% PASTA Positive',
          helper: '% of stroke that is PASTA Positive'
        },
        pRehab: {
          name: 'pRehab',
          val: 0.24,
          default: 0.24,
          type: 'percent',
          group: 'Rehab',
          label: '% Rehab',
          helper: '% of Stroke patients in ASU needing inpatient rehab',
          tip: 'From ADT145 data for neuro stroke discharges'
        },
        pPSIIVTNegHASU: {
          name: 'pPSINegHASU',
          val: 0.5,
          default: 0.5,
          type: 'percent',
          group: 'ED',
          label: '% PSI Neg to HASU',
          help: '% PASTA +ve/PSI&IVT -ve admitted to HASU vs ASU'
        }
      }
    }
  }
}
