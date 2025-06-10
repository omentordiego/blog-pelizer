
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArticlesProvider } from "./contexts/ArticlesContext";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import { NewsletterProvider } from "./contexts/NewsletterContext";
import { AuthProvider } from "./contexts/AuthContext";
import AdSenseScript from "./components/AdSenseScript";
import ExitIntentPopup from "./components/ExitIntentPopup";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Article from "./pages/Article";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import About from "./pages/About";
import Newsletter from "./pages/Newsletter";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import Cookies from "./pages/Cookies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ArticlesProvider>
            <CategoriesProvider>
              <NewsletterProvider>
                <AdSenseScript />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/artigo/:slug" element={<Article />} />
                  <Route path="/categorias" element={<Categories />} />
                  <Route path="/categorias/:slug" element={<Category />} />
                  <Route path="/sobre" element={<About />} />
                  <Route path="/newsletter" element={<Newsletter />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/termos" element={<Termos />} />
                  <Route path="/privacidade" element={<Privacidade />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <ExitIntentPopup />
              </NewsletterProvider>
            </CategoriesProvider>
          </ArticlesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
