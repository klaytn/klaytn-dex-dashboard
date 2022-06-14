<template>
  <nuxt-link class="ui-link" v-bind="$attrs" v-on="$listeners">
    <slot />
  </nuxt-link>
</template>

<script>
export default {
  name: 'UILink'
}
</script>

<style lang="scss" scoped>
.ui-link {
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
  color: $dark2;
}
</style>
