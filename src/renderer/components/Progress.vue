<template>
  <v-content>
    <v-layout id="main-content" row>
      <v-flex xs2></v-flex>
      <v-flex xs8>
        <v-card
          class="mb-5"
        >
        <v-layout align-baseline row>
          <h1>Downloading Files</h1>
        </v-layout>
        <v-progress-linear :indeterminate="true"></v-progress-linear>
        </v-card>
      </v-flex>
      <v-flex xs2></v-flex>
    </v-layout>
  </v-content>
</template>

<script>
  export default {
    name: 'progress',
  };
</script>

<style scoped>
 #main-content
  {
    margin-top: 2%;
  }
  </style>
