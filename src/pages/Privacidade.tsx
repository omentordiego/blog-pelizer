
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Privacidade = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">
            🔐 Política de Privacidade
          </h1>
          
          <p className="text-gray-600 mb-8">
            Última atualização: [28/05/2025]
          </p>

          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6">
              Bem-vindo ao Ponto de Vista | Por Pelizer. A sua privacidade é importante para nós. Esta Política de Privacidade tem como objetivo esclarecer como coletamos, usamos, armazenamos e protegemos os seus dados ao navegar neste site.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              📌 1. Coleta de Informações
            </h2>
            <p className="text-gray-700 mb-4">
              Coletamos informações pessoais apenas quando você:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Preenche o formulário de newsletter (nome e e-mail)</li>
              <li>Entra em contato pelo formulário de contato</li>
              <li>Acessa e navega em nosso site (coleta automática via cookies)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              As informações coletadas podem incluir:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Nome e e-mail</li>
              <li>IP, tipo de dispositivo, navegador, localização aproximada</li>
              <li>Comportamento de navegação (páginas acessadas, tempo de permanência)</li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              🧠 2. Uso das Informações
            </h2>
            <p className="text-gray-700 mb-4">
              As informações coletadas são utilizadas para:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Enviar conteúdos, novidades e artigos por e-mail (se você se inscrever)</li>
              <li>Melhorar sua experiência de navegação</li>
              <li>Analisar métricas de acesso e desempenho do site</li>
              <li>Personalizar o conteúdo exibido</li>
              <li>Cumprir obrigações legais</li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              🔒 3. Armazenamento e Segurança
            </h2>
            <p className="text-gray-700 mb-6">
              Todos os dados são armazenados com segurança em plataformas confiáveis (como Firebase ou serviços integrados ao Lovable). Utilizamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, vazamento ou perda.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              ❌ 4. Compartilhamento de Dados
            </h2>
            <p className="text-gray-700 mb-6">
              Nós não vendemos, trocamos ou compartilhamos seus dados pessoais com terceiros, exceto em casos onde for necessário por obrigação legal, ordem judicial ou com o seu consentimento.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              🧾 5. Uso de Cookies
            </h2>
            <p className="text-gray-700 mb-4">
              Utilizamos cookies para melhorar sua experiência no site. Cookies são pequenos arquivos que armazenam informações no seu navegador e podem ser desativados a qualquer momento nas configurações do navegador.
            </p>
            <p className="text-gray-700 mb-4">
              Os cookies podem ser usados para:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Análises de acesso (Google Analytics)</li>
              <li>Salvamento de preferências</li>
              <li>Funcionalidades de login, caso você seja administrador</li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              💌 6. Newsletter e Comunicação
            </h2>
            <p className="text-gray-700 mb-6">
              Ao se inscrever na newsletter, você autoriza o envio de conteúdos e mensagens relacionadas ao blog. Você pode se descadastrar a qualquer momento clicando no link de descadastro presente no rodapé de cada e-mail.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              👤 7. Seus Direitos
            </h2>
            <p className="text-gray-700 mb-4">
              Você tem o direito de:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusão dos seus dados</li>
              <li>Revogar o consentimento dado anteriormente</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Para exercer seus direitos, entre em contato pelo e-mail: contato@pontodevista.blog
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              ⚖️ 8. Alterações nesta Política
            </h2>
            <p className="text-gray-700 mb-6">
              Reservamo-nos o direito de atualizar esta Política de Privacidade a qualquer momento. Recomendamos que você a revise periodicamente. A data da última atualização estará sempre indicada no topo.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              📬 Fale Conosco
            </h2>
            <p className="text-gray-700 mb-4">
              Em caso de dúvidas sobre esta Política ou sobre como lidamos com seus dados, entre em contato:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>E-mail: contato@pontodevista.blog</li>
              <li>Responsável: Equipe Ponto de Vista</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacidade;
