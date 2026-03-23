import { useEffect, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Tractors } from './pages/Tractors';
import { Inquiry } from './pages/Inquiry';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { Tractor, Tehsil } from './types';

function InitializeData() {
  const [tractors, setTractors] = useLocalStorage<Tractor[]>('tractors', []);
  const [tehsils, setTehsils] = useLocalStorage<Tehsil[]>('tehsils', []);

  useEffect(() => {
    if (tractors.length === 0) {
      const initialTractors: Tractor[] = [
        {
          id: '1',
          name: 'Massey Ferguson 1035 Dost',
          model: '1035 Dost',
          hp: 35,
          price: 600000,
          image: '/images/tractor-1035-dost.jpg',
          description: '35 HP tractor ideal for small farms. Compact, fuel-efficient, and easy to maintain.',
          stock: 3
        },
        {
          id: '2',
          name: 'Massey Ferguson 241 Sonaplus',
          model: '241 Sonaplus',
          hp: 42,
          price: 650000,
          image: '/images/tractor-241-sonaplus.jpg',
          description: '42 HP powerful tractor with advanced features. Perfect for medium farms and heavy loads.',
          stock: 5
        },
        {
          id: '3',
          name: 'Massey Ferguson 1035 Maha Shakti',
          model: '1035 Maha Shakti',
          hp: 35,
          price: 550000,
          image: '/images/tractor-1035-maha-shakti.jpg',
          description: '35 HP value-for-money tractor. Reliable performance for various farming operations.',
          stock: 4
        },
        {
          id: '4',
          name: 'Massey Ferguson 246 Dynatrack',
          model: '246 Dynatrack',
          hp: 46,
          price: 750000,
          image: '/images/tractor-246.jpg',
          description: '46 HP dynamic tractor with superior traction. Best for paddy fields and wet conditions.',
          stock: 2
        },
      ];
      setTractors(initialTractors);
    }
  }, [tractors.length, setTractors]);

  // Initialize default tehsils and villages
  useEffect(() => {
    if (tehsils.length === 0) {
      const defaultTehsils: Tehsil[] = [
        {
          id: 'tehsil-1',
          name: 'Khambhat',
          villages: ['Khambhat', 'Ralaj', 'Neja', 'Bhattalavdi']
        },
        {
          id: 'tehsil-2',
          name: 'Tarapur',
          villages: ['Tarapur', 'Isharwada', 'Moraj', 'Padra']
        },
        {
          id: 'tehsil-3',
          name: 'Sojitra',
          villages: ['Sojitra', 'Limbdi']
        },
        {
          id: 'tehsil-4',
          name: 'Vaso',
          villages: ['Vaso', 'Daloli']
        }
      ];
      setTehsils(defaultTehsils);
    }
  }, [tehsils.length, setTehsils]);

  return null;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

function AppContent() {
  return (
    <BrowserRouter>
      <InitializeData />
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/tractors" element={<Tractors />} />
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppContent />;
}