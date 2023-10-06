<template>
  <teleport to="#modals">
    <transition name="fade">
      <div class="expanded-layout" v-if="shouldShow">
        <div class="expanded-layout__top-bar">
          <button @click="exitLayout">
            <base-icon :icon="mdiClose" size="md" />
          </button>
        </div>
        <div class="expanded-layout__content" v-if="activeMemberData">
          <base-video
            :isVideoEnabled="activeMemberData.isVideoEnabled"
            :user="activeMemberData.identity"
            :isMuted="true"
            :stream="activeMemberData.stream"
          ></base-video>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/store";
import { UserIdentity } from "@/plugins/RTC/types";
import BaseVideo from "./BaseVideo.vue";
import BaseIcon from "../base/BaseIcon.vue";
import { mdiClose } from "@mdi/js";

const emit = defineEmits<(e: "layout-change-requested") => void>();

const props = defineProps<{ shouldShow?: boolean; activeMemberId?: string }>();

const store = useStore();
const mediaState = computed(() => store.state.media);

function exitLayout() {
  emit("layout-change-requested");
}
const activeMemberData = computed(
  () =>
    store.state.room.members.get(props.activeMemberId ?? "") || {
      isVideoEnabled: mediaState.value.isVideoEnabled,
      stream: mediaState.value.stream as MediaStream,
      identity: store.state.auth as UserIdentity,
    }
);
</script>

<style scoped lang="scss">
.expanded-layout {
  width: 100%;
  height: 100vh;
  @include overlap-children;
  z-index: 3;
  position: absolute;
  &__top-bar {
    width: 100%;
    align-self: flex-start;
    z-index: 1;
    background-color: map-get($gray,100);
  }
}
</style>
