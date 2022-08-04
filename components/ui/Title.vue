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
  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  color: $dark2;
  padding: 8px 0px;

  & > *:not(:last-child) {
    margin-right: 8px;
  }

  @media screen and (min-width: $screen-md) {
    flex: 1;
  }
}
</style>
