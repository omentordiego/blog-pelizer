import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNewsletter } from '@/contexts/NewsletterContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { subscribe } = useNewsletter();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Enviando formulário de newsletter:', { email, name });
    
    try {
      const success = await subscribe(email.trim(), name.trim() || undefined);
      if (success) {
        setEmail('');
        setName('');
        console.log('Newsletter inscrita com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao processar inscrição:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar sua inscrição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      href: 'https://www.facebook.com/profile.php?id=61572958285693' 
    },
    { 
      name: 'Twitter/X', 
      icon: null, 
      href: 'https://x.com/vpelizerpereira',
      customSvg: (
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50" fill="currentColor">
          <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
        </svg>
      )
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      href: 'https://www.instagram.com/vanderleipelizer/' 
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      href: '#' 
    },
  ];

  const footerLinks = [
    {
      title: 'Blog',
      links: [
        { name: 'Artigos Recentes', href: '/blog' },
        { name: 'Política Nacional', href: '/categorias/politica-nacional' },
        { name: 'Economia', href: '/categorias/economia' },
        { name: 'Democracia', href: '/categorias/democracia' },
      ]
    },
    {
      title: 'Sobre',
      links: [
        { name: 'Quem é Pelizer', href: '/sobre' },
        { name: 'Missão do Blog', href: '/sobre#missao' },
        { name: 'Contato', href: '/contato' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Política de Privacidade', href: '/privacidade' },
        { name: 'Termos de Uso', href: '/termos' },
        { name: 'Cookies', href: '/cookies' },
      ]
    }
  ];

  return (
    <footer className="bg-blog-primary text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="bg-blog-secondary rounded-lg p-6 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="w-8 h-8 mx-auto mb-4 text-white" />
            <h3 className="text-xl font-serif font-bold mb-2">
              Receba nossa newsletter
            </h3>
            <p className="text-blue-100 mb-4">
              Fique por dentro das análises mais importantes sobre política brasileira
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Seu nome (opcional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white text-gray-900"
                disabled={isSubmitting}
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Seu melhor email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white text-gray-900"
                  required
                  disabled={isSubmitting}
                />
                <Button 
                  type="submit" 
                  variant="secondary" 
                  disabled={isSubmitting}
                  className="bg-white text-blog-secondary hover:bg-gray-100 disabled:opacity-50"
                >
                  {isSubmitting ? 'Inscrevendo...' : 'Inscrever-se'}
                </Button>
              </div>
              <p className="text-sm text-blue-200">
                ✓ Gratuito para sempre • ✓ Sem spam • ✓ Cancele a qualquer momento
              </p>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="https://i.postimg.cc/mgpyvymp/PONTO-DE-VISTA-3.png" 
                alt="Ponto de Vista" 
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-blue-100 text-sm mb-4">
              Educação política com opinião, clareza e posicionamento. 
              Conteúdo que forma cidadãos conscientes e participativos.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-blue-200 hover:text-white transition-colors"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.customSvg ? (
                    social.customSvg
                  ) : social.icon ? (
                    <social.icon className="w-5 h-5" />
                  ) : null}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-blue-200 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm">
            © 2024 Blog Fala Pelizer. Todos os direitos reservados.
          </p>
          <p className="text-blue-200 text-sm mt-2 md:mt-0">
            Feito com ❤️ para a educação política brasileira
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
