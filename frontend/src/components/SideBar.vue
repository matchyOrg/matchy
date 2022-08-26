<template>
  <v-navigation-drawer
    temporary
    :model-value="visible"
    @update:model-value="(e) => emits('update:visible', e)"
    app
  >
    <div class="mx-4 mt-6 mb-0 pb-0">
      <h2 class="font-weight-medium">Menu</h2>
      <h5 class="mb-4 text-grey font-weight-medium" style="margin-top: -0.1rem">
        current view: {{ PageMode }}
      </h5>
    </div>

    <v-list class="mt-1">
      <!-- edit profile -->
      <v-list-item to="/" prepend-icon="mdi-home">
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>

      <!-- edit profile -->
      <v-list-item to="/edit-profile" prepend-icon="mdi-account">
        <v-list-item-title>Account</v-list-item-title>
      </v-list-item>

      <!-- matches -->
      <v-list-item
        v-if="PageMode === 'participant'"
        to="/matches"
        prepend-icon="mdi-cards-playing-heart-multiple"
      >
        <v-list-item-title>Matches</v-list-item-title>
      </v-list-item>

      <!-- create event -->
      <v-list-item
        v-if="PageMode === 'organizer'"
        to="/create-event"
        prepend-icon="mdi-calendar-multiple-check"
      >
        <v-list-item-title>Create Event</v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <!-- switch to organizer view -->
      <div class="mx-2">
        <v-btn
          v-if="PageMode === 'participant'"
          @click="PageMode = 'organizer'"
          variant="flat"
          block
          color="grey-lighten-2"
        >
          <span style="font-size: 0.8rem; color: #616161">
            show organizer view
          </span>
        </v-btn>
      </div>

      <!-- switch to participant view -->
      <div class="mx-2">
        <v-btn
          v-if="PageMode === 'organizer'"
          @click="PageMode = 'participant'"
          variant="flat"
          block
          color="grey-lighten-2"
        >
          <span style="font-size: 0.8rem; color: #616161">
            show participant view
          </span>
        </v-btn>
      </div>

      <!-- sign out -->
      <div class="mx-2 mb-4 mt-4">
        <v-btn variant="flat" block @click="signOut" color="grey">
          <span style="font-size: 0.8rem; color: #fafafa"> sign out </span>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { supabase } from "@/services/supabase";
import { PageMode } from "@/stores/pageMode";
const router = useRouter();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

const close = () => {
  emits("update:visible", false);
};

function signOut() {
  supabase.auth.signOut();
  router.push("/");
}
</script>
