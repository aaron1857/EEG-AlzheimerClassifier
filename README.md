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
pnpm install
```
Running the project:
```
pnpm start
```
From here, a window should open up with the project


**NOTE:** You will need to modify the directory in the python command if you are running this in Windows since Windows does directories its own way.
The comand *should* work for Linux and Mac OS.

**NOTE:** Both of these commands are written assuming you run them from the root directory of the project.

## Building the project
**Make sure you run pnpm i above**


Afterwards, run
```
pnpm make
```
*Note*: It will take a while for this command to run.
This should make a desktop app for your OS.
For linux
- It creates an appimage as well as a zip file with the build in it.
For MacOS and Windows
- It create a zip folder with the build inside it.

This will be in the "out" folder of the project, click on the folder with your OS name. Finally go through the folders until you see the executable for your OS.
