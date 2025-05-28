
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { Advertisement, AdvertisementType, AdvertisementPosition } from '@/types/advertisement';

const AddAdvertisementModal = () => {
  const { createAdvertisement } = useAdvertisements();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'banner' as AdvertisementType,
    content: '',
    link_url: '',
    position: 'sidebar' as AdvertisementPosition,
    is_active: true,
    start_date: '',
    end_date: ''
  });

  const positions = [
    { value: 'header', label: 'Cabeçalho' },
    { value: 'between_articles', label: 'Entre Artigos' },
    { value: 'sidebar', label: 'Barra Lateral' },
    { value: 'article_footer', label: 'Rodapé do Artigo' },
    { value: 'site_footer', label: 'Rodapé do Site' },
    { value: 'exit_popup', label: 'Pop-up de Saída' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setLoading(true);
    try {
      await createAdvertisement({
        ...formData,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
        link_url: formData.link_url || undefined
      });
      
      setFormData({
        title: '',
        type: 'banner',
        content: '',
        link_url: '',
        position: 'sidebar',
        is_active: true,
        start_date: '',
        end_date: ''
      });
      setOpen(false);
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-heading">
          <Plus className="w-4 h-4 mr-2" />
          Novo Anúncio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">Adicionar Novo Anúncio</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="font-heading">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Nome do anúncio"
              required
            />
          </div>

          <div>
            <Label htmlFor="type" className="font-heading">Tipo</Label>
            <Select value={formData.type} onValueChange={(value: AdvertisementType) => 
              setFormData(prev => ({ ...prev, type: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="banner">Banner (Imagem)</SelectItem>
                <SelectItem value="adsense">Google AdSense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="content" className="font-heading">
              {formData.type === 'adsense' ? 'Código AdSense' : 'URL da Imagem'}
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder={
                formData.type === 'adsense' 
                  ? 'Cole aqui o código do Google AdSense'
                  : 'https://exemplo.com/imagem.jpg'
              }
              rows={formData.type === 'adsense' ? 4 : 2}
              required
            />
          </div>

          {formData.type === 'banner' && (
            <div>
              <Label htmlFor="link_url" className="font-heading">URL de Destino (opcional)</Label>
              <Input
                id="link_url"
                type="url"
                value={formData.link_url}
                onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                placeholder="https://exemplo.com"
              />
            </div>
          )}

          <div>
            <Label htmlFor="position" className="font-heading">Posição</Label>
            <Select value={formData.position} onValueChange={(value: AdvertisementPosition) => 
              setFormData(prev => ({ ...prev, position: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {positions.map(pos => (
                  <SelectItem key={pos.value} value={pos.value}>
                    {pos.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="font-heading">Data de Início (opcional)</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end_date" className="font-heading">Data de Fim (opcional)</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active" className="font-heading">Anúncio ativo</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Anúncio'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdvertisementModal;
