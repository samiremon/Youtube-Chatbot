import { useState } from "react";
import { Link2, Loader2, Sparkles, AlertCircle, History, Trash2 } from "lucide-react";

export default function LandingScreen({ loadVideo, loading, error, history, onSelectSession, onDeleteSession }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim() || loading) return;
    loadVideo(url);
  };

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-10 px-4 sm:px-6 py-12 w-full h-full min-h-[75vh]">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[700px] rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 blur-[100px]" />
      </div>

      {/* Center Welcome Section */}
      <div className="w-full flex flex-col items-center text-center animate-in fade-in zoom-in-98 duration-300">
        <div className="relative mb-5">
          <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-500/15 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-500/20 border border-indigo-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-white translate-x-0.5"
            >
              <polygon points="6 3 20 12 6 21 6 3" fill="currentColor" className="text-indigo-100" />
            </svg>
          </div>
        </div>
        <h2 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl md:text-6xl select-none">
          Welcome to <span className="bg-gradient-to-tr from-indigo-400 to-violet-400 bg-clip-text text-transparent">TubeWave</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg mx-auto">
          Unleash the power of AI on video content. Transcribe, analyze, and chat instantly.
        </p>
      </div>

      {/* Input Section - Large premium height dashboard bar */}
      <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-400">
        <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/30 p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-slate-950/50">
          {/* Subtle glow border */}
          <div className="absolute -inset-0.5 -z-10 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 opacity-35 blur-md" />
          
          <form
            onSubmit={handleSubmit}
            className={`w-full flex items-center gap-3 sm:gap-5 rounded-2xl border bg-slate-950 p-4 pl-5 sm:pl-7 transition-all duration-300 ${
              error
                ? "border-rose-500/50 ring-2 ring-rose-500/10"
                : "border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10"
            }`}
          >
            <div className="flex items-center text-slate-500 shrink-0">
              <Link2 size={20} className="sm:size-[22px]" />
            </div>

            <input
              type="text"
              className="w-full bg-transparent text-base sm:text-lg text-slate-100 placeholder:text-slate-500 focus:outline-none disabled:cursor-not-allowed py-3.5 pl-1"
              placeholder="Paste YouTube video link here..."
              value={url}
              disabled={loading}
              onChange={(e) => setUrl(e.target.value)}
            />

            {/* Extra Large Glowing Action Button */}
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[size:200%_auto] hover:bg-[position:right_center] disabled:from-slate-900 disabled:to-slate-900 disabled:bg-[size:auto] disabled:text-slate-650 disabled:border-transparent text-white px-8 py-4 text-sm sm:text-base font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-500 disabled:cursor-not-allowed cursor-pointer shrink-0 whitespace-nowrap border border-indigo-500/25"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin text-indigo-300" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-indigo-200 animate-pulse" />
                  <span>Load Video</span>
                </>
              )}
            </button>
          </form>

          {/* Centered Instructions text */}
          <p className="mt-4.5 text-center text-xs sm:text-sm font-medium text-slate-500 px-4">
            Paste a YouTube URL in the input field above to start chatting with the video's content.
          </p>
        </div>

        {/* Form Error Message */}
        {error && (
          <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-rose-400 bg-rose-950/40 border border-rose-900/40 rounded-2xl px-5 py-3 text-left animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle size={16} className="shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Chat History Section */}
      <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="flex items-center gap-2.5 mb-4 px-2 select-none">
          <History size={14} className="text-slate-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recent Conversations
          </span>
          <div className="h-px flex-1 bg-slate-900" />
        </div>

        {history && history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {history.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session)}
                className="group relative flex items-center justify-between gap-3 rounded-2xl border border-slate-900 bg-slate-900/20 p-4 hover:border-slate-800 hover:bg-slate-900/50 transition-all duration-200 cursor-pointer hover:shadow-lg"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                    🤖
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-250 truncate group-hover:text-white transition-colors">
                      {session.title || "Video Analysis"}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {session.messages.length} messages · {new Date(session.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-rose-500/10 hover:text-rose-450 text-slate-500 transition-all active:scale-90 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                  title="Delete chat history"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-900/50 bg-slate-900/5 p-8 select-none">
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Your recent video chat sessions will appear here for quick access. Paste a link above to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
