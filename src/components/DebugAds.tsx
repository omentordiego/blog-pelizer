
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { Advertisement } from '@/types/advertisement';

const DebugAds: React.FC = () => {
  const [debugMode, setDebugMode] = useState(false);
  const [adsByPosition, setAdsByPosition] = useState<Record<string, Advertisement[]>>({});
  const { getActiveAdvertisements } = useAdvertisements();

  const positions = [
    'header',
    'between_articles', 
    'sidebar',
    'article_footer',
    'site_footer',
    'exit_popup'
  ];

  useEffect(() => {
    if (debugMode) {
      loadAllAds();
    }
  }, [debugMode]);

  const loadAllAds = async () => {
    console.log('🔍 Carregando anúncios para debug...');
    const results: Record<string, Advertisement[]> = {};
    
    for (const position of positions) {
      try {
        const ads = await getActiveAdvertisements(position as any);
        results[position] = ads;
        console.log(`📍 ${position}: ${ads.length} anúncios`);
      } catch (error) {
        console.error(`❌ Erro ao carregar ${position}:`, error);
        results[position] = [];
      }
    }
    
    setAdsByPosition(results);
  };

  if (!debugMode) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setDebugMode(true)}
          variant="outline"
          size="sm"
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Debug Ads
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="container mx-auto p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Debug do Sistema de Anúncios</CardTitle>
            <Button 
              onClick={() => setDebugMode(false)}
              variant="outline"
              size="sm"
            >
              Fechar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={loadAllAds} className="w-full">
              Recarregar Anúncios
            </Button>
            
            {positions.map(position => (
              <div key={position} className="border rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{position}</h3>
                  <Badge variant={adsByPosition[position]?.length > 0 ? 'default' : 'secondary'}>
                    {adsByPosition[position]?.length || 0} anúncios
                  </Badge>
                </div>
                
                {adsByPosition[position]?.length > 0 ? (
                  <div className="space-y-2">
                    {adsByPosition[position].map(ad => (
                      <div key={ad.id} className="bg-gray-50 p-2 rounded text-sm">
                        <div className="font-medium">{ad.title}</div>
                        <div className="text-gray-600">
                          Tipo: {ad.type} | 
                          Ativo: {ad.is_active ? 'Sim' : 'Não'} |
                          Impressões: {ad.impression_count} |
                          Cliques: {ad.click_count}
                        </div>
                        {ad.start_date && (
                          <div className="text-gray-500 text-xs">
                            Período: {new Date(ad.start_date).toLocaleDateString()} - 
                            {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : 'Sem fim'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">Nenhum anúncio ativo</div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebugAds;
