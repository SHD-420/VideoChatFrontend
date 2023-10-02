<template>
  <div class="home-view">
    <page-head></page-head>
    <hero-form
      @create-room-requested="createRoom()"
      @join-room-requested="(id) => joinRoom(id)"
    ></hero-form>
  </div>
</template>

<script lang="ts" setup>
import { useWebSockets } from "@/plugins/WebSockets";
import { useRouter } from "@/router";
import { RouteNames } from "@/router/types";
import { useStore } from "@/store";
import { ModalMutationTypes } from "@/store/modules/modal/types";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import PageHead from "@/components/home/PageHead.vue";
import HeroForm from "@/components/home/HeroForm.vue";

const route = useRoute();
const router = useRouter();
const store = useStore();
const ws = useWebSockets();

function prepareUser() {
  return new Promise<void>((resolve) => {
    store.commit(ModalMutationTypes.SHOW_AUTH_MODAL, () =>
      store.commit(ModalMutationTypes.SHOW_MEDIA_MODAL, () => resolve())
    );
  });
}

function joinRoom(roomId: string) {
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
.home-view {
}

</style>
