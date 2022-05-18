export const OverviewTransactionsQuery = `
query OverviewTransactionsQuery {
  transactions(orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    burns {
      id
    }
    mints {
      id
      amount0
      amount1
    }
    swaps {
      amount0In
      amount0Out
      amount1In
      amount1Out
      from
      pair {
        token0Price
        token1Price
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
    }
  }
}
`