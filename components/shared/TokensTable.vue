<template>
  <ui-table
    v-loading="loading"
    :data="items"
    :page.sync="page"
    style="width: 100%"
  >
    <template v-slot="{ startIndex }">
      <el-table-column
        label="#"
        width="84"
      >
        <template v-slot="{ $index }">
          <span>{{ startIndex + $index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="Name"
      />

      <el-table-column
        prop="price"
        label="Price"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.price) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="priceChange"
        label="Price Change"
      >
        <template v-slot="{ row }">
          <span>{{ formatAmount(row.priceChange) }}%</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="tradeVolume"
        label="Volume 24H"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.tradeVolume) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="totalLiquidity"
        label="Total Deposited"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.totalLiquidity) }}</span>
        </template>
      </el-table-column>
    </template>
  </ui-table>
</template>

<script>
import dayjs from 'dayjs';

import SubgraphClient from '@/services/subgraph/client';
import { OverviewTokensQuery } from '@/services/subgraph/query/tokens';

import { formatAmount } from '@/utils/formatters';

const formatData = (data) => {
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
};

export default {
  name: "TokensTable",
  data() {
    return {
      items: [],
      loading: false,
      page: 1,
      formatAmount
    };
  },
  mounted() {
    this.updateData();
  },
  methods: {
     async updateData() {
      // two days before
      const timestamp = dayjs().startOf('hour').unix() - 2 * 24 * 60 * 60;
      const vars = { timestamp };
      try {
        this.loading = true;
        const { data: { tokens } } = await SubgraphClient.query(OverviewTokensQuery, vars).toPromise();
        this.items = tokens.map(data => formatData(data));
      } catch (error) {
        console.error(error);
        this.items = [];
      } finally {
        this.loading = false;
      }
    },
  }
}
</script>
