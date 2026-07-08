import { useState } from "react";
import Header from "./components/Header";
import LandingScreen from "./components/LandingScreen";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import api from "./services/api";
import { Film } from "lucide-react";

const loadHistory = () => {
  try {
    const data = localStorage.getItem("tubewave_history");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveHistory = (newHistory) => {
  try {
    localStorage.setItem("tubewave_history", JSON.stringify(newHistory));
  } catch (e) {
    console.error(e);
  }
};

function App() {
  const [video, setVideo] = useState(null); // { url, title? } | null
  const [messages, setMessages] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [videoError, setVideoError] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [history, setHistory] = useState(loadHistory);

  const videoLoaded = Boolean(video);

  const loadVideo = async (url, existingSessionId = null) => {
    if (!url.trim()) return;

    const sessionUuid = existingSessionId || crypto.randomUUID();

    try {
      setVideoLoading(true);
      setVideoError("");

      const res = await api.post("/load_video", {
        url,
        session_id: sessionUuid,
      });

      const videoTitle = res?.data?.title || "Video Analysis";

      if (!existingSessionId) {
        const newSession = {
          id: sessionUuid,
          url,
          title: videoTitle,
          messages: [],
          timestamp: Date.now(),
        };
        const updatedHistory = [newSession, ...history];
        setHistory(updatedHistory);
        saveHistory(updatedHistory);
        setMessages([]);
      }

      setVideo({ url, title: videoTitle });
      setCurrentSessionId(sessionUuid);
    } catch (err) {
      console.error(err);
      const detail = err?.response?.data?.detail || "Failed to load video. Check the URL and try again.";
      setVideoError(detail);
      setVideo(null);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleSelectSession = async (session) => {
    setMessages(session.messages);
    setVideo({ url: session.url, title: session.title });
    setCurrentSessionId(session.id);

    try {
      const res = await api.post("/load_video", {
        url: session.url,
        session_id: session.id,
      });
      const videoTitle = res?.data?.title;
      if (videoTitle && videoTitle !== session.title) {
        const updatedHistory = history.map((s) => {
          if (s.id === session.id) {
            return { ...s, title: videoTitle };
          }
          return s;
        });
        setHistory(updatedHistory);
        saveHistory(updatedHistory);
        setVideo({ url: session.url, title: videoTitle });
      }
    } catch (err) {
      console.error("Error warming up session in backend:", err);
    }
  };

  const handleDeleteSession = (sessionId) => {
    const updatedHistory = history.filter((s) => s.id !== sessionId);
    setHistory(updatedHistory);
    saveHistory(updatedHistory);
    if (currentSessionId === sessionId) {
      setVideo(null);
      setCurrentSessionId(null);
      setMessages([]);
    }
  };

  const goBack = () => {
    setVideo(null);
    setCurrentSessionId(null);
    setMessages([]);
    setVideoError("");
  };

  const sendMessage = async (question) => {
    if (!question.trim() || !videoLoaded || !currentSessionId) return;

    const userMessage = { role: "user", content: question };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    const updatedHistoryWithUser = history.map((s) => {
      if (s.id === currentSessionId) {
        return { ...s, messages: newMessages, timestamp: Date.now() };
      }
      return s;
    });
    setHistory(updatedHistoryWithUser);
    saveHistory(updatedHistoryWithUser);

    try {
      setChatLoading(true);

      const response = await api.post("/chat", {
        question,
        session_id: currentSessionId,
      });

      const assistantMessage = { role: "assistant", content: response.data.answer };
      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);

      const updatedHistoryWithAssistant = history.map((s) => {
        if (s.id === currentSessionId) {
          return { ...s, messages: finalMessages, timestamp: Date.now() };
        }
        return s;
      });
      setHistory(updatedHistoryWithAssistant);
      saveHistory(updatedHistoryWithAssistant);
    } catch (err) {
      console.error(err);
      const errorMessage = {
        role: "assistant",
        content: "Something went wrong answering that — please try again.",
        isError: true,
      };
      const finalMessagesWithErr = [...newMessages, errorMessage];
      setMessages(finalMessagesWithErr);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Header containing Video URL Loader */}
      <Header
        loadVideo={loadVideo}
        loading={videoLoading}
        videoLoaded={videoLoaded}
        video={video}
        error={videoError}
      />

      <main className="flex-1 flex flex-col min-h-0 relative">
        {videoLoaded ? (
          <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-300">
            {/* Active Video Source Bar */}
            <div className="border-b border-slate-900 bg-slate-950/50 px-4 py-2 sm:px-8 md:px-12 lg:px-16 text-[11px] text-slate-400">
              <div className="mx-auto flex w-full max-w-none items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Film size={12} className="text-indigo-400 shrink-0" />
                  <span className="font-semibold text-slate-300 shrink-0">Connected Source:</span>
                  <span className="truncate font-medium text-indigo-400">
                    {video.title || video.url}
                  </span>
                </div>
                <button
                  onClick={goBack}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-350 hover:text-white px-2.5 py-1 text-[10px] font-semibold border border-slate-800 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  ← Back to Home
                </button>
              </div>
            </div>

            {/* Chatbot conversation window */}
            <ChatWindow
              messages={messages}
              loading={chatLoading}
              onPromptClick={sendMessage}
            />

            {/* User message input box */}
            <ChatInput disabled={chatLoading} onSend={sendMessage} />
          </div>
        ) : (
          <LandingScreen
            loadVideo={loadVideo}
            loading={videoLoading}
            error={videoError}
            history={history}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
          />
        )}
      </main>
    </div>
  );
}

export default App;