<template>
  <ui-card class="chart-card">
    <div class="chart-data" v-if="selectedData">
      <div class="chart-data__secondary">{{ title }}</div>
      <div class="chart-data__primary">{{ selectedData.totalTransactions }}</div>
      <div class="chart-data__secondary">{{ selectedDataTime }}</div>
    </div>
    <v-chart ref="chart" class="chart" :option="chartData" autoresize @highlight="highlight" @globalout="resetHighlight"/>
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
    },
    title: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      highlightIndex: 0,
    }
  },
  created() {
    this.resetHighlight();
  },
  computed: {
    selectedData() {
      return this.data[this.highlightIndex];
    },

    selectedDataTime() {
      return this.selectedData ? dayjs(this.selectedData.timestamp).format('MMM DD, YYYY') : '';
    },

    chartData() {
      return {
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
  },
  methods: {
    highlight(value) {
      this.highlightIndex = value.batch[0].dataIndex;
    },
    resetHighlight() {
      this.highlightIndex = this.data.length - 1;
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
  position: relative;

  .chart-data {
    position: absolute;
    top: 0px;
    left: 0px;
    padding: 16px;

    &__secondary {
      color: $gray4;
      font-weight: 500;
      font-size: 12px;
      line-height: 15px;
    }

    &__primary {
      color: $dark2;
      font-weight: 700;
      font-size: 20px;
      line-height: 24px;
    }
  }
}
</style>