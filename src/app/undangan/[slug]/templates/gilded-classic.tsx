import TemplateRenderer from '../TemplateRenderer'
import type { WeddingData } from '../types'

export default function TemplateGildedClassic({ wedding }: { wedding: WeddingData }) {
  return <TemplateRenderer wedding={wedding} templateId="gilded-classic" />
}
