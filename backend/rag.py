from dotenv import load_dotenv

from langchain_huggingface import (
    ChatHuggingFace,
    HuggingFaceEndpoint,
)

from langchain_core.prompts import ChatPromptTemplate

from langchain_core.output_parsers import (
    StrOutputParser,
)

from loader import load_video

from utils import format_docs


load_dotenv()

llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation",
)

model = ChatHuggingFace(llm=llm)

prompt = ChatPromptTemplate.from_template(
    """
You are a helpful assistant.

You are given a youtube transcript.

Answer ONLY from the provided context and our previous chat history.

Context:
{context}

Chat History:
{chat_history}

Question:
{question}
"""
)

# Holds per-session state: retriever + chat history for each user/chat
sessions = {}


def load_new_video(url, session_id):

    retriever, metadata = load_video(url)

    sessions[session_id] = {
        "retriever": retriever,
        "chat_history": [],
    }
    return metadata


def chat(question, session_id):

    if session_id not in sessions:
        return "Please load a YouTube video first."

    retriever = sessions[session_id]["retriever"]
    chat_history = sessions[session_id]["chat_history"]

    history_text = ""

    for human, ai in chat_history:
        history_text += (
            f"Human: {human}\n"
            f"Assistant: {ai}\n"
        )

    rag_chain = (
        {
            "context": lambda x: format_docs(
                retriever.invoke(x["question"])
            ),
            "question": lambda x: x["question"],
            "chat_history": lambda x: x["chat_history"],
        }
        | prompt
        | model
        | StrOutputParser()
    )

    response = rag_chain.invoke(
        {
            "question": question,
            "chat_history": history_text,
        }
    )

    chat_history.append((question, response))

    return response