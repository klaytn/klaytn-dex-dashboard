<template>
  <ui-container>
    <ui-title>
      <div>Top Pools</div>
      <ui-link :to="{ name: 'pools' }">All pools</ui-link>
    </ui-title>
    <shared-pools-table />
  </ui-container>
</template>

<script>
export default {
  name: "PoolsPage"
}
</script>

