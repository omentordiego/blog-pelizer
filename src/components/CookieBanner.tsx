
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Cookie, Settings, X } from 'lucide-react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const CookieBanner = () => {
  const { showBanner, acceptAll, rejectAll, updateSettings, cookieSettings, hideBanner } = useCookieConsent();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempSettings, setTempSettings] = useState(cookieSettings);

  if (!showBanner) return null;

  const handleShowSettings = () => {
    setTempSettings(cookieSettings);
    setShowSettingsModal(true);
  };

  const handleSaveSettings = () => {
    updateSettings(tempSettings);
    setShowSettingsModal(false);
  };

  const handleCloseModal = () => {
    setShowSettingsModal(false);
    setTempSettings(cookieSettings);
  };

  const cookieTypes = [
    {
      id: 'necessary',
      label: 'Cookies Essenciais',
      description: 'Necessários para o funcionamento básico do site',
      required: true,
    },
    {
      id: 'functional',
      label: 'Cookies Funcionais',
      description: 'Melhoram a funcionalidade e personalização',
      required: false,
    },
    {
      id: 'analytics',
      label: 'Cookies de Análise',
      description: 'Ajudam a entender como os visitantes usam o site',
      required: false,
    },
    {
      id: 'marketing',
      label: 'Cookies de Marketing',
      description: 'Usados para exibir anúncios relevantes',
      required: false,
    },
  ];

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <Card className="mx-auto max-w-4xl border-2 border-blog-primary shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Cookie className="w-8 h-8 text-blog-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-serif font-bold text-lg mb-2">
                  🍪 Este site usa cookies
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e analisar nosso tráfego. 
                  Ao continuar navegando, você concorda com nossa{' '}
                  <a href="/cookies" className="text-blog-primary hover:underline font-medium">
                    Política de Cookies
                  </a>{' '}
                  e{' '}
                  <a href="/privacidade" className="text-blog-primary hover:underline font-medium">
                    Política de Privacidade
                  </a>
                  .
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={acceptAll} className="bg-blog-primary hover:bg-blog-secondary">
                    Aceitar Todos
                  </Button>
                  <Button onClick={rejectAll} variant="outline">
                    Rejeitar Todos
                  </Button>
                  <Button onClick={handleShowSettings} variant="outline" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Configurar
                  </Button>
                </div>
              </div>
              <Button
                onClick={hideBanner}
                variant="ghost"
                size="sm"
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="w-5 h-5" />
              Configurações de Cookies
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-gray-600 text-sm">
              Escolha quais tipos de cookies você deseja permitir. Você pode alterar essas configurações a qualquer momento.
            </p>

            <div className="space-y-4">
              {cookieTypes.map((type) => (
                <div key={type.id} className="border rounded-lg p-4">
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={tempSettings[type.id as keyof typeof tempSettings]}
                        onCheckedChange={(checked) => {
                          if (!type.required) {
                            setTempSettings(prev => ({
                              ...prev,
                              [type.id]: checked === true
                            }));
                          }
                        }}
                        disabled={type.required}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none flex-1">
                      <FormLabel className="text-sm font-medium">
                        {type.label}
                        {type.required && (
                          <span className="text-xs text-gray-500 ml-2">(Obrigatório)</span>
                        )}
                      </FormLabel>
                      <p className="text-xs text-gray-600">
                        {type.description}
                      </p>
                    </div>
                  </FormItem>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">ℹ️ Informações Importantes:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Cookies essenciais são sempre ativos e não podem ser desabilitados</li>
                <li>• Desabilitar cookies pode afetar a funcionalidade do site</li>
                <li>• Suas preferências são salvas no navegador</li>
                <li>• Você pode alterar essas configurações a qualquer momento</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={handleSaveSettings} className="bg-blog-primary hover:bg-blog-secondary">
                Salvar Preferências
              </Button>
              <Button onClick={() => { setTempSettings({ necessary: true, analytics: true, marketing: true, functional: true }); }} variant="outline">
                Aceitar Todos
              </Button>
              <Button onClick={handleCloseModal} variant="ghost">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieBanner;
