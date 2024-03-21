<script lang="ts" setup>
import { ref } from 'vue';
import { useSettingStore, useAppStore } from '../store';
import { storeToRefs } from 'pinia';
import { TTSEngine } from '../enums/appEnum';
import { OPENAI_TTS_MODES, OPENAI_TTS_VOICES, SUPPORT_LANGS } from '../constant';
import { useTTS } from '../hooks/useTTS';
import ApiSettingPop from './ApiSettingPop.vue';
import { Message } from '@arco-design/web-vue';

const popVisible = ref(false);
const isConverting = ref(false);

const settingStore = useSettingStore();
const { tts } = storeToRefs(settingStore);
const { selectedLanguage } = storeToRefs(settingStore);


const appStore = useAppStore();
const { text, audioURL, audioBlob } = storeToRefs(appStore);
const { processAudioText } = useTTS();

const handleLanguageChange = (lang: any) => {
  settingStore.selectLanguage(lang);
}

const onPopupVisibleChange = (visible: boolean) => {
  popVisible.value = visible;
}


const startConvert = async () => {
  isConverting.value = true;
  try {
    const blob = await processAudioText(text.value);
    audioURL.value = URL.createObjectURL(blob);
    audioBlob.value = blob;
  } catch (error) {
    Message.error(error + '')
  }

  isConverting.value = false;
}

</script>


<template>
  <div class="flex flex-col w-500px rounded-lg p-5 justify-between">
    <a-form :model="tts" label-align="right" auto-label-width>
      <a-form-item label="引擎">
        <a-radio-group v-model="tts.engine">
          <a-radio :value="TTSEngine.edge">Edge</a-radio>
          <div class="inline-flex items-center">
            <a-radio :value="TTSEngine.openai">OpenAI</a-radio>
            <a-popover class="w-400px max-w-[80%]" trigger="click" :popup-visible="popVisible"
              @popup-visible-change="onPopupVisibleChange">
              <template #content>
                <ApiSettingPop @on-submit="() => onPopupVisibleChange(false)"/>
              </template>
              <a-button type="secondary" shape="circle" size="small">
                <icon-settings :size="16" />
              </a-button>
            </a-popover>

          </div>
        </a-radio-group>
      </a-form-item>
      <div v-if="tts.engine === TTSEngine.edge">
        <a-form-item label="语言">
          <a-select class="rounded-xl" v-model="tts.selectedLan" @change="handleLanguageChange"
            :disabled="tts.engine !== TTSEngine.edge">
            <a-option v-for="item in SUPPORT_LANGS" :label="item.name" :value="item.lang" />
          </a-select>
        </a-form-item>
        <a-form-item label="语音">
          <a-select class="rounded-xl" v-model="tts.selectedVoice" :disabled="tts.engine !== TTSEngine.edge">
            <a-option v-for="item in selectedLanguage.voices" :label="item.name" :value="item.id" />
          </a-select>
        </a-form-item>
        <a-form-item label="语速">
          <a-slider v-model="tts.rate" :max="3" :step="0.01" show-input :disabled="tts.engine !== TTSEngine.edge" />
        </a-form-item>
        <a-form-item label="语调">
          <a-slider v-model="tts.pitch" :max="2" :step="0.01" show-input :disabled="tts.engine !== TTSEngine.edge" />
        </a-form-item>
      </div>
      <div v-if="tts.engine === TTSEngine.openai">
        <a-form-item label="模型">
          <a-select class="rounded-xl" v-model="tts.openAiModel" @change="handleLanguageChange">
            <a-option v-for="item in OPENAI_TTS_MODES" :label="item" :value="item" />
          </a-select>
        </a-form-item>
        <a-form-item label="语音">
          <a-select class="rounded-xl" v-model="tts.openAiVoice">
            <a-option v-for="item in OPENAI_TTS_VOICES" :label="item" :value="item" />
          </a-select>
        </a-form-item>
        <a-form-item label="语速">
          <a-slider v-model="tts.openAiSpeed" :min="0.25" :max="4" :step="0.01" show-input />
        </a-form-item>
      </div>
    </a-form>
    <a-button type="primary" shape="round" @click="startConvert" :loading="isConverting">提交生成</a-button>
  </div>
</template>
<style>
.arco-slider {
  display: inline-flex !important;
}
</style>