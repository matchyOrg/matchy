<template>
  <v-main>
    <v-container>
      <h2 v-if="!loadingEvent">{{ matchyEvent?.title }}</h2>
      <skeleton-loader v-else width="200" height="32" />
      <v-card
        class="mb-3 font-weight-bold"
        width="100%"
        height="200"
        color="#E0E0E0"
        elevation="0"
        v-if="matchyEvent?.header_image"
      >
        <v-img cover width="100%" :src="imageHeaderSrc" />
      </v-card>
      <div v-else class="mt-8"></div>

      <event-info
        :loading="loadingEvent"
        :location="matchyEvent?.location"
        :datetime="matchyEvent?.datetime"
      />
      <p v-if="!loadingEvent" class="mt-8">{{ matchyEvent?.description }}</p>

      <skeleton-loader v-else width="100%" :num-rows="2" />
      <v-divider class="my-4" />
      <div v-if="matchyEvent?.event_groups">
        <span class="d-block mb-4">{{ t("pages.events.groups-text") }}:</span>
        <span class="d-block font-weight-bold">{{
          matchyEvent.event_groups.groupA.title
        }}</span>
        <span
          class="d-block pl-4 mb-4"
          v-if="matchyEvent.event_groups.groupA.description"
          >{{ matchyEvent.event_groups.groupA.description }}</span
        >
        <span class="d-block pl-4 mb-4 text-grey" v-else>{{
          t("shared.events.no-description")
        }}</span>
        <span class="d-block font-weight-bold">{{
          matchyEvent.event_groups.groupB.title
        }}</span>
        <span
          class="d-block pl-4 mb-4"
          v-if="matchyEvent.event_groups.groupB.description"
          >{{ matchyEvent.event_groups.groupB.description }}</span
        >
        <span class="d-block pl-4 mb-4 text-grey" v-else>{{
          t("shared.events.no-description")
        }}</span>
      </div>
      <v-btn
        class="d-block mx-auto mt-8 mb-1 font-weight-bold"
        height="52"
        @click="onShare"
      >
        <v-icon class="mr-2" size="large">mdi-share-variant</v-icon>
        {{ t("pages.events.share-button-text") }}
      </v-btn>
      <span class="d-block text-center text-grey text-caption">{{
        authStore.user && authStore.user.id === matchyEvent?.organizer
          ? t("pages.events.share-hint-organizer")
          : t("pages.events.share-hint-participant")
      }}</span>
      <registration-overview
        v-if="isOrganizer"
        :event_groups="matchyEvent?.event_groups"
        :group-a-counts="groupACounts"
        :group-b-counts="groupBCounts"
        :total-present-count="totalPresentCount"
        :total-registered-count="totalRegisteredCount"
      />
      <div class="d-flex justify-center mt-8">
        <v-btn v-if="isOrganizer" @click="onEdit">
          <v-icon>mdi-pencil</v-icon>
          {{ t("pages.events.edit-event") }}
        </v-btn>
      </div>
      <div class="d-flex justify-center mt-8">
        <v-progress-circular indeterminate v-if="loadingRegisteredStatus" />
        <span v-else-if="isRegisteredForEvent" class="d-block">
          <v-icon class="mr-2" color="success">mdi-check-bold</v-icon>
          {{ t("pages.events.already-registered") }}
        </span>
        <v-btn
          v-else-if="!authStore.isLoggedIn"
          variant="text"
          color="primary"
          @click="router.push('/login?redirect=/events/' + matchyEvent?.id)"
          >{{ t("pages.events.login-register") }}</v-btn
        >
        <v-btn
          v-else-if="!isOrganizer"
          variant="text"
          color="primary"
          @click="startRegister"
          >{{ t("pages.events.register-button-text") }}
          <v-dialog v-model="showRegisterModal">
            <v-card>
              <v-card-title class="text-h6">{{
                t("pages.events.register-modal-title")
              }}</v-card-title>
              <v-card-text>
                {{ t("pages.events.register-modal-text") }}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  variant="text"
                  @click="registerForEvent(matchyEvent?.event_groups?.groupA)"
                >
                  {{ matchyEvent?.event_groups?.groupA.title }}
                </v-btn>
                <v-btn
                  color="primary"
                  variant="text"
                  @click="registerForEvent(matchyEvent?.event_groups?.groupB)"
                >
                  {{ matchyEvent?.event_groups?.groupB.title }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-btn>
        <v-btn
          v-else-if="!matchyEvent?.is_ended"
          class="d-block mx-auto"
          @click="showStartModal = true"
        >
          {{ t("pages.dashboard.prepare.start-event") }}
          <v-dialog v-model="showStartModal">
            <v-card>
              <v-card-text>
                {{ t("pages.dashboard.prepare.start-modal-text") }}
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="red"
                  variant="text"
                  @click="showStartModal = false"
                >
                  {{ t("pages.dashboard.prepare.start-modal-cancel") }}
                </v-btn>
                <v-btn color="primary" variant="text" @click="startEvent">
                  {{ t("pages.dashboard.prepare.start-modal-confirm") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-btn>

        <v-btn
          v-else-if="!matchyEvent.results_published"
          :loading="publishing"
          color="success"
          @click="publish"
          >Publish results</v-btn
        >
        <div v-else class="text-h6 font-weight-bold">Results published</div>
      </div>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import {
  type EventInfo,
  type Group,
  useEventService,
  type EventRegistration,
  type GroupPair,
} from "@/services/eventService";
import { useAuthStore } from "@/stores/auth";
import { shareEvent } from "@/services/utils/share";
import { useI18n } from "vue-i18n";
import { supabase } from "@/services/supabase";
import { useCurrentEventStore } from "@/stores/currentEvent";

interface GroupCount {
  total: number;
  present: number;
}

const { t } = useI18n();
const authStore = useAuthStore();
const eventService = useEventService(authStore);
const currentEvent = useCurrentEventStore();
const route = useRoute();
const router = useRouter();

const matchyEvent = ref<EventInfo>();
const loadingEvent = ref(true);
const loadingRegisteredStatus = ref(true);
const isRegisteredForEvent = ref<boolean>();
const isOrganizer = computed(
  () => authStore.user && authStore.user.id == matchyEvent?.value?.organizer
);

const totalRegisteredCount = ref<number>();
const totalPresentCount = ref<number>();
const groupACounts = ref<GroupCount>();
const groupBCounts = ref<GroupCount>();

const showRegisterModal = ref(false);
const showStartModal = ref(false);

const startEvent = async () => {
  if (!matchyEvent.value) return;
  try {
    await currentEvent.startEvent(matchyEvent.value.id);
    router.push({ name: "dashboard", params: { id: matchyEvent.value.id } });
  } catch (e) {
    console.log(e);
    errorToast(e);
  }
};

const imageHeaderSrc = computed(
  () =>
    import.meta.env.VITE_SUPABASE_STORAGE_URL + matchyEvent.value?.header_image
);

const onShare = async () => {
  if (!matchyEvent.value) {
    throw new Error("Event shared before loaded");
  }
  await shareEvent(matchyEvent.value, authStore, t, router);
};

const onEdit = () => {
  router.push({ name: "event-edit", params: { id: route.params.id } });
};

// entry-point for both registrations
const startRegister = async () => {
  // if the event uses groups we show a modal for the user to pick one
  if (matchyEvent.value?.event_groups) {
    showRegisterModal.value = true;
    return;
  }
  await registerForEvent();
};

const registerForEvent = async (group?: Group) => {
  if (!matchyEvent.value) return;
  await eventService.registerForEvent(matchyEvent.value.id, group?.id);
  successToast(t("pages.events.register-without-group-success"));
  showRegisterModal.value = false;
  isRegisteredForEvent.value = true;
};

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

const publishing = ref(false);

const publish = async () => {
  publishing.value = true;
  const { error } = await supabase.rpc(
    "compute_matches_and_send_notifications",
    {
      ev_id: +route.params.id,
    }
  );
  if (error) {
    console.log(error);
    errorToast(error);
  } else {
    successToast("Succesfully published the results");
  }
  publishing.value = false;
  if (!matchyEvent.value) return;
  matchyEvent.value.results_published = true;
};

watch(
  () => route.params.id,
  async () => {
    loadingEvent.value = true;
    loadingRegisteredStatus.value = true;
    if (isNaN(+route.params.id)) {
      errorToast(t("shared.events.invalid-id"));
      router.back();
      return;
    }
    try {
      matchyEvent.value = await eventService.fetchEventById(+route.params.id);
    } catch (e) {
      console.log(e);
      errorToast(t("shared.events.event-load-error"));
      router.back();
    }
    loadingEvent.value = false;
    try {
      isRegisteredForEvent.value = await eventService.isRegisteredForEvent(
        +route.params.id
      );
    } catch (e) {
      console.log(e);
    }
    loadingRegisteredStatus.value = false;
    if (matchyEvent.value?.organizer !== authStore.user?.id) {
      return;
    }
    const { data } = await supabase
      .from("event_registrations")
      .select("group_id, present")
      .eq("event_id", matchyEvent.value?.id);
    if (data === null) {
      errorToast("There was a problem loading the registrations");
      return;
    }
    totalRegisteredCount.value = data.length;
    totalPresentCount.value = data.filter((reg) => reg.present).length;
    if (matchyEvent.value?.event_groups)
      splitByGroup(data, matchyEvent.value.event_groups);
  },
  { immediate: true, flush: "post" }
);
</script>
