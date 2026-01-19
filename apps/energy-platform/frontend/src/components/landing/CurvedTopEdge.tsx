'use client'

interface CurvedTopEdgeProps {
    fillColor?: string
    className?: string
}

export default function CurvedTopEdge({
    fillColor = '#0f172a', // slate-900
    className = ''
}: CurvedTopEdgeProps) {
    return (
        <div className={`absolute -top-24 left-0 right-0 h-32 overflow-hidden ${className}`}>
            <svg
                viewBox="0 0 1440 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute bottom-0 w-full h-auto"
                preserveAspectRatio="none"
            >
                {/* Convex curve - bulges upward */}
                <path
                    d="M0 120L0 60C0 60 360 0 720 0C1080 0 1440 60 1440 60L1440 120L0 120Z"
                    fill={fillColor}
                />
            </svg>
        </div>
    )
}
