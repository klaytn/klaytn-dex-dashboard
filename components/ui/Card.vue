<template>
  <div class="ui-card">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'UICard'
}
</script>

<style lang="scss" scoped>
.ui-card {
  display: flex;
  flex-flow: column nowrap;
  background: $white;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  overflow: hidden;
}
</style>
