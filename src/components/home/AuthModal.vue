<template>
  <div class="auth-modal">
    <p>Enter your name:</p>
    <input type="text" placeholder="Type here..." v-model="currentName" />
    <p>Pick an avatar:</p>
    <ul class="auth-modal__avatars">
      <li
        v-for="(url, name) in AvatarURLS"
        :key="name"
        class="auth-modal__avatar"
        :class="{ 'auth-modal__avatar--active': url === currentAvatar }"
        @click="setAvatar(url)"
        role="button"
        tabindex="0"
      >
        <span></span>
        <img :src="url" :alt="name" />
      </li>
    </ul>
    <button
      class="primary"
      :disabled="!currentName"
      @click.prevent="handleContinue"
    >
      Continue
    </button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
import { AuthMutationTypes, AvatarURLS } from "@/store/modules/auth/types";
import { computed, ref } from "vue";
import { mdiCheck } from "@mdi/js";

const emit = defineEmits<(e: "closed") => void>();

const store = useStore();
const currentName = ref(store.state.auth?.username);
const currentAvatar = computed(() => store.state.auth?.avatar as string);
function setAvatar(newAvatar: AvatarURLS) {
  store.commit(AuthMutationTypes.SET_AVATAR, newAvatar);
}
function handleContinue() {
  if (currentName.value) {
    store.commit(AuthMutationTypes.SET_USERNAME, currentName.value);
    const successHandler = store.state.modal.onSuccess;
    if (successHandler) successHandler();
  }
}
</script>

<style scoped lang="scss">
.auth-modal {
  padding: 2rem;
  padding-top: 0;

  min-width: 90vw;
  @include mq(sm) {
    min-width: 512px;
  }

  p {
    color: map-get($gray, 400);
    margin-bottom: 1rem;
  }
  input {
    border: 1px solid rgba(map-get($gray, 200), 0.5);
    width: 100%;
    border-radius: 0.25rem;
    margin-bottom: 3rem;
    &:focus {
      box-shadow: 0 0 0 0.25rem rgba($primary, 0.25);
    }
  }

  $avatar-diameter: 56px;
  $avatar-padding: 0.25rem;

  &__avatar {
    @include sqr($avatar-diameter);
    padding: $avatar-padding;
    cursor: pointer;
    opacity: 0.75;
    transition-property: transform;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);

    span {
      @include sqr(1rem);
      justify-self:end;
      background-color: $primary;
      transform: translate(50%, -50%);
      border-radius: 50%;
    }

    img {
      border-radius: 50%;
    }

    &:hover {
      opacity: 1;
    }
    &--active {
      opacity: 1;
      transform: scale(1.25);
      @include overlap-children;
    }
  }

  &__avatars {
    display: grid;
    place-items: center;
    grid-template-columns: repeat(
      auto-fit,
      calc($avatar-diameter + $avatar-padding * 2)
    );
  }

  button {
    margin-top: 3rem;
  }
}
</style>
