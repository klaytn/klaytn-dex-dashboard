import { gql } from '@urql/core';

export const OverviewPoolsQuery = gql`
query OverviewPoolsQuery($hourTimestamp: Int, $dayTimestamp: Int, $where: Pair_filter) {
  pairs(orderBy: reserveUSD, orderDirection: desc, where: $where) {
    id
    name
    totalSupply
    reserve0
    reserve1
    reserveUSD
    token0 {
      derivedUSD
    }
    token1 {
      derivedUSD
    }
    dayData(orderBy: timestamp, orderDirection: desc, where: {timestamp_gte: $dayTimestamp}) {
      volumeToken0
      volumeToken1
    }
    hourData(orderBy: timestamp, orderDirection: desc, where: {timestamp_gte: $hourTimestamp}) {
      volumeToken0
      volumeToken1
    }
  }
}
`
