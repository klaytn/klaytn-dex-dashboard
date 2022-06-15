<template>
  <div>
    {{ $route.params.id }}

    <ui-container>
      <ui-title>
        <div>Top Pools</div>
      </ui-title>
      <shared-pools-table :token="id" />
    </ui-container>

    <ui-container>
      <ui-title>
        <div>Transactions</div>
      </ui-title>
      <shared-transactions-table :token="id" />
    </ui-container>
  </div>
</template>

<script>
export default {
  name: "TokenPage",
  computed: {
    id() {
      return this.$route.params.id;
    },
    filter() {
      return {
        token0: this.id
      }
    }
  }
}
</script>
