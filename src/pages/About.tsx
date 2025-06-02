
import React from 'react';
import { Award, BookOpen, Users, Target, Mail, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  const achievements = [
    {
      icon: Award,
      title: '30+ Anos de Experiência',
      description: 'Mais de três décadas dedicadas à Tecnologia da Informação e desenvolvimento regional'
    },
    {
      icon: BookOpen,
      title: 'Trajetória Diversificada',
      description: 'Do comércio local à multinacionais, do empreendedorismo à vida pública'
    },
    {
      icon: Users,
      title: 'Liderança Política',
      description: 'Vice-prefeito de Uberlândia e presidente do Partido Liberal no município'
    },
    {
      icon: Target,
      title: 'Compromisso com Uberlândia',
      description: 'Promovendo educação, empreendedorismo e liberdade individual'
    }
  ];

  const timeline = [
    {
      year: '1990s',
      title: 'Início da Carreira',
      description: 'Office boy no comércio local, formação técnica em informática'
    },
    {
      year: '2000-2017',
      title: 'Grupo Martins',
      description: '17 anos na maior empresa atacadista da América Latina'
    },
    {
      year: '2010s',
      title: 'Stefanini IT Solutions',
      description: 'Consultor e diretor do escritório regional em Uberlândia'
    },
    {
      year: '2013',
      title: 'Entrada na Política',
      description: 'Participação em movimentos sociais e ativismo político'
    },
    {
      year: '2015',
      title: 'Empreendedorismo',
      description: 'Fundação de empresa de consultoria em tecnologia'
    },
    {
      year: '2020',
      title: 'Assessoria Política',
      description: 'Integração à equipe do deputado estadual Cristiano Caporezzo'
    },
    {
      year: '2024',
      title: 'Vice-prefeito',
      description: 'Eleição como vice-prefeito de Uberlândia e presidência do PL municipal'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blog-primary to-blog-secondary text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
              Sobre Vanderlei Pelizer Pereira
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Vice-prefeito de Uberlândia, especialista em TI e líder político comprometido com o desenvolvimento regional
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Photo and Introduction */}
            <div className="lg:col-span-1">
              <div className="relative mb-6">
                <img
                  src="/lovable-uploads/c26b562f-5118-47d3-a0ac-10b37ab2678a.png"
                  alt="Vanderlei Pelizer Pereira"
                  className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-lg">
                  <div className="w-12 h-12 bg-blog-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">VP</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-2xl font-serif font-bold text-blog-primary mb-2">
                  Vanderlei Pelizer Pereira
                </h2>
                <p className="text-gray-600 mb-2">
                  Vice-prefeito de Uberlândia
                </p>
                <p className="text-gray-600 mb-4">
                  Presidente do PL Municipal
                </p>
                <div className="flex justify-center space-x-3">
                  <Button variant="ghost" size="sm">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-serif font-bold text-blog-primary mb-6">
                  Uma Trajetória de Dedicação e Liderança
                </h2>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  Vanderlei Pelizer Pereira, natural de Uberlândia (MG), é um profissional da área 
                  de Tecnologia da Informação com mais de 30 anos de experiência. Atualmente, 
                  ocupa o cargo de vice-prefeito de Uberlândia e preside o Partido Liberal (PL) 
                  no município.
                </p>

                <h3 className="text-2xl font-serif font-bold text-blog-primary mb-4">
                  Trajetória Profissional
                </h3>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  Pelizer iniciou sua carreira como office boy no comércio local e, posteriormente, 
                  formou-se em um curso técnico de informática. Trabalhou por 17 anos no Grupo Martins, 
                  a maior empresa atacadista da América Latina, e integrou a equipe de consultores da 
                  multinacional Stefanini IT Solutions, onde assumiu a direção do escritório regional 
                  em Uberlândia. Em 2015, tornou-se empreendedor na área de tecnologia, prestando 
                  consultorias na região.
                </p>

                <h3 className="text-2xl font-serif font-bold text-blog-primary mb-4">
                  Atuação Política
                </h3>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  Sua atuação política começou em 2013, participando de movimentos sociais. Em 2020, 
                  foi convidado a integrar a equipe de assessores do então vereador e atual deputado 
                  estadual Cristiano Caporezzo. Em 2024, foi indicado como candidato a vice-prefeito 
                  de Uberlândia na chapa de Paulo Sérgio Ferreira (PP), sendo eleito para o cargo.
                </p>

                <blockquote className="border-l-4 border-blog-accent bg-blue-50 p-4 italic text-blog-primary mb-6">
                  "Vanderlei Pelizer é reconhecido por sua dedicação ao desenvolvimento de Uberlândia, 
                  tanto no setor tecnológico quanto no cenário político, promovendo valores como 
                  educação, empreendedorismo e liberdade individual."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="missao" className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-blog-primary mb-6">
              Missão do Blog
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              O "Fala Pelizer" nasceu da necessidade de criar um espaço de reflexão 
              qualificada sobre política brasileira e desenvolvimento regional. Nossa missão 
              é promover educação política através de análises profundas, sempre com opinião 
              clara, clareza na exposição e posicionamento fundamentado.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 text-blog-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Educação</h3>
                  <p className="text-sm text-gray-600">
                    Formar cidadãos conscientes através de conteúdo educativo de qualidade
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-blog-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Desenvolvimento</h3>
                  <p className="text-sm text-gray-600">
                    Promover o crescimento tecnológico e político de Uberlândia
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-blog-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Participação</h3>
                  <p className="text-sm text-gray-600">
                    Incentivar o engajamento cívico e a participação democrática
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center text-blog-primary mb-12">
            Realizações e Impacto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <achievement.icon className="w-12 h-12 text-blog-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center text-blog-primary mb-12">
            Trajetória Profissional e Política
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-blog-accent"></div>
              
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center mb-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blog-primary rounded-full border-4 border-white shadow"></div>
                  
                  {/* Content */}
                  <div className={`flex-1 ml-12 md:ml-0 ${
                    index % 2 === 0 ? 'md:mr-8 md:text-right' : 'md:ml-8'
                  }`}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-blog-secondary font-bold text-lg mb-2">
                          {item.year}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
