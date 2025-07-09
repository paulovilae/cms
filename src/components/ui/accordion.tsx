'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utilities/ui'

const Accordion = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('w-full space-y-2', className)} {...props} />
  ),
)
Accordion.displayName = 'Accordion'

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
  }
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('w-full border rounded-lg', className)} {...props} />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isOpen?: boolean
  }
>(({ className, children, isOpen, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'w-full flex items-center justify-between py-4 px-6 font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-800 [&[data-state=open]>svg]:rotate-180',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronDown
      className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
    />
  </button>
))
AccordionTrigger.displayName = 'AccordionTrigger'

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen?: boolean
  }
>(({ className, children, isOpen, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'w-full overflow-hidden transition-all duration-200 ease-in-out',
      isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0',
    )}
    {...props}
  >
    <div className={cn('px-6 pb-4 pt-0', className)}>{children}</div>
  </div>
))
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
