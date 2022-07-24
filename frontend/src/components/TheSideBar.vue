<template>
  <Transition name="slide-fade">
    <div class="side-bar" @click="hideSideBar" v-if="visible">
      <van-sidebar v-model="active" @click.stop>
        <van-sidebar-item title="Home" @click="goToHome" />
        <van-sidebar-item title="empty" />
        <van-sidebar-item title="empty" />
        <van-sidebar-item title="Switch to visitor view" v-if="PageMode !== 'eventVisitor'" @click="PageMode = 'eventVisitor'" />
        <van-sidebar-item title="Switch to organizer view" v-if="PageMode !== 'eventOrganizer'" @click="PageMode = 'eventOrganizer'" />
        <van-sidebar-item title="Sign out" @click="signOut" />
      </van-sidebar>
    </div>
  </Transition>
</template>

<script setup lang="ts">
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

function goToHome() {
  router.push("/");
}

function hideSideBar() {
  emits("update:visible", false);
}
function signOut() {
  userStore.signOut();
  router.push("/");
}
</script>
<style scoped>
.side-bar {
  position: fixed;
  top: 40px; /** TODO: Replace this hack with something proper */
  right: 0;
  left: 0;
  bottom: 0;
  margin-bottom: auto;
  background: rgba(0, 0, 0, 0.5);
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
