export const usePCA = () => {
    const CHANNELS = 19
    const TIME_POINTS = 128
    const COMPONENTS = 10
    const CHUNK_SIZE = CHANNELS * TIME_POINTS

    const applyPCA = async (data: Float32Array): Promise<Float32Array[]> => {
        const numChunks = Math.floor(data.length / CHUNK_SIZE)
        if (numChunks < 2) {
            throw new Error("Not enough data to perform PCA. Please upload a longer recording (at least 2 seconds).")
        }

        console.log(`Starting PCA preprocessing on ${numChunks} chunks using fixed parameters...`)

        // 1. Load PCA parameters
        let pcaParams: any;
        try {
            const response = await fetch('/models/pca_parameters.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            pcaParams = await response.json();
        } catch (err) {
            console.error("Failed to load PCA parameters:", err);
            throw new Error("Critical error: PCA configuration could not be loaded.");
        }

        // 2. Reshape data into [numChunks, TIME_POINTS, CHANNELS]
        const reshapedData: Float32Array[][] = Array.from({ length: numChunks }, () => 
            Array.from({ length: TIME_POINTS }, () => new Float32Array(CHANNELS))
        )

        for (let i = 0; i < numChunks; i++) {
            for (let t = 0; t < TIME_POINTS; t++) {
                for (let c = 0; c < CHANNELS; c++) {
                    const val = data[i * CHUNK_SIZE + t * CHANNELS + c];
                    if (val !== undefined) {
                        reshapedData[i]![t]![c] = val
                    }
                }
            }
        }

        // 3. Apply Fixed PCA projection per channel
        const pcaFeatures: Float32Array[] = Array.from({ length: numChunks }, () => new Float32Array(CHANNELS * COMPONENTS))

        for (let c = 0; c < CHANNELS; c++) {
            const channelKey = `channel_${c + 1}`;
            const { components, mean } = pcaParams[channelKey];
            
            for (let i = 0; i < numChunks; i++) {
                // Extract time series for this chunk and channel
                const chunkChannelData = new Float32Array(TIME_POINTS);
                for (let t = 0; t < TIME_POINTS; t++) {
                    chunkChannelData[t] = reshapedData[i]![t]![c]!;
                }

                // Project onto each component: PC_j = sum_t (data_t - mean_t) * component_jt
                for (let j = 0; j < COMPONENTS; j++) {
                    let dotProduct = 0;
                    for (let t = 0; t < TIME_POINTS; t++) {
                        dotProduct += (chunkChannelData[t] - mean[t]) * components[j][t];
                    }
                    pcaFeatures[i]![c * COMPONENTS + j] = dotProduct;
                }
            }
        }

        console.log(`PCA complete. Features shape: [${numChunks}, ${CHANNELS * COMPONENTS}]`)
        return pcaFeatures
    }

    return {
        applyPCA,
        CHANNELS,
        COMPONENTS,
        CHUNK_SIZE,
        TIME_POINTS
    }
}
