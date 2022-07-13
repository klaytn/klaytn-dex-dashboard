import Vue from 'vue';
import ECharts from 'vue-echarts';
import { use } from 'echarts/core';

// import ECharts modules manually to reduce bundle size
import { CanvasRenderer } from 'echarts/renderers';

import { LineChart } from 'echarts/charts';
import { BarChart } from "echarts/charts"

import {
  TitleComponent,
  GridComponent,
  TooltipComponent,
} from 'echarts/components';

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, TitleComponent, LineChart, BarChart]);

// register globally (or you can do it locally)
Vue.component('v-chart', ECharts);