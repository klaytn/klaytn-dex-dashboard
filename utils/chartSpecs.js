import dayjs from 'dayjs';
import { graphic } from 'echarts';

export const factoryTvlChartSpec = (chartData) => ({
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: chartData.map(item => item.timestamp),
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
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
  },
  yAxis: {
    show: false,
    type: 'value'
  },
  series: [
    {
      data: chartData.map(item => item.value),
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
});

export const factoryVolumeChartSpec = (chartData) => ({
  xAxis: {
    data: chartData.map(item => item.timestamp),
    axisLabel: {
      formatter(value) {
        return dayjs(+value).format('DD MMM')
      }
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
  },
  yAxis: {
    show: false,
    type: 'value'
  },
  series: [
    {
      type: 'bar',
      data: chartData.map(item => item.value),
      itemStyle: {
        color: '#8FBAFB'
      },
      showBackground: true,
      backgroundStyle: {
        color: '#DFE4ED',
      },
      emphasis: {
        itemStyle: {
          color: '#0263F5'
        },
      },
    }
  ]
});