<template>
  <div class="ui-tags">
    <span
      :class="['tag', 'ui-tag', { 'is-primary': tag === value }]"
      v-for="tag in tags" :key="tag"
      @click="setValue(tag)"
    >
      {{ tag }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'UITags',
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: '',
    },
  },
  methods: {
    setValue(tag) {
      this.$emit('input', tag);
    },
  },
}
</script>

<style lang="scss" scoped>
.ui-tag {
  cursor: pointer;
  font-weight: 700;

  & + & {
    margin-left: 4px;
  }
}
</style>