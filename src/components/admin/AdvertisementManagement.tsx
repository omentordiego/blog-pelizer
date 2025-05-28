
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Search, Edit, Trash2, Eye, BarChart3 } from 'lucide-react';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { Advertisement } from '@/types/advertisement';
import AddAdvertisementModal from './AddAdvertisementModal';

const AdvertisementManagement = () => {
  const { advertisements, loading, updateAdvertisement, deleteAdvertisement } = useAdvertisements();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAds = advertisements.filter(ad =>
    ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPositionLabel = (position: string) => {
    const positions: Record<string, string> = {
      'header': 'Cabeçalho',
      'between_articles': 'Entre Artigos',
      'sidebar': 'Barra Lateral',
      'article_footer': 'Rodapé do Artigo',
      'site_footer': 'Rodapé do Site',
      'exit_popup': 'Pop-up de Saída'
    };
    return positions[position] || position;
  };

  const getTypeLabel = (type: string) => {
    return type === 'adsense' ? 'AdSense' : 'Banner';
  };

  const handleToggleActive = async (ad: Advertisement) => {
    try {
      await updateAdvertisement(ad.id, { is_active: !ad.is_active });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDelete = async (ad: Advertisement) => {
    if (window.confirm(`Tem certeza que deseja excluir o anúncio "${ad.title}"?`)) {
      try {
        await deleteAdvertisement(ad.id);
      } catch (error) {
        console.error('Erro ao excluir anúncio:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blog-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Gerenciar Anúncios</h2>
          <p className="text-gray-600 font-heading">
            Gerencie anúncios AdSense e banners personalizados
          </p>
        </div>
        <AddAdvertisementModal />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar anúncios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-heading"
          />
        </div>
      </div>

      {filteredAds.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 font-heading">
              {searchTerm ? 'Nenhum anúncio encontrado.' : 'Nenhum anúncio cadastrado.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAds.map((ad) => (
            <Card key={ad.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-heading truncate">
                    {ad.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={ad.is_active}
                      onCheckedChange={() => handleToggleActive(ad)}
                      size="sm"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={ad.type === 'adsense' ? 'default' : 'secondary'}>
                    {getTypeLabel(ad.type)}
                  </Badge>
                  <Badge variant="outline">
                    {getPositionLabel(ad.position)}
                  </Badge>
                  <Badge variant={ad.is_active ? 'default' : 'secondary'}>
                    {ad.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 font-heading">Impressões:</span>
                    <div className="font-semibold">{ad.impression_count.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-heading">Cliques:</span>
                    <div className="font-semibold">{ad.click_count.toLocaleString()}</div>
                  </div>
                </div>

                {ad.type === 'banner' && ad.content && (
                  <div className="mt-3">
                    <img 
                      src={ad.content} 
                      alt={ad.title}
                      className="w-full h-20 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}

                {(ad.start_date || ad.end_date) && (
                  <div className="text-xs text-gray-500 font-heading">
                    {ad.start_date && (
                      <div>Início: {new Date(ad.start_date).toLocaleDateString()}</div>
                    )}
                    {ad.end_date && (
                      <div>Fim: {new Date(ad.end_date).toLocaleDateString()}</div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(ad)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvertisementManagement;
