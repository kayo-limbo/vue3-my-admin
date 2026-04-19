<template>
  {{ d.num.toFixed(0) }}
</template>
<script setup lanh="ts">
import {reactive, watch, } from 'vue'
import gsap from 'gsap'
const props = defineProps({
  value: {
    type: Number,
    default: 0
  }
})
function AnimateToValue() {
  gsap.to(d, {
    num: props.value,
    duration: 0.5,
  })
}

const d = reactive({
  num: 0
})
AnimateToValue()
watch(() => props.value, ()=>AnimateToValue())

</script>