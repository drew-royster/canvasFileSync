<template>
  <v-content>
    <v-alert
      :value="true"
      color="error"
      icon="priority_high"
      outline
      dismissible
    >
      {{ error }}
    </v-alert>
  </v-content>
</template>

<script>

export default {
  name: 'Error',
  computed: {
    error() {
      return this.$store.getters.error;
    },
  },
};
</script>
