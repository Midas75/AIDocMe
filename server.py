from os.path import dirname, abspath
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from aidocme import process, serialize

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

current_dir = dirname(abspath(__file__))
app.mount("/static", StaticFiles(directory=current_dir))


@app.get("/")
async def redirect_to_index():
    return RedirectResponse(url="/static/index.html")


@app.post("/docme")
async def docme(file: UploadFile = File(...)):
    if not file.filename.endswith(".py"):
        raise HTTPException(status_code=400, detail="Only .py files are allowed.")
    content = await file.read()
    try:
        source = content.decode("utf-8")
    except UnicodeDecodeError as e:
        raise HTTPException(
            status_code=400, detail="File must be UTF-8 encoded."
        ) from e
    return JSONResponse(content=serialize(*process(file.filename, source)))


if __name__ == "__main__":
    from uvicorn import run

    run("server:app", host="0.0.0.0", port=8000, reload=True)
