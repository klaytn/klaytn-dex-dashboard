<template>
  <div class="search-input">
    <el-input
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      clearable
      :value="value"
      @input="handleValue"
      @focus="handleFocus"
      @blur="handleBlur"
      class="search-input-field"
    />
    <div v-if="value && focus" class="search-input-results">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      focus: false,
    };
  },
  methods: {
    handleValue(value) {
      this.$emit('input', value);
    },
    handleFocus() {
      this.focus = true;
    },
    handleBlur() {
      this.focus = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.search-input {
  position: relative;

  &-results {
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    z-index: 100;
  }
}
</style>
