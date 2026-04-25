import { PCA } from 'ml-pca'

export const usePCA = () => {
    const CHANNELS = 19
    const TIME_POINTS = 128
    const COMPONENTS = 10
    const CHUNK_SIZE = CHANNELS * TIME_POINTS

    const applyPCA = (data: Float32Array): Float32Array[] => {
        const numChunks = Math.floor(data.length / CHUNK_SIZE)
        if (numChunks < 2) {
            throw new Error("Not enough data to perform PCA. Please upload a longer recording (at least 2 seconds).")
        }

        console.log(`Starting PCA preprocessing on ${numChunks} chunks...`)

        // 1. Reshape data into [numChunks, TIME_POINTS, CHANNELS]
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

        // 2. Apply PCA per channel
        const pcaFeatures: Float32Array[] = Array.from({ length: numChunks }, () => new Float32Array(CHANNELS * COMPONENTS))

        for (let c = 0; c < CHANNELS; c++) {
            const channelData: number[][] = Array.from({ length: numChunks }, (_, i) => {
                const row = new Float64Array(TIME_POINTS)
                for (let t = 0; t < TIME_POINTS; t++) {
                    row[t] = reshapedData[i]![t]![c]!
                }
                return Array.from(row)
            })

            const pca = new PCA(channelData)
            const availableComponents = Math.min(pca.getEigenvalues().length, COMPONENTS)
            const reduced = pca.predict(channelData, { nComponents: availableComponents })

            for (let i = 0; i < numChunks; i++) {
                for (let pc = 0; pc < COMPONENTS; pc++) {
                    if (pc < availableComponents) {
                        pcaFeatures[i]![c * COMPONENTS + pc] = reduced.get(i, pc)
                    } else {
                        pcaFeatures[i]![c * COMPONENTS + pc] = 0
                    }
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
