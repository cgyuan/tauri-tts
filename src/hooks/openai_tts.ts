import { useSettingStore } from '../store'
import { storeToRefs } from 'pinia'
import OpenAI from "openai"

export const getOpenAI = () => {
  const settingStore = useSettingStore()
  const setting = settingStore.openAiProxy
  let baseProxyUrl =  setting.proxyUrl || 'https://api.openai.com'
  if (!baseProxyUrl.endsWith('/v1')) {
    baseProxyUrl += '/v1'
  }
  return new OpenAI({
    apiKey: setting.proxyApiKey,
    baseURL: baseProxyUrl,
    dangerouslyAllowBrowser: true
  })
}

export const text2speech = async (text: string, model: string,
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
  speed: number) => {
  const openai = getOpenAI()
  const response = await openai.audio.speech.create({
    input: text,
    model,
    voice,
    response_format: 'mp3',
    speed
  })
  const arrayBuffer = await response.arrayBuffer()
  return new Blob([arrayBuffer], { type: 'audio/mp3' })
}

export const useOpenAiTTS = () => {
  const settingStore = useSettingStore()
  const { tts } = storeToRefs(settingStore)

  const model = tts.value.openAiModel
  const voice = tts.value.openAiVoice
  const speed = tts.value.openAiSpeed

  const processAudioText = (text: string) => {
    return new Promise<Blob>((resolve, reject) => {
      if (!settingStore.openAiProxy.proxyApiKey) {
        reject('请先设置 OpenAI API Key')
        return
      }
      return resolve(text2speech(text, model, voice, speed))
    })
  }
  

  return {
    processAudioText
  }
}