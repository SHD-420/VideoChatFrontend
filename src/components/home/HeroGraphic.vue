<template>
  <div class="graphic">
    <div class="graphic__img">
      <img src="@/assets/images/desktop-bg.jpg" />
    </div>
    <div class="graphic__bottom"></div>
  </div>
</template>

<style lang="scss" scoped>
.graphic {
  display: none;
  max-height: 90vh;
  &__img,
  &__bottom {
    border-radius: 2rem;
  }
  &__img {
    border-radius: 2rem;
    overflow: hidden;
  }

  &__bottom {
    background-image: linear-gradient(45deg, $dark1, rgba($dark1, 0.5));
    @include sqr(200px);
  }
}
@include media-queries.hero-graphic;
</style>
