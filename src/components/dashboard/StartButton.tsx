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
      className="w-full py-5 rounded-2xl bg-neutral text-white text-2xl font-bold disabled:opacity-40 active:scale-95 transition-transform shadow-lg shadow-neutral/25"
    >
      Start Speedrun
    </button>
  )
}
