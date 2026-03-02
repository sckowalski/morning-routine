import { useState } from 'react'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
}

const CATEGORIES: { label: string; emojis: string[] }[] = [
  { label: 'Morning', emojis: ['☀️', '🌅', '⏰', '🛏️', '🌤️', '🐓'] },
  { label: 'Hygiene', emojis: ['🚿', '🪥', '🧴', '🧼', '💆', '🪒'] },
  { label: 'Food & Drink', emojis: ['☕', '🍳', '🥣', '🥤', '🍵', '🥗', '🥚', '🍌'] },
  { label: 'Fitness', emojis: ['🏋️', '🧘', '🏃', '🚴', '💪', '🤸'] },
  { label: 'Getting Ready', emojis: ['👔', '👕', '👟', '🎒', '🪞', '💼'] },
  { label: 'Health', emojis: ['💊', '💧', '🩺', '🧠', '❤️', '😴'] },
  { label: 'Tasks', emojis: ['📝', '📱', '📧', '🗓️', '✅', '📚'] },
  { label: 'Misc', emojis: ['🚶', '🐕', '🌿', '🎵', '🧹', '🔑'] },
]

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [customEmoji, setCustomEmoji] = useState('')

  const handleCustomSubmit = () => {
    if (customEmoji.trim()) {
      onSelect(customEmoji.trim())
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface-raised rounded-t-2xl p-5 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] max-h-[75dvh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-sm font-bold text-slate-300">Pick an Icon</h3>
          <button
            onClick={onClose}
            className="text-slate-500 text-sm active:scale-95 transition-transform"
          >
            Cancel
          </button>
        </div>

        {CATEGORIES.map((cat) => (
          <div key={cat.label} className="mb-4">
            <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mb-2">
              {cat.label}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onSelect(emoji)}
                  className="w-10 h-10 rounded-lg text-xl flex items-center justify-center
                    bg-white/5 hover:bg-white/10 active:scale-90 transition-all duration-150"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-2 pt-3 border-t border-white/5">
          <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mb-2">
            Custom
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customEmoji}
              onChange={(e) => setCustomEmoji(e.target.value)}
              placeholder="Paste emoji..."
              maxLength={4}
              className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-center text-lg outline-none
                focus:ring-2 focus:ring-neutral/50 transition-all duration-200"
            />
            <button
              type="button"
              onClick={handleCustomSubmit}
              disabled={!customEmoji.trim()}
              className="px-4 py-2.5 rounded-xl font-heading text-sm font-bold
                bg-neutral text-white disabled:opacity-30
                active:scale-95 transition-all duration-200"
            >
              Use
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
