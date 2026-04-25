<template>
    <div class="absolute max-w-1/2 w-full bg-secondary shadow-inner rounded-xl animate-open-window max-h-96 h-full overflow-hidden font-secondary"
        :class="{ 'bg-secondary-dark': isDark, 'text-white': isDark }">
        <div class="flex flex-col items-start p-5 w-full">
                <b>Results</b>
                <p>{{ results }}</p>
         </div>
    </div>
    
</template>

<script setup>
import { ref, computed, defineProps } from "vue"
const colorMode = useColorMode()

const props = defineProps({
    results: {
        type: String,
        default: "Processing..."
    }
})

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})

</script>