'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { EditName } from './buttons'

export default function NewPageError({
    error,
    reset
}: {
    error: Error & { digest?: string },
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div>
            <h2>{error.message}</h2>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </button>
        </div>
    )
}