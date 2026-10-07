import { RECORD_TEXT, SIGNAL_TEXT, STATUS_TEXT, type RecordVerdict, type Status } from './heroConfig'

/**
 * The archive reporting on itself. One line at a time, set small and quiet —
 * editorial marginalia, not a HUD. The metadata rows below it keep reporting
 * whatever the signal and the record are currently doing.
 */
export function HeroDiagnosticLine({ status }: { status: Status | null }) {
  return (
    <p className="ha-diag" aria-hidden="true" data-status={status ?? 'none'}>
      <span key={status ?? 'none'} className="ha-diag__line">
        {status ? STATUS_TEXT[status] : ''}
      </span>
    </p>
  )
}

interface MetaProps {
  status: Status | null
  record: RecordVerdict
  style?: React.CSSProperties
}

export function HeroDiagnosticMeta({ status, record, style }: MetaProps) {
  const signal = status ?? 'stable'
  return (
    <dl className="hero__diag hero-item" data-signal={signal} data-record={record} style={style}>
      <div>
        <dt>سیگنال</dt>
        <dd aria-live="off">{SIGNAL_TEXT[signal]}</dd>
      </div>
      <div>
        <dt>موقعیت</dt>
        <dd>ایران</dd>
      </div>
      <div>
        <dt>داده</dt>
        <dd>{RECORD_TEXT[record]}</dd>
      </div>
    </dl>
  )
}
