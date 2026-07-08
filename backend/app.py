from fastapi import FastAPI, HTTPException

from models import (
    QuestionRequest,
    VideoRequest,
)

from rag import (
    chat,
    load_new_video,
)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/load_video")
def load_video_api(data: VideoRequest):
    try:
        metadata = load_new_video(data.url, data.session_id)
        return {
            "message": "Video loaded successfully.",
            "title": metadata.get("title") if metadata else "YouTube Video",
            "author_name": metadata.get("author_name") if metadata else "Unknown Artist"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process video: {str(e)}")


@app.post("/chat")
def chat_api(data: QuestionRequest):

    return {
        "answer": chat(data.question, data.session_id)
    }