export const OverviewTokensQuery = `
query Tokens {
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