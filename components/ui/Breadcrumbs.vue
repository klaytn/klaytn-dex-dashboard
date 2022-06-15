<template>
  <div class="ui-breadcrumbs">
    <template v-for="(item, index) in items">
      <nuxt-link :to="item.to" :key="index">{{ item.name }}</nuxt-link>
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