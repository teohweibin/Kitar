import { Ban } from 'lucide-react'
import { binLabel } from '../lib/guide.js'
import CategoryIcon from './CategoryIcon.jsx'
import Chip, { BinDot } from './Chip.jsx'
import './ItemDetail.css'

// Full guide entry: bin, numbered preparation steps and the category's sample points rate.
export default function ItemDetail({ item, category }) {
  return (
    <div className="item-detail">
      <div className="item-detail__head">
        <CategoryIcon categoryId={item.category_id} size={56} />
        <div>
          <p className="item-detail__ms">{item.name_ms}</p>
          {category ? (
            <p className="muted">{category.name_en} · {category.name_ms}</p>
          ) : (
            <p className="muted">Not recyclable through Kitar</p>
          )}
        </div>
      </div>

      <div className="item-detail__chips">
        {category ? (
          <Chip tone="bin" icon={<BinDot binColour={category.bin_colour} />}>
            {binLabel(category.bin_colour)}
          </Chip>
        ) : (
          <Chip tone="danger" icon={<Ban />}>Not recyclable here</Chip>
        )}
        {category && <Chip>Sample rate: {category.points_per_kg} points / kg</Chip>}
      </div>

      <h3 className="item-detail__steps-title">How to prepare it</h3>
      <ol className="item-detail__steps">
        {item.prep_steps.map((step, index) => (
          <li key={step}>
            {step}
            {item.prep_steps_ms?.[index] && (
              <span className="item-detail__step-ms" lang="ms">{item.prep_steps_ms[index]}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
