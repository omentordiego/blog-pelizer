
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import { useCategories } from '@/contexts/CategoriesContext';

interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
}

interface EditCategoryModalProps {
  category: Category;
}

const EditCategoryModal = ({ category }: EditCategoryModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || '');
  const [color, setColor] = useState(category.color);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateCategory } = useCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await updateCategory(category.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        color
      });
      setOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName(category.name);
    setDescription(category.description || '');
    setColor(category.color);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="hover:bg-blue-50 hover:text-blog-primary transition-all duration-200 hover:scale-110"
        >
          <Edit className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">Editar Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome da Categoria</Label>
            <Input
              id="edit-name"
              type="text"
              placeholder="Nome da categoria"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição</Label>
            <Textarea
              id="edit-description"
              placeholder="Descrição da categoria (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-color">Cor</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="edit-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1"
                placeholder="#0A1D56"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 font-heading"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 bg-blog-primary hover:bg-blog-secondary font-heading"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;
