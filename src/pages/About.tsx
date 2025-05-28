
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
      title: '25+ Anos de Experiência',
      description: 'Mais de duas décadas dedicadas ao jornalismo político e análise institucional'
    },
    {
      icon: BookOpen,
      title: '500+ Artigos Publicados',
      description: 'Extenso arquivo de análises e reflexões sobre política brasileira'
    },
    {
      icon: Users,
      title: '50K+ Leitores Alcançados',
      description: 'Comunidade engajada de cidadãos interessados em educação política'
    },
    {
      icon: Target,
      title: 'Missão Clara',
      description: 'Promover educação política com opinião, clareza e posicionamento'
    }
  ];

  const timeline = [
    {
      year: '1998',
      title: 'Início na Carreira',
      description: 'Primeiros passos no jornalismo político, cobrindo eleições municipais'
    },
    {
      year: '2005',
      title: 'Especialização',
      description: 'Foco em análise institucional e comportamento político brasileiro'
    },
    {
      year: '2010',
      title: 'Reconhecimento',
      description: 'Consolidação como referência em educação política'
    },
    {
      year: '2018',
      title: 'Era Digital',
      description: 'Expansão para plataformas digitais e redes sociais'
    },
    {
      year: '2024',
      title: 'Ponto de Vista',
      description: 'Lançamento do blog dedicado à educação política cidadã'
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
              Sobre Vanderlei Pelizer
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Jornalista político comprometido com a educação para a cidadania
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
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                  alt="Vanderlei Pelizer"
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
                  Vanderlei Pelizer
                </h2>
                <p className="text-gray-600 mb-4">
                  Jornalista Político & Educador
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
                  Uma Vida Dedicada à Educação Política
                </h2>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  Com mais de 25 anos de experiência no jornalismo político, Vanderlei Pelizer 
                  construiu uma carreira sólida baseada na análise criteriosa das instituições 
                  brasileiras e na promoção da educação política como ferramenta de transformação social.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Formado em Jornalismo pela Universidade de São Paulo, com especialização em 
                  Ciência Política, Pelizer começou sua trajetória cobrindo eleições municipais 
                  no interior de São Paulo. Desde então, testemunhou e analisou as principais 
                  transformações do cenário político brasileiro.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Sua abordagem única combina rigor jornalístico com uma linguagem acessível, 
                  tornando temas complexos da política compreensíveis para o cidadão comum. 
                  Acredita que a educação política é a base para uma democracia mais sólida 
                  e participativa.
                </p>

                <blockquote className="border-l-4 border-blog-accent bg-blue-50 p-4 italic text-blog-primary mb-6">
                  "A democracia só se fortalece quando os cidadãos compreendem seu papel 
                  e participam ativamente da vida política. Este é o meu compromisso: 
                  formar uma cidadania consciente e engajada."
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
              O "Ponto de Vista" nasceu da necessidade de criar um espaço de reflexão 
              qualificada sobre política brasileira. Nossa missão é promover educação 
              política através de análises profundas, sempre com opinião clara, 
              clareza na exposição e posicionamento fundamentado.
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
                  <h3 className="font-semibold text-gray-900 mb-2">Clareza</h3>
                  <p className="text-sm text-gray-600">
                    Explicar temas complexos de forma acessível e compreensível
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
            Trajetória Profissional
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
