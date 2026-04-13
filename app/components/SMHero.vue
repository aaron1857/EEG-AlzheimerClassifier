<template>
  <section class="relative isolate overflow-hidden bg-slate-900 dark:bg-slate-900 light:bg-slate-100 
    [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
    <!-- Background Image -->
    <img
      src="/images/eeg-hero.jpg"
      alt="EEG waveform visualization"
      class="absolute inset-0 -z-10 h-full w-full object-cover"
    />

    <!-- Washed overlay -->
    <div class="absolute inset-0 -z-10 bg-slate-900/70 dark:bg-slate-900/70 light:bg-slate-100/70 backdrop-blur-[2px]" />
     <!-- <div class="absolute inset-0 -z-10" /> -->

    <!-- Content -->
    <div class="mx-10 max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
        <p class="text-sm font-semibold font-secondary uppercase tracking-[0.3em] text-primary">
          EEG-Based Alzheimer’s Screening
        </p>

        <h1 class="mt-6 text-4xl font-semibold font-primary tracking-tight text-white dark:text-white light:text-gray-900 sm:text-6xl">
          Wavethinker
        </h1>

        <p class="mt-6 text-lg font-secondary leading-8 text-slate-300 dark:text-slate-300 light:text-gray-700">
          Upload EEG data and detect Alzheimer's Disease using our AI-Powered, B2B SaaS
        </p>
    </div>
    <NuxtLink
      to="/ai"
      class="fixed right-6 top-1/2 -translate-y-1/2 z-50
            flex items-center justify-center
            size-14
            transition-all duration-300
            group"
      @click="removeArrow"
    >
      <svg id="arrow" class="text-white dark:text-white light:text-gray-900 text-3xl transition-transform duration-300 group-hover:translate-x-1" v-if="showArrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
      </svg>

    </NuxtLink>
  </section>
</template>

<script setup lang="ts">

const showArrow = ref(false)


// TODO: Refactor and actually debug the arrow problem
onMounted(() => { // similar to the below function, i am band aid fixing this haha
  setTimeout(() => {
    showArrow.value = true
  }, 530)
})
 // this is here because the arrow will teleport when doing the animation on loading, so only we hide it when it's clicked
const removeArrow = () => { showArrow.value = false; }

</script>