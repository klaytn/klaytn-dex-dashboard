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
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid $gray5;
  }

  &-aside {
    & > * {
      padding: 24px 0px;

      &:not(:last-child) {
        border-bottom: 1px solid $gray5;
      }
    }
  }

  &-content {
    padding: 8px 0px;
  }

  &-title {
    font-size: 20px;
    font-weight: 700;
    line-height: 24px;
    color: $dark2;
  }

  &-body,
  &-buttons {
    display: flex;
    flex-flow: row nowrap;
  }

  &-buttons {
    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }

  &-column {
    padding: 0 24px;

    &.fullwidth {
      flex: 1;
    }

    & + & {
      border-left: 1px solid $gray5;
    }
  }
}
</style>