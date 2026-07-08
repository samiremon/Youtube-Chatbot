export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-900 bg-slate-950 px-4 py-4 sm:px-8 md:px-12 lg:px-16 backdrop-blur-md">
      {/* Brand logo and name */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20 text-white font-black text-sm">
          TW
        </div>
        <h1 className="text-lg font-bold tracking-tight text-white select-none">
          TubeWave
        </h1>
      </div>
    </header>
  );
}