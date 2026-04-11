<!-- burg -->

<template>
    <div class="h-full">
        <div class="z-50 sticky bottom-0 w-full flex flex-row justify-center bg-primary text-white"> 
            <UNavigationMenu
                collapsed
                orientation="horizontal"
                :items="items"
                :ui="{
                link: 'flex-col gap-1',
                linkLabel: 'block text-center'
                }"
            />
        </div>
    </div>
    
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const isMenuOpen = false;

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/',
  },
  {
    label: 'Analyze',
    icon: 'i-lucide-brain',
    to: '/ai',
  },
  {
    label: 'Manual',
    icon: 'i-lucide-file-question-mark',
    to: 'https://fegelsamuel.github.io',
  },
])
</script>