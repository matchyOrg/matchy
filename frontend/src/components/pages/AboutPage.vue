<template>
  <teleport to="#nav-title">{{ t("pages.about.title") }}</teleport>
  <v-main class="mx-9 mt-5">
    <p>
      <i18n-t keypath="pages.about.github-plug" tag="p">
        <a class="text-grey" href="https://github.com/sueszli/matchy">{{
          t("pages.about.github-page")
        }}</a>
      </i18n-t>
    </p>

    <h2 class="mt-10 mb-4">👨‍💻 {{ t("pages.about.devs.title") }}</h2>
    <p>
      {{ t("pages.about.devs.description") }}
    </p>

    <h3 class="mt-7 font-weight-regular">
      <b>Marco </b>
      <a class="text-grey" href="https://github.com/MJDeligan">@MJDeligan</a>
    </h3>
    <i class="text-grey">{{ t("pages.about.devs.marco.title") }}</i>
    <p class="mb-4">{{ t("pages.about.devs.marco.p1") }}</p>
    <p>{{ t("pages.about.devs.marco.p2") }}</p>

    <h3 class="mt-7 font-weight-regular">
      <b>Stefan </b>
      <a class="text-grey" href="https://github.com/stefnotch">@stefnotch</a>
    </h3>
    <i class="text-grey">{{ t("pages.about.devs.stefan.title") }}</i>
    <p class="mb-4">{{ t("pages.about.devs.stefan.p1") }}</p>
    <p class="mb-4">{{ t("pages.about.devs.stefan.p2") }}</p>
    <p>{{ t("pages.about.devs.stefan.p3") }}</p>

    <h3 class="mt-7 font-weight-regular">
      <b>Yahya </b>
      <a class="text-grey" href="https://github.com/sueszli">@sueszli</a>
    </h3>
    <i class="text-grey">{{ t("pages.about.devs.yahya.title") }}</i>
    <i18n-t keypath="pages.about.devs.yahya.p1" tag="p" class="mb-4">
      <a class="text-grey" href="https://github.com/sueszli/datewatch"
        >DateWatch</a
      >
    </i18n-t>
    <p class="mb-4">{{ t("pages.about.devs.yahya.p2") }}</p>
    <p>{{ t("pages.about.devs.yahya.p3") }}</p>

    <h3 class="mt-7 font-weight-regular">
      <b>Daniel </b>
      <a class="text-grey" href="https://github.com/Fancy11111">@Fancy11111</a>
    </h3>
    <i class="text-grey">{{ t("pages.about.devs.daniel.title") }}</i>
    <p>{{ t("pages.about.devs.daniel.p1") }}</p>

    <h2 class="mt-10">{{ t("pages.about.community.title") }}</h2>
    <p>
      {{ t("pages.about.community.p1") }}
    </p>
    <p class="mt-5 mb-10">
      {{ t("pages.about.community.p2") }}
    </p>
  </v-main>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<style scoped>
h3 a {
  text-decoration: none;
}
i {
  display: inline-block;
  letter-spacing: 0.05rem !important;
  font-weight: 500 !important;
  margin-bottom: 0.3rem !important;
}
</style>
