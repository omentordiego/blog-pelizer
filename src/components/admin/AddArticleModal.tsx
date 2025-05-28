
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/contexts/CategoriesContext';
import { useArticles } from '@/contexts/ArticlesContext';
import { useAuth } from '@/contexts/AuthContext';
import WordPressEditor from './WordPressEditor';

const AddArticleModal = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [author, setAuthor] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { categories } = useCategories();
  const { addArticle } = useArticles();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !summary.trim() || !content.trim() || !categoryId || !author.trim()) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addArticle({
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        category_id: categoryId,
        author: author.trim(),
        cover_image: featuredImage || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        is_published: true,
        published_at: new Date().toISOString(),
        read_time: Math.ceil(content.split(' ').length / 200), // Estimate reading time
        seo_title: title.trim(),
        seo_description: summary.trim()
      });
      
      toast({
        title: "Sucesso",
        description: "Artigo criado com sucesso!",
      });

      // Reset form and close modal
      setTitle('');
      setSummary('');
      setContent('');
      setCategoryId('');
      setAuthor('');
      setFeaturedImage('');
      setOpen(false);
    } catch (error) {
      console.error('Erro ao criar artigo:', error);
      
      toast({
        title: "Erro",
        description: "Não foi possível criar o artigo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set default author when modal opens
  React.useEffect(() => {
    if (open && user && !author) {
      setAuthor(user.name);
    }
  }, [open, user, author]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blog-primary hover:bg-blog-secondary transition-all duration-200 hover:scale-105 hover:shadow-lg font-heading">
          <Plus className="w-4 h-4 mr-2" />
          Novo Artigo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[95vw] lg:max-w-[1200px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Criar Novo Artigo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Autor *</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nome do autor"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <WordPressEditor
            title={title}
            onTitleChange={setTitle}
            content={content}
            onContentChange={setContent}
            summary={summary}
            onSummaryChange={setSummary}
            featuredImage={featuredImage}
            onFeaturedImageChange={setFeaturedImage}
          />

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="hover:bg-gray-50 transition-colors duration-200 font-heading"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-blog-primary hover:bg-blog-secondary transition-all duration-200 hover:scale-105 font-heading"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publicando...' : 'Publicar Artigo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddArticleModal;
