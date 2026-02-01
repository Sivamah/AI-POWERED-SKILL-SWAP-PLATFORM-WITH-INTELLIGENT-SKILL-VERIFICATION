---
description: How to start and stop the Skill Swap AI project
---

# Running the Project

## Prerequisites
- Node.js installed
- Python installed with dependencies (`pip install -r backend/requirements.txt`)

## Start Servers
You need two separate terminals.

1.  **Backend (FastAPI)**
    ```powershell
    cd "d:\AI POWERED\backend"
    uvicorn main:app --reload
    ```

2.  **Frontend (React/Vite)**
    ```powershell
    cd "d:\AI POWERED\frontend"
    npm run dev
    ```

## Stop Servers
To stop the servers, you can usage one of the following methods:

**Method 1: Safe Stop (Recommended)**
- Click inside the running terminal window.
- Press `Ctrl + C`.
- Type `y` if prompted to terminate the batch job.

**Method 2: Force Kill (Windows)**
Run this command in any terminal to kill all Node and Python processes (use with caution):
```powershell
taskkill /F /IM node.exe /IM python.exe
```
// turbo
