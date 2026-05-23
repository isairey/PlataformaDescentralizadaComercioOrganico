import React from 'react'

export interface ButtonProps {
  title: string
  onClick: () => void
  styles: string
}

export function Button({ title, onClick, styles }: ButtonProps) {
  return (
    <button style={{backgroundColor: "blue"}} className={styles} onClick={onClick}>
      {title}
    </button>
  )
}
