<template>
  <v-navigation-drawer
    :model-value="visible"
    @update:model-value="(e) => emits('update:visible', e)"
    app
  >
    <v-list>
      <v-list-item to="/edit-profile">
        <v-list-item-title>Profile</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="PageMode === 'organizer'"
        @click="
          PageMode = 'participant';
          close();
        "
      >
        <v-list-item-title>Switch to visitor view</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="PageMode === 'participant'"
        @click="
          PageMode = 'organizer';
          close();
        "
      >
        <v-list-item-title>Switch to participant view</v-list-item-title>
      </v-list-item>
      <v-list-item @click="signOut">
        <v-list-item-title> Sign out </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { supabase } from "@/services/supabase";
import { PageMode } from "@/stores/pageMode";
const router = useRouter();

// see: https://next.vuetifyjs.com/en/components/navigation-drawers/

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
