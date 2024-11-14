<template>
  <div class="flex justify-around p-4 buttons-container">
    <Button icon="pi pi-times" severity="secondary" text raised rounded class="round-button" @click="onTimesClick" />
    <Button 
      raised 
      rounded 
      :severity="isFriends ? 'warn': 'danger'" 
      class="px-10" 
      @click="onFilterClick"
    >
      {{ isFriends ? "Friend" : "Love" }}
    </Button>
    <Button icon="pi pi-heart" severity="danger" text raised rounded @click="onHeartClick" />
  </div>
</template>

<script>
import Button from 'primevue/button';

export default {
  name: "ButtonGroup",
  components: {
    Button,
  },
  data() {
    return {
      isFriends: false
    };
  },
  methods: {
    onHeartClick() {
      this.$emit('heart-clicked');
    },
    onTimesClick() {
      this.$emit('times-clicked');
    },
    onFilterClick(){
      this.isFriends = !this.isFriends;
      this.$emit('filter-clicked');
    }
  }
};
</script>


<style>
.round-button {
  width: 40px;
  height: 40px;
}

.buttons-container {
  width: 24rem;
}
</style>
