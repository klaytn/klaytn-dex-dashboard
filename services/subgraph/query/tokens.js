export const OverviewTokensQuery = `
query OverviewTokensQuery {
  tokens {
    id
    name
    symbol
    tradeVolume
    totalLiquidity
    dayData(first: 1, orderBy: timestamp, orderDirection: desc) {
      dailyVolumeToken
    }
  }
}
`;