import { useState, useRef, useEffect } from "react";
import { ArrowUp, Paperclip } from "lucide-react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const send = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // auto-resize textarea as user types, capped so it doesn't take over the screen
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 320) + "px";
  }, [text]);

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-slate-900 bg-slate-950/90 backdrop-blur-md px-4 py-4 sm:px-8 md:px-12 lg:px-16">
      <div className="group relative mx-auto w-full max-w-none">
        {/* Ambient background glow active on focus */}
        <div className="absolute -inset-0.5 -z-10 rounded-[30px] bg-gradient-to-r from-indigo-500/15 to-violet-500/15 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-300" />
        
        {/* WhatsApp/Messenger style Input Pill */}
        <div
          className={`flex items-end gap-4 rounded-[32px] border py-3.5 px-5 transition-all duration-300 shadow-xl ${
            disabled
              ? "border-slate-900 bg-slate-900/20"
              : "border-slate-800 bg-slate-900/40 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:bg-slate-900/60"
          }`}
        >
          {/* Attachment Icon */}
          <button
            type="button"
            disabled={disabled}
            aria-label="Attach file"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:hover:text-slate-400 disabled:hover:bg-transparent mb-0.5"
          >
            <Paperclip size={22} />
          </button>

          {/* Text Input Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            className="w-full resize-none bg-transparent py-2.5 px-1.5 text-base text-slate-100 placeholder:text-slate-500/80 focus:outline-none disabled:cursor-not-allowed leading-6 overflow-y-auto mb-0.5"
            placeholder={disabled ? "Chatbox locked..." : "Ask about the video transcript..."}
            disabled={disabled}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Premium Gradient Send Button */}
          <button
            disabled={!canSend}
            onClick={send}
            aria-label="Send message"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${
              canSend
                ? "bg-gradient-to-tr from-indigo-600 to-violet-500 text-white hover:from-indigo-500 hover:to-violet-400 hover:scale-[1.04] active:scale-95 shadow-md shadow-indigo-500/20"
                : "bg-slate-850 text-slate-650 disabled:cursor-not-allowed"
            }`}
          >
            <ArrowUp size={22} className={canSend ? "animate-pulse" : ""} />
          </button>
        </div>
      </div>

      <p className="mx-auto mt-2 text-center text-[10px] font-semibold tracking-wider text-slate-600 uppercase select-none">
        {disabled ? "Load a video first to ask questions" : "Press Enter to send · Shift + Enter for a new line"}
      </p>
    </div>
  );
}