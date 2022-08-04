<template>
  <ui-card class="search-results" v-if="results">
    <div class="search-results-group" v-if="results.tokens">
      <div class="group-title">Tokens</div>
      <div class="group-list">
        <div v-for="token in results.tokens" :key="token.id">
          {{ token.name }}
        </div>
      </div>
    </div>
    <div class="search-results-group" v-if="results.pairs">
      <div class="group-title">Pools</div>
      <div class="group-list">
        <div v-for="pair in results.pairs" :key="pair.id">
          {{ pair.name }}
        </div>
      </div>
    </div>
  </ui-card>
</template>

<script>
export default {
  name: 'SearchResults',
  props: {
    results: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss" scoped>
.search-results {
  padding: 16px;
}
</style>