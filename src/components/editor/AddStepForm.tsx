import { useState } from 'react'

const EMOJI_SUGGESTIONS = ['🚿', '🪥', '☕', '🍳', '👔', '🧘', '📱', '🚶', '💊', '📝', '🏋️', '🧴']

interface AddStepFormProps {
  onAdd: (name: string, icon: string) => void
}

export function AddStepForm({ onAdd }: AddStepFormProps) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🚿')
  const [customEmoji, setCustomEmoji] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed, icon)
    setName('')
    setIcon('🚿')
    setCustomEmoji('')
  }

  const handlePresetClick = (emoji: string) => {
    setIcon(emoji)
    setCustomEmoji('')
  }

  const handleCustomChange = (value: string) => {
    setCustomEmoji(value)
    if (value) {
      setIcon(value)
    }
  }

  const isPresetSelected = !customEmoji && EMOJI_SUGGESTIONS.includes(icon)

  return (
    <form onSubmit={handleSubmit} className="card border border-white/5 p-4">
      <div className="mb-4">
        <label className="text-xs text-slate-500 font-medium tracking-wide block mb-2">Icon</label>
        <div className="flex flex-wrap gap-1.5 items-center">
          {EMOJI_SUGGESTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handlePresetClick(emoji)}
              className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all duration-150 ${
                isPresetSelected && icon === emoji
                  ? 'bg-neutral/15 ring-2 ring-neutral shadow-[0_0_10px_rgba(246,177,122,0.15)]'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {emoji}
            </button>
          ))}
          <input
            type="text"
            value={customEmoji}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="✨"
            maxLength={4}
            className={`w-12 h-9 rounded-lg text-lg text-center bg-white/5 outline-none transition-all duration-150 ${
              customEmoji
                ? 'ring-2 ring-neutral bg-neutral/15 shadow-[0_0_10px_rgba(246,177,122,0.15)]'
                : 'hover:bg-white/10'
            }`}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Step name (e.g., Shower)"
          className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 outline-none
            focus:ring-2 focus:ring-neutral/50 transition-all duration-200 text-sm"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-5 py-3 rounded-xl font-heading text-sm font-bold
            bg-neutral text-white
            disabled:opacity-30
            active:scale-95 transition-all duration-200"
        >
          Add
        </button>
      </div>
    </form>
  )
}
