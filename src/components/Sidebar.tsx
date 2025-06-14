
import React from 'react';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Newsletter Signup Widget */}
      <div className="bg-blog-primary text-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 font-heading">Newsletter</h3>
        <p className="text-sm text-blue-100 mb-4 font-heading">
          Receba análises políticas direto no seu email
        </p>
        <a 
          href="/newsletter" 
          className="inline-block bg-white text-blog-primary px-4 py-2 rounded font-medium text-sm hover:bg-gray-100 transition-colors font-heading"
        >
          Inscrever-se
        </a>
      </div>

      {/* Recent Categories Widget */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-blog-primary font-heading">
          Categorias Principais
        </h3>
        <div className="space-y-2">
          {['Política Nacional', 'Economia', 'Democracia', 'Análises'].map((category) => (
            <a 
              key={category}
              href={`/categorias/${category.toLowerCase().replace(' ', '-')}`}
              className="block text-gray-600 hover:text-blog-primary transition-colors text-sm font-heading"
            >
              {category}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
