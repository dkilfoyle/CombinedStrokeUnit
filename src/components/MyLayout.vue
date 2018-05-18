<template lang="pug">
  .row.gutter-md
    .col-sm-4
      q-scroll-area(style="height: calc(100vh - 114px);"  :thumb-style="{ left: '0px', width: '5px' }")
        slot(name="settings")
    .col-sm-8
      q-tabs(color="secondary" style="height: calc(100vh - 114px);")
        q-tab(default name="graph" slot="title" label="Flowchart" icon="mdi-sitemap")
        q-tab(name="table" slot="title" label="Table" icon="mdi-table")
        q-tab-pane(name="table")
          //- q-scroll-area(style="height: 73vh; padding:10px;"  :thumb-style="{ left: '0px', width: '5px' }")
          slot(name="table")
        q-tab-pane(name="graph")
          slot(name="graph")
</template>

<script>
export default {
  name: 'my-layout',
  data () {
    return {}
  }
}
</script>

<style>
.layout-padding {
  padding: 2em 2em;
}
</style>
