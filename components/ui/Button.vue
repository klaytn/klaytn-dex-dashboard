<template>
  <button v-bind="$attrs" :class="['btn', { loading }]" v-on="$listeners">
    <icon v-if="icon" :name="icon" class="btn-icon"/>
    <span><slot></slot></span>
  </button>
</template>

<script>
export default {
  name: "KlayButton",
  props: {
    loading: {
      type: Boolean,
    },
    icon: {
      type: String
    },
  },
}
</script>

<style lang="scss" scoped>
.btn {
  display: flex;
  align-items: center;

  background: $blue;
  border: none;
  cursor: pointer;
  padding: 10px 20px;
  font-family: inherit;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: $white;
  border-radius: 8px;
  min-width: 100px;
  max-height: 40px;
  white-space: nowrap;

  &-icon + * {
    margin-left: 8px;
  }

  &.loading {
    background: #8fbafb;
    cursor: default;
    &:hover {
      background: #8fbafb;
    }
  }

  &:hover {
    background: #3684f9;
  }
  &:active {
    background: #0263f5;
  }
  &:disabled {
    background: $disabled;
    cursor: default;
  }
}
</style>
