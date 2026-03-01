import { useState } from 'react'

const EMOJI_SUGGESTIONS = ['🚿', '🪥', '☕', '🍳', '👔', '🧘', '📱', '🚶', '💊', '📝', '🏋️', '🧴']

interface AddStepFormProps {
  onAdd: (name: string, icon: string) => void
}

export function AddStepForm({ onAdd }: AddStepFormProps) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🚿')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed, icon)
    setName('')
    setIcon('🚿')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-raised rounded-2xl p-4">
      <div className="mb-3">
        <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Icon</label>
        <div className="flex flex-wrap gap-2">
          {EMOJI_SUGGESTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setIcon(emoji)}
              className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                icon === emoji ? 'bg-neutral/30 ring-2 ring-neutral' : 'bg-surface hover:bg-surface-overlay'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Step name (e.g., Shower)"
          className="flex-1 bg-surface rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-neutral"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-5 py-3 rounded-xl bg-neutral text-white font-medium disabled:opacity-40 active:scale-95 transition-transform"
        >
          Add
        </button>
      </div>
    </form>
  )
}
