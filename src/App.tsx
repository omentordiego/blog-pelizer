
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArticlesProvider } from '@/contexts/ArticlesContext';
import { CategoriesProvider } from '@/contexts/CategoriesContext';
import { NewsletterProvider } from '@/contexts/NewsletterContext';
import { AuthProvider } from '@/contexts/AuthContext';

// Pages
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Article from "./pages/Article";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Newsletter from "./pages/Newsletter";
import NotFound from "./pages/NotFound";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import Cookies from "./pages/Cookies";

const queryClient = new QueryClient();

const App = () => (
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
                  <Route path="/blog/:slug" element={<Article />} />
                  <Route path="/artigo/:slug" element={<Article />} />
                  <Route path="/sobre" element={<About />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/categorias" element={<Categories />} />
                  <Route path="/categorias/:slug" element={<Category />} />
                  <Route path="/newsletter" element={<Newsletter />} />
                  <Route path="/privacidade" element={<Privacidade />} />
                  <Route path="/termos" element={<Termos />} />
                  <Route path="/cookies" element={<Cookies />} />
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

export default App;
