
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Termos = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">
            📄 Termos de Uso
          </h1>
          
          <p className="text-gray-600 mb-8">
            Última atualização: [28/05/2025]
          </p>

          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6">
              Seja bem-vindo ao blog Ponto de Vista | Por Pelizer. Ao acessar este site, você concorda com os termos e condições descritos abaixo. Por favor, leia com atenção.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              1. ✅ Aceitação dos Termos
            </h2>
            <p className="text-gray-700 mb-6">
              Ao acessar, navegar ou utilizar este site, você declara que leu, entendeu e concorda com os presentes Termos de Uso. Caso não concorde, pedimos que não utilize o site.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              2. 📚 Finalidade do Site
            </h2>
            <p className="text-gray-700 mb-6">
              Este blog tem o objetivo de promover educação política, opinião e informação pública, de forma livre, responsável e fundamentada. Todo o conteúdo reflete a visão pessoal do autor Vanderlei Pelizer, e não substitui opiniões profissionais ou técnicas específicas.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              3. 🧠 Propriedade Intelectual
            </h2>
            <p className="text-gray-700 mb-4">
              Todos os textos, artigos, imagens, logotipos, vídeos e demais conteúdos publicados neste site são protegidos por direitos autorais e pertencem ao autor do blog, salvo quando indicado o contrário.
            </p>
            <p className="text-gray-700 mb-6">
              É proibida a reprodução total ou parcial de qualquer conteúdo sem autorização prévia e por escrito.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              4. 💬 Comentários e Participação
            </h2>
            <p className="text-gray-700 mb-4">
              Usuários podem interagir com o conteúdo através de comentários (quando habilitados). No entanto, não será permitido:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Discurso de ódio, racismo, homofobia ou preconceito de qualquer tipo</li>
              <li>Conteúdo ofensivo, violento, difamatório ou ilegal</li>
              <li>Propaganda, spam ou links maliciosos</li>
            </ul>
            <p className="text-gray-700 mb-6">
              A equipe do blog se reserva o direito de remover comentários que violem essas diretrizes, sem aviso prévio.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              5. 🔐 Privacidade
            </h2>
            <p className="text-gray-700 mb-6">
              A utilização deste site também está sujeita à nossa Política de Privacidade, que descreve como os dados dos usuários são coletados, armazenados e utilizados.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              6. 📩 Newsletter e E-mails
            </h2>
            <p className="text-gray-700 mb-6">
              Ao se cadastrar na nossa newsletter, você autoriza o envio de conteúdos, artigos e materiais informativos. Você poderá se descadastrar a qualquer momento por meio do link presente nos e-mails.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              7. ⚠️ Limitação de Responsabilidade
            </h2>
            <p className="text-gray-700 mb-4">
              Apesar do esforço para manter o conteúdo atualizado, o blog não se responsabiliza por decisões tomadas com base nas informações aqui contidas, nem por eventuais danos ou prejuízos causados pelo uso do site.
            </p>
            <p className="text-gray-700 mb-6">
              O blog também não garante disponibilidade contínua do serviço e pode sofrer interrupções temporárias por motivos técnicos, manutenção ou força maior.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              8. 🔄 Alterações nos Termos
            </h2>
            <p className="text-gray-700 mb-6">
              Estes Termos de Uso podem ser atualizados periodicamente. A versão mais recente estará sempre disponível nesta página, com a data de atualização.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
              9. 📬 Contato
            </h2>
            <p className="text-gray-700 mb-4">
              Para dúvidas, sugestões ou questões relacionadas a estes Termos, entre em contato:
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

export default Termos;
