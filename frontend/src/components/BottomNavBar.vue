<template>
  <v-bottom-navigation color="primary" grow app>
    <!--
    <v-btn to="/">
      <v-icon>mdi-home</v-icon>
      <span>Home</span>
    </v-btn>-->
    <v-btn to="/edit-profile">
      <span
        v-if="!auth.isRegistered"
        class="reminder bg-red text-white text-center"
        >!</span
      >
      <v-icon>mdi-account</v-icon>
      <span>{{ t("sidebar.profile") }}</span>
    </v-btn>
    <v-btn to="/matches">
      <v-icon>mdi-folder-heart</v-icon>
      <span>{{ t("sidebar.matches") }}</span>
    </v-btn>
    <v-btn to="/create-event">
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
</style>
