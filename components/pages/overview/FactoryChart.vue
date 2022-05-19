<template>
  <ui-card>
    <v-chart class="chart" :option="chartData" />
  </ui-card>
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: 'FactoryChart',
  props: {
    data: {
      type: Array,
      required: true,
    }
  },
  computed: {
    chartData() {
      return {
        title: {
          text: "Total Transactions",
          left: "center"
        },
        axisPointer: {
          show: true,
          type: 'line',
          animation: false,
          label: {
            show: false,
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.data.map(item => dayjs(item.timestamp).format('DD/MM/YYYY')),
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.data.map(item => item.totalTransactions),
            type: 'line',
            areaStyle: {}
          }
        ]
      };
    }
  }
}
</script>

<style lang="scss">
.chart {
  height: 400px;
}
</style>