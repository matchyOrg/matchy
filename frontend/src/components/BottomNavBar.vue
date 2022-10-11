<template>
  <v-bottom-navigation color="primary" grow app>
    <!-- TODO: Make sure all buttons have the same width-->
    <v-btn to="/" class="same-width pl-0 pr-0">
      <v-icon>mdi-home</v-icon>
      <span>Home</span>
    </v-btn>
    <v-btn to="/edit-profile" class="same-width pl-0 pr-0">
      <span
        v-if="!auth.isRegistered"
        class="reminder bg-red text-white text-center"
        >!</span
      >
      <v-icon>mdi-account</v-icon>
      <span>{{ t("sidebar.profile") }}</span>
    </v-btn>
    <v-btn to="/matches" class="same-width pl-0 pr-0">
      <v-icon>mdi-folder-heart</v-icon>
      <span>{{ t("sidebar.matches") }}</span>
    </v-btn>
    <v-btn to="/create-event" class="same-width pl-0 pr-0">
      <v-icon>mdi-plus</v-icon>
      <span>{{ t("sidebar.create-event") }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";
const auth = useAuthStore();
const { t } = useI18n();
</script>

<style scoped>
.reminder {
  position: absolute;
  top: 6px;
  left: calc(50% + 9px);
  font-size: 10px;
  height: 12px;
  width: 12px;
  border-radius: 50%;
}

.same-width {
  flex: 1 1 0;
  width: 0;
}
</style>
