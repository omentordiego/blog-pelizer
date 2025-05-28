
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { articles, categories, newsletterSubscribers } from '@/data/mockData';
import { BarChart3, FileText, Eye, Mail } from 'lucide-react';

type ChangeType = 'positive' | 'negative' | 'neutral';

interface StatItem {
  title: string;
  value: string;
  icon: any;
  change: string;
  changeType: ChangeType;
}

const AdminStats = () => {
  const stats: StatItem[] = [
    {
      title: 'Total de Artigos',
      value: articles.length.toString(),
      icon: FileText,
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Visualizações Totais',
      value: articles.reduce((sum, article) => sum + article.views, 0).toLocaleString(),
      icon: Eye,
      change: '+23%',
      changeType: 'positive'
    },
    {
      title: 'Inscritos Newsletter',
      value: newsletterSubscribers.length.toString(),
      icon: Mail,
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Categorias Ativas',
      value: categories.length.toString(),
      icon: BarChart3,
      change: '0%',
      changeType: 'neutral'
    }
  ];

  const getChangeColor = (changeType: ChangeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-blog-accent rounded-lg">
                <stat.icon className="w-6 h-6 text-blog-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-600 ml-1">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
