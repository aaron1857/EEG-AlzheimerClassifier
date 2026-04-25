import fs from 'fs';
import Papa from 'papaparse';
import { PCA } from 'ml-pca';
import ort from 'onnxruntime-node';

const CHANNELS = 19;
const TIME_POINTS = 128;
const COMPONENTS = 10;
const CHUNK_SIZE = CHANNELS * TIME_POINTS;

async function testFile(filePath) {
    console.log(`Testing ${filePath}...`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const results = Papa.parse(fileContent, { dynamicTyping: true, skipEmptyLines: true });
    const rows = results.data;
    const flatData = rows.flat();
    const data = new Float32Array(flatData);

    const numChunks = Math.floor(data.length / CHUNK_SIZE);
    if (numChunks < 2) {
        console.log("Too short");
        return;
    }

    const reshapedData = Array.from({ length: numChunks }, () => 
        Array.from({ length: TIME_POINTS }, () => new Float32Array(CHANNELS))
    );

    for (let i = 0; i < numChunks; i++) {
        for (let t = 0; t < TIME_POINTS; t++) {
            for (let c = 0; c < CHANNELS; c++) {
                reshapedData[i][t][c] = data[i * CHUNK_SIZE + t * CHANNELS + c];
            }
        }
    }

    const pcaFeatures = Array.from({ length: numChunks }, () => new Float32Array(CHANNELS * COMPONENTS));

    for (let c = 0; c < CHANNELS; c++) {
        const channelData = Array.from({ length: numChunks }, (_, i) => {
            const row = new Float64Array(TIME_POINTS);
            for (let t = 0; t < TIME_POINTS; t++) {
                row[t] = reshapedData[i][t][c];
            }
            return Array.from(row);
        });

        const pca = new PCA(channelData);
        const availableComponents = Math.min(pca.getEigenvalues().length, COMPONENTS);
        const reduced = pca.predict(channelData, { nComponents: availableComponents });

        for (let i = 0; i < numChunks; i++) {
            for (let pc = 0; pc < COMPONENTS; pc++) {
                if (pc < availableComponents) {
                    pcaFeatures[i][c * COMPONENTS + pc] = reduced.get(i, pc);
                } else {
                    pcaFeatures[i][c * COMPONENTS + pc] = 0;
                }
            }
        }
    }

    const session = await ort.InferenceSession.create('./public/models/xgboost_model.onnx');
    let atRiskVotes = 0;

    for (let i = 0; i < numChunks; i++) {
        const inputVector = pcaFeatures[i];
        const tensor = new ort.Tensor('float32', inputVector, [1, CHANNELS * COMPONENTS]);
        const runResults = await session.run({ input: tensor });
        const firstOutput = Object.values(runResults)[0];
        const prediction = runResults.label ? Number(runResults.label.data[0]) : Number(firstOutput.data[0]);
        if (prediction !== 0) {
            atRiskVotes++;
        }
    }

    const atRiskRatio = atRiskVotes / numChunks;
    console.log(`At-risk ratio: ${atRiskRatio.toFixed(2)} (${atRiskVotes}/${numChunks})`);
    if (atRiskRatio >= 0.4) {
        console.log("Result: AT RISK");
    } else {
        console.log("Result: LOW RISK");
    }
}

async function main() {
    await testFile('./test_data/test_2.5s_truncates.csv');
    await testFile('./test_data/test_5s_valid.csv');
}
main();
