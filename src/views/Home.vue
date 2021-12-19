<template>
  <div class="home-view">
    <hero-section
      ref="heroSection"
      @create-room-request="createRoom"
      @join-room-request="joinRoom"
    ></hero-section>
    <overview-section @go-up-clicked="goUp"></overview-section>
  </div>
</template>

<script lang="ts">
import HeroSection from "@/components/home/HeroSection.vue";
import OverviewSection from "@/components/home/OverviewSection.vue";
import { useWebSockets } from "@/plugins/WebSockets";
import { useRouter } from "@/router";
import { RouteNames } from "@/router/types";
import { useStore } from "@/store";
import { ModalMutationTypes } from "@/store/modules/modal/types";
import { defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  components: { HeroSection, OverviewSection },
  setup() {
    const heroSection = ref<InstanceType<typeof HeroSection> | null>(null);
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const ws = useWebSockets();
    const goUp = () => heroSection.value?.$el.scrollIntoView();

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

    return { goUp, heroSection, joinRoom, createRoom };
  },
});
</script>

<style scoped lang="scss">
@include media-queries.home-view;
</style>