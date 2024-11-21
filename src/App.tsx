import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Leads from "./pages/Leads";
import LeadAnalytics from "./pages/LeadAnalytics";
import Notes from "./pages/Notes";
import Templates from "./pages/Templates";
import Todo from "./pages/Todo";
import CompletedTasks from "./pages/CompletedTasks";
import Files from "./pages/Files";
import FolderView from "./components/files/FolderView";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => {
  console.log("Rendering App component"); // Added for debugging
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/leads" replace />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/leads/analytics" element={<LeadAnalytics />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/todo" element={<Todo />} />
              <Route path="/completed-tasks" element={<CompletedTasks />} />
              <Route path="/files" element={<Files />} />
              <Route path="/files/:folderId" element={<FolderView />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;