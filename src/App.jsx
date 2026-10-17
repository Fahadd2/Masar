import { Route, Routes } from 'react-router';
import Layout from './components/layout/Layout.jsx';
import RequireAdmin from './components/layout/RequireAdmin.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import VehicleListPage from './pages/VehicleListPage.jsx';
import VehicleDetailsPage from './pages/VehicleDetailsPage.jsx';
import AddVehiclePage from './pages/AddVehiclePage.jsx';
import EditVehiclePage from './pages/EditVehiclePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Route table — DESIGN.md §1.2
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="vehicles" element={<VehicleListPage />} />
        <Route
          path="vehicles/new"
          element={
            <RequireAdmin>
              <AddVehiclePage />
            </RequireAdmin>
          }
        />
        <Route path="vehicles/:id" element={<VehicleDetailsPage />} />
        <Route
          path="vehicles/:id/edit"
          element={
            <RequireAdmin>
              <EditVehiclePage />
            </RequireAdmin>
          }
        />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
