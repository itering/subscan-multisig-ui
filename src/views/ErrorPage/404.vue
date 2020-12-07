<template>
  <div class="error-page-wrapper subscan-content">
    <div class="subscan-container">
      <div class="not-found">
        <img class="not-found-img" src="./../../assets/images/404.png" alt="404" />
        <div class="no-data">{{$t('error.404')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  }
};
</script>
<style lang="scss" scoped>
.error-page-wrapper {
  flex: 1 1 auto;
  .search-input {
    height: 50px;
  }
  .not-found {
    padding: 10%;
    text-align: center;
    .not-found-img {
    }
    .no-data {
      font-size: 14px;
      font-weight: 600;
      color: rgba(152, 149, 159, 1);
    }
  }
}
</style>
