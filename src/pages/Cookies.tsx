
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const Cookies = () => {
  const { showSettings } = useCookieConsent();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">
            🍪 Política de Cookies
          </h1>
          
          <p className="text-gray-600 mb-8">
            Última atualização: [28/05/2025]
          </p>

          {/* Cookie Settings Button */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Gerencie suas Preferências de Cookies</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Você pode alterar suas configurações de cookies a qualquer momento.
                </p>
              </div>
              <Button 
                onClick={showSettings}
                className="flex items-center gap-2 bg-blog-primary hover:bg-blog-secondary"
              >
                <Settings className="w-4 h-4" />
                Configurar Cookies
              </Button>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6">
              Esta Política de Cookies explica o que são cookies, como os usamos neste site e como você pode controlá-los. Ao continuar navegando em nosso site, você concorda com o uso desses cookies conforme descrito abaixo.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              1. O que são Cookies?
            </h2>
            <p className="text-gray-700 mb-6">
              Cookies são pequenos arquivos de texto armazenados no seu navegador ou dispositivo quando você acessa sites da internet. Eles servem para melhorar sua experiência, lembrar preferências e coletar informações de navegação.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              2. Por que usamos Cookies?
            </h2>
            <p className="text-gray-700 mb-4">
              Utilizamos cookies por vários motivos, incluindo:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Melhorar o desempenho e funcionamento do site</li>
              <li>Lembrar suas preferências de navegação</li>
              <li>Coletar estatísticas de acesso (ex: Google Analytics)</li>
              <li>Oferecer uma experiência personalizada</li>
              <li>Facilitar o login de administradores (em áreas restritas)</li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              3. Tipos de Cookies que Utilizamos
            </h2>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Tipo de Cookie</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Finalidade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Cookies Essenciais</td>
                    <td className="border border-gray-300 px-4 py-2">Necessários para o funcionamento básico do site</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Cookies de Desempenho</td>
                    <td className="border border-gray-300 px-4 py-2">Coletam informações sobre como os visitantes usam o site (ex: páginas mais acessadas)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Cookies Funcionais</td>
                    <td className="border border-gray-300 px-4 py-2">Guardam preferências e personalizações do usuário</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Cookies de Terceiros</td>
                    <td className="border border-gray-300 px-4 py-2">Usados por ferramentas como Google Analytics, YouTube, Disqus, etc.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              4. Como Gerenciar ou Desativar Cookies
            </h2>
            <p className="text-gray-700 mb-4">
              Você pode configurar seu navegador para recusar o uso de cookies, alertá-lo quando eles forem enviados ou limpar cookies armazenados.
            </p>
            <p className="text-gray-700 mb-4">
              Veja abaixo como ajustar nas configurações dos principais navegadores:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Google Chrome:</strong> Configurações &gt; Privacidade e segurança &gt; Cookies</li>
              <li><strong>Firefox:</strong> Preferências &gt; Privacidade &gt; Cookies e dados de sites</li>
              <li><strong>Safari:</strong> Preferências &gt; Privacidade &gt; Gerenciar dados de sites</li>
              <li><strong>Edge:</strong> Configurações &gt; Cookies e permissões do site</li>
            </ul>
            <p className="text-gray-700 mb-6">
              <strong>Lembre-se:</strong> desativar cookies pode impactar na funcionalidade de partes do site.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              5. Cookies de Terceiros
            </h2>
            <p className="text-gray-700 mb-4">
              Nosso site pode utilizar serviços de terceiros que também podem instalar cookies, como:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Google Analytics (análise de navegação)</li>
              <li>YouTube (vídeos incorporados)</li>
              <li>Disqus ou Giscus (sistema de comentários)</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Esses serviços têm suas próprias políticas de cookies e privacidade.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              6. Alterações nesta Política
            </h2>
            <p className="text-gray-700 mb-6">
              Esta Política de Cookies pode ser atualizada para refletir mudanças tecnológicas ou legais. Recomendamos revisá-la regularmente.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              7. Fale Conosco
            </h2>
            <p className="text-gray-700 mb-4">
              Para dúvidas sobre esta Política, entre em contato:
            </p>
            <p className="text-gray-700 mb-6">
              <strong>E-mail:</strong> contato@pontodevista.blog
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cookies;
