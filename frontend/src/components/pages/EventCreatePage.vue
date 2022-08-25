<template>
  <v-main class="mx-9 d-flex flex-column">
    <v-form class="mt-8">
      <!-- title -->
      <v-text-field label="Title" />

      <!-- description -->
      <v-textarea
        label="Description"
        placeholder="Tell your audience about the event, the groups and the rules."
      />

      <!-- location -->
      <v-text-field label="Location" />

      <!-- groups -->
      <v-switch
        v-model="groups"
        label="Participants have 2 groups to choose from"
        color="green-lighten-3"
        value="true"
        hide-details
      ></v-switch>

      <div v-if="groups">NICE GROUPS LMFAO</div>

      <div class="d-flex justify-center mt-8">
        <!-- create button -->
        <v-btn
          class="mb-4"
          size="x-large"
          color="green"
          variant="tonal"
          append-icon="mdi-calendar-plus"
          rounded="pill"
          type="submit"
          minWidth="20rem"
        >
          create event
        </v-btn>
      </div>
    </v-form>
  </v-main>
</template>

<script setup lang="ts">
const groups = ref(false);
</script>
