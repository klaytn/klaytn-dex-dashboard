<template>
  <div class="ui-breadcrumbs">
    <template v-for="(item, index) in items">
      <nuxt-link :to="item.to" :key="index" :tag="item.disabled ? 'span' : 'a'">{{ item.name }}</nuxt-link>
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
  mounted() {
    console.log(this.$route)
  }
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