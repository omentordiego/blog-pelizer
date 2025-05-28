
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { ArticlesProvider } from "@/contexts/ArticlesContext";
import { NewsletterProvider } from "@/contexts/NewsletterContext";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Article from "./pages/Article";
import About from "./pages/About";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Newsletter from "./pages/Newsletter";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import Cookies from "./pages/Cookies";
import NotFound from "./pages/NotFound";

// Criar uma instância estável do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CategoriesProvider>
          <ArticlesProvider>
            <NewsletterProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/artigo/:slug" element={<Article />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/categorias" element={<Categories />} />
                    <Route path="/categorias/:slug" element={<Category />} />
                    <Route path="/newsletter" element={<Newsletter />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/privacidade" element={<Privacidade />} />
                    <Route path="/termos" element={<Termos />} />
                    <Route path="/cookies" element={<Cookies />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </NewsletterProvider>
          </ArticlesProvider>
        </CategoriesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
