<template>
    <div class="mt-10 font-secondary">

        <!-- UPLOAD SCREEN -->
        <div v-if="states[currState]=='upload'">
            <h1 class="w-full text-center font-bold text-2xl">UPLOAD EEG DATA</h1>
            <div class="flex flex-col items-center my-5 gap-3">
                <UFileUpload v-model="selectedFile" accept=".csv" label="Drop File Here (max 100MB)" class="w-96 min-h-48" />
                <WTButton size="2xl" text="SUBMIT" @click="submitCSV"/>
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
                <ResultsWindow :results="finalResults" />
            </div>
            <div class="h-96"></div>
            <!-- next steps buttons -->
            <div class="flex flex-row justify-center gap-3 delay-[2s] animate-window-fade-in">
                <WTButton text="EXPORT RESULT"/>
                <WTButton text="RESET" @click="reset"/>
            </div>
        </div>  

        <!-- ERROR -->
         <div v-else>
            <h1 class="w-full text-center font-bold text-2xl">ERROR</h1>
            <div class="flex flex-row justify-center">
                <WTButton text="RESTART" @click="reset"/>
            </div>
         </div>
    </div>
</template>

<script setup lang="ts">
import * as ort from 'onnxruntime-web'

ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/'

const { validateFile, parseCSV } = useEEGValidation()
const { applyPCA, CHANNELS, COMPONENTS } = usePCA()

const states = ['upload', 'processing', 'results']
const currState = ref(0)
const selectedFile = ref<File | null>(null)
const modelLoad = ref<Promise<ort.InferenceSession | undefined> | null>(null)
const model = ref<ort.InferenceSession | undefined | null>(null)
const processedData = ref<Float32Array | null>(null)

const finalResults = ref("Processing...")

const loadModel = async () => {
    try {
        // Load model from a URL or relative path
        const session = await ort.InferenceSession.create('./models/xgboost_model.onnx', {
            executionProviders: ['wasm'], // Options: 'wasm', 'webgl', 'webgpu'
        });
        console.log('Model loaded successfully');
        console.log('Input metadata:', session.inputMetadata);
        return session;
    } catch (e) {
        console.error(`Failed to load model: ${e}`);
    }
}


onMounted(async () => {
    modelLoad.value = loadModel()
})

const submitCSV = async () => {
    const error = validateFile(selectedFile.value)
    if (error) {
        alert(error)
        return
    }

    // next step
    currState.value++;
    
    try {
        processedData.value = await parseCSV(selectedFile.value!)
        await calculateData();
    } catch (e: any) {
        console.error("Pipeline failed:", e);
        alert(e.message || "An error occurred during processing.")
        currState.value = 3; // Show error screen
    }
}

const calculateData = async () => {
    model.value = await modelLoad.value;
    if (!model.value || !processedData.value) return;

    try {
        const pcaFeatures = await applyPCA(processedData.value)
        const numChunks = pcaFeatures.length

        console.log(`Starting inference...`);

        let atRiskVotes = 0;

        for (let i = 0; i < numChunks; i++) {
            const inputVector = pcaFeatures[i]!;
            const tensor = new ort.Tensor('float32', inputVector, [1, CHANNELS * COMPONENTS]);
            
            const results = await model.value.run({ input: tensor });
            
            const firstOutput = Object.values(results)[0];
            if (!firstOutput) continue;

            const prediction = results.label ? Number(results.label.data[0]) : Number(firstOutput.data[0]);
            
            if (prediction !== 0) {
                atRiskVotes++;
            }
        }

        const atRiskRatio = atRiskVotes / numChunks;
        console.log(`Inference complete. At-risk ratio: ${atRiskRatio.toFixed(2)} (${atRiskVotes}/${numChunks} chunks)`);

        if (atRiskRatio >= 0.4) {
            finalResults.value = "This patient is at risk for Alzheimer's Disease";
        } else {
            finalResults.value = "Low risk for Alzheimer's Disease detected";
        }

        currState.value++;
    } catch (e: any) {
        console.error("Calculation failed:", e)
        alert(e.message || "An error occurred during calculation.")
        throw e
    }
}


const reset = () => {
    currState.value = 0;
    selectedFile.value = null;
    processedData.value = null;
    finalResults.value = "Processing...";
}
</script>