<template>
  <div :class="['value-difference', difference]">
    <icon class="value-difference-icon" name="triangle" />
    <span class="value-difference-value">{{ formattedValue }}%</span>
  </div>
</template>

<script>
import { formatAmount } from '@/utils/formatters';

export default {
  name: 'ValueDifference',
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    formattedValue() {
      return formatAmount(Math.abs(this.value));
    },
    difference() {
      if (this.value > 0) return 'positive';
      if (this.value < 0) return 'negative';
      return '';
    }
  }
}
</script>

<style lang="scss">
.value-difference {
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;
  color: $gray4;

  &-icon + &-value {
    margin-left: 4px;
  }

  &-value {
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
  }

  &.positive {
    color: $green;

    .svg-icon svg path {
      fill: $green;
    }
  }

  &.negative {
    color: $red;

    .svg-icon {
      transform: rotate(180deg);

      svg path {
        fill: $red;
      }
    }
  }

  .svg-icon svg path {
    fill: $gray4;
  }
}
</style>