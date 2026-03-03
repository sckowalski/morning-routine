import { useState } from 'react'
import { EmojiPicker } from './EmojiPicker'

interface EditStepModalProps {
  name: string
  icon: string
  onSave: (name: string, icon: string) => void
  onClose: () => void
}

export function EditStepModal({ name: initialName, icon: initialIcon, onSave, onClose }: EditStepModalProps) {
  const [name, setName] = useState(initialName)
  const [icon, setIcon] = useState(initialIcon)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onSave(trimmed, icon)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface-raised rounded-t-2xl p-5 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-heading text-sm font-bold text-slate-300 mb-4">Edit Step</h3>

        <div className="flex gap-3 mb-4">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(true)}
            className="w-12 h-12 rounded-xl bg-white/5 text-2xl flex items-center justify-center
              hover:bg-white/10 active:scale-95 transition-all duration-200 shrink-0"
          >
            {icon}
          </button>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
            placeholder="Step name"
            maxLength={50}
            className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm outline-none
              focus:ring-2 focus:ring-neutral/50 transition-all duration-200"
            autoFocus
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-slate-400
              bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white
              bg-neutral disabled:opacity-30 active:scale-[0.98] transition-all duration-200"
          >
            Save
          </button>
        </div>
      </div>

      {showEmojiPicker && (
        <div className="z-[70]">
          <EmojiPicker
            onSelect={(emoji) => {
              setIcon(emoji)
              setShowEmojiPicker(false)
            }}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      )}
    </div>
  )
}
