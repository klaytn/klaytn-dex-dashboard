<template>
  <main class="layout">
    <header>
      <div class="col">
        <a href="#" class="app-logo">
          <span class="app-logo-icon"></span>
          <span>DEX Charts</span>
        </a>
      </div>
      <div class="col col-center">
        <Menu :items="links"></Menu>
      </div>

      <div class="col col-right">
        <!-- <input /> -->
        <!-- Search & button -->
      </div>
    </header>

    <div class="layout-main">
      <Nuxt />
      <ui-scroll-top class="scroll-btn" />
    </div>
  </main>
</template>

<script>
export default {
  name: "KlayView",
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
  },
  methods: {},
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

    & + span {
      margin-left: 6px;

      @media screen and (max-width: $screen-md) {
        display: none;
      }
    }
  }
}
</style>
