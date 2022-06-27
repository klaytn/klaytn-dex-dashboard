<template>
  <div class="logo-token" :style="style">
    <span v-if="!icon">{{ char }}</span>
  </div>
</template>

<script>
import whitelist from '@/assets/json/whitelist.json';

export default {
  name: "TokenLogo",
  props: {
    address: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 24,
    },
  },
  computed: {
    char() {
      return this.symbol ? this.symbol[0].toUpperCase() : '';
    },

    token() {
      return whitelist[this.address];
    },

    icon() {
      return this.token ? this.token.icon : '';
    },

    style() {
      const styles = {
        width: `${this.size}px`,
        height: `${this.size}px`,
        fontSize: `${this.size}px`,
      };

      if (this.icon) {
        styles.backgroundImage = `url(${this.icon})`;
        styles.backgroundColor = 'transparent';
      }

      return styles; 
    }
  }
};
</script>

<style lang="scss" scoped>
.logo-token {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: $gray5;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;

  & > span {
    font-size: 0.5em;
  }
}
</style>
