import { useEffect, useState } from 'react'
import PaymentsPage from './pages/PaymentsPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PaymentCancelPage from './pages/PaymentCancelPage'
import './styles/payment.css'

type AppView = 'home' | 'success' | 'cancel'

function getCurrentView(pathname: string): AppView {
  if (pathname === '/payment-success') {
    return 'success'
  }

  if (pathname === '/payment-cancel') {
    return 'cancel'
  }

  return 'home'
}

function App() {
  const [view, setView] = useState<AppView>(() => getCurrentView(window.location.pathname))

  useEffect(() => {
    const onLocationChange = () => setView(getCurrentView(window.location.pathname))

    window.addEventListener('popstate', onLocationChange)
    return () => window.removeEventListener('popstate', onLocationChange)
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setView(getCurrentView(window.location.pathname))
  }

  if (view === 'success') {
    return <PaymentSuccessPage onGoHome={() => navigate('/')} />
  }

  if (view === 'cancel') {
    return <PaymentCancelPage onTryAgain={() => navigate('/')} />
  }

  return <PaymentsPage onCreatedCheckout={(sessionUrl) => window.location.assign(sessionUrl)} />
}

export default App
