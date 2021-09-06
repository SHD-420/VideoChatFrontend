<template>
  <base-modal v-model="shouldShowModal">
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
  </base-modal>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { AvatarURLS, MutationTypes } from "@/store/types";
import { computed, defineComponent, ref, WritableComputedOptions } from "vue";

export default defineComponent({
  props: {
    shouldShow: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const shouldShowModalOptions: WritableComputedOptions<boolean> = {
      get(): boolean {
        return props.shouldShow;
      },
      set(newVal: boolean) {
        emit("update:should-show", newVal);
      },
    };

    return {
      shouldShowModal: computed(shouldShowModalOptions),
      ...useAuth(),
    };
  },
});

function useAuth() {
  const store = useStore();
  const currentName = ref(store.state.username);
  const currentAvatar = computed(() => store.state.avatar);
  function setAvatar(newAvatar: AvatarURLS) {
    store.commit(MutationTypes.SET_AVATAR, newAvatar);
  }
  function handleContinue() {
    if (currentName.value) {
      store.commit(MutationTypes.SET_USERNAME, currentName.value);
    }
  }
  return {
    setAvatar,
    handleContinue,
    currentAvatar,
    currentName,
    allAvatars: AvatarURLS,
  };
}
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