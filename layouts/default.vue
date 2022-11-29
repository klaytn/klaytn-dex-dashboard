<template>
  <main class="layout">
    <header>
      <div class="col">
        <div class="app-logo">
          <a :href="swapLink" class="app-logo-icon" />
          <NuxtLink class="app-logo-title" to="/">DEX Charts</NuxtLink>
        </div>
      </div>
      <div class="col col-center">
        <Menu :items="links"></Menu>
      </div>

      <div class="col col-right">
        <!-- <search-input v-model="query" placeholder="Search token/pool">
          <search-results :results="searchResults" />
        </search-input> -->
      </div>
    </header>

    <div class="layout-main">
      <Nuxt />
      <ui-scroll-top class="scroll-btn" />
    </div>
  </main>
</template>

<script>
import { SearchExplorer } from '@/services/subgraph/explorer';

import { ExchangeExplorer } from '@/utils/explorer';

export default {
  name: "KlayView",
  data() {
    return {
      query: '',
      searchResults: {},
    }
  },
  watch: {
    query: {
      handler: 'search',
    },
  },
  computed: {
    links() {
      return [
        {
          label: "Overview",
          link: "/",
          exact: true,
        },
        {
          label: "Pools",
          link: "/pools",
        },
        {
          label: "Tokens",
          link: "/tokens",
        },
      ]
    },
    swapLink() {
      return ExchangeExplorer.swapLink(this.token0Id, this.token1Id);
    },
  },
  methods: {
    async search(value) {
      if (!value) {
        this.searchResults = {};
      } else {
        this.searchResults = await SearchExplorer.search(value);
      }
    }
  },
}
</script>

<style scoped lang="scss">
.layout {
  padding: 32px 40px;

  @media screen and (max-width: $screen-sm) {
    padding: 16px 8px;
  }

  &-main {
    margin: auto;
    max-width: 1190px;
  }

  & h1 {
    font-size: 30px;
  }

  & header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 82px;

    @media screen and (max-width: $screen-md) {
      margin-bottom: 25px;
    }

    & .col {
      width: calc(100% / 3);
      display: flex;
    }

    & .col-center {
      justify-content: center;
    }

    & .col-right {
      justify-content: flex-end;
    }
  }

  .address {
    padding: 7px 12px;
    background: $white;
    font-style: normal;
    font-weight: 700;
    line-height: 150%;
    font-size: 12px;
    color: $dark;
    border-radius: 10px;
    display: flex;
    align-items: center;

    & svg {
      margin-right: 8px;
    }
  }

  .scroll-btn {
    position: fixed;
    bottom: 64px;
    right: 24px;
  }
}

.app-logo {
  display: flex;
  align-items: center;

  font-weight: 800;
  font-size: 22px;
  line-height: 1.5;
  color: $dark2;

  &-icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: $dark2;
  }

  &-title {
    margin-left: 6px;
    color: $dark2;

    @media screen and (max-width: $screen-md) {
      display: none;
    }
  }
}
</style>
