type PaymentCancelPageProps = {
  onTryAgain: () => void
}

function PaymentCancelPage({ onTryAgain }: PaymentCancelPageProps) {
  return (
    <main className="page-shell">
      <section className="surface card result-card">
        <div className="eyebrow cancel">Pago cancelado</div>
        <h1>La compra fue cancelada</h1>
        <p className="lead">
          No se realizó ningún cargo. Puedes volver a intentar el flujo cuando quieras.
        </p>

        <button className="primary-button secondary" type="button" onClick={onTryAgain}>
          Volver a intentar el pago
        </button>
      </section>
    </main>
  )
}

export default PaymentCancelPage
