<template>
  <ui-card class="chart-card">
    <v-chart class="chart" :option="chartData" />
  </ui-card>
</template>

<script>
import dayjs from 'dayjs';
import { graphic } from 'echarts';

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
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.data.map(item => item.timestamp),
          axisLabel: {
            formatter(value) {
              return dayjs(+value).format('DD MMM')
            }
          },
          axisPointer: {
            show: true,
            type: 'line',
            animation: false,
            label: {
              show: false,
            },
            lineStyle: {
              color: '#ADB9CE',
              type: 'solid',
            }
          },
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        series: [
          {
            data: this.data.map(item => item.totalTransactions),
            type: 'line',
            showSymbol: false,
            itemStyle: {
              color: '#0263F5'
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#E3EDFC'
                },
                {
                  offset: 1,
                  color: '#E9F1FD'
                }]
              ),
            },
            emphasis: {
              disabled: true
            }
          },
        ],
      };
    }
  }
}
</script>

<style lang="scss">
.chart {
  height: 400px;
  width: 100%;
}

.chart-card {
  padding: 16px;
}
</style>