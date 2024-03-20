import { useSettingStore } from "../store"
import { useEdgeTtsWs } from "./edge_tts_ws"
import { useOpenAiTTS } from "./openai_tts"


export const useTTS = () => {
  const settingStore = useSettingStore()

  const processAudioText = (text: string) => {
    if (settingStore.tts.engine === 'edge') {
      const { processAudioText: h } = useEdgeTtsWs()
      return h(text)
    } else {
      const { processAudioText: h } = useOpenAiTTS()
      return h(text)
    }
  }

  return {
    processAudioText
  }
}