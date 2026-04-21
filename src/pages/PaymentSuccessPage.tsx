import { useEffect, useState } from 'react'
import ApiPaymentService from '../service/Api-payment'

function getSessionIdFromLocation() {
  return new URLSearchParams(window.location.search).get('session_id') ?? ''
}

type PaymentSuccessPageProps = {
  onGoHome: () => void
}

function PaymentSuccessPage({ onGoHome }: PaymentSuccessPageProps) {
  const sessionId = getSessionIdFromLocation()
  const [confirmationState, setConfirmationState] = useState<{
    loading: boolean
    message: string
    summaryText: string
  }>({
    loading: Boolean(sessionId),
    message: sessionId
      ? 'Confirmando pago con el backend...'
      : 'No se recibió session_id en la URL.',
    summaryText: '',
  })

  useEffect(() => {
    const currentSessionId = getSessionIdFromLocation()

    if (!currentSessionId) {
      return
    }

    let isActive = true

    const confirmPayment = async () => {
      try {
        const data = await ApiPaymentService.confirmPayment(currentSessionId)
        const summaryText = data.summary ? JSON.stringify(data.summary, null, 2) : ''

        if (!isActive) {
          return
        }

        setConfirmationState({
          loading: false,
          message: data.message ?? 'Pago confirmado correctamente.',
          summaryText,
        })
      } catch (error) {
        if (!isActive) {
          return
        }

        setConfirmationState({
          loading: false,
          message: error instanceof Error ? error.message : 'No se pudo confirmar el pago.',
          summaryText: '',
        })
      }
    }

    void confirmPayment()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <main className="page-shell">
      <section className="surface card result-card">
        <div className="eyebrow success">Pago exitoso</div>
        <h1>El pago se completó correctamente</h1>
        <p className="lead">
          Este flujo sirve para validar Stripe Checkout sin montar un frontend completo.
        </p>

        <div className="detail-block">
          <span>session_id</span>
          <strong>{sessionId || 'No disponible'}</strong>
        </div>

        <div className="status-panel">
          <p>{confirmationState.message || 'El pago ya pasó por Stripe Checkout.'}</p>
          {confirmationState.loading ? <p className="hint">Consultando al backend...</p> : null}
          {confirmationState.summaryText ? (
            <pre className="summary-box">{confirmationState.summaryText}</pre>
          ) : null}
        </div>

        <button className="primary-button secondary" type="button" onClick={onGoHome}>
          Volver al inicio
        </button>
      </section>
    </main>
  )
}

export default PaymentSuccessPage
