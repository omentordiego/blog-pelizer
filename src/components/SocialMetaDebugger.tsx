
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, ExternalLink, Check, X, RefreshCw, AlertTriangle } from 'lucide-react';
import { debugSocialMetaTags, generateDebugReport, SocialMetaDebugInfo } from '@/utils/socialMetaDebugger';

interface SocialMetaDebuggerProps {
  isVisible?: boolean;
}

const SocialMetaDebugger = ({ isVisible = false }: SocialMetaDebuggerProps) => {
  const [showDebugger, setShowDebugger] = useState(isVisible);
  const [debugData, setDebugData] = useState<SocialMetaDebugInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDebug = async () => {
    setIsLoading(true);
    try {
      const data = await debugSocialMetaTags();
      setDebugData(data);
      
      // Gerar relatório detalhado no console
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
      description: 'Limpar cache do Facebook/WhatsApp',
      icon: '🔵'
    },
    {
      name: 'Twitter Validator',
      url: 'https://cards-dev.twitter.com/validator',
      description: 'Validar Twitter Cards',
      icon: '🐦'
    },
    {
      name: 'LinkedIn Inspector',
      url: 'https://www.linkedin.com/post-inspector/',
      description: 'Testar no LinkedIn',
      icon: '💼'
    }
  ];

  if (!showDebugger) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowDebugger(true)}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg border-2 border-blue-200 hover:border-blue-300"
        >
          <Eye className="w-4 h-4 mr-2" />
          Debug Meta Tags
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[500px] overflow-auto">
      <Card className="shadow-xl border-2 border-blue-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Debug Meta Tags
            </CardTitle>
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
            Verificar meta tags para redes sociais
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <Button
            onClick={runDebug}
            disabled={isLoading}
            size="sm"
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Executar Debug
              </>
            )}
          </Button>

          {debugData && (
            <div className="space-y-3">
              {/* Status da Imagem */}
              <div className="bg-muted p-2 rounded text-xs">
                <div className="flex items-center justify-between mb-1">
                  <strong>Status da Imagem:</strong>
                  <Badge variant={debugData.imageValidation.isValid ? "default" : "destructive"}>
                    {debugData.imageValidation.isValid ? (
                      <Check className="w-3 h-3 mr-1" />
                    ) : (
                      <X className="w-3 h-3 mr-1" />
                    )}
                    {debugData.imageValidation.isValid ? 'Válida' : 'Inválida'}
                  </Badge>
                </div>
                {debugData.imageValidation.error && (
                  <div className="text-red-600 text-xs flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {debugData.imageValidation.error}
                  </div>
                )}
              </div>

              {/* Informações Básicas */}
              <div className="text-xs space-y-1">
                <div><strong>Título:</strong> {debugData.title}</div>
                <div><strong>URL:</strong> {debugData.url}</div>
              </div>

              {/* Open Graph Tags */}
              <div className="text-xs">
                <strong>Open Graph (Facebook/WhatsApp):</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {debugData.ogTags.map((tag) => (
                    <Badge
                      key={tag.name}
                      variant={tag.found ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {tag.name.replace('og:', '')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Twitter Tags */}
              <div className="text-xs">
                <strong>Twitter:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {debugData.twitterTags.map((tag) => (
                    <Badge
                      key={tag.name}
                      variant={tag.found ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {tag.name.replace('twitter:', '')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Dados Estruturados */}
              <div className="text-xs">
                <strong>JSON-LD:</strong>
                <Badge variant={debugData.structuredData ? "default" : "secondary"} className="ml-2">
                  {debugData.structuredData ? 'Presente' : 'Ausente'}
                </Badge>
              </div>
            </div>
          )}

          {/* Ferramentas de Teste */}
          <div className="space-y-1">
            <div className="text-xs font-medium">🛠️ Ferramentas de Teste:</div>
            {testUrls.map((tool) => (
              <Button
                key={tool.name}
                onClick={() => window.open(tool.url, '_blank')}
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs h-8"
              >
                <span className="mr-2">{tool.icon}</span>
                <ExternalLink className="w-3 h-3 mr-2" />
                {tool.name}
              </Button>
            ))}
          </div>

          {/* Dicas Rápidas */}
          <div className="bg-blue-50 p-2 rounded text-xs">
            <div className="font-medium mb-1">💡 Dicas para WhatsApp:</div>
            <ul className="text-xs space-y-1">
              <li>• Use o Facebook Debugger para limpar cache</li>
              <li>• Cache pode levar até 7 dias para atualizar</li>
              <li>• Imagem deve ter pelo menos 300x157px</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMetaDebugger;
