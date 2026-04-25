import { useEffect, useState } from 'react';
import PaymentsPage from './pages/PaymentsPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import RestaurantListPage from './pages/RestaurantListPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import RestaurantFormPage from './pages/RestaurantFormPage';
import './styles/payment.css';
import './styles/catalog.css';

type AppView = 'restaurants' | 'restaurant-detail' | 'create-restaurant' | 'checkout' | 'success' | 'cancel';

type CheckoutData = {
  dishName: string
  quantity: number
  unitPrice: number
  restauranteName: string
}

function getCurrentView(pathname: string): AppView {
  if (pathname === '/payment-success') return 'success';
  if (pathname === '/payment-cancel') return 'cancel';
  if (pathname === '/checkout') return 'checkout';
  if (pathname === '/create-restaurant') return 'create-restaurant';
  if (pathname.startsWith('/restaurant/')) return 'restaurant-detail';
  return 'restaurants';
}

function getRestauranteIdFromPath(pathname: string): string {
  const match = pathname.match(/^\/restaurant\/(.+)$/);
  return match ? match[1] : '';
}

function App() {
  const [view, setView] = useState<AppView>(() => getCurrentView(window.location.pathname));
  const [selectedRestauranteId, setSelectedRestauranteId] = useState(() =>
    getRestauranteIdFromPath(window.location.pathname),
  );
  const [listKey, setListKey] = useState(0);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  useEffect(() => {
    const onLocationChange = () => {
      setView(getCurrentView(window.location.pathname));
      setSelectedRestauranteId(getRestauranteIdFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setView(getCurrentView(path));
    setSelectedRestauranteId(getRestauranteIdFromPath(path));
  };

  const handleSelectRestaurant = (id: string) => navigate(`/restaurant/${id}`);
  const handleCheckout = (data: CheckoutData) => {
    setCheckoutData(data);
    navigate('/checkout');
  };
  const handleCreated = () => {
    navigate('/');
    setListKey((k) => k + 1);
  };

  if (view === 'success') {
    return <PaymentSuccessPage onGoHome={() => navigate('/')} />;
  }
  if (view === 'cancel') {
    return <PaymentCancelPage onTryAgain={() => navigate('/')} />;
  }
  if (view === 'checkout') {
    return (
      <PaymentsPage
        onCreatedCheckout={(sessionUrl) => window.location.assign(sessionUrl)}
        initialValues={checkoutData ? {
          dishName: checkoutData.dishName,
          quantity: String(checkoutData.quantity),
          unitPrice: String(checkoutData.unitPrice),
          currency: 'cop',
          customerReference: checkoutData.restauranteName,
        } : undefined}
        restauranteName={checkoutData?.restauranteName}
      />
    );
  }
  if (view === 'create-restaurant') {
    return (
      <RestaurantFormPage
        onGoBack={() => navigate('/')}
        onCreated={handleCreated}
      />
    );
  }
  if (view === 'restaurant-detail' && selectedRestauranteId) {
    return (
      <RestaurantDetailPage
        restauranteId={selectedRestauranteId}
        onGoBack={() => navigate('/')}
        onCheckout={handleCheckout}
      />
    );
  }

  return (
    <RestaurantListPage
      key={listKey}
      onSelectRestaurant={handleSelectRestaurant}
      onCreateRestaurant={() => navigate('/create-restaurant')}
    />
  );
}

export default App;
