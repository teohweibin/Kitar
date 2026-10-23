import { Ban, CupSoda, Cylinder, Droplet, Milk, Newspaper, Shirt, Smartphone, Wine } from 'lucide-react'
import './CategoryIcon.css'

const ICONS = {
  paper: Newspaper,
  plastic: CupSoda,
  metal: Cylinder,
  glass: Wine,
  carton: Milk,
  ewaste: Smartphone,
  textile: Shirt,
  cooking_oil: Droplet,
}

// 48 px tinted tile from design.md → List items. null category = not recyclable.
export default function CategoryIcon({ categoryId, size = 48 }) {
  const Icon = ICONS[categoryId] ?? Ban
  return (
    <span
      className={`category-icon${categoryId ? '' : ' category-icon--none'}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Icon size={Math.round(size * 0.46)} />
    </span>
  )
}
