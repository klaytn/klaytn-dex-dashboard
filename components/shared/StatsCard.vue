<template>
  <ui-card>
    <div class="stats-card">
      <div class="stats-card-head">
        <div class="stats-card-title">
          <slot name="title" />
        </div>
        <div class="stats-card-buttons">
          <slot name="buttons" />
        </div>
      </div>
      <div class="stats-card-body">
        <div class="stats-card-column">
          <div class="stats-card-aside">
            <slot name="aside" />
          </div>
        </div>
        <div class="stats-card-column fullwidth">
          <div class="stats-card-content">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </ui-card>
</template>

<script>
export default {
  name: 'StatsCard'
}
</script>

<style lang="scss">
.stats-card {
  &-head {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid $gray5;

    @media screen and (max-width: $screen-md) {
      padding: 16px;

      & > *:not(:last-child) {
        margin-bottom: 16px;
      }
    }
  }

  &-aside {
    width: 100%;

    & > * {
      padding: 24px 0px;

      @media screen and (max-width: $screen-md) {
        padding: 8px 0px;
        display: flex;
        flex-flow: row wrap;
        align-items: flex-start;
      }

      &:not(:last-child) {
        border-bottom: 1px solid $gray5;
      }
    }
  }

  &-content {
    width: 100%;
    padding: 8px 0px;
  }

  &-title {
    display: flex;
    align-items: center;

    font-size: 20px;
    font-weight: 700;
    line-height: 24px;
    color: $dark2;

    @media screen and (max-width: $screen-md) {
      padding: 8px 0;
    }

    & > * {
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }

  &-body {
    display: flex;
    flex-flow: row nowrap;

    @media screen and (max-width: $screen-md) {
      flex-flow: row wrap;
    }
  }

  &-buttons {
    display: flex;
    flex-flow: row wrap;

    @media screen and (max-width: $screen-md) {
      & > *:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }

  &-buttons {
    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }

  &-column {
    display: flex;
    padding: 0 24px;

    @media screen and (max-width: $screen-md) {
      width: 100%;
      padding: 0px 8px;

      &:not(:last-child) {
        border-bottom: 1px solid $gray5;
      }
    }

    &.fullwidth {
      flex: 1;
    }

    & + & {
      border-left: 1px solid $gray5;
    }
  }
}
</style>