from pydantic import BaseModel


class QuestionRequest(BaseModel):
    question: str
    session_id: str


class VideoRequest(BaseModel):
    url: str
    session_id: str