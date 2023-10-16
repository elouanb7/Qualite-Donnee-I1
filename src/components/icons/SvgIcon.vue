<template>
  <Icon :class="className" />
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: null
  }
})

/*const className = computed(() => {
  return `svg-icon--${props.name}`;
});*/

const className = computed(() => {
  return `svg-icon`
})

const Icon = computed(() => {
  const file = props.name
  return defineAsyncComponent(() => {
    return import(`../../assets/icons/${file}.svg`)
  })
})
</script>

<style scoped>
/*.svg-icon {
  stroke: var(--svg-icon-stroke); !* Default fill color *!
}*/
</style>
