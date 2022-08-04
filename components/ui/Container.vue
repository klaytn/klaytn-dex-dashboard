<template>
  <div class="ui-container">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'UIContainer'
}
</script>

<style lang="scss" scoped>
.ui-container {
  margin-bottom: 24px;
}
</style>
