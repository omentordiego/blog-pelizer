
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Mail, Trash2 } from 'lucide-react';
import { newsletterSubscribers } from '@/data/mockData';

const NewsletterManagement = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gerenciar Newsletter</CardTitle>
          <Button className="bg-blog-primary hover:bg-blog-secondary">
            Exportar Lista
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blog-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{newsletterSubscribers.length}</div>
                <div className="text-sm text-gray-600">Total de Inscritos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">15</div>
                <div className="text-sm text-gray-600">Novos esta semana</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">Taxa de abertura</div>
              </CardContent>
            </Card>
          </div>

          <div className="border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h4 className="font-semibold text-gray-900">Inscritos Recentes</h4>
            </div>
            <div className="divide-y divide-gray-200">
              {newsletterSubscribers.map((subscriber) => (
                <div key={subscriber.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{subscriber.email}</div>
                    <div className="text-sm text-gray-500">
                      Inscrito em {new Date(subscriber.subscriptionDate).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsletterManagement;
