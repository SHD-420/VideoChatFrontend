<template>
  <div class="waiting-members" v-if="waitingMembers.length">
    <p class="waiting-members__title">
      <span class="mr-sm">Waiting ({{ waitingMembers.length }})</span>
      <base-icon :icon="mdiChevronDown" size="xs" />
    </p>
    <ul class="waiting-members__list">
      <li
        class="waiting-members__item"
        v-for="user in waitingMembers"
        :key="user.socketId"
      >
        <img class="mr-sm" :src="user.avatar" />
        <p>{{ user.username }}</p>
        <div class="flex-grow"></div>
        <button
          class="bg-fade-pr text-white"
          @click="ws.acceptJoinReq(user.socketId)"
        >
          <base-icon :icon="mdiPlus" size="xs" />
        </button>
      </li>
    </ul>
    <div class="pb-xs bg-fade-pr"></div>
  </div>
</template>

<script setup lang="ts">
import { useWebSockets } from "@/plugins/WebSockets";
import { useStore } from "@/store";
import { computed } from "vue";
import { mdiChevronDown, mdiPlus } from "@mdi/js";
import BaseIcon from "../base/BaseIcon.vue";

const store = useStore();
const ws = useWebSockets();
const waitingMembers = computed(() => store.state.room.waitingMembers);
</script>

<style scoped lang="scss">
.waiting-members {
  margin-bottom: 1rem;
  background-color: rgba(map-get($gray,200),0.25);
  padding: 0.5rem 1em;
  border-radius: 0.25rem;

  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  &__item {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(map-get($gray, 200), 0.5);
    }

    img {
      @include sqr(40px);
      border-radius: 50%;
      margin-right: 0.5rem;
    }
    button {
      margin-left: auto;
      padding: 0.5rem;
    }
  }
}
</style>
