
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, ExternalLink, Check, X } from 'lucide-react';
import { debugSocialMetaTags, generateDebugReport, validateImageUrl } from '@/utils/socialMetaDebugger';

interface SocialMetaDebuggerProps {
  isVisible?: boolean;
}

const SocialMetaDebugger = ({ isVisible = false }: SocialMetaDebuggerProps) => {
  const [showDebugger, setShowDebugger] = useState(isVisible);
  const [debugData, setDebugData] = useState<any>(null);
  const [isImageValid, setIsImageValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDebug = async () => {
    setIsLoading(true);
    try {
      const data = debugSocialMetaTags();
      setDebugData(data);
      
      if (data.image) {
        const imageValid = await validateImageUrl(data.image);
        setIsImageValid(imageValid);
      }
      
      // Também gerar relatório no console
      const report = await generateDebugReport();
      console.log(report);
    } catch (error) {
      console.error('Erro ao executar debug:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testUrls = [
    {
      name: 'Facebook Debugger',
      url: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(window.location.href)}`,
      description: 'Teste como o link aparece no Facebook e WhatsApp'
    },
    {
      name: 'Twitter Card Validator',
      url: 'https://cards-dev.twitter.com/validator',
      description: 'Valide os Twitter Cards (cole a URL manualmente)'
    },
    {
      name: 'LinkedIn Post Inspector',
      url: 'https://www.linkedin.com/post-inspector/',
      description: 'Teste a visualização no LinkedIn'
    }
  ];

  if (!showDebugger) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowDebugger(true)}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg"
        >
          <Eye className="w-4 h-4 mr-2" />
          Debug Meta Tags
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-auto">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Debug Meta Tags</CardTitle>
            <Button
              onClick={() => setShowDebugger(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            Verifique as meta tags para redes sociais
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <Button
            onClick={runDebug}
            disabled={isLoading}
            size="sm"
            className="w-full"
          >
            {isLoading ? 'Analisando...' : 'Executar Debug'}
          </Button>

          {debugData && (
            <div className="space-y-2">
              <div className="text-xs">
                <strong>Título:</strong> {debugData.title}
              </div>
              
              <div className="text-xs">
                <strong>Imagem:</strong>
                {isImageValid !== null && (
                  <Badge variant={isImageValid ? "default" : "destructive"} className="ml-1 text-xs">
                    {isImageValid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  </Badge>
                )}
              </div>

              <div className="text-xs">
                <strong>Open Graph:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {debugData.ogTags.map((tag: any) => (
                    <Badge
                      key={tag.name}
                      variant={tag.found ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-xs">
                <strong>Twitter:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {debugData.twitterTags.map((tag: any) => (
                    <Badge
                      key={tag.name}
                      variant={tag.found ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <div className="text-xs font-medium">Ferramentas de Teste:</div>
            {testUrls.map((tool) => (
              <Button
                key={tool.name}
                onClick={() => window.open(tool.url, '_blank')}
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs h-8"
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                {tool.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMetaDebugger;
