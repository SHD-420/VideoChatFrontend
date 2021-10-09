<template>
  <div>
    <h1>Welcome to {{ roomId }}</h1>
    <ul>      
      <li v-for="user in waitingList" :key="user.socketId">
        <div class="d-flex">
          <p>{{ user.username }} wants to join room.</p>
        </div>
        <button class="primary" @click="addMember(user)">Accept</button>
      </li>
    </ul>
    <ul>
      <li v-for="member in members.values()" :key="member.identity.socketId">
        <video :srcObject.prop.camel="member.stream" autoplay></video>
      </li>
    </ul>
    <router-link :to="{ name: 'Home' }">Back </router-link>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";
import { WebSocketUser } from "@/plugins/WebSockets/types";
import { useWebSockets } from "@/plugins/WebSockets";

export default defineComponent({
  setup() {
    const store = useStore();
    const ws = useWebSockets();
    function addMember(member: WebSocketUser) {
      if (store.state.room.id) ws.acceptJoinReq(member.socketId, store.state.room.id);
    }
    return {
      addMember,
      members: computed(()=>store.state.room.members),
      roomId: computed(() => store.state.room.id),
      waitingList: computed(() => store.state.room.waitingMembers || []),
    };
  },
});
</script>

<style scoped>
</style>