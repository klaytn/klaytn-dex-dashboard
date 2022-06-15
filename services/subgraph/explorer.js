import SubgraphClient from './client';

import { OverviewTokensQuery, TokenPairsQuery } from './query/tokens';
import { OverviewPoolsQuery } from './query/pools';
import { OverviewTransactionsQuery, TransactionsByPairsQuery } from '@/services/subgraph/query/transactions';

import { TransactionTypes } from '@/consts';

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
  async getTokens(vars) {
    try {
      const { tokens } = await this.request(OverviewTokensQuery, vars);

      return tokens.map(token => this.formatTokenData(token));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getTokenPairsIds(id) {
    try {
      const { token } = await this.request(TokenPairsQuery, { id });

      return [...token.pairBase, ...token.pairQuote].map(pair => pair.id);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  formatTokenData(data) {
    const tradeVolume = Number(data.dayData[0]?.dailyVolumeToken ?? 0);
    const totalLiquidity = Number(data.totalLiquidity);
    const price = Number(data.derivedUSD);
    const lastPrice = Number(data.dayData[1]?.priceUSD ?? 0);
    const priceChange = lastPrice !== 0 ? (price - lastPrice) * 100 / lastPrice : 0;

    return {
      ...data,
      price,
      priceChange,
      tradeVolume: tradeVolume * price,
      totalLiquidity: totalLiquidity * price,
    };
  }
};

class Pairs extends SubgraphExplorer {
  async getPairs(vars) {
    try {
      const { pairs } = await this.request(OverviewPoolsQuery, vars);

      return pairs.map(pair => this.formatPair(pair));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  formatPair(data) {
    const token0price = Number(data.token0.derivedUSD);
    const token1price = Number(data.token1.derivedUSD);

    const daily = this.aggregate(data, 'hourData');
    const weekly= this.aggregate(data, 'dayData');

    const dayVolume = daily.volumeToken0 * token0price + daily.volumeToken1 * token1price;
    const weekVolume = weekly.volumeToken0 * token0price + weekly.volumeToken1 * token1price;

    const tvl = Number(data.reserveUSD);

    return {
      id: data.id,
      name: data.name,
      tvl,
      dayVolume,
      weekVolume,
    };
  }

  aggregate(data, aggrProperty = 'hourData', volumeA = 'volumeToken0', volumeB = 'volumeToken1') {
    return data[aggrProperty].reduce((buffer, item) => {
      buffer[volumeA] = buffer[volumeA] + Number(item[volumeA]);
      buffer[volumeB] = buffer[volumeB] + Number(item[volumeB]);
      return buffer;
    }, {
      [volumeA]: 0,
      [volumeB]: 0,
    });
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
