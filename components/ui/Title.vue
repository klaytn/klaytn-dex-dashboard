<template>
  <div class="ui-title">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'UITitle'
}
</script>

<style lang="scss" scoped>
.ui-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  color: $dark2;
  padding: 8px 0px;
}
</style>
