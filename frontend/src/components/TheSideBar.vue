<template>
  <Transition name="slide-fade">
    <van-overlay :show="visible" @click="hideSideBar">
      <div class="side-bar fixed top-12 bottom-0 z-10" @click="hideSideBar" v-if="visible">
        <van-sidebar v-model="active" @click.stop>
          <van-sidebar-item title="Home" @click="hideSideBar" to="/" />
          <van-sidebar-item title="Profile" @click="hideSideBar" to="/profile-edit" />
          <van-sidebar-item
            title="Switch to visitor view"
            v-if="PageMode !== 'eventVisitor'"
            @click="PageMode = 'eventVisitor'"
          />
          <van-sidebar-item
            title="Switch to organizer view"
            v-if="PageMode !== 'eventOrganizer'"
            @click="PageMode = 'eventOrganizer'"
          />
          <van-sidebar-item title="Sign out" @click="signOut" />
        </van-sidebar>
      </div>
    </van-overlay>
  </Transition>
</template>

<script setup lang="ts">
import { supabase } from "@/services/supabase";
import { PageMode } from "@/stores/page-mode";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const router = useRouter();

const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

const active = ref(2);

function hideSideBar() {
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
