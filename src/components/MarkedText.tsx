import React from 'react'

export function MarkedText({ text }: { text: string }) {
  if (!text.includes('__')) return <>{text}</>

  const parts = text.split('__')
  return (
    <>
      {parts.map((part, index) => {
        // Every odd index is inside the __ markers
        if (index % 2 === 1) {
          return (
            <u key={index} className="underline decoration-1 underline-offset-4 decoration-gray-400">
              {part}
            </u>
          )
        }
        return <React.Fragment key={index}>{part}</React.Fragment>
      })}
    </>
  )
}
