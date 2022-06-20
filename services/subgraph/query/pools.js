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

export const OverviewPoolsQuery = gql`
query OverviewPoolsQuery($first: Int = 50, $timestamp: Int, $where: Pair_filter) {
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
      symbol
    }
    token1 {
      symbol
    }
    dayData(first: 365, orderBy: timestamp, orderDirection: desc) {
      ...PairDayDataFragment
    }
  }
}
${PairFragment}
${PairDayDataFragment}
`;
