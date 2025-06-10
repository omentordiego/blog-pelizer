
import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LazyAdDisplay from './LazyAdDisplay';

const ExitIntentPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Detectar quando o mouse sai da janela pela parte superior
    if (e.clientY <= 0 && !hasShown && !isVisible) {
      setIsVisible(true);
      setHasShown(true);
      console.log('🚪 Exit intent detectado - mostrando popup');
    }
  }, [hasShown, isVisible]);

  useEffect(() => {
    // Adicionar listener apenas se ainda não foi mostrado
    if (!hasShown) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown, handleMouseLeave]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    console.log('❌ Popup de exit intent fechado');
  }, []);

  const handleContinue = useCallback(() => {
    setIsVisible(false);
    console.log('✅ Usuário escolheu continuar navegando');
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full mx-auto relative animate-scale-in">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 hover:bg-gray-100"
          aria-label="Fechar popup"
        >
          <X className="w-4 h-4" />
        </Button>
        
        <CardHeader>
          <CardTitle className="text-center text-lg font-heading">
            Não vá embora ainda!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600 font-heading">
            Que tal conferir nossos parceiros antes de sair?
          </p>
          
          {/* Advertisement for exit popup */}
          <LazyAdDisplay position="exit_popup" />
          
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 font-heading"
            >
              Fechar
            </Button>
            <Button 
              onClick={handleContinue}
              className="flex-1 font-heading bg-blog-primary hover:bg-blog-secondary"
            >
              Continuar navegando
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExitIntentPopup;
