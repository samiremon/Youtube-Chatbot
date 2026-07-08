from urllib.parse import urlparse, parse_qs, unquote
import re
import urllib.request
import json

from youtube_transcript_api import YouTubeTranscriptApi

from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings


embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


def extract_video_id(url):
    url = unquote(url.strip())
    # 1. Clean 11-char ID
    if len(url) == 11 and re.match(r'^[a-zA-Z0-9_-]{11}$', url):
        return url

    # 2. Match standard formats including shorts, watch, embed, youtu.be, etc.
    pattern = r'(?:v=|\/embed\/|\/v\/|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})'
    match = re.search(pattern, url)
    if match:
        return match.group(1)

    # 3. Robust fallback using urlparse
    try:
        parsed_url = urlparse(url)
        query_params = parse_qs(parsed_url.query)
        v_list = query_params.get("v")
        if v_list:
            return v_list[0]
            
        path_parts = [p for p in parsed_url.path.split('/') if p]
        if path_parts:
            last_part = path_parts[-1]
            if len(last_part) == 11 and re.match(r'^[a-zA-Z0-9_-]{11}$', last_part):
                return last_part
    except Exception:
        pass

    return None


def get_video_metadata(video_id):
    try:
        url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            return {
                "title": data.get("title", "YouTube Video"),
                "author_name": data.get("author_name", "Unknown Artist")
            }
    except Exception:
        return {
            "title": "YouTube Video",
            "author_name": "Unknown Artist"
        }


def load_video(url):
    video_id = extract_video_id(url)
    if not video_id:
        raise ValueError("Could not extract a valid YouTube Video ID. Please check the URL format.")

    metadata = get_video_metadata(video_id)
    title = metadata["title"]
    author_name = metadata["author_name"]

    try:
        ytt_api = YouTubeTranscriptApi()
        transcript_list = ytt_api.list(video_id)
        
        # Try to get English transcript directly
        try:
            transcript = transcript_list.find_transcript(['en'])
        except Exception:
            transcript = None
            
        # If English is not directly available, try translating any transcript to English
        if not transcript:
            for t in transcript_list:
                try:
                    transcript = t.translate('en')
                    break
                except Exception:
                    pass
                    
        # If translation is not available, fall back to the first available transcript
        if not transcript:
            for t in transcript_list:
                transcript = t
                break
                
        if not transcript:
            raise ValueError("No transcript is available for this video.")
            
        transcript = transcript.fetch()
    except Exception as e:
        raise ValueError(f"Could not load transcript for video {video_id}: {str(e)}")

    documents = []

    for snippet in transcript.snippets:

        documents.append(
            Document(
                page_content=snippet.text,
                metadata={
                    "video_id": video_id,
                    "start": snippet.start,
                    "duration": snippet.duration,
                    "title": title,
                    "author_name": author_name,
                },
            )
        )

    merged_documents = []

    MAX_CHARS = 1000

    current_text = ""
    current_start = None
    last_end = None

    for doc in documents:

        if current_start is None:
            current_start = doc.metadata["start"]

        current_text += doc.page_content + " "

        last_end = (
            doc.metadata["start"]
            + doc.metadata["duration"]
        )

        if len(current_text) >= MAX_CHARS:
            content_with_metadata = f"Video Title: {title}\nSinger/Author: {author_name}\nTranscript Content:\n{current_text.strip()}"
            merged_documents.append(
                Document(
                    page_content=content_with_metadata,
                    metadata={
                        "video_id": video_id,
                        "start": current_start,
                        "end": last_end,
                        "title": title,
                        "author_name": author_name,
                    },
                )
            )

            current_text = ""
            current_start = None
            last_end = None

    if current_text:
        content_with_metadata = f"Video Title: {title}\nSinger/Author: {author_name}\nTranscript Content:\n{current_text.strip()}"
        merged_documents.append(
            Document(
                page_content=content_with_metadata,
                metadata={
                    "video_id": video_id,
                    "start": current_start,
                    "end": last_end,
                    "title": title,
                    "author_name": author_name,
                },
            )
        )

    import chromadb
    chroma_client = chromadb.EphemeralClient()

    vector_store = Chroma.from_documents(
        documents=merged_documents,
        embedding=embeddings,
        client=chroma_client,
        collection_name=f"video_{video_id}",
    )

    return vector_store.as_retriever(
        search_kwargs={"k": 7}
    ), metadata