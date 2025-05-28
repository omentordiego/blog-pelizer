
import React, { useState } from 'react';
import { Mail, CheckCircle, Users, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, insira seu email",
        variant: "destructive",
      });
      return;
    }

    // Simular inscrição na newsletter
    console.log('Email inscrito:', email);
    setIsSubscribed(true);
    toast({
      title: "Sucesso!",
      description: "Você foi inscrito na nossa newsletter",
    });
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Análises Exclusivas',
      description: 'Receba análises políticas aprofundadas que não são publicadas no blog'
    },
    {
      icon: Calendar,
      title: 'Resumo Semanal',
      description: 'Todo domingo, um resumo dos principais acontecimentos da semana'
    },
    {
      icon: Users,
      title: 'Comunidade Engajada',
      description: 'Faça parte de uma comunidade de cidadãos interessados em política'
    }
  ];

  const stats = [
    { number: '5.2K+', label: 'Inscritos ativos' },
    { number: '95%', label: 'Taxa de abertura' },
    { number: '4.8★', label: 'Avaliação média' }
  ];

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
                Bem-vindo à nossa comunidade!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Você foi inscrito com sucesso na newsletter "Ponto de Vista". 
                Verifique sua caixa de entrada para confirmar a inscrição.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => window.location.href = '/blog'}
                  size="lg"
                  className="bg-blog-primary hover:bg-blog-secondary"
                >
                  Explorar Artigos
                </Button>
                <p className="text-sm text-gray-500">
                  Primeiro newsletter será enviado na próxima semana
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blog-primary to-blog-secondary text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-blog-primary" />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
              Newsletter Ponto de Vista
            </h1>
            
            <p className="text-xl text-blue-100 mb-8">
              Receba análises políticas exclusivas, reflexões sobre democracia e 
              insights para uma cidadania mais consciente, direto na sua caixa de entrada.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Seu melhor email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white text-gray-900"
                  required
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-blog-primary hover:bg-gray-100"
                >
                  Inscrever-se Grátis
                </Button>
              </div>
              <p className="text-sm text-blue-200 mt-3">
                ✓ Gratuito para sempre • ✓ Sem spam • ✓ Cancele a qualquer momento
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blog-primary mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-blog-primary mb-4">
                Por que Assinar Nossa Newsletter?
              </h2>
              <p className="text-lg text-gray-600">
                Conteúdo exclusivo para formar uma cidadania mais consciente
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blog-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-6 h-6 text-blog-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sample Content */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-blog-primary mb-4">
                Amostra do Conteúdo
              </h2>
              <p className="text-gray-600">
                Veja o que nossos assinantes recebem todas as semanas
              </p>
            </div>

            <Card className="bg-white border-l-4 border-blog-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Newsletter #47 • 15 de Janeiro, 2024</span>
                  <span className="text-sm bg-blog-accent text-blog-primary px-2 py-1 rounded">
                    Apenas para assinantes
                  </span>
                </div>
                
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
                  "As Três Reformas que Vão Definir 2024"
                </h3>
                
                <p className="text-gray-700 mb-4">
                  Olá, caro leitor! Esta semana analisamos as reformas tributária, 
                  administrativa e política que estão em tramitação no Congresso. 
                  Como cada uma pode impactar sua vida e o futuro do país...
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 italic">
                    📊 Dados exclusivos: Como as reformas afetam diferentes classes sociais<br/>
                    🎯 Minha opinião: Por que a reforma política é a mais urgente<br/>
                    📝 Para refletir: Três perguntas para fazer aos seus representantes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-blog-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Pronto para Se Tornar um Cidadão Mais Informado?
          </h2>
          <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de brasileiros que já recebem análises políticas 
            que realmente fazem diferença na formação da opinião.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Seu melhor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white text-gray-900"
                required
              />
              <Button 
                type="submit" 
                size="lg" 
                variant="secondary"
                className="bg-white text-blog-primary hover:bg-gray-100"
              >
                Começar Agora
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Newsletter;
