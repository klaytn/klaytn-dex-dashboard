import { gql } from '@urql/core';

export const OverviewFactoryTotalTransactions = gql`
query OverviewFactoryTotalTransactions {
  factoryDayDatas {
    timestamp
    totalTransactions
  }
}
`