import dayjs from 'dayjs';
import { graphic } from 'echarts';

export const lineChartSpec = (chartData) => ({
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
    type: 'value',
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

export const barChartSpec = (chartData, formatter = (value) => value) => ({
  xAxis: {
    data: chartData.map(item => item.timestamp),
    axisLabel: {
      formatter
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisPointer: {
      show: true,
      animation: false,
      type: 'shadow',
      label: {
        show: false,
      },
      shadowStyle: {
        color: '#DFE4ED',
        shadowBlur: 0,
      },
      z: 1,
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
      emphasis: {
        itemStyle: {
          color: '#0263F5'
        },
      },
    }
  ]
});