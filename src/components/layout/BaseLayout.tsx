import type { FC, PropsWithChildren } from 'react'
import 'twin.macro'

export const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div tw="relative flex min-h-full flex-col">
        {children}
      </div>
    </>
  )
}
