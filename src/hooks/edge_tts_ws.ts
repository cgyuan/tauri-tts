import { useSettingStore } from "../store"
import { concatenateUint8Arrays, findSubArray, is } from "../utils"
// import { randomBytes } from "crypto"
import { getRandomBytes } from "../utils"
import WebSocketTauri from "tauri-plugin-websocket-api"


const useEdgeTtsWsWeb = () => {
  const settingStore = useSettingStore()

  const processAudioText = (text: string) => {

    const connectionId = getRandomBytes(16).toLowerCase()

    const url = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4&ConnectionId=${connectionId}`
    let format = "audio-24khz-48kbitrate-mono-mp3"
    let configData = {
      context: {
        synthesis: {
          audio: {
            metadataoptions: {
              sentenceBoundaryEnabled: "false",
              wordBoundaryEnabled: "false",
            },
            outputFormat: format,
          }
        },
      },
    }
    let configMessage =
      `X-Timestamp:${Date()}\r\n` +
      "Content-Type:application/json charset=utf-8\r\n" +
      "Path:speech.config\r\n\r\n" +
      JSON.stringify(configData)

    const rate = (settingStore.tts.rate - 1) * 100
    const pitch = (settingStore.tts.pitch - 1) * 50
    const ssml = `
<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
    <voice name="${settingStore.tts.selectedVoice}">
        <prosody rate="${rate}%" pitch="${pitch}%">
        ${text}
        </prosody>
    </voice>
</speak>
`
    // 发送SSML消息
    const requestId = getRandomBytes(16).toLowerCase()
    let ssmlMessage =
      `X-Timestamp:${Date()}\r\n` +
      `X-RequestId:${requestId}\r\n` +
      `Content-Type:application/ssml+xml\r\n` +
      `Path:ssml\r\n\r\n` +
      ssml
    const ws = new WebSocket(url)
    ws.binaryType = 'arraybuffer'
    ws.addEventListener('open', async () => {
      ws.send(configMessage)
      ws.send(ssmlMessage)
    })

    let concatenatedData = new Uint8Array()

    function processAndConcatenate(message: ArrayBuffer) {
      const dataview = new DataView(message)
      const headerLength = dataview.getInt16(0)
      if (message.byteLength > headerLength + 2) {
        const contentArrayBuffer = message.slice(headerLength + 2)
        concatenatedData = concatenateUint8Arrays(concatenatedData, new Uint8Array(contentArrayBuffer))
      }
    }

    return new Promise<Blob>((resolve, _reject) => {
      ws.addEventListener('message', async (event) => {
        const message = event.data

        if (typeof message === 'string') {
          if (message.includes('Path:turn.end')) {
            ws.close()
            let audioBlob = new Blob([concatenatedData.buffer], { type: 'audio/mp3' })
            resolve(audioBlob)
          }
        } else if (message instanceof ArrayBuffer) {
          processAndConcatenate(message)
        }
      })
    })

  }

  return {
    processAudioText
  }
}

const useEdgeTtsWsTauri = () => {
  const settingStore = useSettingStore()

  const processAudioText = (text: string) => {
    const connectionId = getRandomBytes(16).toLowerCase()
    let url = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4&ConnectionId=${connectionId}`

    // let pattern = /X-RequestId:(?<id>[a-z|0-9]*)/
    // const decoder = new TextDecoder('ascii')
    let encoder = new TextEncoder()
    let concatenatedData = new Uint8Array()

    let format = "audio-24khz-48kbitrate-mono-mp3"
    let configData = {
      context: {
        synthesis: {
          audio: {
            metadataoptions: {
              sentenceBoundaryEnabled: "false",
              wordBoundaryEnabled: "false",
            },
            outputFormat: format,
          }
        },
      },
    }
    let configMessage =
      `X-Timestamp:${Date()}\r\n` +
      "Content-Type:application/json charset=utf-8\r\n" +
      "Path:speech.config\r\n\r\n" +
      JSON.stringify(configData)

    const rate = (settingStore.tts.rate - 1) * 100
    const pitch = (settingStore.tts.pitch - 1) * 50

    return new Promise<Blob>(async (resolve, _reject) => {
      let ws = await WebSocketTauri.connect(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.66 Safari/537.36 Edg/103.0.1264.44",
        },
      })
      try {
        await ws.send(configMessage)
        const ssml = `
    <speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
        <voice name="${settingStore.tts.selectedVoice}">
            <prosody rate="${rate}%" pitch="${pitch}%">
            ${text}
            </prosody>
        </voice>
    </speak>
    `
        // 发送SSML消息
        const requestId = getRandomBytes(16).toLowerCase()
        let ssmlMessage =
          `X-Timestamp:${Date()}\r\n` +
          `X-RequestId:${requestId}\r\n` +
          `Content-Type:application/ssml+xml\r\n` +
          `Path:ssml\r\n\r\n` +
          ssml
        await ws.send(ssmlMessage)
      } catch (error) {
        console.log(error)
      }
      ws.addListener((message) => {
        if (message.type === "Binary") {
          let separator = "Path:audio\r\n"
          let segmentData = new Uint8Array(message.data)
          // const data = decoder.decode(segmentData.buffer)
          // let contentIndex = data.indexOf(separator) + separator.length
          const separatorArray = encoder.encode(separator)
          const separatorIndex = findSubArray(segmentData, separatorArray)
          const start = separatorIndex + separatorArray.length
          const contentArray = segmentData.slice(start)

          concatenatedData = concatenateUint8Arrays(concatenatedData, contentArray)
        } else if (message.type === "Text") {
          if (message.data.toString().includes('Path:turn.start')) {

          }
          if (message.data.toString().includes('Path:turn.end')) {

            ws.disconnect()
            console.log('end', text)
            let audioBlob = new Blob([concatenatedData.buffer], { type: 'audio/mp3' })
            resolve(audioBlob)
          }
        }
      })
    })
  }


  return {
    processAudioText
  }
}


export const useEdgeTtsWs = () => {

  const processAudioText = (text: string) => {
    if (is.desktop()) {
      const { processAudioText: h } = useEdgeTtsWsTauri()
      return h(text)
    } else {
      const { processAudioText: h } = useEdgeTtsWsWeb()
      return h(text)
    }
  }
  
  return {
    processAudioText
  }
}