<template>
  <div class="logo-pair">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'LogoPair',
};
</script>

<style lang="scss" scoped>
.logo-pair {
  display: flex;
  align-items: center;
}
</style>
