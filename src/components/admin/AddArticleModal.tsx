
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/data/mockData';
import RichTextEditor from './RichTextEditor';

const AddArticleModal = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !summary.trim() || !content.trim() || !categoryId || !author.trim()) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos",
        variant: "destructive",
      });
      return;
    }

    // Simular criação do artigo
    console.log('Novo artigo:', { 
      title, 
      summary, 
      content, 
      categoryId, 
      author, 
      coverImage: coverImage || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    });
    
    toast({
      title: "Sucesso",
      description: "Artigo criado com sucesso!",
    });

    // Resetar formulário e fechar modal
    setTitle('');
    setSummary('');
    setContent('');
    setCategoryId('');
    setAuthor('');
    setCoverImage('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blog-primary hover:bg-blog-secondary transition-all duration-200 hover:scale-105 hover:shadow-lg font-heading">
          <Plus className="w-4 h-4 mr-2" />
          Novo Artigo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Adicionar Novo Artigo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do artigo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Autor *</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nome do autor"
                required
              />
            </div>
          </div>

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
              <Label htmlFor="coverImage">Imagem de Capa</Label>
              <Input
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="URL da imagem de capa (opcional)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Resumo *</Label>
            <RichTextEditor
              value={summary}
              onChange={setSummary}
              placeholder="Digite um resumo do artigo"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo *</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Digite o conteúdo completo do artigo usando Markdown para formatação"
              rows={12}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="hover:bg-gray-50 transition-colors duration-200 font-heading"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-blog-primary hover:bg-blog-secondary transition-all duration-200 hover:scale-105 font-heading"
            >
              Criar Artigo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddArticleModal;
