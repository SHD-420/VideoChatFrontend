<template>
  <ul class="members-list text-white">
    <li
      v-for="(member, i) in members.values()"
      :key="i"
      class="member d-flex p-md"
    >
      <img :src="member.identity.avatar" class="member__avatar mr-md" />
      <p>{{ member.identity.username }}</p>
      <div class="flex-grow"></div>
      <button class="icon small" @click="removeMember(member.identity)">
        <font-awesome-icon icon="minus-circle"></font-awesome-icon>
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { ModalMutationTypes } from "@/store/modules/modal/types";
import { RoomMember } from "@/store/modules/room/types";
import { computed, defineComponent } from "vue";

export default defineComponent({
  emits: ["new-waiting-member"],
  setup() {
    const store = useStore();
    const members = computed(() => store.state.room.members);

    function removeMember(member: RoomMember) {
      // store.commit(ModalMutationTypes.SHOW_REMOVE_MEMBER_CONFIRMATION, {
      //   memberName: member.username,
      //   onConfirmed: () => console.log(`${member.username} removed`),
      // });
    }
    return { members, removeMember };
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