<template>
  <main class="layout">
    <header>
      <div class="col">
        <a href="#">
          <img src="~assets/svg/logo.svg" />
        </a>
      </div>
      <div class="col col-center">
        <Menu :items="links"></Menu>
      </div>

      <div class="col col-right">
        Search & button
      </div>
    </header>

    <Nuxt />
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
  padding: 40px 82px;

  & h1 {
    font-size: 30px;
  }

  & header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 82px;

    & .col {
      width: 33.33%;
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
}
</style>
