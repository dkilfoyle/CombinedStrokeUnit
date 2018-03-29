import numeral from 'numeral'

var paramFilters = {
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
  }
}

export default paramFilters
