import { useState } from 'react'
import { EmojiPicker } from './EmojiPicker'

interface AddStepFormProps {
  onAdd: (name: string, icon: string) => void
}

export function AddStepForm({ onAdd }: AddStepFormProps) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🚿')
  const [pickerOpen, setPickerOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed, icon)
    setName('')
    setIcon('🚿')
  }

  const handleEmojiSelect = (emoji: string) => {
    setIcon(emoji)
    setPickerOpen(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="card border border-white/5 p-4">
        <div className="flex gap-3 items-center">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 text-2xl
              flex items-center justify-center active:scale-95 transition-all duration-150
              hover:bg-white/10"
          >
            {icon}
          </button>
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
      {pickerOpen && (
        <EmojiPicker
          onSelect={handleEmojiSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  )
}
