import { useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════════════════
   SpaceBackground
   – Renders once at App root so it NEVER resets on navigation.
   – Three star parallax layers (slow / mid / fast), twinkle effect.
   – Nebula orbs and light beams via pure CSS (no repaint cost).
   ═══════════════════════════════════════════════════════════════ */
export default function SpaceBackground() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animId, W, H

        const resize = () => {
            W = canvas.width = window.innerWidth
            H = canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        /* Three parallax star layers */
        const LAYERS = [
            { count: 140, speed: 0.06, r: [0.35, 0.80], a: 0.50 }, // far
            { count: 80, speed: 0.15, r: [0.75, 1.50], a: 0.72 }, // mid
            { count: 40, speed: 0.30, r: [1.30, 2.20], a: 0.95 }, // near
        ]

        const stars = LAYERS.flatMap(l =>
            Array.from({ length: l.count }, () => ({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                radius: Math.random() * (l.r[1] - l.r[0]) + l.r[0],
                speed: l.speed + Math.random() * 0.05,
                base: Math.random() * (l.a - 0.18) + 0.18,
                phase: Math.random() * Math.PI * 2,
            }))
        )

        let t = 0
        const draw = () => {
            t += 0.010
            ctx.clearRect(0, 0, W, H)

            for (const s of stars) {
                const alpha = s.base * (0.65 + 0.35 * Math.sin(t + s.phase))
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(220,235,255,${alpha})`
                ctx.fill()

                s.y -= s.speed
                if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W }
            }

            animId = requestAnimationFrame(draw)
        }
        draw()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <>
            {/* ── Star canvas ── */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed', inset: 0,
                    width: '100%', height: '100%',
                    zIndex: 0, pointerEvents: 'none',
                }}
            />

            {/* ── CSS nebula orbs (GPU composited, zero JS cost) ── */}
            <div className="sp-bg-orb sp-bg-orb-a" />
            <div className="sp-bg-orb sp-bg-orb-b" />
            <div className="sp-bg-orb sp-bg-orb-c" />
            <div className="sp-bg-orb sp-bg-orb-d" />

            {/* ── Light beams ── */}
            <div className="sp-bg-beam sp-bg-beam-1" />
            <div className="sp-bg-beam sp-bg-beam-2" />
            <div className="sp-bg-beam sp-bg-beam-3" />

            {/* ── Dot grid ── */}
            <div className="sp-bg-grid" />
        </>
    )
}
