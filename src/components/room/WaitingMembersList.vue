<template>
  <div class="waiting-members text-white mb-xl" v-if="waitingMembers.length">
    <p class="text-center py-sm">
      <span class="mr-sm">Waiting ({{ waitingMembers.length }})</span>
      <span>
        <font-awesome-icon icon="caret-down"></font-awesome-icon>
      </span>
    </p>
    <ul class="waiting-members__list">
      <li
        class="d-flex waiting-members__item p-md my-xs"
        v-for="user in waitingMembers"
        :key="user.socketId"
      >
        <img class="mr-sm" :src="user.avatar" />
        <p>{{ user.username }}</p>
        <div class="flex-grow"></div>
        <button
          class="bg-fade-pr text-white"
          @click="acceptMember(user.socketId)"
        >
          <font-awesome-icon icon="plus"></font-awesome-icon>
        </button>
      </li>
    </ul>
    <div class="pb-xs bg-fade-pr"></div>
  </div>
  <p v-else class="empty-list text-center text-white py-sm">
    No members in waiting
  </p>
</template>

<script lang="ts">
import { useWebSockets } from "@/plugins/WebSockets";
import { useStore } from "@/store";
import { computed, defineComponent } from "vue";

export default defineComponent({
  setup() {
    const store = useStore();
    const ws = useWebSockets();
    const waitingMembers = computed(() => store.state.room.waitingMembers);
    return { waitingMembers, acceptMember: ws.acceptJoinReq };
  },
});
</script>

<style scoped lang="scss">
.waiting-members {
  &__item {
    align-items: center;
    border-top: 1px solid $dark1;
    background: $dark1;
    img {
      @include sqr(40px);
      border-radius: 50%;
    }
  }
}
.empty-list {
  opacity: 0.5;
}
</style>