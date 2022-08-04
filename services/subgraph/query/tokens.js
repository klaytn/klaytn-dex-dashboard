import { gql } from '@urql/core';

export const OverviewTokensQuery = gql`
query OverviewTokensQuery($timestamp: Int) {
  tokens {
    id
    name
    symbol
    tradeVolume
    totalLiquidity
    derivedUSD
    dayData(first: 2, orderBy: timestamp, orderDirection: desc) {
      priceUSD
      timestamp
      totalLiquidityToken
      dailyVolumeUSD
      totalTransactions
    }
  }
}
`;

export const TokenQuery = gql`
query TokenQuery($id: ID!, $timestamp: Int) {
  token(id: $id) {
    id
    name
    symbol
    derivedUSD
    totalLiquidity
    dayData(first: 365, orderBy: timestamp, orderDirection: desc) {
      priceUSD
      timestamp
      totalLiquidityToken
      dailyVolumeUSD
      totalTransactions
    }
  }
}
`;

export const TokenPairsQuery = gql`
query TokenPairsQuery($id: ID!) {
  token(id: $id) {
    pairBase {
      id
    }
    pairQuote {
      id
    }
  }
}
`;
