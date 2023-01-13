import dayjs from 'dayjs';

import SubgraphClient from './client';

import { OverviewTokensQuery, TokenPairsQuery, TokenQuery } from './query/tokens';
import { OverviewPairsQuery, PairQuery } from './query/pools';
import { TokensSearchQuery, PairsSearchQuery } from './query/search';
import { OverviewTransactionsQuery, TransactionsByPairsQuery } from './query/transactions';
import { OverviewFactoryDailyVolume } from './query/factory';

import { TransactionTypes } from '@/consts';

const calcChange = (current, last) => {
  const divider = last || current;

  return divider !== 0 ? (current - last) * 100 / divider : 0;
};

export const sortByTimestampAsc = (dayData) => [...dayData].sort((a, b) => a.timestamp - b.timestamp);

export const normalizeDayData = (dayData, overrideFields = []) => {
  if (!dayData.length) return [];

  const buffer = [];
  const diff = 24 * 60 * 60 * 1000;
  const now = dayjs().utc().startOf('day').unix() * 1000;

  let i = 0;

  for (let currentTimestamp = dayData[0].timestamp; currentTimestamp <= now; currentTimestamp += diff) {
    const curr = dayData[i];
    const prev = dayData[i - 1];

    if (prev && (!curr || curr.timestamp > currentTimestamp)) {
      const currUpdated = { ...prev, timestamp: currentTimestamp };

      overrideFields.forEach((field) => {
        currUpdated[field] = 0;
      })

      buffer.push(currUpdated);
    } else {
      buffer.push(curr);
      i++;
    }
  }

  return buffer;
};

class SubgraphExplorer {
  constructor() {
    this.client = SubgraphClient;
  }

  async request(query, vars = {}) {
    const { data } = await this.client.query(query, vars).toPromise();

    return data;
  }
};

class Tokens extends SubgraphExplorer {
  async getToken(vars) {
    try {
      const { token } = await this.request(TokenQuery, vars);

      return this.formatTokenData(token);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getTokens(vars) {
    try {
      const { tokens } = await this.request(OverviewTokensQuery, vars);

      return tokens.map(token => this.formatTokenData(token));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getTokenPairsIds(vars) {
    try {
      const { token } = await this.request(TokenPairsQuery, vars);

      return [...token.pairBase, ...token.pairQuote].map(pair => pair.id);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  formatTokenData(data) {
    // 7 days before
    const weekTimestamp = (dayjs().utc().startOf('day').unix() - 7 * 24 * 60 * 60) * 1000;
    // 14 days before
    const prevWeekTimestamp = weekTimestamp - 7 * 24 * 60 * 60 * 1000;
    // this day
    const dayTimestamp = dayjs().utc().startOf('day').unix() * 1000;
    // 1 day before
    const prevDayTimestamp = dayTimestamp - 24 * 60 * 60 * 1000;

    const sortedByTimestampAsc = sortByTimestampAsc(data.dayData.map(dayData => this.formatTokenDayData(dayData)));

    const dayData = normalizeDayData(sortedByTimestampAsc, ['tradeVolume', 'totalTransactions']);

    const price = Number(data.derivedUSD);
    const totalLiquidity = Number(data.totalLiquidity) * price;

    let priceChange = 0;
    let totalLiquidityChange = 0;
    let transactionsDay = 0;
    let transactionsWeek = 0;

    let tradeVolumeDay = 0;
    let tradeVolumeDayPrev = 0;
    let tradeVolumeDayChange = 0;
    let tradeVolumeWeek = 0;
    let tradeVolumeWeekPrev = 0;
    let tradeVolumeWeekChange = 0;
    let totalLiquidityDayPrev = 0;

    let pricePrevDay = 0;

    for (let i = 0; i < dayData.length; i++) {
      const item = dayData[i];

      if (item.timestamp < prevWeekTimestamp) continue;

      const tradeVolume = item.tradeVolume;
      const transactions = item.totalTransactions;

      if (item.timestamp < weekTimestamp) {
        tradeVolumeWeekPrev += tradeVolume;
      } else {
        tradeVolumeWeek += tradeVolume;
        transactionsWeek += transactions;
      }

      if (item.timestamp === prevDayTimestamp) {
        tradeVolumeDayPrev += tradeVolume;
        totalLiquidityDayPrev += item.totalLiquidity;
        pricePrevDay = item.price;
      } else if (item.timestamp === dayTimestamp) {
        tradeVolumeDay += tradeVolume;
        transactionsDay += transactions;
        priceChange = calcChange(price, pricePrevDay);
        totalLiquidityChange = calcChange(totalLiquidity, totalLiquidityDayPrev);
        tradeVolumeDayChange = calcChange(tradeVolumeDay, tradeVolumeDayPrev);
        tradeVolumeWeekChange = calcChange(tradeVolumeWeek, tradeVolumeWeekPrev);
      }
    }

    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      price,
      priceChange,
      totalLiquidity,
      totalLiquidityChange,
      tradeVolumeDay,
      tradeVolumeDayChange,
      tradeVolumeWeek,
      tradeVolumeWeekChange,
      transactionsDay,
      transactionsWeek,
      dayData,
    };
  }

  formatTokenDayData(dayData) {
    const price = Number(dayData.priceUSD ?? 0);
    const timestamp = Number(dayData.timestamp) * 1000;
    const totalLiquidityToken = Number(dayData.totalLiquidityToken ?? 0);
    const totalTransactions = Number(dayData.totalTransactions ?? 0);
    const tradeVolume = Number(dayData.dailyVolumeUSD ?? 0);
    const totalLiquidity = totalLiquidityToken * price;

    return {
      price,
      timestamp,
      tradeVolume,
      totalLiquidity,
      totalTransactions,
    };
  }
};

class Pairs extends SubgraphExplorer {
  async getPair(vars) {
    try {
      const { pair } = await this.request(PairQuery, vars);

      return this.formatPair(pair);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getPairs(vars) {
    try {
      const { pairs } = await this.request(OverviewPairsQuery, vars);

      return pairs.map(pair => this.formatPair(pair));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  formatPair(data) {
    // 7 days before
    const weekTimestamp = (dayjs().utc().startOf('day').unix() - 7 * 24 * 60 * 60) * 1000;
    // 14 days before
    const prevWeekTimestamp = weekTimestamp - 7 * 24 * 60 * 60 * 1000;
    // 1 day before
    const dayTimestamp = (dayjs().utc().startOf('day').unix() - 24 * 60 * 60) * 1000;
    // 2 days before
    const prevDayTimestamp = dayTimestamp - 24 * 60 * 60 * 1000;
    const sortedByTimestampAsc = sortByTimestampAsc(data.dayData.map(dayData => this.formatPairDayData(dayData)));

    const dayData = normalizeDayData(sortedByTimestampAsc, ['tradeVolume', 'totalTransactions']);

    const totalLiquidity = Number(data.reserveUSD ?? 0);
    const reserve0 = Number(data.reserve0 ?? 0);
    const reserve1 = Number(data.reserve1 ?? 0);
    const token0Price = Number(data.token0Price ?? 0);
    const token1Price = Number(data.token1Price ?? 0);

    let tradeVolumeDay = 0;
    let tradeVolumeDayPrev = 0;
    let tradeVolumeDayChange = 0;
    let tradeVolumeWeek = 0;
    let tradeVolumeWeekPrev = 0;
    let tradeVolumeWeekChange = 0;
    let totalLiquidityDayPrev = 0;

    let transactionsDay = 0;
    let transactionsWeek = 0;

    let totalLiquidityChange = 0;

    for (let i = 0; i < dayData.length; i++) {
      const item = dayData[i];

      if (item.timestamp < prevWeekTimestamp) continue;

      const tradeVolume = item.tradeVolume;
      const transactions = item.totalTransactions;

      if (item.timestamp < weekTimestamp) {
        tradeVolumeWeekPrev += tradeVolume;
      } else {
        tradeVolumeWeek += tradeVolume;
        transactionsWeek += transactions;
      }

      if (item.timestamp === prevDayTimestamp) {
        totalLiquidityDayPrev += item.totalLiquidity;
        tradeVolumeDayPrev += tradeVolume;
      } else if (item.timestamp >= dayTimestamp) {
        tradeVolumeDay += tradeVolume;
        transactionsDay += transactions;
        totalLiquidityChange = calcChange(totalLiquidity, totalLiquidityDayPrev);
        tradeVolumeDayChange = calcChange(tradeVolumeDay, tradeVolumeDayPrev);
        tradeVolumeWeekChange = calcChange(tradeVolumeWeek, tradeVolumeWeekPrev);
      }
    }

    return {
      id: data.id,
      name: data.name,
      token0: data.token0,
      token0Price,
      token1: data.token1,
      token1Price,
      reserve0,
      reserve1,
      totalLiquidity,
      totalLiquidityChange,
      tradeVolumeDay,
      tradeVolumeDayChange,
      tradeVolumeWeek,
      tradeVolumeWeekChange,
      transactionsDay,
      transactionsWeek,
      dayData
    };
  }

  formatPairDayData(dayData) {
    const timestamp = Number(dayData.timestamp) * 1000;
    const tradeVolume = Number(dayData.volumeUSD ?? 0);
    const totalLiquidity = Number(dayData.reserveUSD ?? 0);
    const totalTransactions = Number(dayData.totalTransactions ?? 0);

    return {
      timestamp,
      tradeVolume,
      totalLiquidity,
      totalTransactions,
    };
  }
};

class Factory extends SubgraphExplorer {
  async getVolumeDayData(vars) {
    try {
      const data = await this.request(OverviewFactoryDailyVolume, vars);

      const sortedByTimestampAsc = sortByTimestampAsc(data.factoryDayDatas.map(dayData => this.formatVolumeDayData(dayData)));

      return normalizeDayData(sortedByTimestampAsc, ['value']);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  formatVolumeDayData(dayData) {
    const volumeUntracked = +dayData.dailyVolumeUntracked;
    const volumeTracked = +dayData.dailyVolumeUSD;
    return {
      timestamp: +dayData.timestamp * 1000,
      value: volumeTracked + volumeUntracked,
    };
  }
}

class Transactions extends SubgraphExplorer {
  async getTransactions(vars) {
    try {
      const data = await this.request(OverviewTransactionsQuery, vars);

      return this.formatEvents(data);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getTransactionsByPairsIds(pairs = []) {
    try {
      const data = await this.request(TransactionsByPairsQuery, { pairs });

      return this.formatEvents(data);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  formatTransaction(tx) {
    return {
      id: tx.id,
      timestamp: +tx.timestamp * 1000,
    };
  }

  formatSwap(tx) {
    const from = tx.from;
    const idxFrom = Number(+tx.amount0In === 0);
    const idxTo = Number(!idxFrom);

    const amount0 = +tx[`amount${idxFrom}In`];
    const amount1 = +tx[`amount${idxTo}Out`];
    const token0 = tx.pair[`token${idxFrom}`];
    const token1 = tx.pair[`token${idxTo}`];
    const value = +tx.amountUSD;

    return {
      from,
      value,
      amount0,
      amount1,
      token0,
      token1,
      type: TransactionTypes.swap,
    };
  }

  formatMintOrBurn(tx, type) {
    const from = tx.to;
    const amount0 = +tx.amount0;
    const amount1 = +tx.amount1;
    const token0 = tx.pair.token0;
    const token1 = tx.pair.token1;
    const value = +tx.amountUSD;

    return {
      type,
      from,
      value,
      amount0,
      amount1,
      token0,
      token1,
    };
  }

  formatEvents({ swaps, mints, burns }) {
    const swapsData = swaps.map(item => ({ ...this.formatSwap(item), ...this.formatTransaction(item.transaction) }));
    const mintsData = mints.map(item => ({ ...this.formatMintOrBurn(item, TransactionTypes.add), ...this.formatTransaction(item.transaction) }));
    const burnsData = burns.map(item => ({ ...this.formatMintOrBurn(item, TransactionTypes.remove), ...this.formatTransaction(item.transaction) }));
  
    return [...swapsData, ...mintsData, ...burnsData].sort((a, b) => b.timestamp - a.timestamp);
  }
}

class Search extends SubgraphExplorer {
  async search(value) {
    const { byAddress: byTokenAddress, byName, bySymbol } = await this.request(TokensSearchQuery, { value });
    const tokensMap = [...byName, ...bySymbol, ...byTokenAddress].reduce((buffer, token) => ({
      ...buffer,
      [token.id]: token,
    }), {});

    const ids = Object.keys(tokensMap);

    const { byAddress: byPairAddress, byToken0, byToken1 } = await this.request(PairsSearchQuery, { ids });

    const pairsMap = [...byToken0, ...byToken1, ...byPairAddress].reduce((buffer, pair) => ({
      ...buffer,
      [pair.id]: pair,
    }), {});

    return {
      tokens: Object.values(tokensMap),
      pairs: Object.values(pairsMap),
    };
  }
}

export const TokensExplorer = new Tokens();
export const PairsExplorer = new Pairs();
export const TransactionsExplorer = new Transactions();
export const FactoryExplorer = new Factory();
export const SearchExplorer = new Search();
