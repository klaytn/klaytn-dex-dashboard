<template>
  <div>
    <PagesOverviewTokensTable :data="tokensData" />
  </div>
</template>

<script>
export default {
  name: "OverviewPage",
  data() {
    return {
      tokensData: [
        {
          name: 'ETH',
          price: 64.97,
          priceChange: 3.01,
          volume: 8.17,
          tvl: 8.17
        },
        {
          name: 'ETH',
          price: 64.97,
          priceChange: 3.01,
          volume: 8.17,
          tvl: 8.17
        }
      ]
    }
  }
}
</script>

