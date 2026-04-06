<template> 
    <UButton 
        class="cursor-pointer py-1 px-4 m-2 bg-primary hover:bg-primary-hover rounded-full font-secondary text-white transition text-center shadow-lg"
        :class="{
            'text-xs': size=='xs',
            'text-sm': size=='sm',
            'text-md': size=='md',
            'text-lg': size=='lg',
            'text-xl': size=='xl',
            'text-2xl': size=='2xl'
        }"
        > 
        {{ text }}
    </UButton>
</template>

<script setup>
const props = defineProps(['text', 'size'])


</script>