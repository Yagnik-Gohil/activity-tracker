export function TimerWidget(): JSX.Element {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-3xl font-mono">00:21:25</div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Marketing</div>
        <div className="text-xs text-gray-500">Customer growth strategies</div>
      </div>
    </div>
  )
}
