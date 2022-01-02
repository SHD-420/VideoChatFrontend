<template>
  <ul class="members-list text-white">
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
        class="icon small"
        @click="removeMember(member.identity.username, id)"
      >
        <font-awesome-icon icon="minus-circle"></font-awesome-icon>
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { useWebSockets } from "@/plugins/WebSockets";
import { useStore } from "@/store";
import { ModalMutationTypes } from "@/store/modules/modal/types";
import { computed, defineComponent } from "vue";

export default defineComponent({
  emits: ["new-waiting-member"],
  setup() {
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
    return { members, isMeOwner, removeMember };
  },
});
</script>

<style scoped lang="scss">
.member {
  align-items: center;
  background-color: $dark1;
  width: 100%;
  border-top: 1px solid $dark2;
  button {
    color: rgba($light3, 0.75);
    justify-self: flex-end;
    &:hover {
      background: $primary;
    }
  }
  &__avatar {
    @include sqr(60px);
    border-radius: 50%;
  }
}
</style>