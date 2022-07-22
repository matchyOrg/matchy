<template>
  <before-login v-if="!userStore.user"></before-login>
  <div v-else>
    <h2>Welcome {{ t("mode." + PageMode) }} {{ userStore.profile.username }}</h2>
    Logged in
    <p>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam, repellendus
      consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam maiores eligendi similique? Lorem ipsum,
      dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam, repellendus consequuntur vel
      sed corporis enim eos totam est? Natus odit molestiae totam maiores eligendi similique? Lorem ipsum, dolor sit amet
      consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam, repellendus consequuntur vel sed corporis
      enim eos totam est? Natus odit molestiae totam maiores eligendi similique? Lorem ipsum, dolor sit amet consectetur
      adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam, repellendus consequuntur vel sed corporis enim eos totam
      est? Natus odit molestiae totam maiores eligendi similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit.
      Voluptatibus ab illo sequi, temporibus numquam, repellendus consequuntur vel sed corporis enim eos totam est? Natus odit
      molestiae totam maiores eligendi similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo
      sequi, temporibus numquam, repellendus consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam
      maiores eligendi similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi,
      temporibus numquam, repellendus consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam maiores
      eligendi similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus
      numquam, repellendus consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam maiores eligendi
      similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam,
      repellendus consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam maiores eligendi similique? Lorem
      ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam, repellendus
      consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam maiores eligendi similique? Lorem ipsum,
      dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam, repellendus consequuntur vel
      sed corporis enim eos totam est? Natus odit molestiae totam maiores eligendi similique? Lorem ipsum, dolor sit amet
      consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam, repellendus consequuntur vel sed corporis
      enim eos totam est? Natus odit molestiae totam maiores eligendi similique? Lorem ipsum, dolor sit amet consectetur
      adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam, repellendus consequuntur vel sed corporis enim eos totam
      est? Natus odit molestiae totam maiores eligendi similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit.
      Voluptatibus ab illo sequi, temporibus numquam, repellendus consequuntur vel sed corporis enim eos totam est? Natus odit
      molestiae totam maiores eligendi similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo
      sequi, temporibus numquam, repellendus consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam
      maiores eligendi similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi,
      temporibus numquam, repellendus consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam maiores
      eligendi similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus
      numquam, repellendus consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam maiores eligendi
      similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam,
      repellendus consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam maiores eligendi similique? Lorem
      ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam, repellendus
      consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam maiores eligendi similique? Lorem ipsum,
      dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam, repellendus consequuntur vel
      sed corporis enim eos totam est? Natus odit molestiae totam maiores eligendi similique? Lorem ipsum, dolor sit amet
      consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam, repellendus consequuntur vel sed corporis
      enim eos totam est? Natus odit molestiae totam maiores eligendi similique? Lorem ipsum, dolor sit amet consectetur
      adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam, repellendus consequuntur vel sed corporis enim eos totam
      est? Natus odit molestiae totam maiores eligendi similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit.
      Voluptatibus ab illo sequi, temporibus numquam, repellendus consequuntur vel sed corporis enim eos totam est? Natus odit
      molestiae totam maiores eligendi similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo
      sequi, temporibus numquam, repellendus consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam
      maiores eligendi similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi,
      temporibus numquam, repellendus consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam maiores
      eligendi similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus
      numquam, repellendus consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam maiores eligendi
      similique? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab illo sequi, temporibus numquam,
      repellendus consequuntur vel sed corporis enim eos totam est? Natus odit molestiae totam maiores eligendi similique?
    </p>
  </div>
</template>
<script setup lang="ts">
import { PageMode } from "@/stores/page-mode";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
import BeforeLogin from "../components/BeforeLogin.vue";
const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

// TODO: Handle the error login case
// http://127.0.0.1:5173/#/error=unauthorized_client&error_code=401&error_description=Email+link+is+invalid+or+has+expired

watch(
  () => userStore.isLoggedIn,
  (v) => {
    if (v) {
      userStore.loadProfile().then(() => {
        const profileIsEmpty = userStore.isLoggedIn && userStore.profile.username === "";
        if (profileIsEmpty) {
          router.push("/profile-edit");
        }
      });
    }
  },
  { immediate: true }
);
</script>
