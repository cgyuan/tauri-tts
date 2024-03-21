<script setup lang="ts">
import { useAppStore } from '../store'
import { appWindow } from '@tauri-apps/api/window'
import { is } from '../utils'
import './Icons/win-minimize'
import './Icons/win-maximize'
import './Icons/win-close'
import './Icons/win-pin'
import './Icons/win-pin-fill'
import { storeToRefs } from 'pinia'
import { unref, computed } from 'vue'

const appStore = useAppStore()

const { alwaysOnTop } = storeToRefs(appStore)

const minimize = () => {
  appWindow.minimize()
}

const maximize = async () => {
  await appWindow.isMaximized() ? appWindow.unmaximize() : appWindow.maximize()

}

const close = () => {
  appWindow.hide()
}

const togglePin = () => {
  unref(alwaysOnTop) ? appWindow.setAlwaysOnTop(false) : appWindow.setAlwaysOnTop(true)
  alwaysOnTop.value = !unref(alwaysOnTop)
}

const pinStatusIcon = computed(() => {
  return unref(alwaysOnTop) ? 'win-pin-fill' : 'win-pin'
})

appWindow.setAlwaysOnTop(unref(alwaysOnTop))

// if (is.windows()) {
//   appWindow.setDecorations(false)
// }

</script>

<template>
  <div data-tauri-drag-region class="header text-black h-35px flex justify-end bg-[var(--color-bg-1)] items-center border-b border-b-solid border-b-[var(--color-border)]">
    <img src="/tauri.svg" class="w-20px h-20px ml-2" data-tauri-drag-region v-show="is.windows()"/>
    <div class="flex-1" data-tauri-drag-region></div>
    <div class="action-btn" @click="togglePin()"><mo-icon :name="pinStatusIcon" width="12" height="12" /></div>
    <ul class="flex h-full m0 p0" v-show="is.windows()">
      <li class="action-btn" @click="minimize()"><mo-icon name="win-minimize" width="12" height="12" /></li>
      <li class="action-btn" @click="maximize()"><mo-icon name="win-maximize" width="12" height="12" /></li>
      <li class="action-btn" @click="close()"><mo-icon name="win-close" width="12" height="12" /></li>
    </ul>
  </div>
</template>

<style scoped>
.header {
  user-select: none;
  -webkit-user-select: none;
  /* -webkit-app-region: drag; */
  -moz-user-select: none;
  -ms-user-select: none;
}

.action-btn {
  @apply w-60px h-full cursor-pointer flex justify-center items-center list-none;
  color: var(--titlebar-actions-color);
}

.action-btn:hover {
  background-color: #eee;
}

.action-btn:hover {
  color: #000;
}

.action-btn:last-child:hover {
  background-color: #fd0007;
  color: #fff;
}
</style>
