<script lang="ts">
const icons: any = {}
export default {
  name: 'mo-icon',
  register: (data: any) => {
    for (const name in data) {
      const icon = data[name]

      if (!icon.paths) {
        icon.paths = []
      }
      if (icon.d) {
        icon.paths.push({ d: icon.d })
      }

      if (!icon.polygons) {
        icon.polygons = []
      }
      if (icon.points) {
        icon.polygons.push({ points: icon.points })
      }

      icons[name] = icon
    }
  }
}

</script>
<template>
  <svg version="1.1" :class="klass" :role="label ? 'img' : 'presentation'" :aria-label="label" :x="0" :y="0"
    :width="width" :height="height" :viewBox="box" :style="style">
    <slot>
      <template v-if="icon && icon.paths">
        <path v-for="(path, i) in icon.paths" :key="`path-${i}`" v-bind="path" />
      </template>
      <template v-if="icon && icon.polygons">
        <polygon v-for="(polygon, i) in icon.polygons" :key="`polygon-${i}`" v-bind="polygon" />
      </template>
      <template v-if="icon && icon.raw">
        <g v-bind="icon.g" v-html="raw" />
      </template>
    </slot>
  </svg>
</template>

<script setup lang="ts">

import { computed, onMounted, reactive, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()!

let cursor = 0xD4937
function getId() {
  return `mo-${(cursor++).toString(16)}`
}


const props = defineProps({
  name: String,
  type: String,
  spin: Boolean,
  inverse: Boolean,
  pulse: Boolean,
  flip: {
    type: String,
    validator: (prop: string) => ['horizontal', 'vertical'].includes(prop)
  },
  scale: [Number, String],
  label: String
})

const data = reactive({
  x: false,
  y: false,
  childrenWidth: 0,
  childrenHeight: 0,
  outerScale: 1
})

const normalizedScale = computed(() => {
  let scale = props.scale
  scale = typeof scale === 'undefined' ? 1 : Number(scale)
  if (isNaN(scale) || scale <= 0) {
    console.warn('Invalid prop: prop "scale" should be a number over 0.', this)
    return data.outerScale
  }
  return scale * data.outerScale
})

const klass = computed(() => {
  return {
    'mo-icon': true,
    'mo-spin': props.spin,
    'mo-flip-horizontal': props.flip === 'horizontal',
    'mo-flip-vertical': props.flip === 'vertical',
    'mo-inverse': props.inverse,
    'mo-pulse': props.pulse,
    [props.name!]: true
  }
})
const icon = computed(() => {
  if (props.name) {
    return icons[props.name]
  }
  return null
})

const ratio = computed(() => {
  if (!icon.value) {
    return 1
  }
  const { width, height } = icon.value
  return Math.max(width, height) / 16
})

const width = computed(() => {
  return data.childrenWidth || (icon.value && icon.value.width / ratio.value * normalizedScale.value) || 0
})
const height = computed(() => {
  return data.childrenHeight || (icon.value && icon.value.height / ratio.value * normalizedScale.value) || 0
})

const box = computed(() => {
  if (icon.value) {
    return `0 0 ${icon.value.width} ${icon.value.height}`
  }
  return `0 0 ${width.value} ${height.value}`
})

const style = computed(() => {
  if (normalizedScale.value === 1) {
    return {}
  }
  return {
    fontSize: normalizedScale.value + 'em'
  }
})

const raw = computed(() => {
  // generate unique id for each icon's SVG element with ID
  if (!icon.value || !icon.value.raw) {
    return null
  }
  let raw = icon.value.raw
  const ids: any = {}
  raw = raw.replace(/\s(?:xml:)?id=(["']?)([^"')\s]+)\1/g, (_match: string, _quote: string, id: string) => {
    const uniqueId = getId()
    ids[id] = uniqueId
    return ` id="${uniqueId}"`
  })
  raw = raw.replace(/#(?:([^'")\s]+)|xpointer\(id\((['"]?)([^')]+)\2\)\))/g, (match: string, rawId: string, _: string, pointerId: string) => {
    const id = rawId || pointerId
    if (!id || !ids[id]) {
      return match
    }

    return `#${ids[id]}`
  })

  return raw
})

onMounted(() => {
  if (icon.value) {
    return
  }

  console.log(proxy?.$refs)
})


</script>

<style>
.mo-icon {
  display: inline-block;
  fill: currentColor;
}

.mo-flip-horizontal {
  transform: scale(-1, 1);
}

.mo-flip-vertical {
  transform: scale(1, -1);
}

.mo-spin {
  animation: mo-spin 0.5s 0s infinite linear;
}

.mo-inverse {
  color: #fff;
}

.mo-pulse {
  animation: mo-spin 1s infinite steps(8);
}

@keyframes mo-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
