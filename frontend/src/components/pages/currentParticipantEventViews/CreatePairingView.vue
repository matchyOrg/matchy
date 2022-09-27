<template>
  <div>
    <span class="d-block text-body-1 font-weight-bold"
      >{{ t("pages.participant-event.searching-title") }}
    </span>
    <span class="d-block mb-4 text-body-2">{{
      t("pages.participant-event.searching-subtitle")
    }}</span>
    <span class="d-block mb-4 text-body-2"
      >{{ displayTime }}
      {{ t("pages.participant-event.searching-minutes-left") }}</span
    >
    <div
      :style="{ width: '250px', height: '250px', position: 'relative' }"
      class="bg-grey mx-auto"
      @click="showQrReader = true"
    >
      <div class="logo bg-white pa-2 rounded-lg">
        <v-icon>mdi-camera</v-icon>
      </div>
      <vue-qrcode
        :value="userId"
        :color="{
          dark: '#000',
          light: '#fff',
        }"
        type="image/png"
        :quality="0.92"
        :width="250"
      ></vue-qrcode>
      <v-dialog v-model="showQrReader">
        <div class="p-relative fullscreen">
          <qrcode-stream
            v-if="showQrReader"
            @init="onReaderInit"
            @decode="onRead"
          />
          <v-progress-circular
            v-if="loadingReader"
            class="qr-loader"
            size="125"
            indeterminate
          />
        </div>
      </v-dialog>
    </div>
    <v-text-field v-model="otherUserId" label="ID (optional)">
      <template v-slot:append>
        <v-btn @click="emitIdIfValid" color="secondary">{{
          t("pages.participant-event.searching-manual-pair-button")
        }}</v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { QrcodeStream } from "vue3-qrcode-reader";
import VueQrcode from "vue-qrcode";

const props = defineProps<{ userId: string; roundTime?: number }>();
const emits = defineEmits<{ (e: "partnerFound", uuid: string): void }>();

const { t } = useI18n();

const otherUserId = ref("");

const showQrReader = ref(false);
const loadingReader = ref(false);

const onReaderInit = (initPromise: Promise<any>) => {
  loadingReader.value = true;
  initPromise
    .then(() => (loadingReader.value = false))
    .catch((e) => console.log(e));
};

const onRead = (uuid: string) => {
  otherUserId.value = uuid;
  emitIdIfValid();
};

const emitIdIfValid = () => {
  if (validUUID.value) {
    emits("partnerFound", otherUserId.value);
  }
};

const validUUID = computed(() =>
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(
    otherUserId.value
  )
);

const displayTime = computed(() => {
  if (!props.roundTime) return "00:00";
  const minutes = Math.floor(props.roundTime / (60 * 1000));
  const seconds = Math.floor((props.roundTime % (60 * 1000)) / 1000);
  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
});
</script>

<style scoped>
.logo {
  z-index: 5;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.fullscreen {
  height: 100vh;
  width: 100vw;
}

.p-relative {
  position: relative;
}

.qr-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
