<template>
  <ul class="member-slides">
    <li
      class="member-slides__item"
      v-for="member in [...storeMembers,...storeMembers,...storeMembers]"
      :key="member.id"
      :class="{ 'member-slides__item--active': currentMemberId === member.id }"
    >
      <base-video
        :user="member.identity"
        :stream="member.stream"
        :isVideoEnabled="member.isVideoEnabled"
        :isSizeSmall="true"
      ></base-video>
      <button class="primary" @click="pinMember(member.id)">
        <base-icon :icon="mdiArrowUp" size="xs" />
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
import { computed, ref } from "vue";
import BaseVideo from "./BaseVideo.vue";
import { mdiArrowUp } from "@mdi/js";
import BaseIcon from "../base/BaseIcon.vue";

const emit = defineEmits<{
  (e: "member-pinned", d: string): void;
  (e: "self-pinned"): void;
}>();

const store = useStore();
const storeMembers = computed(() =>
  [...store.state.room.members].map(([id, member]) => ({ id, ...member }))
);
const currentMemberId = ref<string>("");

function pinMember(newMemberId: string) {
  currentMemberId.value = newMemberId;
  emit("member-pinned", newMemberId);
}
</script>

<style lang="scss" scoped>
.member-slides {
  margin-top: 1rem;
  padding: 0.5rem;
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: 160px;
  grid-auto-columns: 160px;
  column-gap: 0.25rem;

  overflow-x: scroll;
  scrollbar-width: thin;

  $scrollbar-color: rgba(map-get($gray, 200), 0.5);
  scrollbar-color: $scrollbar-color;

  &::-webkit-scrollbar {
    background-color: transparent;
    height: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $scrollbar-color;
    &:hover {
      background-color: map-get($gray, 200);
    }
  }
  &__item {
    @include overlap-children();
    grid-template-rows: 100%;
    border: 1px solid map-get($gray, 200);
    border-radius: 0.25rem;
    overflow: hidden;
    transition: 0.2s ease-in;
    z-index: 1;
    &--active {
      border: 1px solid map-get($gray, 400);
    }
    button {
      align-self: flex-end;
      justify-self: center;
      padding: 0.75rem;
      transition: 0.2s;
      transform: translateY(120%);
    }
    &:hover {
      button {
        transform: translateY(-20%);
      }
    }
  }
}
</style>
