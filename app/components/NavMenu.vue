<!-- burg -->

<template>
    <div class="h-full">
        <div @mouseleave="hoverleave()" @mouseenter="hoverenter()" class="z-50 fixed bottom-0 w-full flex flex-col justify-center items-center text-white"
          :class="{
            'footer-leave-active': !isMenuOpen,
            'footer-leave-to': !isMenuOpen,
            'footer-enter-active': isMenuOpen,
            'footer-enter-from': isMenuOpen,
          }"> 
          <div class="w-full flex flex-row justify-center">
            <div class="bg-primary h-10 w-16 flex flex-row justify-center p-2 text-white rounded-t-lg">
                <svg viewBox="0 0 1024 1024" class="icon size-8" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#FFFFFF"></path></g></svg>
            </div>

          </div>
          <div class="w-full bg-primary flex flex-row justify-center">
            <UNavigationMenu
                collapsed
                orientation="horizontal"
                :items="items"
                highlight-color="primary"
                :ui="{
                link: 'flex-col gap-2 text-white',
                linkLabel: 'block text-center text-white',
                linkLeadingIcon: 'text-white',
                }"
            />
          </div>
            
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { NavigationMenuItem } from '@nuxt/ui'

const isMenuOpen = ref(true);


function hoverleave() {
  isMenuOpen.value = false;
}

function hoverenter() {
  isMenuOpen.value = true;
}

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Analyze',
    icon: 'i-lucide-brain',
    to: '/ai',
  },
  {
    label: 'Manual',
    icon: 'i-lucide-file-question-mark',
    to: '/manual',
  },
])
</script>
