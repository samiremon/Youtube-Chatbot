import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function Message({ role, content, isError }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`group flex w-full items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl font-bold shadow-md transition-all duration-300 ${
          isUser
            ? "bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-indigo-500/20"
            : "bg-slate-900 border border-slate-800 text-indigo-400 shadow-slate-950/55"
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} className="animate-pulse" />}
      </div>

      {/* Bubble Container */}
      <div className={`relative max-w-[80%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        {/* Username/Role Header */}
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-1 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {isUser ? "You" : "TubeWave"}
        </span>

        {/* Bubble */}
        <div
          className={`relative rounded-2xl px-4 py-3.5 shadow-md border transition-all duration-200 w-fit ${
            isUser
              ? "bg-gradient-to-tr from-indigo-600 to-violet-600 text-white border-indigo-500/30"
              : isError
              ? "border-rose-950 bg-rose-950/30 text-rose-200"
              : "bg-slate-900/60 border-slate-850 backdrop-blur-sm text-slate-200 hover:border-slate-800 pr-12"
          }`}
        >
          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed font-sans">{content}</div>

          {/* Copy Button (only for AI assistant messages) */}
          {!isUser && !isError && (
            <button
              onClick={handleCopy}
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-950/80 hover:bg-slate-950 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg border border-slate-800"
              title="Copy answer"
            >
              {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}