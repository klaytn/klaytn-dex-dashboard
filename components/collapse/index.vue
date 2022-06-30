<template>
  <div class="collapse">
    <div class="collapse--head" @click="isOpen = !isOpen">
      <slot name="head"></slot>
      <div v-if="$slots.head" class="icon-wrap" :style="{transform: `rotate(${isOpen ? 180 : 0}deg)`}">
        <Icon name="collapse-arrow" />
      </div>
    </div>
    <div :class="['collapse--body', { closed: !isOpen }]">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "KlayCollapse",
  data() {
    return {
      isOpen: true,
    }
  },
}
</script>

<style scoped lang="scss">
.collapse {
  &--head {
    width: 100%;
    display: flex;
    align-items: center;
  }

  &--body {
    display: flex;
    flex-flow: column nowrap;

    @media screen and (max-width: $screen-md) {
      &.closed {
        display: none;
      }
    }
  }

  & .icon-wrap {
    margin-left: auto;
    display: flex;
  }

  @media screen and (min-width: $screen-md) {
    .icon-wrap {
      display: none;
    }
  }
}
</style>
