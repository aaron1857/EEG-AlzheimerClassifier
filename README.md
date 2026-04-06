# EEG-AlzheimerClassifier
This project, our team's senior design project, focuses on developing a machine‑learning model that uses publicly available datasets to analyze EEG recordings to detect biomarkers indicative of Alzheimer’s disease, providing a non‑invasive screening tool for early diagnosis.

We intend to use the following dataset:

https://www.kaggle.com/datasets/codingyodha/largest-alzheimer-eeg-dataset

Due to github file size limits we cannot save this file to github. Instead we reccomend using Google Colab to run the jupyter notebook, since we haven't adapted the notebook to run locally yet.

## Running the Project
Our project utilized Nuxt for the frontend, but we plan on having the backend written in python since that is better suited to handle the machine learning model.

Since we currently do not have a backend, the best way to test it is by building it with pnpm, and then serving the built files with python. Eventually we will make a proper main.py instead of launching a python http server.

Installing pnpm:

If you have npm, but not pnpm:
```
npm install -g pnpm
```
If you do not have npm installed, follow: https://pnpm.io/installation


Install packages needed to build the project:
```
pnpm i
```
Building the project:
```
pnpm build
```
Running the project:
```
python -m http.server 3000 -d ./.output/public/
```
From here, you can the access it on port 3000 on your computer using this link: http://localhost:3000


**NOTE:** You will need to modify the directory in the python command if you are running this in Windows since Windows does directories its own way.
The comand *should* work for Linux and Mac OS.

**NOTE:** Both of these commands are written assuming you run them from the root directory of the project.
