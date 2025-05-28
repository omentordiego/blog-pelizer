
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useArticles } from '@/contexts/ArticlesContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { useToast } from '@/hooks/use-toast';

interface Article {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  cover_image?: string;
  author: string;
  category_id?: string;
  is_published: boolean;
  published_at?: string;
  views: number;
  read_time?: number;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

interface EditArticleModalProps {
  article: Article;
}

const EditArticleModal = ({ article }: EditArticleModalProps) => {
  const [open, setOpen] = useState(false);
  const { updateArticle } = useArticles();
  const { categories } = useCategories();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      title: article.title,
      summary: article.summary || '',
      content: article.content || '',
      cover_image: article.cover_image || '',
      author: article.author,
      category_id: article.category_id || '',
      is_published: article.is_published,
      seo_title: article.seo_title || '',
      seo_description: article.seo_description || ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await updateArticle(article.id, data);
      setOpen(false);
      toast({
        title: "Sucesso",
        description: "Artigo atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar artigo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o artigo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="hover:bg-green-50 hover:text-green-600 transition-all duration-200 hover:scale-110"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">Editar Artigo</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                {...register('title', { required: true })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="author">Autor</Label>
              <Input
                id="author"
                {...register('author', { required: true })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={watch('category_id')}
                onValueChange={(value) => setValue('category_id', value)}
              >
                <SelectTrigger className="mt-1">
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

            <div className="col-span-2">
              <Label htmlFor="cover_image">URL da Imagem de Capa</Label>
              <Input
                id="cover_image"
                {...register('cover_image')}
                className="mt-1"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="summary">Resumo</Label>
              <Textarea
                id="summary"
                {...register('summary')}
                className="mt-1"
                rows={3}
                placeholder="Breve resumo do artigo..."
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                {...register('content')}
                className="mt-1"
                rows={10}
                placeholder="Conteúdo completo do artigo..."
              />
            </div>

            <div>
              <Label htmlFor="seo_title">Título SEO</Label>
              <Input
                id="seo_title"
                {...register('seo_title')}
                className="mt-1"
                placeholder="Título para SEO"
              />
            </div>

            <div>
              <Label htmlFor="seo_description">Descrição SEO</Label>
              <Input
                id="seo_description"
                {...register('seo_description')}
                className="mt-1"
                placeholder="Descrição para SEO"
              />
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={watch('is_published')}
                onCheckedChange={(checked) => setValue('is_published', checked)}
              />
              <Label htmlFor="is_published">Publicar artigo</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditArticleModal;
