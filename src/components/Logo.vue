<template>
    <div class="logo">
        <img src="@/assets/images/logo.svg"/>
        <p class="font-semibold">IALER</p>
    </div>
</template>

<style scoped lang="scss">
.logo {
    display: flex;
    align-items: center;
    color: map-get($gray, 400);
    img {
        @include sqr(1rem);
        margin-right: 0.25rem;
    }
}
</style>