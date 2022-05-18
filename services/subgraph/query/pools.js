export const OverviewPoolsQuery = `
query OverviewPoolsQuery {
  pairs {
    id
    name
    totalSupply
    token1Price
    token0Price
    reserve0
    reserve1
    dayData(first: 7, orderBy: timestamp, orderDirection: desc) {
      volumeToken0
      volumeToken1
    }
    hourData(first: 24, orderBy: timestamp, orderDirection: desc) {
      volumeToken0
      volumeToken1
    }
  }
}
`
