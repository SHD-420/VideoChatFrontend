<template>
  <ul class="member-slides py-xl">
    <li
      class="member-slides__item"
      v-for="member in storeMembers"
      :key="member.id"
      :class="{ 'member-slides__item--active': currentMemberId === member.id }"
    >
      <base-video
        :user="member.identity"
        :stream="member.stream"
        :isVideoEnabled="member.isVideoEnabled"
        :isSizeSmall="true"
      ></base-video>
      <button class="primary icon my-sm small" @click="pinMember(member.id)">
        <font-awesome-icon icon="arrow-up"></font-awesome-icon>
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { computed, defineComponent, ref } from "vue";
import BaseVideo from "./BaseVideo.vue";

export default defineComponent({
  components: { BaseVideo },
  emits: ["member-pinned", "self-pinned"],
  setup(_, { emit }) {
    const store = useStore();
    const storeMembers = computed(() =>
      [...store.state.room.members].map(([id, member]) => ({ id, ...member }))
    );
    const currentMemberId = ref<string>("");

    function pinMember(newMemberId: string) {
      currentMemberId.value = newMemberId;
      emit("member-pinned", newMemberId);
    }

    return { pinMember, currentMemberId, storeMembers };
  },
});
</script>

<style lang="scss" scoped>
.member-slides {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: 160px;
  grid-auto-columns: 160px;
  column-gap: 0.25rem;

  overflow-x: scroll;
  scrollbar-width: thin;
  scrollbar-color: rgba($light1, 0.5) transparent;

  &::-webkit-scrollbar {
    background-color: transparent;
    height: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba($light3, 0.25);
    border-radius: 2rem;
    &:hover {
      background-color: rgba($light1, 0.5);
    }
  }
  &__item {
    @include overlap-children();
    grid-template-rows: 100%;
    border-radius: 0.5rem;
    overflow: hidden;
    transition: 0.2s ease-in;
    z-index: 1;
    button {
      align-self: flex-end;
      justify-self: center;
      transition: 0.2s;
      transform: translateY(120%);
      z-index: 100;
    }
    &:hover {
      box-shadow: inset 0 0 0px 0.25rem rgba($primary, 0.75);
      button {
        transform: translateY(0);
      }
    }
  }
}
</style>
