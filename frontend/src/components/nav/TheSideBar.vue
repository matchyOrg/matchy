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
        @click="(PageMode = 'organizer'), close()"
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
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const router = useRouter();

console.log(PageMode.value);

const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

const close = () => {
  emits("update:visible", false);
}

function signOut() {
  supabase.auth.signOut();
  router.push("/");
}
</script>
<style scoped>
.side-bar {
  left: max(calc((100vw - var(--mobile-l)) / 2), 0px);
  max-width: var(--mobile-l);
}

.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
