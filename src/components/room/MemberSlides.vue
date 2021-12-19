<template>
  <ul class="member-slides py-xl">
    <li
      class="member-slides__item"
      v-for="member in members"
      :key="member"
      :class="{ 'member-slides__item--active': currentMember === member.id }"
    >
      <base-video
        :user="member.identity"
        :stream="member.stream"
        :isVideoEnabled="member.isVideoEnabled"
      ></base-video>
      <!-- <img src="@/assets/images/kakashi5.png" /> -->
      <button class="primary icon my-sm small" @click="pinMember(member)">
        <font-awesome-icon icon="arrow-up"></font-awesome-icon>
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { computed, defineComponent, ref, watch } from "vue";
import BaseVideo from "./BaseVideo.vue";
import { MemberData } from "@/types/roomTypes";

export default defineComponent({
  components: { BaseVideo },
  emits: ["member-pinned"],
  setup(_, { emit }) {
    const store = useStore();
    const storeMembers = computed(() => store.state.room.members);
    const members = ref<Array<MemberData>>([]);
    const currentMember = ref<string>();

    function pinMember(newMember: MemberData) {
      currentMember.value = newMember.id;
      emit("member-pinned", newMember);
    }

    watch(
      () => [...storeMembers.value],
      (newMembers) => {
        members.value = [];
        for (let [socketId, roomMember] of newMembers) {
          roomMember.dataChannel.on("videostatechange", (data) => {
            const member = members.value.find((m) => m.id === socketId);
            if (member) member.isVideoEnabled = data.newState === "on";
          });

          members.value.push({
            id: socketId,
            identity: roomMember.identity,
            stream: roomMember.stream,
            isVideoEnabled: false,
          });
        }
      }
    );

    return { members, pinMember, currentMember };
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
  background: $dark2;

  overflow-x: scroll;
  scrollbar-width: thin;
  scrollbar-color: rgba($light1,0.5) transparent;

  &::-webkit-scrollbar {
    background-color: transparent;
    height: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba($light3,0.25);
    border-radius: 2rem;
    &:hover {
      background-color: rgba($light1,0.5);
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