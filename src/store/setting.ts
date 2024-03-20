import { defineStore } from 'pinia'
import { TTSEngine } from '../enums/appEnum'
import { SUPPORT_LANGS } from '../constant'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    openAiProxy: {
      proxyUrl: '',
      proxyApiKey: '',
    },
    tts: {
      engine: TTSEngine.edge,
      selectedLan: 'zh-CN',
      selectedVoice: 'zh-CN-XiaoxiaoNeural',
      // 语速
      rate: 1,
      // 音调
      pitch: 1,
      openAiModel: 'tts-1',
      openAiVoice: 'shimmer' as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
      openAiSpeed: 1.0
    },
    selectedLanguage: {
      lang: 'zh-CN',
      name: '中文(普通话，简体)',
      voices: SUPPORT_LANGS[0].voices
    } as Language,
  }),
  actions: {
    selectLanguage(lang: string) {
      this.tts.selectedLan = lang
      this.selectedLanguage = SUPPORT_LANGS.find(item => item.lang === lang)!
      this.tts.selectedVoice = this.selectedLanguage.voices[0].id
    }
  },
  persist: true
})