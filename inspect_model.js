import ort from 'onnxruntime-node';

async function inspect(path) {
    try {
        const session = await ort.InferenceSession.create(path);
        console.log(`--- ${path} ---`);
        console.log("Input names:", session.inputNames);
        console.log("Input metadata:", JSON.stringify(session.inputMetadata, null, 2));
        console.log("Output names:", session.outputNames);
        console.log("Output metadata:", JSON.stringify(session.outputMetadata, null, 2));
    } catch (e) {
        console.error(`Error loading model ${path}:`, e.message);
    }
}

async function main() {
    await inspect('./public/models/xgboost_model.onnx');
    await inspect('./public/models/combined_pca_xgboost.onnx');
}
main();
