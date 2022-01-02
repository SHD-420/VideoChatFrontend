<template>
  <div class="sidebar">
    <div class="sidebar__topbar">
      <button @click="showSideBar()" class="sidebar__toggle text-white">
        <transition name="scale-fade">
          <span class="sidebar__badge" v-if="shouldShowBadge"></span>
        </transition>
        <font-awesome-icon icon="bars"></font-awesome-icon>
      </button>
    </div>
    <transition name="slide-x">
      <div class="sidebar__content" v-if="shouldShowSidebar">
        <button
          class="text-white sidebar__close-btn"
          @click="shouldShowSidebar = false"
        >
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>
        </button>
        <div class="bg-dark d-flex text-white">
          <div class="flex-grow py-md px-md">
            <h4>
              <span class="text-light mr-sm"> Room ID: </span>
              <span> {{ roomId }} </span>
            </h4>
            <p class="mt-sm">{{ membersCount }} members</p>
          </div>
          <button class="error large sharp" @click="leaveRoom">
            <font-awesome-icon icon="sign-out-alt"></font-awesome-icon>
          </button>
        </div>
        <p class="text-white">
          <small class="">{{ joinLink }}</small>
          <button class="primary py-sm ml-md" @click="copyJoinLink">
            <font-awesome-icon icon="clipboard"></font-awesome-icon>
          </button>
        </p>
        <waiting-members-list v-if="isMeOwner"></waiting-members-list>
        <members-list></members-list>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { computed, defineComponent, ref, watch } from "vue";
import MembersList from "./MembersList.vue";
import WaitingMembersList from "./WaitingMembersList.vue";

export default defineComponent({
  components: { MembersList, WaitingMembersList },
  emits: ["leave-room-requested"],
  setup(_, { emit }) {
    const store = useStore();
    const shouldShowSidebar = ref(false);
    const shouldShowBadge = ref(false);
    const roomId = computed(() => store.state.room.id);
    const joinLink = `${window.location.origin}?room=${roomId.value}`;
    watch(
      () => store.state.room.waitingMembers.length,
      () => shouldShowSidebar.value || (shouldShowBadge.value = true)
    );
    function showSideBar() {
      shouldShowSidebar.value = true;
      shouldShowBadge.value = false;
    }
    return {
      joinLink,
      shouldShowBadge,
      shouldShowSidebar,
      roomId,
      membersCount: computed(() => store.state.room.members.size),
      isMeOwner: computed(() => store.state.room.isMeOwner),
      showSideBar,
      leaveRoom: () => emit("leave-room-requested"),
      copyJoinLink: () => navigator.clipboard.writeText(joinLink),
    };
  },
});
</script>


<style lang="scss" scoped>
.sidebar {
  $self: &;
  &__topbar {
    background: rgba($dark1, 0.5);
  }

  &__toggle {
    @include overlap-children();
    #{$self}__badge {
      @include sqr(0.5rem);
      background: $primary;
      border-radius: 50%;
      transform: translate(0.5rem, -0.5rem);
      justify-self: end;
      box-shadow: 0 0 0 0.25rem rgba($primary, 0.5);
    }
  }

  &__content {
    z-index: 2;
    @include sqr();
    position: fixed;
    top: 0;
    background: $dark2;
  }
}
</style>