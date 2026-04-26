import * as Papa from 'papaparse'

export const useEEGValidation = () => {
    const kilobyteSize = 1024
    const megabyteSize = 1024 * kilobyteSize
    const max_file_size = 100 * megabyteSize

    const validateFile = (file: File | null): string | null => {
        if (!file) {
            return "Please upload a file."
        }
        if (file.size > max_file_size) {
            return "File too large. Please upload a smaller file."
        }
        return null
    }

    const parseCSV = (file: File): Promise<Float32Array> => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results: Papa.ParseResult<any[]>) => {
                    try {
                        const rows = results.data
                        if (rows.length === 0 || !rows[0]) {
                            throw new Error("Empty file")
                        }

                        const numCols = rows[0].length
                        if (numCols !== 19) {
                            throw new Error(`Invalid format: Expected 19 channels (columns), but got ${numCols}.`)
                        }

                        const flatData = rows.flat()
                        const numRows = Math.floor(flatData.length / 19)

                        if (numRows < 256) {
                            throw new Error("Recording too short: Need at least 256 time points (2 seconds).")
                        }

                        if (numRows > 300 * 128) {
                            throw new Error("Recording too long: Maximum 300 seconds allowed.")
                        }

                        const hasInvalidValues = flatData.some(val => typeof val !== 'number' || isNaN(val))
                        if (hasInvalidValues) {
                            throw new Error("Invalid data format: CSV contains non-numeric values or empty fields.")
                        }

                        console.log(`Finished parsing CSV: ${numRows} rows found.`)
                        resolve(new Float32Array(flatData))
                    } catch (err: any) {
                        reject(err)
                    }
                },
                error: (err) => {
                    reject(new Error(`Error parsing CSV file: ${err.message}`))
                }
            })
        })
    }

    return {
        validateFile,
        parseCSV
    }
}
