<script lang="ts" setup>
import { ValidatedError } from '@arco-design/web-vue';
import { ref, onMounted, unref } from 'vue';
import { useSettingStore } from '../store';
import { storeToRefs } from 'pinia';

const settingStore = useSettingStore();
const { openAiProxy } = storeToRefs(settingStore);

const emit = defineEmits(['onSubmit'])

const form = ref({
  proxyUrl: '',
  proxyApiKey: ''
})

const handleSubmit = ({
  values,
  errors
}: {
  values: Record<string, any>;
  errors: Record<string, ValidatedError> | undefined;
}) => {
  if (errors) {
    return;
  }
  openAiProxy.value = values as any
  emit('onSubmit')
}


onMounted(() => {
  form.value = {
    proxyUrl: unref(openAiProxy).proxyUrl,
    proxyApiKey: unref(openAiProxy).proxyApiKey,
  }
})
</script>

<template>
  <a-form :model="form" @submit="handleSubmit">
    <a-form-item field="proxyUrl" :rules="[{ required: false, message: '请输入API地址' }]" hideLabel>
      <a-input placeholder="API地址 示例：https://api.openai.com" v-model="form.proxyUrl" allow-clear></a-input>
    </a-form-item>
    <a-form-item field="proxyApiKey" :rules="[{ required: false, message: '请输入ProxyApiKey' }]" hideLabel>
      <a-input placeholder="ProxyApiKey" v-model="form.proxyApiKey" type="password" allow-clear></a-input>
    </a-form-item>
    <a-form-item hideLabel>
      <a-button type="primary" class="w-full" shape="round" html-type="submit">保存</a-button>
    </a-form-item>
  </a-form>
</template>