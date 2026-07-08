import { useEffect, useRef } from "react";
import Message from "./Message";
import { Sparkles, Terminal, Video } from "lucide-react";

export default function ChatWindow({ messages, loading, onPromptClick }) {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const starterPrompts = [
    {
      text: "Summarize this video in detail",
      icon: <Sparkles size={14} className="text-amber-400" />,
    },
    {
      text: "What are the main key takeaways?",
      icon: <Video size={14} className="text-emerald-400" />,
    },
    {
      text: "Extract any code, tools or links mentioned",
      icon: <Terminal size={14} className="text-indigo-400" />,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 md:px-12 lg:px-16">
      <div className="mx-auto flex w-full max-w-none flex-col gap-6">
        {messages.length === 0 && !loading && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-350">
            <div className="relative mb-6">
              <div className="absolute inset-0 animate-ping rounded-3xl bg-indigo-500/10 blur-md opacity-75" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600/20 to-violet-500/20 border border-indigo-500/30 text-3xl shadow-xl shadow-indigo-500/5">
                🤖
              </div>
            </div>
            
            <h2 className="mb-2 text-2xl font-extrabold text-white tracking-tight">
              AI Chatbot Session Connected
            </h2>
            <p className="max-w-md text-sm text-slate-400 leading-relaxed mb-8">
              The transcript is loaded and ready. Ask any question below or click a starter prompt to begin the analysis.
            </p>

            {/* Quick Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl px-4">
              {starterPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onPromptClick && onPromptClick(prompt.text)}
                  className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-left text-xs font-semibold text-slate-300 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-200 active:scale-[0.98] cursor-pointer hover:shadow-md hover:shadow-indigo-500/[0.02]"
                >
                  <span className="shrink-0">{prompt.icon}</span>
                  <span className="line-clamp-2 leading-snug">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Feed */}
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} isError={msg.isError} />
        ))}

        {/* Typing Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-4 animate-in fade-in duration-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/10">
              🤖
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-1">
                TubeWave
              </span>
              <div className="flex items-center justify-center gap-1.5 rounded-2xl px-4 py-2.5 bg-slate-900/30 border border-slate-850/80 backdrop-blur-sm shadow-md w-fit h-9">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}