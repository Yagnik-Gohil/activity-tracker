import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps<T> {
  value: T
  onChange: (value: T) => void
  options: { label: string; value: T }[]
  className?: string
}

export function CustomSelect<T extends string | number>({
  value,
  onChange,
  options,
  className = ''
}: SelectProps<T>): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return (): void => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div ref={dropdownRef} className={`relative ${className}`} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-400 rounded-md bg-white text-gray-800 text-sm shadow-sm focus:ring-2 focus:ring-gray-400 transition-all"
      >
        {selectedOption?.label || 'Select...'}
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-3 py-2 text-sm cursor-pointer transition-all ${
                value === option.value
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={(e) => {
                onChange(option.value)
                setIsOpen(false)
                e.stopPropagation()
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
