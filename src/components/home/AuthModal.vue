<template>
  <div class="auth-modal">
    <p class="text-secondary">
      Please enter a name and choose an avatar to continue
    </p>
    <input type="text" placeholder="Enter a name" v-model="currentName" />
    <div>
      <div class="auth-modal__field">
        <div class="auth-modal__avatar auth-modal__avatar--current">
          <img :src="currentAvatar" alt="Current Avatar" />
        </div>
        <div class="d-flex">
          <div
            v-for="(url, name) in allAvatars"
            :key="name"
            class="auth-modal__avatar"
            :class="{ 'auth-modal__avatar--active': url === currentAvatar }"
            @click="setAvatar(url)"
          >
            <img :src="url" :alt="name" />
          </div>
        </div>
      </div>
    </div>
    <button
      class="primary"
      :disabled="!currentName"
      @click.prevent="handleContinue"
    >
      Continue
    </button>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { AuthMutationTypes, AvatarURLS } from "@/store/modules/auth/types";

import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  emits: ["closed"],
  setup() {
    const store = useStore();
    const currentName = ref(store.state.auth?.username);
    const currentAvatar = computed(() => store.state.auth?.avatar);
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
    return {
      setAvatar,
      handleContinue,
      currentAvatar,
      currentName,
      allAvatars: AvatarURLS,
    };
  },
});
</script>

<style scoped lang="scss">
.auth-modal {
  display: grid;
  grid-auto-flow: row;
  row-gap: 1rem;
  padding: 2rem;
  &__field {
    width: max-content;
    margin: auto;
  }
  &__avatar {
    @include sqr(60px);
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    margin: 0.5rem;
    &--active {
      box-shadow: 0 0 16px $primary;
    }
    &--current {
      @include sqr(75px);
      margin: 2rem auto;
    }
  }
  button {
    margin-top: 2rem;
  }
}
</style>