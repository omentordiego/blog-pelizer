
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Mail, Trash2 } from 'lucide-react';
import { useNewsletter } from '@/contexts/NewsletterContext';
import { useToast } from '@/hooks/use-toast';

const NewsletterManagement = () => {
  const { subscribers, exportSubscribers, unsubscribe, isLoading } = useNewsletter();
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      await exportSubscribers();
      toast({
        title: "Sucesso",
        description: "Lista de assinantes exportada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar a lista.",
        variant: "destructive",
      });
    }
  };

  const handleUnsubscribe = async (email: string) => {
    if (confirm(`Tem certeza que deseja remover ${email} da newsletter?`)) {
      try {
        await unsubscribe(email);
        toast({
          title: "Sucesso",
          description: "Assinante removido com sucesso!",
        });
      } catch (error) {
        console.error('Erro ao remover assinante:', error);
        toast({
          title: "Erro",
          description: "Não foi possível remover o assinante.",
          variant: "destructive",
        });
      }
    }
  };

  const activeSubscribers = subscribers.filter(sub => sub.is_active);
  const weeklyNew = subscribers.filter(sub => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(sub.subscribed_at) > oneWeekAgo && sub.is_active;
  }).length;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blog-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados da newsletter...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gerenciar Newsletter</CardTitle>
          <Button 
            onClick={handleExport}
            className="bg-blog-primary hover:bg-blog-secondary"
            disabled={activeSubscribers.length === 0}
          >
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
                <div className="text-2xl font-bold text-gray-900">{activeSubscribers.length}</div>
                <div className="text-sm text-gray-600">Total de Inscritos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{weeklyNew}</div>
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
              {activeSubscribers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Nenhum assinante encontrado.
                </div>
              ) : (
                activeSubscribers.slice(0, 10).map((subscriber) => (
                  <div key={subscriber.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{subscriber.email}</div>
                      {subscriber.name && (
                        <div className="text-sm text-gray-600">{subscriber.name}</div>
                      )}
                      <div className="text-sm text-gray-500">
                        Inscrito em {new Date(subscriber.subscribed_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleUnsubscribe(subscriber.email)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsletterManagement;
