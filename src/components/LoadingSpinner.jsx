/**
 * Loading Spinner Component
 * Reusable loading indicator with different sizes and styles
 */

import React from 'react'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  text = '',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const spinner = (
    <div className={clsx(
      'flex items-center justify-center',
      fullScreen && 'min-h-screen',
      className
    )}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={clsx(
          'animate-spin text-blue-600',
          sizeClasses[size]
        )} />
        {text && (
          <p className="text-sm text-gray-600 animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner
