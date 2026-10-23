import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import './QrCard.css'

// The unit's bag label: a QR code of the random qr_token only (no names, no unit code inside).
// The whole card is also what gets printed (see print.css).
export default function QrCard({ token, unitCode, townshipName }) {
  const [svg, setSvg] = useState(null)

  useEffect(() => {
    let cancelled = false
    QRCode.toString(token, { type: 'svg', errorCorrectionLevel: 'M', margin: 1, color: { dark: '#0D0A08', light: '#FFFFFF' } })
      .then((markup) => !cancelled && setSvg(markup))
      .catch(() => !cancelled && setSvg(null))
    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <figure className="qr-card print-label">
      <p className="qr-card__brand">Kitar recycling bag</p>
      {svg ? (
        <div
          className="qr-card__code"
          role="img"
          aria-label={`QR code for unit ${unitCode}`}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="qr-card__code qr-card__code--loading" aria-hidden="true" />
      )}
      <figcaption>
        <span className="qr-card__unit mono">{unitCode}</span>
        {townshipName && <span className="qr-card__township">{townshipName}</span>}
      </figcaption>
    </figure>
  )
}
