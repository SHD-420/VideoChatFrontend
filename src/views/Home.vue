<template>
  <main class="home">
    <img src="@/assets/images/globe.svg" />
    <section class="home__hero">
      <aside>
        <logo />
        <h1>Video calls on the Web</h1>
        <div class="home__shapes">
          <div class="home__square"></div>
          <div class="home__circle"></div>
          <svg
            class="home__triangle"
            width="40"
            height="40"
            viewBox="0 0 100 100"
          >
            <polygon
              points="0,0 100,50 0,100"
              fill="transparent"
              vector-effect="non-scaling-stroke"
              stroke="currentColor"
            />
          </svg>
        </div>
      </aside>
      <div class="home__actions">
        <p>Enter room code to join:</p>
        <form @submit.prevent="joinRoom()">
          <input
            type="text"
            placeholder="Enter code here"
            v-model="roomIdInput"
          />
          <button class="primary" :disabled="isRoomIdInValid">
            <base-icon :icon="mdiArrowRight" />
          </button>
        </form>
        <p>Or</p>
        <button class="primary" @click.prevent="createRoom">
          Create new room
        </button>
      </div>
    </section>
    <section class="info">
      <div class="info__bulb">
        <base-icon :icon="mdiLightbulb" />
      </div>
      <div class="info__bg"></div>
      <div class="info__spotlight"></div>
      <div class="info__text">
        <h4 class="font-bold">Video Calls <span>></span> Audio Calls</h4>
        <p>
          Seeing a person's face and surroundings fosters a deeper personal
          connection, enhancing intimacy and relationship-building, especially
          in professional or long-distance scenarios.
        </p>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import Logo from "@/components/Logo.vue";
import { useWebSockets } from "@/plugins/WebSockets";
import { useRouter } from "@/router";
import { RouteNames } from "@/router/types";
import { useStore } from "@/store";
import { ModalMutationTypes } from "@/store/modules/modal/types";
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import BaseIcon from "@/components/base/BaseIcon.vue";
import { mdiArrowRight, mdiLightbulb } from "@mdi/js";

const route = useRoute();
const router = useRouter();
const store = useStore();
const ws = useWebSockets();

const roomIdInput = ref("");
const isRoomIdInValid = computed(() => roomIdInput.value.length !== 6);

function prepareUser() {
  return new Promise<void>((resolve) => {
    store.commit(ModalMutationTypes.SHOW_AUTH_MODAL, () =>
      store.commit(ModalMutationTypes.SHOW_MEDIA_MODAL, () => resolve())
    );
  });
}

function joinRoom(id?: string) {
  const roomId = id ?? roomIdInput.value;

  prepareUser().then(() => {
    store.commit(ModalMutationTypes.SHOW_JOINING_MODAL);
    ws.joinRoom(roomId)
      .then(() => {
        store.commit(ModalMutationTypes.HIDE_MODAL);
        router.push({ name: RouteNames.Room });
      })
      .catch(() => {
        store.commit(ModalMutationTypes.SHOW_JOIN_ERROR_MODAL);
      });
  });
}

function createRoom() {
  prepareUser().then(() =>
    ws.createRoom().then(() => router.push({ name: RouteNames.Room }))
  );
}

onMounted(() => {
  const queryRoomId = route.query.room as string;
  if (queryRoomId) joinRoom(queryRoomId);
});
</script>

<style scoped lang="scss">
.home {
  display: grid;

  & > img,
  & > section:not(:last-child) {
    grid-column-start: 1;
    grid-row-start: 1;
  }

  img {
    @include sqr(512px);
    opacity: 0.1;
    transform: translate(-64px, -64px);
    z-index: -1;
  }

  &__hero {
    width: min(920px, 100%);
    padding: 0 2rem;
    margin: 4rem auto 0 auto;
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 3rem;
  }

  h1 {
    margin-top: 1.5rem;
    margin-bottom: 2.5rem;
    color: map-get($gray, 600);
  }

  &__shapes {
    display: flex;
    color: map-get($gray, 600);
  }
  &__square,
  &__circle {
    @include sqr(40px);
    border: 1px solid currentColor;
  }
  &__circle {
    border-radius: 50%;
    margin: 0 1.5rem;
  }

  &__actions {
    padding: 3rem 0;
    p {
      margin-bottom: 1rem;
      color: map-get($gray, 400);
    }
    form {
      margin-bottom: 4rem;
      border: 1px solid rgba(map-get($gray, 200), 0.5);
      width: max-content;
      border-radius: 0.25rem;
      padding: 0.25rem;
      display: flex;
      &:focus-within {
        box-shadow: 0 0 0 0.25rem rgba($primary, 0.25);
      }
      button {
        border-radius: 0;
        @include sqr(3rem);
        display: grid;
        place-content: center;
      }
    }
  }
}

.info {
  @include overlap-children;
  width: min(1024px, 100%);
  margin: auto;
  margin-bottom: 1rem;

  &__bulb,
  &__text {
    z-index: 1;
  }

  &__bulb {
    margin-left: 1rem;
    box-shadow: 0 2px 16px -8px rgba(map-get($gray, 800), 0.25);
    align-self: start;
    justify-self: start;
    @include sqr(3rem);
    display: grid;
    place-content: center;
    border-radius: 50%;
    color: $primary;
    transform: translateY(-50%);
    background-color: $primary-light;
  }

  &__spotlight {
    margin-left: 1rem;
    width: 200px;
    background-image: linear-gradient(-45deg, transparent, map-get($gray, 100));
    clip-path: polygon(0 0, 24% 0, 100% 100%, 25% 100%);
  }

  &__bg {
    background-image: linear-gradient(
      45deg,
      rgba($primary, 0.25),
      rgba(#438eff, 0.25)
    );
    border-radius: 0.25rem;
  }

  &__text {
    padding: 2rem 3rem;
    padding-left: 6rem;
    h4 {
      font-size: 1.5rem;
      color: map-get($gray, 400);
      margin-bottom: 0.5rem;
      span {
        color: $primary;
      }
    }
    p {
      color: map-get($gray, 600);
      line-height: 1.5;
    }
  }
}
</style>
