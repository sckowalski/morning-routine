import { useNavigate } from 'react-router-dom'

interface StartButtonProps {
  disabled?: boolean
}

export function StartButton({ disabled }: StartButtonProps) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/run')}
      disabled={disabled}
      className="group relative w-full py-5 rounded-2xl font-heading text-lg font-bold tracking-wide
        text-white disabled:opacity-40 active:scale-[0.97] transition-all duration-200
        bg-neutral
        shadow-[0_4px_20px_rgba(0,0,0,0.2)]
        hover:shadow-[0_6px_24px_rgba(0,0,0,0.3)]"
    >
      Start Speedrun
    </button>
  )
}
