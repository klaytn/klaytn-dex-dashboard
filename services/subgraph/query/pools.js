import { gql } from '@urql/core';

const PairFragment = gql`
  fragment PairFragment on Pair {
    id
    name
    reserve0
    reserve1
    reserveUSD
    token0Price
    token1Price
    volumeUSD
  }
`;

const PairDayDataFragment = gql`
  fragment PairDayDataFragment on PairDayData {
    timestamp
    volumeUSD
    reserveUSD
    totalTransactions
  }
`;

export const OverviewPairsQuery = gql`
query OverviewPairsQuery($first: Int = 50, $timestamp: Int, $where: Pair_filter) {
  pairs(orderBy: reserveUSD, orderDirection: desc, where: $where) {
    ...PairFragment
    dayData(orderBy: timestamp, orderDirection: desc, where: {timestamp_gte: $timestamp}) {
      ...PairDayDataFragment
    }
  }
}
${PairFragment}
${PairDayDataFragment}
`

export const PairQuery = gql`
query PairQuery($id: ID!) {
  pair(id: $id) {
    ...PairFragment
    token0 {
      id
      symbol
    }
    token1 {
      id
      symbol
    }
    dayData(first: 365, orderBy: timestamp, orderDirection: asc) {
      ...PairDayDataFragment
    }
  }
}
${PairFragment}
${PairDayDataFragment}
`;
