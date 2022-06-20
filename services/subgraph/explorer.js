import dayjs from 'dayjs';

import SubgraphClient from './client';

import { OverviewTokensQuery, TokenPairsQuery, TokenQuery } from './query/tokens';
import { OverviewPairsQuery, PairQuery } from './query/pools';
import { OverviewTransactionsQuery, TransactionsByPairsQuery } from '@/services/subgraph/query/transactions';

import { TransactionTypes } from '@/consts';

const calcChange = (current, last) => {
  const divider = last || current;

  return divider !== 0 ? (current - last) * 100 / divider : 0;
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
    const weekTimestamp = (dayjs().startOf('day').unix() - 7 * 24 * 60 * 60) * 1000;
    // 1 days before
    const dayTimestamp = (dayjs().startOf('day').unix() - 24 * 60 * 60) * 1000;

    const dayData = data.dayData.map(dayData => this.formatTokenDayData(dayData));
    const price = Number(data.derivedUSD);
    const totalLiquidity = Number(data.totalLiquidity) * price;

    let priceChange = 0;
    let totalLiquidityChange = 0;
    let transactionsDay = 0;
    let transactionsWeek = 0;
    let tradeVolumeDay = 0;
    let tradeVolumeWeek = 0;

    for (let i = 0; i < dayData.length; i++) {
      const item = dayData[i];

      if (item.timestamp < weekTimestamp) break;

      const tradeVolume = item.tradeVolume;
      const transactions = item.totalTransactions;

      tradeVolumeWeek += tradeVolume;
      transactionsWeek += transactions;

      if (item.timestamp >= dayTimestamp) {
        const lastPrice = item.price;
        const lastTotalLiquidity = item.totalLiquidity;

        tradeVolumeDay += tradeVolume;
        transactionsDay += transactions;
        priceChange = calcChange(price, lastPrice);
        totalLiquidityChange = calcChange(totalLiquidity, lastTotalLiquidity);
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
      tradeVolumeWeek,
      transactionsDay,
      transactionsWeek,
      dayData,
    };
  }

  formatTokenDayData(dayData) {
    const price = Number(dayData.priceUSD ?? 0);
    const timestamp = Number(dayData.timestamp) * 1000;
    const dailyVolumeToken = Number(dayData.dailyVolumeToken ?? 0);
    const totalLiquidityToken = Number(dayData.totalLiquidityToken ?? 0);
    const totalTransactions = Number(dayData.totalTransactions ?? 0);
    const tradeVolume = dailyVolumeToken * price;
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
    const weekTimestamp = (dayjs().startOf('day').unix() - 7 * 24 * 60 * 60) * 1000;
    // 2 days before
    const prevDayTimestamp = (dayjs().startOf('day').unix() - 2 * 24 * 60 * 60) * 1000;
    // 1 days before
    const dayTimestamp = (dayjs().startOf('day').unix() - 24 * 60 * 60) * 1000;

    const dayData = data.dayData.map(dayData => this.formatPairDayData(dayData));
    const totalLiquidity = Number(data.reserveUSD ?? 0);
    const reserve0 = Number(data.reserve0 ?? 0);
    const reserve1 = Number(data.reserve1 ?? 0);

    let tradeVolumeChange = 0;
    let totalLiquidityChange = 0;
    let transactionsDay = 0;
    let transactionsWeek = 0;
    let tradeVolumeDay = 0;
    let tradeVolumeWeek = 0;

    for (let i = 0; i < dayData.length; i++) {
      const item = dayData[i];

      if (item.timestamp < weekTimestamp) continue;

      const tradeVolume = item.tradeVolume;
      const transactions = item.totalTransactions;

      tradeVolumeWeek += tradeVolume;
      transactionsWeek += transactions;

      if (item.timestamp >= dayTimestamp) {
        const lastTotalLiquidity = item.totalLiquidity;

        tradeVolumeDay += tradeVolume;
        transactionsDay += transactions;
        totalLiquidityChange = calcChange(totalLiquidity, lastTotalLiquidity);
      } else if (item.timestamp >= prevDayTimestamp) {
        tradeVolumeChange = calcChange(tradeVolumeDay, tradeVolume);
      }
    }

    return {
      id: data.id,
      name: data.name,
      token0: data.token0,
      token1: data.token1,
      reserve0,
      reserve1,
      totalLiquidity,
      totalLiquidityChange,
      tradeVolumeDay,
      tradeVolumeWeek,
      tradeVolumeChange,
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

class Transactions extends SubgraphExplorer {
  async getTransactions(vars) {
    try {
      const { transactions } = await this.request(OverviewTransactionsQuery, vars);

      return transactions.map(tx => this.formatTransactionEvents(tx));
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

    const value = Math.max(
      amount0 * +token0.derivedUSD,
      amount1 * +token1.derivedUSD,
    );

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
    const value = amount0 * +tx.pair.token0.derivedUSD + amount1 * +tx.pair.token1.derivedUSD;

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

  formatTransactionEvents(data) {
    const attrs = this.formatTransaction(data);

    if (data.swaps.length !== 0) {
      const tx = this.formatSwap(data.swaps[0]);

      return {
        ...attrs,
        ...tx,
      }
    }

    if (data.mints.length !== 0 || data.burns.length !== 0) {
      const type = data.mints.length !== 0 ? TransactionTypes.add : TransactionTypes.remove;
      const prop = data.mints.length !== 0 ? 'mints' : 'burns';

      const tx = this.formatMintOrBurn(data[prop][0], type);

      return {
        ...attrs,
        ...tx,
      }
    }

    return null;
  }

  formatEvents({ swaps, mints, burns }) {
    const swapsData = swaps.map(item => ({ ...this.formatSwap(item), ...this.formatTransaction(item.transaction) }));
    const mintsData = mints.map(item => ({ ...this.formatMintOrBurn(item, TransactionTypes.add), ...this.formatTransaction(item.transaction) }));
    const burnsData = burns.map(item => ({ ...this.formatMintOrBurn(item, TransactionTypes.remove), ...this.formatTransaction(item.transaction) }));
  
    return [...swapsData, ...mintsData, ...burnsData].sort((a, b) => b.timestamp - a.timestamp);
  }
}

export const TokensExplorer = new Tokens();
export const PairsExplorer = new Pairs();
export const TransactionsExplorer = new Transactions();
