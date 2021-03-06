<template>
  <ui-card class="ui-chart-card">
    <div class="ui-chart-data">
      <div class="ui-chart-title" v-if="selectedData">
        <div class="ui-chart-title__secondary">{{ title }}</div>
        <div class="ui-chart-title__primary">{{ valueFormatter(selectedData) }}</div>
        <div class="ui-chart-title__secondary">{{ timeFormatter(selectedData) }}</div>
      </div>

      <slot name="controls" />
    </div>

    <v-chart
      ref="chart"
      class="ui-chart"
      :option="spec"
      @highlight="highlight"
      @mouseover="highlight"
      @globalout="resetHighlight"
    />
  </ui-card>
</template>

<script>
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
    },
    valueFormatter: {
      type: Function,
      default: (v) => v,
    },
    timeFormatter: {
      type: Function,
      default: (v) => v,
    },
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
  },
  methods: {
    highlight(value) {
      if (value.componentSubType) {
        this.highlightIndex = value.dataIndex;
      } else {
        this.highlightIndex = value.batch[0].dataIndex;
      }
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

  &-card {
    padding: 16px 0;
    position: relative;
  }

  &-data {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    padding: 16px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    z-index: 2;
  }

  &-title {
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