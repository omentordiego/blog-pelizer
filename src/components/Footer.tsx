import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, insira seu email",
        variant: "destructive",
      });
      return;
    }

    // Simulação de inscrição na newsletter
    toast({
      title: "Sucesso!",
      description: "Você foi inscrito na nossa newsletter",
    });
    setEmail('');
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
      href: '#',
      customIcon: 'https://img.icons8.com/?size=100&id=fJp7hepMryiw&format=png&color=000000'
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
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Seu melhor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white text-gray-900"
              />
              <Button type="submit" variant="secondary" className="bg-white text-blog-secondary hover:bg-gray-100">
                Inscrever-se
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="https://i.postimg.cc/LX2bQXqH/PONTO-DE-VISTA.png" 
                alt="Ponto de Vista" 
                className="h-14 w-auto brightness-0 invert"
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
                  {social.customIcon ? (
                    <img 
                      src={social.customIcon} 
                      alt={social.name}
                      className="w-5 h-5 brightness-0 invert opacity-75 hover:opacity-100 transition-opacity"
                    />
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
            © 2024 Ponto de Vista por Pelizer. Todos os direitos reservados.
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
