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
        ...this.bedUserParams
      }
    }
  }
}
