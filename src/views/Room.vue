<template>
  <div v-if="roomId">
    <expanded-layout
      :activeMember="activeMember"
      :shouldShow="shouldShowExpanded"
      @layout-change-requested="shouldShowExpanded = false"
    ></expanded-layout>

    <default-layout
      :activeMember="activeMember"
      @self-pinned="pinMember(null)"
      @layout-change-requested="shouldShowExpanded = true"
    ></default-layout>

    <member-slides
      @member-pinned="pinMember"
      @self-pinned="pinMember(null)"
    ></member-slides>
  </div>
</template>

<script lang="ts">
import DefaultLayout from "@/components/room/DefaultLayout.vue";
import ExpandedLayout from "@/components/room/ExpandedLayout.vue";
import MemberSlides from "@/components/room/MemberSlides.vue";
import { useWebSockets } from "@/plugins/WebSockets";
import { useStore } from "@/store";
import { ModalMutationTypes } from "@/store/modules/modal/types";
import { MemberData } from "@/types/roomTypes";
import { computed, defineComponent, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useRouter } from "@/router";
import { RouteNames } from "@/router/types";

export default defineComponent({
  components: { MemberSlides, DefaultLayout, ExpandedLayout },
  setup() {
    const store = useStore();
    const router = useRouter();
    const ws = useWebSockets();
    const roomId = computed(() => store.state.room.id);
    const shouldShowExpanded = ref(false);
    const activeMember = ref<MemberData | null>(null);
    function pinMember(newMember: MemberData | null) {
      activeMember.value = newMember;
    }

    

    if (!roomId.value) router.push({ name: RouteNames.Home });

    onBeforeRouteLeave((_, __, next) => {
      // show confirmation modal before leaving if user is in an existing room.
      if (roomId.value) {
        next(false);
        store.commit(ModalMutationTypes.SHOW_LEAVE_ROOM_CONFIRMATION, () => {
          ws.leaveRoom();
          router.push({ name: RouteNames.Home });
        });
      } else next();
    });

    return {
      roomId,
      activeMember,
      pinMember,
      shouldShowExpanded,
    };
  },
});
</script>
