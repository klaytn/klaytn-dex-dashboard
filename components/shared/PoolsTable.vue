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
      >
        <template v-slot="{ row }">
          <nuxt-link :to="{ name: 'pools-id', params: { id: row.id } }">{{ row.name }}</nuxt-link>
        </template>
      </el-table-column>

      <el-table-column
        prop="tvl"
        label="TVL"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.tvl) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="dayVolume"
        label="Volume 24H"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.dayVolume) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="weekVolume"
        label="Volume 7D"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.weekVolume) }}</span>
        </template>
      </el-table-column>
    </template>
  </ui-table>
</template>

<script>
import dayjs from 'dayjs';

import SubgraphClient from '@/services/subgraph/client';
import { OverviewPoolsQuery } from '@/services/subgraph/query/pools';

import { formatAmount } from '@/utils/formatters';

const aggregate = (data, aggrProperty = 'hourData', volumeA = 'volumeToken0', volumeB = 'volumeToken1') => {
  return data[aggrProperty].reduce((buffer, item) => {
    buffer[volumeA] = buffer[volumeA] + Number(item[volumeA]);
    buffer[volumeB] = buffer[volumeB] + Number(item[volumeB]);
    return buffer;
  }, {
    [volumeA]: 0,
    [volumeB]: 0,
  });
};

const formatData = (data) => {
  const token0price = Number(data.token0.derivedUSD);
  const token1price = Number(data.token1.derivedUSD);

  const daily = aggregate(data, 'hourData');
  const weekly= aggregate(data, 'dayData');

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
};

export default {
  name: "PoolsTable",
  props: {
    token: {
      type: String,
      default: '',
    }
  },
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
      // 7 days before
      const dayTimestamp = dayjs().startOf('hour').unix() - 7 * 24 * 60 * 60;
      // 1 days before
      const hourTimestamp = dayjs().startOf('hour').unix() - 24 * 60 * 60;
      // common vars
      const vars = { dayTimestamp, hourTimestamp };
      // filter
      const whereClauses = this.token ? ['token0', 'token1'].map(attr => ({ [attr]: this.token })) : undefined;

      this.loading = true;

      if (whereClauses) {
        const pools = await Promise.all(whereClauses.map(where => this.getPools({ ...vars, where })));

        this.items = pools.flat();
      } else {
        this.items = await this.getPools(vars);
      }

      this.loading = false;
    },

    async getPools(vars) {
      try {
        const { data: { pairs } } = await SubgraphClient.query(OverviewPoolsQuery, vars).toPromise();
        return pairs.map(data => formatData(data));
      } catch (error) {
        console.error(error);
        return [];
      }
    }
  }
}
</script>
