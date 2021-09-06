<template>
  <div class="overview text-light text-secondary">
    <div class="overview__head">
      <h2 class="text-medium">An overview</h2>
      <p>
        This web service helps you to create rooms and use them. If you like you
        can share.
      </p>
    </div>
    <div class="overview__body">
      <ul>
        <li>
          <h4 class="text-medium">Join Room:</h4>
          <p>Join a video chat room providing a room id.</p>
        </li>
        <li>
          <h4 class="text-medium">Create room:</h4>
          <p>
            Create a new video chat room and receive a unique room id. Share
            that id with those whom you would like to join.
          </p>
        </li>
      </ul>
      <button class="primary" @click.prevent="$emit('go-up-clicked')">
        <font-awesome-icon icon="arrow-up"></font-awesome-icon>
      </button>
    </div>
  </div>
</template>


<style scoped lang="scss">
.overview {
  $x-spacing: 0 1.5rem;
  margin-bottom: 2rem;
  h2,h4{
    margin-bottom: 0.75rem;
  }
  &__head {
    margin: $x-spacing;
    margin-bottom: 4rem;
  }

  &__body {
    button{
      display: block;
      margin: auto;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      border-radius: 4rem;
    }
    ul {
      list-style-type: none;
      margin-bottom: 4rem;
      li {
        padding: $x-spacing;
        padding-left: 2.5rem;
        border-left: 4px solid $primary;
        margin: 1.5rem 0;
      }
    }
  }
}
@include media-queries.overview-section;
</style>