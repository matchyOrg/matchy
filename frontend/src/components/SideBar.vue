<template>
  <v-navigation-drawer
    temporary
    :model-value="visible"
    @update:model-value="(e) => emits('update:visible', e)"
    app
  >
    <div class="mx-4 mt-6 mb-0 pb-0">
      <h2 class="font-weight-medium">{{ t("sidebar.menu-title") }}</h2>
      <h5 class="mb-4 text-grey font-weight-medium" style="margin-top: -0.1rem">
        {{ t("sidebar.current-view") }}: {{ t("pageMode." + PageMode) }}
      </h5>
    </div>
    <v-divider />

    <v-list class="mt-1">
      <!-- edit profile -->
      <v-list-item to="/" prepend-icon="mdi-home">
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>

      <!-- edit profile -->
      <v-list-item to="/edit-profile" prepend-icon="mdi-account">
        <v-list-item-title>{{ t("sidebar.profile") }}</v-list-item-title>
      </v-list-item>

      <!-- matches -->
      <v-list-item
        v-if="PageMode === 'participant'"
        to="/matches"
        prepend-icon="mdi-cards-playing-heart-multiple"
      >
        <v-list-item-title>{{ t("sidebar.matches") }}</v-list-item-title>
      </v-list-item>

      <!-- create event -->
      <v-list-item
        v-if="PageMode === 'organizer'"
        to="/create-event"
        prepend-icon="mdi-calendar-multiple-check"
      >
        <v-list-item-title>{{ t("sidebar.create-event") }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <!-- switch to organizer view -->
      <div class="mx-2">
        <v-btn
          @click="PageMode = getNextPageMode(PageMode)"
          variant="flat"
          block
          color="grey-lighten-2"
        >
          <span style="font-size: 0.8rem; color: #616161">
            {{
              t("sidebar.switch-view", {
                role: t("pageMode." + getNextPageMode(PageMode)),
              })
            }}
          </span>
        </v-btn>
      </div>

      <!-- sign out -->
      <div class="mx-2 mb-4 mt-4">
        <v-btn variant="flat" block @click="signOut" color="grey">
          <span style="font-size: 0.8rem; color: #fafafa">
            {{ t("sidebar.sign-out") }}
          </span>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { supabase } from "@/services/supabase";
import { PageMode, getNextPageMode } from "@/stores/pageMode";
import { useI18n } from "vue-i18n";
const router = useRouter();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

const { t } = useI18n();
function signOut() {
  supabase.auth.signOut();
  router.push("/");
}
</script>
