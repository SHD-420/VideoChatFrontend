<template>
  <teleport to="#modals">
    <transition name="fade">
      <div class="expanded-layout" v-if="shouldShow">
        <div class="expanded-layout__top-bar">
          <button class="text-white sharp" @click="exitLayout">
            <font-awesome-icon icon="times"></font-awesome-icon>
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

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";
import { UserIdentity } from "@/plugins/RTC/types";
import BaseVideo from "./BaseVideo.vue";

export default defineComponent({
  components: { BaseVideo },
  props: {
    shouldShow: {
      type: Boolean,
      default: false,
    },
    activeMemberId: {
      type: String,
      default: "",
    },
  },
  emits: ["layout-change-requested"],
  setup(props, { emit }) {
    const store = useStore();
    const mediaState = computed(() => store.state.media);
    function exitLayout() {
      emit("layout-change-requested");
    }
    const activeMemberData = computed(
      () =>
        store.state.room.members.get(props.activeMemberId) || {
          isVideoEnabled: mediaState.value.isVideoEnabled,
          stream: mediaState.value.stream as MediaStream,
          identity: store.state.auth as UserIdentity,
        }
    );

    return { exitLayout, activeMemberData };
  },
});
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
    background-color: rgba($dark1, 0.5);
    button {
      background-color: rgba($dark1, 0.25);
      font-size: 1.25rem;
    }
  }
}
</style>
