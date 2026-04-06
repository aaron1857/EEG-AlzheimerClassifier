<template>
    <div class="mt-10 font-secondary">

        <!-- UPLOAD SCREEN -->
        <div v-if="states[currState]=='upload'">
            <h1 class="w-full text-center font-bold text-2xl">UPLOAD EEG DATA</h1>
            <div class="flex flex-col items-center my-5 gap-3">
                <UFileUpload v-model="selectedFile" accept=".csv" label="Drop File Here (max 20MB)" class="w-96 min-h-48" />
                <SMButton size="2xl" text="SUBMIT" @click="submitCSV"/>
            </div>
        </div>

        <!-- IN PROCESS SCREEN -->
        <div v-else-if="states[currState]=='processing'">
            <div class="w-full flex flex-col items-center justify-center gap-4 py-20">
                <ULoader size="xl" />
                <p class="text-sm opacity-70">Processing data...</p>
            </div>
        </div>

        <!-- RESULTS SCREEN -->
        <div v-else-if="states[currState]=='results'">
            <h1 class="w-full text-center font-bold text-2xl">RESULTS</h1>
            <div class="w-full my-5 flex justify-center">
                <ResultsWindow />
            </div>
            <div class="h-96"></div>
            <!-- next steps buttons -->
            <div class="flex flex-row justify-center gap-3 delay-[2s] animate-window-fade-in">
                <SMButton text="EXPORT RESULT"/>
                <SMButton text="RESET" @click="reset"/>
            </div>
        </div>  

        <!-- ERROR -->
         <div v-else>
            <h1 class="w-full text-center font-bold text-2xl">ERROR</h1>
            <div class="flex flex-row justify-center">
                <SMButton text="RESTART" @click="reset"/>
            </div>
         </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const max_file_size = 20 * 1024 * 1024
const states = ['upload', 'processing', 'results']
const currState = ref(0)
const selectedFile = ref<File | null>(null)


const submitCSV = () => {
    // validity checks
    if (selectedFile.value == null) {
        alert("Please upload a file.")
        return;
    }
    if (selectedFile.value.size > max_file_size) {
        alert("File too large. Please upload a smaller file.")
        return;
    }

    // give file to model

    // next step
    currState.value++;
    calculateData()
}

const calculateData = () => {
    const balls = ref(true)
  //simulate a 1 sec wait/buffer before data is ready to present
  setTimeout(() => {
    currState.value++;
  }, 2500)

}

const reset = () => {
    currState.value = 0;
    selectedFile.value = null;
}
</script>