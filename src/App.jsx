import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import OfflineBanner from './components/OfflineBanner.jsx'
import InstallCard from './components/InstallCard.jsx'
import ResidentLayout from './layouts/ResidentLayout.jsx'
import CollectorLayout from './layouts/CollectorLayout.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/resident/Home.jsx'
import Guide from './pages/resident/Guide.jsx'
import Scan from './pages/resident/Scan.jsx'
import Bag from './pages/resident/Bag.jsx'
import Rewards from './pages/resident/Rewards.jsx'
import ScanBag from './pages/collector/ScanBag.jsx'
import Weigh from './pages/collector/Weigh.jsx'
import Done from './pages/collector/Done.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import { RequireRole } from './lib/auth.jsx'
import './layouts/layouts.css'

export default function App() {
  const { pathname } = useLocation()
  const inApp = pathname !== '/' && pathname !== '/login'

  return (
    <>
      <OfflineBanner />
      {inApp && <InstallCard />}
      <AppRoutes />
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route path="/resident" element={<RequireRole role="resident"><ResidentLayout /></RequireRole>}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="guide" element={<Guide />} />
        <Route path="scan" element={<Scan />} />
        <Route path="bag" element={<Bag />} />
        <Route path="rewards" element={<Rewards />} />
      </Route>

      <Route path="/collector" element={<RequireRole role="collector"><CollectorLayout /></RequireRole>}>
        <Route index element={<Navigate to="scan" replace />} />
        <Route path="scan" element={<ScanBag />} />
        <Route path="weigh" element={<Weigh />} />
        <Route path="done" element={<Done />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireRole role="admin">
            <div className="app-shell app-shell--wide"><Dashboard /></div>
          </RequireRole>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
