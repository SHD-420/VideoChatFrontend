<template>
  <div class="sidebar">
    <div class="sidebar__topbar">
      <button @click="showSideBar()" class="sidebar__toggle text-white">
        <transition name="scale-fade">
          <span class="sidebar__badge" v-if="shouldShowBadge"></span>
        </transition>
        <base-icon :icon="mdiMenu" />
      </button>
    </div>
    <transition name="slide-x">
      <div class="sidebar__content" v-if="shouldShowSidebar">
        <button
          class="text-white sidebar__close-btn"
          @click="shouldShowSidebar = false"
        >
          <base-icon :icon="mdiArrowLeft" />
        </button>
        <div class="sidebar__room-info">
          <h4>
            <span class="text-light mr-sm">ID:</span>
            <span> {{ roomId }} </span>
          </h4>
          <p class="mt-sm">{{ membersCount }} members</p>
        </div>
        <div class="sidebar__btns">
          <button class="danger" @click="leaveRoom">
            <span>Leave</span>
            <base-icon :icon="mdiLogout" siz="xs" />
          </button>
          <button class="sidebar__join-link secondary" @click="copyJoinLink">
            <span>Copy join link</span>
            <base-icon :icon="mdiClipboardOutline" size="xs" />
          </button>
        </div>
        <waiting-members-list v-if="isMeOwner"></waiting-members-list>
        <members-list></members-list>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "@/store";
import { computed, ref, watch } from "vue";
import MembersList from "./MembersList.vue";
import WaitingMembersList from "./WaitingMembersList.vue";
import BaseIcon from "../base/BaseIcon.vue";
import { mdiLogout, mdiClipboardOutline, mdiArrowLeft, mdiMenu } from "@mdi/js";

const emit = defineEmits<(e: "leave-room-requested") => void>();

const shouldShowSidebar = ref(false);
const shouldShowBadge = ref(false);
function showSideBar() {
  shouldShowSidebar.value = true;
  shouldShowBadge.value = false;
}

const store = useStore();
const membersCount = computed(() => store.state.room.members.size);
const isMeOwner = computed(() => store.state.room.isMeOwner);
const roomId = computed(() => store.state.room.id);

watch(
  () => store.state.room.waitingMembers.length,
  () => shouldShowSidebar.value || (shouldShowBadge.value = true)
);

const leaveRoom = () => emit("leave-room-requested");

const joinLink = `${window.location.origin}?room=${roomId.value}`;
const copyJoinLink = () => navigator.clipboard.writeText(joinLink);
</script>

<style lang="scss" scoped>
.sidebar {
  &__topbar {
    background-image: linear-gradient(
      to right,
      rgba(map-get($gray, 200), 0.25),
      transparent
    );
  }

  &__toggle {
    @include overlap-children();
  }
  &__badge {
    @include sqr(0.5rem);
    background: $primary;
    border-radius: 50%;
    transform: translate(0.5rem, -0.5rem);
    justify-self: end;
  }

  &__content {
    z-index: 2;
    padding: 1rem;
    color: map-get($gray, 600);
    width: calc(100% - 1rem);
    height: 100%;
    position: fixed;
    top: 0;
    background: map-get($gray, 100);
    box-shadow: 8px 0 40px rgba(map-get($gray, 800), 0.5);

    button:not(.secondary, .danger) {
      margin-bottom: 1rem;
      padding: 0;
    }
  }

  &__room-info {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    p {
      margin-left: 0.5rem;
      color: map-get($gray, 400);
    }
  }

  &__btns {
    display: flex;
    margin-bottom: 1rem;
    button {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      &:last-child,
      :last-child {
        margin-left: 0.5rem;
      }
    }
  }
}
</style>