<template>
  <v-main>
    <template v-if="!matchyEvent">
      <div class="h-100 w-100 d-flex flex-column justify-center align-center">
        <v-progress-circular indeterminate />
        <span class="text-grey">{{
          t("pages.dashboard.prepare.loading-text")
        }}</span>
      </div>
    </template>
    <v-container v-else>
      <h2 class="mb-6">{{ matchyEvent.title }}</h2>
      <v-row v-if="matchyEvent.event_groups">
        <v-col cols="6" class="rounded-lg text-center">
          <v-sheet class="rounded-lg py-4" color="grey-lighten-5">
            <span class="d-block mb-4 font-weight-bold">{{
              matchyEvent.event_groups.groupA.title
            }}</span>
            <span
              class="d-block px-2 text-h5 font-weight-bold"
              v-if="groupACounts !== undefined"
              >{{ groupACounts.total }} / {{ totalRegisteredCount }}</span
            >
            <span class="d-block mb-4 text-body-2 text-grey">{{
              t("pages.dashboard.prepare.registered")
            }}</span>
            <span
              class="d-block px-2 text-h5 font-weight-bold"
              v-if="groupACounts !== undefined"
              >{{ groupACounts.present }} / {{ groupACounts.total }}</span
            >
            <span class="d-block pa-2" v-else>
              <v-progress-circular indeterminate />
            </span>
            <span class="d-block text-body-2 text-grey">{{
              t("pages.dashboard.prepare.present")
            }}</span>
          </v-sheet>
        </v-col>
        <v-col cols="6" class="text-center">
          <v-sheet class="rounded-lg py-4" color="grey-lighten-5">
            <span class="d-block mb-4 font-weight-bold">{{
              matchyEvent.event_groups.groupB.title
            }}</span>
            <span
              class="d-block text-h5 font-weight-bold"
              v-if="groupBCounts !== undefined"
              >{{ groupBCounts.total }} / {{ totalRegisteredCount }}</span
            >
            <span class="d-block mb-4 text-body-2 text-grey">{{
              t("pages.dashboard.prepare.registered")
            }}</span>
            <span
              class="d-block text-h5 font-weight-bold"
              v-if="groupBCounts !== undefined"
              >{{ groupBCounts.present }} / {{ groupBCounts.total }}</span
            >
            <span class="d-block pa-2" v-else>
              <v-progress-circular indeterminate />
            </span>
            <span class="d-block text-body-2 text-grey">{{
              t("pages.dashboard.prepare.present")
            }}</span>
          </v-sheet>
        </v-col>
      </v-row>
      <v-sheet v-else class="pa-4 d-flex align-center justify-space-around">
        <div class="text-center">
          <span
            class="d-block px-2 text-h5 font-weight-bold"
            v-if="totalPresentCount !== undefined"
            >{{ totalPresentCount }}</span
          >
          <span class="d-block pa-2" v-else>
            <v-progress-circular indeterminate />
          </span>
          <span class="d-block px-2">{{
            t("pages.dashboard.prepare.present")
          }}</span>
        </div>
        <div class="text-center">
          <span
            class="d-block px-2 text-h5 font-weight-bold"
            v-if="totalRegisteredCount !== undefined"
            >{{ totalRegisteredCount }}</span
          >
          <span class="d-block pa-2" v-else>
            <v-progress-circular indeterminate />
          </span>
          <span class="d-block px-2">{{
            t("pages.dashboard.prepare.registered")
          }}</span>
        </div>
      </v-sheet>
      <v-btn class="d-block mx-auto" @click="showStartModal = true">
        {{ t("pages.dashboard.prepare.start-event") }}
        <v-dialog v-model="showStartModal">
          <v-card>
            <v-card-text>
              {{ t("pages.dashboard.prepare.start-modal-text") }}
            </v-card-text>
            <v-card-actions>
              <v-btn color="red" variant="text" @click="showStartModal = false">
                {{ t("pages.dashboard.prepare.start-modal-cancel") }}
              </v-btn>
              <v-btn color="primary" variant="text" @click="startEvent">
                {{ t("pages.dashboard.prepare.start-modal-confirm") }}
              </v-btn>
            </v-card-actions>
          </v-card></v-dialog
        >
      </v-btn>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import {
  useEventService,
  type EventInfo,
  type EventRegistration,
  type GroupPair,
} from "@/services/eventService";
import { supabase } from "@/services/supabase";
import { useAuthStore } from "@/stores/auth";
import { useCurrentEventStore } from "@/stores/currentEvent";
import { useI18n } from "vue-i18n";

const authStore = useAuthStore();
const eventService = useEventService(authStore);
const currentEvent = useCurrentEventStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const matchyEvent = ref<EventInfo | null>(null);

const totalRegisteredCount = ref<number>();
const totalPresentCount = ref<number>();

interface GroupCount {
  total: number;
  present: number;
}
const groupACounts = ref<GroupCount>();
const groupBCounts = ref<GroupCount>();

const splitByGroup = async (
  registrations: EventRegistration[],
  groups: GroupPair
) => {
  const groupA = { total: 0, present: 0 };
  const groupB = { total: 0, present: 0 };
  registrations.forEach((reg) => {
    if (reg.group_id === groups.groupA.id) {
      groupA.total += 1;
      groupA.present += +reg.present;
    } else {
      groupB.total += 1;
      groupB.present += +reg.present;
    }
  });
  groupACounts.value = groupA;
  groupBCounts.value = groupB;
};

const showStartModal = ref(false);
const startEvent = async () => {
  if (!matchyEvent.value) return;
  const { error } = await supabase
    .from("events")
    .update({ is_started: true })
    .match({ id: matchyEvent.value.id });
  if (error) {
    console.log(error);
    throw error;
  }
  currentEvent.setCurrentId(matchyEvent.value.id);
  router.push("/events/" + matchyEvent.value.id + "/dashboard/ongoing");
};

onMounted(async () => {
  const idString = route.params.id;
  if (isNaN(+idString)) {
    errorToast(t("shared.events.invalid-id"));
    router.push("/");
    return;
  }
  matchyEvent.value = await eventService.fetchEventById(+idString);
  if (matchyEvent.value.organizer !== authStore.user?.id) {
    errorToast("Only the organizer can access this page");
    router.push("/");
  }
  const { data } = await supabase
    .from("event_registrations")
    .select("group_id, present")
    .eq("event_id", matchyEvent.value.id);
  if (data === null) {
    errorToast("There was a problem loading the registrations");
    return;
  }
  totalRegisteredCount.value = data.length;
  totalPresentCount.value = data.filter((reg) => reg.present).length;
  if (matchyEvent.value.event_groups)
    splitByGroup(data, matchyEvent.value.event_groups);
});
</script>
