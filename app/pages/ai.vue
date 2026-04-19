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
import * as ort from 'onnxruntime-web'
import * as Papa from 'papaparse'

ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/'

const max_file_size = 20 * 1024 * 1024
const states = ['upload', 'processing', 'results']
const currState = ref(0)
const selectedFile = ref<File | null>(null)
const modelLoad = ref<Promise<ort.InferenceSession | undefined> | null>(null)
const model = ref<ort.InferenceSession | undefined | null>(null)
const dataLoad = ref<Promise<void> | null>(null)
const data = ref<ort.Tensor>(new ort.Tensor('float32', [], [0]))

const loadModel = async () => {
    try {
        // Load model from a URL or relative path
        const session = await ort.InferenceSession.create('./models/tcn_model.onnx', {
            executionProviders: ['wasm'], // Options: 'wasm', 'webgl', 'webgpu'
            externalData: [{ path: "tcn_model.onnx.data", data: "./models/tcn_model.onnx.data" }]
        });
        console.log('Model loaded successfully');
        return session;
    } catch (e) {
        console.error(`Failed to load model: ${e}`);
    }
}


onMounted(async () => {
    modelLoad.value = loadModel()
})

const submitCSV = async () => {
    // validity checks
    if (selectedFile.value == null) {
        alert("Please upload a file.")
        return;
    }
    if (selectedFile.value.size > max_file_size) {
        alert("File too large. Please upload a smaller file.")
        return;
    }

    dataLoad.value = new Promise<void>((resolve, reject) => {
        Papa.parse(selectedFile.value, {
            dynamicTyping: true, // Automatically converts numbers/booleans
            complete: function(results: Papa.ParseResult<[]>) {
                results.data.pop() //  Last element will always be null
                const processed = new Float32Array(results.data.flat())
                data.value = new ort.Tensor('float32', processed, [1,19,128])
                console.log("Finished:", processed);
                resolve()
            },
            error: function(err) {
                console.error("Error parsing file:", err.message);
                reject()
            }
    })})
    // give file to model


    // next step
    currState.value++;
    await calculateData()
}

const calculateData = async () => {
  model.value = await modelLoad.value
  await dataLoad.value
  console.log(model.value?.inputMetadata)
  console.log(data.value.size)
  const results = await model.value?.run({ input: data.value })
  console.log("Inference result:", results);
  currState.value++

}

const reset = () => {
    currState.value = 0;
    selectedFile.value = null;
}
</script>