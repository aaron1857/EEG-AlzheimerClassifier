<template>
    <div class="w-full sticky p-4 shadow-xl bg-primary text-gray-900 dark:text-white grid grid-cols-2 font-secondary">
        <NuxtLink to="/">
            <svg class="fill-secondary-dark dark:fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:1;"><path d="M12 5c.67 0 1.35.09 2 .26c1.78-2 5.03-2.84 6.42-2.26c1.4.58-.42 7-.42 7c.57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44c0 0-1.89-6.42-.5-7s4.72.23 6.5 2.23A9 9 0 0 1 12 5m-4 9v.5m8-.5v.5"/><path d="M11.25 16.25h1.5L12 17z"/></svg>
        </NuxtLink>

        
        <div class="col-span-1 flex justify-end gap-3 items-center">
            <!-- Theme Toggle -->
            <SMbutton
                @click="toggleColorMode"
                class="relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none"
                :class="isDark ? 'bg-gray-800' : 'bg-gray-300'"
                aria-label="Toggle color mode"
            >
            <!-- Sliding thumb -->
                <span
                    class="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center"
                    :class="isDark ? 'translate-x-8' : 'translate-x-0'"
                >
                    <UIcon
                    :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
                    class="h-4 w-4 text-gray-800"
                    />
                </span>
            </SMbutton>
            <NuxtLink to="/">Home</NuxtLink>
            <NuxtLink to="/ai">Upload EEG Data</NuxtLink>
            <a href="https://fegelsamuel.github.io">About Us</a> <!-- todo: replace with team -->
        </div>
        
    </div>
</template>

<script setup lang="ts">

const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})

const toggleColorMode = () => {
    colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
};
</script>