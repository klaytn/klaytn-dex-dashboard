<template>
  <div class="ui-breadcrumbs">
    <template v-for="(item, index) in items">
      <component :is="item.disabled ? 'span' : 'nuxt-link'" :to="item.to" :key="index">
        <slot v-bind="item">
          {{ item.name }}
        </slot>
      </component>
      <icon v-if="index !== items.length - 1" :key="`arrow-${index}`" name="next" class="arrow" />
    </template>
  </div>
</template>

<script>
export default {
  name: 'UIBreadcrumbs',
  props: {
    items: {
      type: Array,
      default: () => ([]),
    },
  },
};
</script>

<style lang="scss" scoped>
.ui-breadcrumbs {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  font-size: 12px;
  font-weight: 500;
  line-height: 15px;

  margin-bottom: 13px;

  & > span {
    color: $gray4;
  }

  & > a {
    color: $dark2;
  }

  & > .arrow {
    padding: 0 8px;
  }
}
</style>