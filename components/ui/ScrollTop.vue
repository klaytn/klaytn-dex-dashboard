<template>
  <button class="ui-scroll-top" v-show="visible" @click="toTop">
    <icon class="ui-scroll-top-icon" name="union" />
  </button>
</template>

<script>
export default {
  name: 'UIScrollTop',
  data() {
    return {
      scTimer: 0,
      scY: 0,
      height: 0,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.height = window.innerHeight;
  },
  computed: {
    visible() {
      return this.scY > this.height;
    }
  },
  methods: {
    handleScroll() {
      if (this.scTimer) return;
      this.scTimer = setTimeout(() => {
        this.scY = window.scrollY;
        clearTimeout(this.scTimer);
        this.scTimer = 0;
      }, 100);
    },
    toTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.ui-scroll-top {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #FFFFFF;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  cursor: pointer;

  &-icon {
    transform: rotate(90deg);
  }
}
</style>