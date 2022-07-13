import { gql } from '@urql/core';

export const OverviewFactoryDailyVolume = gql`
query OverviewFactoryDailyVolume {
  factoryDayDatas {
    timestamp
    dailyVolumeUSD
  }
}
`

export const OverviewFactoryTotalLiquidity = gql`
query OverviewFactoryTotalLiquidity {
  factoryDayDatas {
    timestamp
    totalLiquidityUSD
  }
}
`

export const PairDayDatas = gql`
query PairDayDatas {
  pairDayDatas(orderBy: timestamp, orderDirection: desc) {
    reserveUSD
    timestamp
    pair {
      id
    }
  }
}
`;