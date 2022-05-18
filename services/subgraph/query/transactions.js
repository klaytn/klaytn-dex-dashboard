export const OverviewTransactionsQuery = `
query OverviewTransactionsQuery ($first: Int = 50) {
  transactions(first: $first, orderBy: timestamp, orderDirection: desc) {
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
    mints {
      amount0
      amount1
      to
      pair {
        token0Price
        token1Price
        token0 {
          id
          symbol
        }
        token1 {
          symbol
          id
        }
      }
    }
  }
}
`