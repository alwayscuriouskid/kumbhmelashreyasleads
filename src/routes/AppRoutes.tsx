import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoginPage from "@/components/auth/LoginPage";
import Layout from "@/components/Layout";
import Leads from "@/pages/Leads";
import LeadAnalytics from "@/pages/LeadAnalytics";
import TeamActivities from "@/pages/TeamActivities";
import Notes from "@/pages/Notes";
import Templates from "@/pages/Templates";
import Trash from "@/pages/Trash";
import Todo from "@/pages/Todo";
import Files from "@/pages/Files";
import FolderView from "@/components/files/FolderView";
import Inventory from "@/pages/Inventory";
import Orders from "@/pages/Orders";
import SalesProjection from "@/pages/SalesProjection";
import { FeatureProtectedRoute } from "./FeatureProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Navigate to="/leads" replace />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leads"
        element={
          <ProtectedRoute>
            <Layout>
              <Leads />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leads/analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <LeadAnalytics />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/team-activities"
        element={
          <ProtectedRoute>
            <Layout>
              <TeamActivities />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Layout>
              <Notes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <Layout>
              <Templates />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trash"
        element={
          <ProtectedRoute>
            <Layout>
              <Trash />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/todo"
        element={
          <ProtectedRoute>
            <Layout>
              <Todo />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/files"
        element={
          <ProtectedRoute>
            <Layout>
              <Files />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/files/:folderId"
        element={
          <ProtectedRoute>
            <Layout>
              <FolderView />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <Layout>
              <Inventory />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory/orders"
        element={
          <ProtectedRoute>
            <Layout>
              <Orders />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales-projection"
        element={
          <ProtectedRoute>
            <FeatureProtectedRoute feature="sales_projection">
              <Layout>
                <SalesProjection />
              </Layout>
            </FeatureProtectedRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};