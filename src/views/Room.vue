<template>
  <div>
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

    <member-slides @member-pinned="pinMember"></member-slides>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "@/store";
import BaseVideo from "@/components/room/BaseVideo.vue";
import MemberSlides from "@/components/room/MemberSlides.vue";
import { MemberData } from "@/types/roomTypes";
import DefaultLayout from "@/components/room/DefaultLayout.vue";
import ExpandedLayout from "@/components/room/ExpandedLayout.vue";
import { onBeforeRouteLeave } from "vue-router";
import { ModalMutationTypes } from "@/store/modules/modal/types";

export default defineComponent({
  components: { BaseVideo, MemberSlides, DefaultLayout, ExpandedLayout },
  setup() {
    const store = useStore();
    const shouldShowExpanded = ref(false);
    const activeMember = ref<MemberData | null>(null);
    function pinMember(newMember: MemberData | null) {
      activeMember.value = newMember;
    }
    onBeforeRouteLeave((from, to, next) => {
      store.commit(ModalMutationTypes.SHOW_LEAVE_ROOM_CONFIRMATION, next);
    });
    return {
      roomId: computed(() => store.state.room.id),
      activeMember,
      pinMember,
      shouldShowExpanded,
    };
  },
});
</script>
