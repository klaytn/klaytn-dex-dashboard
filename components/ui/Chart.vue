<template>
  <ui-card class="ui-chart-card">
    <div class="ui-chart-data" v-if="selectedData">
      <div class="ui-chart-data__secondary">{{ title }}</div>
      <div class="ui-chart-data__primary">{{ selectedDataValue }}</div>
      <div class="ui-chart-data__secondary">{{ selectedDataTime }}</div>
    </div>
    <v-chart
      ref="chart"
      class="ui-chart"
      :option="spec"
      @highlight="highlight"
      @globalout="resetHighlight"
    />
  </ui-card>
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: 'UIChart',
  props: {
    data: {
      type: Array,
      required: true,
    },
    spec: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      highlightIndex: 0,
      chartSpec: {},
    }
  },

  watch: {
    data: {
      handler: 'resetHighlight'
    },
  },

  mounted() {
    window.addEventListener('resize', this.onResize);
  },

  destroyed() {
    window.removeEventListener('resize', this.onResize);
  },

  computed: {
    selectedData() {
      return this.data[this.highlightIndex];
    },

    selectedDataValue() {
      return this.selectedData ? this.selectedData.value : 0;
    },

    selectedDataTime() {
      return this.selectedData ? dayjs(this.selectedData.timestamp).format('MMM DD, YYYY') : '';
    },
  },
  methods: {
    highlight(value) {
      console.log(value)
      this.highlightIndex = value.batch[0].dataIndex;
    },
    resetHighlight() {
      this.highlightIndex = this.data.length > 0 ? this.data.length - 1 : 0;
    },

    onResize() {
      this.$refs.chart.resize();
    },
  }
}
</script>

<style lang="scss">
.ui-chart {
  height: 400px;
  width: 100%;
}

.ui-chart-card {
  padding: 16px;
  position: relative;

  .ui-chart-data {
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