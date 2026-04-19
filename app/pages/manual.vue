<template>
    <div class="font-secondary">
        <div class="mx-auto py-10 px-6 h-[calc(100dvh-6rem)] overflow-y-auto">
            <h1 class="text-4xl font-bold text-center mb-2">Wavethinker User Manual</h1>
            <p class="text-center text-lg opacity-70 mb-10">Complete guide to using Wavethinker for EEG-based Alzheimer's detection</p>

            <div class="space-y-6">
                <UCard>
                    <template #header>
                        <h2 class="text-2xl font-bold flex items-center gap-2">
                            <UIcon name="i-heroicons-information-circle" class="w-6 h-6" />
                            Overview
                        </h2>
                    </template>
                    <div class="space-y-3">
                        <p>Wavethinker is an open-source Machine Learning-powered tool that analyzes EEG data to detect patterns associated with Alzheimer's Disease.</p>
                        <p>The system uses machine learning to examine brain wave signals and provide a classification result along with a confidence score.</p>
                    </div>
                </UCard>

                <UCard>
                    <template #header>
                        <h2 class="text-2xl font-bold flex items-center gap-2">
                            <UIcon name="i-heroicons-book-open" class="w-6 h-6" />
                            How to use Wavethinker
                        </h2>
                    </template>
                    <div class="space-y-4">
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                            <div>
                                <h3 class="font-semibold text-lg">Prepare Your EEG Data</h3>
                                <p class="opacity-75">Ensure your EEG data is in CSV format with proper electrode channel labels and time-series measurements in the international 10-20 system.</p>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                            <div>
                                <h3 class="font-semibold text-lg">Navigate to the Analysis Page and Upload Data</h3>
                                <p class="opacity-75">Click on "Upload EEG Data" in the Analyse page and select the CSV file containing the EEG data, then click submit.</p>
                            </div>
                        </div>

                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
                            <div>
                                <h3 class="font-semibold text-lg">Thats it!</h3>
                                <p class="opacity-75">Give it a moment to process data and your results should be ready.</p>
                            </div>
                        </div>
                    </div>
                </UCard>

                <UCard>
                    <template #header>
                        <h2 class="text-2xl font-bold flex items-center gap-2">
                            <UIcon name="i-heroicons-document-arrow-up" class="w-6 h-6" />
                            File Requirements
                        </h2>
                    </template>
                    <div class="space-y-3">
                        <UTable :data="fileRequirements" :columns="fileColumns" />
                        <UAlert color="warning" variant="subtle" icon="i-heroicons-exclamation-triangle">
                            <template #title>Important</template>
                            <template #description>Ensure your CSV file follows the standard EEG format with electrode channels as columns and time points as rows.</template>
                        </UAlert>
                    </div>
                </UCard>

                <UCard>
                    <template #header>
                        <h2 class="text-2xl font-bold flex items-center gap-2">
                            <UIcon name="i-heroicons-question-mark-circle" class="w-6 h-6" />
                            Frequently Asked Questions
                        </h2>
                    </template>
                    <UAccordion :items="faqs" />
                </UCard>

                <UCard>
                    <template #header>
                        <h2 class="text-2xl font-bold flex items-center gap-2">
                            <UIcon name="i-heroicons-exclamation-circle" class="w-6 h-6" />
                            Troubleshooting
                        </h2>
                    </template>
                    <div class="space-y-3">
                        <div v-for="issue in troubleshooting" :key="issue.problem">
                            <h4 class="font-semibold flex items-center gap-2">
                                <UIcon name="i-heroicons-x-circle" class="w-4 h-4 text-red-500" />
                                {{ issue.problem }}
                            </h4>
                            <p class="ml-6 opacity-75">{{ issue.solution }}</p>
                        </div>
                    </div>
                </UCard>

                <UCard>
                    <template #header>
                        <h2 class="text-2xl font-bold flex items-center gap-2">
                            <UIcon name="i-heroicons-light-bulb" class="w-6 h-6" />
                            Tips for Best Results
                        </h2>
                    </template>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="tip in tips" :key="tip.title" class="flex gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                            <UIcon :name="tip.icon" class="w-5 h-5 mt-1 flex-shrink-0 text-primary" />
                            <div>
                                <h4 class="font-semibold">{{ tip.title }}</h4>
                                <p class="text-sm opacity-75">{{ tip.description }}</p>
                            </div>
                        </div>
                    </div>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const fileColumns = [
    { id: 'property', accessorKey: 'property', header: 'Property' },
    { id: 'requirement', accessorKey: 'requirement', header: 'Requirement' }
]

const fileRequirements = [
    { property: 'File Format', requirement: 'CSV (Comma Separated Values)' },
    { property: 'Maximum Size', requirement: '20 MB' },
    { property: 'Structure', requirement: 'Channels as columns, time points as rows' },
    { property: 'Encoding', requirement: 'UTF-8' },
    { property: 'Headers', requirement: 'Channel names in first row' }
]

const faqs = [
    {
        label: 'What EEG format is supported?',
        content: 'We support standard CSV format with electrode channels as columns and time-series data points as rows.',
        icon: 'i-heroicons-chevron-down'
    },
    {
        label: 'How long does the analysis take?',
        content: 'Processing time depends on the file size. Typically, analysis completes within 2-5 seconds for standard EEG recordings. You will see a loading indicator during processing.',
        icon: 'i-heroicons-chevron-down'
    },
    {
        label: 'What do the results mean?',
        content: 'The results provide a classification indicating whether the EEG patterns are consistent with indicators of Alzheimer\'s Disease, along with a confidence percentage. This should be used as a screening tool only, not a diagnosis.',
        icon: 'i-heroicons-chevron-down'
    },
    {
        label: 'Is my data kept private?',
        content: 'Yes, all processing is done locally, and no data is stored permanently.',
        icon: 'i-heroicons-chevron-down'
    },
]

const troubleshooting = [
    {
        problem: 'It keeps giving me an error!',
        solution: 'Make sure your csv file is in the international 10-20 system for EEG data.'
    },
    // We can add more here if we think of more
]

const tips = [
    {
        icon: 'i-heroicons-document-chart-bar',
        title: 'Clean Data',
        description: 'Remove artifacts and eye blinks before uploading for more accurate results.'
    },
    {
        icon: 'i-heroicons-clock',
        title: 'Adequate Recording Length',
        description: 'Use recordings of at least 30 seconds to 5 minutes for best analysis accuracy.'
    },
    {
        icon: 'i-heroicons-signal',
        title: 'Standard Montage',
        description: 'Standard 10-20 electrode placement provides the most reliable results.'
    },
    {
        icon: 'i-heroicons-sparkles',
        title: 'Preprocessing',
        description: 'Apply bandpass filtering (0.5-45 Hz) to your EEG data before export.'
    }
]
</script>
