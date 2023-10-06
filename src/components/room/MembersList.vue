<template>
  <ul>
    <li
      v-for="[id, member] in members.entries()"
      :key="id"
      class="member d-flex p-md"
    >
      <img :src="member.identity.avatar" class="member__avatar mr-md" />
      <p>{{ member.identity.username }}</p>
      <div class="flex-grow"></div>
      <button
        v-if="isMeOwner"
        class="secondary"
        @click="removeMember(member.identity.username, id)"
      >
        <base-icon :icon="mdiMinus" size="xs" />
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useWebSockets } from "@/plugins/WebSockets";
import { useStore } from "@/store";
import { ModalMutationTypes } from "@/store/modules/modal/types";
import { computed } from "vue";
import { mdiMinus } from "@mdi/js";
import BaseIcon from "../base/BaseIcon.vue";

const store = useStore();
const ws = useWebSockets();
const members = computed(() => store.state.room.members);
const isMeOwner = computed(() => store.state.room.isMeOwner);

function removeMember(memberName: string, memberId: string) {
  store.commit(ModalMutationTypes.SHOW_REMOVE_MEMBER_CONFIRMATION, {
    memberName,
    onConfirmed: () => ws.removeMember(memberId),
  });
}
</script>

<style scoped lang="scss">
.member {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid map-get($gray, 200);
  }

  &__avatar {
    @include sqr(48px);
    border-radius: 50%;
    margin-right: 1rem;
  }

  button {
    margin-left: auto;
    @include sqr(2rem);
    display: grid;
    place-content: center;
  }
}
</style>
