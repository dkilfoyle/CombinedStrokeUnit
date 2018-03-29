<template lang="pug">
  .customParamTable
    h6(style="color:#757575") Custom Parameters
    table.q-table.horizonal-separator.bordered(style="margin-bottom: 20px")
      thead
        tr
          th Parameter
          th Default
          th Setting
      tbody
        tr
          td DHBs
          td
          td {{ population.dhbs.join(', ') }}
        tr(v-for="param in params" v-if="param.val !== param.default")
          td {{ param.label }}
          td {{ param.default | p }}
          td {{ param.val | p }}
        tr(v-if="Object.values(params).find(x => x.val === x.default) === undefined")
          td No custom parameters
</template>

<script>
import numeral from 'numeral'

export default {
  name: 'custom-param-table',
  components: {
  },
  props: ['params', 'population'],
  data () {
    return {
      numeral: numeral
    }
  },
  filters: {
    p: function (x) {
      return numeral(x).format('0%')
    }
  }
}
</script>

<style>
</style>
