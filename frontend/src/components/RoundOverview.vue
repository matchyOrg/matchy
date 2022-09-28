<template>
  <v-row>
    <v-col cols="6" class="rounded-lg text-center">
      <v-sheet class="rounded-lg py-4" color="grey-lighten-5">
        <div class="d-block px-2 text-h5 font-weight-bold">
          <span v-if="usersInPairs !== undefined">{{ usersInPairs }}</span>
          <v-progress-circular v-else class="d-inline-block" indeterminate />
          /
          <span v-if="totalExpectedUsers !== undefined">
            {{ totalExpectedUsers }}
          </span>
          <v-progress-circular v-else class="d-inline-block" indeterminate />
        </div>
        <span class="d-block mb-4 text-body-2 text-grey">Users in pairs</span>
      </v-sheet>
    </v-col>
    <v-col cols="6" class="rounded-lg text-center">
      <v-sheet class="rounded-lg py-4" color="grey-lighten-5">
        <div class="d-block px-2 text-h5 font-weight-bold">
          <span v-if="votes !== undefined">{{ votes }}</span>
          <v-progress-circular v-else class="d-inline-block" indeterminate />
          /
          <span v-if="totalExpectedVotes !== undefined">
            {{ totalExpectedVotes }}
          </span>
          <v-progress-circular v-else class="d-inline-block" indeterminate />
        </div>
        <span class="d-block mb-4 text-body-2 text-grey">Users voted</span>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
defineProps<{
  votes?: number;
  totalExpectedVotes?: number;
  usersInPairs?: number;
  totalExpectedUsers?: number;
}>();
</script>
