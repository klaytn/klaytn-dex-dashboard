import { gql } from '@urql/core';

export const OverviewTokensQuery = gql`
query OverviewTokensQuery($first: Int = 50, $skip: Int = 0, $timestamp: Int) {
  tokens(first: $first, skip: $skip) {
    id
    name
    symbol
    tradeVolume
    totalLiquidity
    derivedUSD
    dayData(orderBy: timestamp, orderDirection: desc, where: {timestamp_gte: $timestamp}) {
      dailyVolumeToken
      priceUSD
    }
  }
}
`;