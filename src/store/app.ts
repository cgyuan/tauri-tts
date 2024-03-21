import { defineStore } from 'pinia'
import { is } from '../utils'

export const useAppStore = defineStore('app', {
  state: () => ({
    text: '',
    audioURL: '',
    audioBlob: undefined as Blob | undefined,
    alwaysOnTop: false,
    headerHeight: is.desktop() ? 35 : 0,
  }),
})