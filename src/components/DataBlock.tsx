import type { DataPoint } from '../data/dataPoints'
import { DATA_CATEGORY_LABEL } from '../data/dataPoints'

export function DataBlock({ point }: { point: DataPoint }) {
  return (
    <article className="data-block reveal">
      <span className="data-block__cat">{DATA_CATEGORY_LABEL[point.category]}</span>
      <div>
        <div className="data-block__headline">{point.headline}</div>
        {point.unit ? <div className="data-block__unit">{point.unit}</div> : null}
      </div>
      <h3>{point.title}</h3>
      <p>{point.context}</p>
      {point.bars ? (
        <div className="bars">
          {point.bars.map((b) => (
            <div key={b.label} className="bar">
              <div className="bar__top">
                <span>{b.label}</span>
                <span>{b.display}</span>
              </div>
              <div className="bar__track">
                <div className="bar__fill" style={{ ['--w' as string]: `${b.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <div className="data-block__src">
        <span>تاریخ داده: {point.date}</span>
        <a href={point.sourceUrl} target="_blank" rel="noopener noreferrer">
          منبع: {point.source} ↗
        </a>
      </div>
    </article>
  )
}
