<script setup lang="ts">
import { useAppStore } from './store';
import { storeToRefs } from 'pinia';
import ParamsPanel from './components/ParamsPanel.vue';
import Header from './components/Header.vue';
import { is } from './utils';
const { text, audioURL, headerHeight } = storeToRefs(useAppStore());

const downloadAudio = () => {
  if (!audioURL.value) {
    return
  }
  const link = document.createElement('a');
  link.href = audioURL.value;
  link.download = Date.now() + '.mp3';
  link.click();
  link.remove();
}
</script>

<template>
  <Header v-if="is.desktop()"/>
  <div class="flex flex-col bg-white gap-5" :style="{
    height: `calc(100vh - ${headerHeight}px)`,
  }">
    <div class="flex-1 flex flex-row gap-5 px-5 pt-5">
      <a-textarea v-model="text" />
      <ParamsPanel />
    </div>
    <div class="h-80px mx-5 flex justify-center items-center gap-10">
      <a-button type="secondary" shape="circle" class="w-50px! h-50px!" @click="downloadAudio">
        <template #icon>
          <icon-download :size="30" />
        </template>
      </a-button>
      <audio :src="audioURL" controls class="w-1/2"></audio>
    </div>
  </div>
</template>

<style>
.arco-textarea {
  resize: none !important;
  height: 100%;
}
</style>
