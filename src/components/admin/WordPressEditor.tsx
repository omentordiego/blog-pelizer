
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link2, 
  Image,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  FileImage,
  Upload
} from 'lucide-react';

interface WordPressEditorProps {
  title: string;
  onTitleChange: (title: string) => void;
  content: string;
  onContentChange: (content: string) => void;
  summary: string;
  onSummaryChange: (summary: string) => void;
  featuredImage: string;
  onFeaturedImageChange: (url: string) => void;
  placeholder?: string;
}

const WordPressEditor = ({ 
  title,
  onTitleChange,
  content, 
  onContentChange, 
  summary,
  onSummaryChange,
  featuredImage,
  onFeaturedImageChange,
  placeholder 
}: WordPressEditorProps) => {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showFeaturedImageDialog, setShowFeaturedImageDialog] = useState(false);
  const [tempFeaturedImage, setTempFeaturedImage] = useState('');

  const insertFormatting = (before: string, after: string = '', targetField: 'content' | 'summary' = 'content') => {
    const textareaId = targetField === 'content' ? 'content-editor' : 'summary-editor';
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = targetField === 'content' ? content : summary;
    const selectedText = currentText.substring(start, end);
    
    const newText = currentText.substring(0, start) + before + selectedText + after + currentText.substring(end);
    
    if (targetField === 'content') {
      onContentChange(newText);
    } else {
      onSummaryChange(newText);
    }
    
    // Restaurar foco e posição do cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const insertImage = () => {
    if (imageUrl.trim()) {
      const imageMarkdown = `![${imageAlt || 'Imagem'}](${imageUrl})`;
      const newText = content + '\n\n' + imageMarkdown + '\n\n';
      onContentChange(newText);
      setImageUrl('');
      setImageAlt('');
      setShowImageDialog(false);
    }
  };

  const insertLink = () => {
    if (linkUrl.trim() && linkText.trim()) {
      const linkMarkdown = `[${linkText}](${linkUrl})`;
      const newText = content + linkMarkdown;
      onContentChange(newText);
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
    }
  };

  const setFeaturedImage = () => {
    if (tempFeaturedImage.trim()) {
      onFeaturedImageChange(tempFeaturedImage);
      setTempFeaturedImage('');
      setShowFeaturedImageDialog(false);
    }
  };

  const formatButtons = [
    { icon: Heading1, action: () => insertFormatting('# ', ''), title: 'Título H1' },
    { icon: Heading2, action: () => insertFormatting('## ', ''), title: 'Título H2' },
    { icon: Heading3, action: () => insertFormatting('### ', ''), title: 'Título H3' },
    { icon: Bold, action: () => insertFormatting('**', '**'), title: 'Negrito' },
    { icon: Italic, action: () => insertFormatting('*', '*'), title: 'Itálico' },
    { icon: Underline, action: () => insertFormatting('<u>', '</u>'), title: 'Sublinhado' },
    { icon: List, action: () => insertFormatting('- ', ''), title: 'Lista' },
    { icon: ListOrdered, action: () => insertFormatting('1. ', ''), title: 'Lista Numerada' },
    { icon: Quote, action: () => insertFormatting('> ', ''), title: 'Citação' },
    { icon: AlignLeft, action: () => insertFormatting('<div style="text-align: left;">\n', '\n</div>'), title: 'Alinhar à Esquerda' },
    { icon: AlignCenter, action: () => insertFormatting('<div style="text-align: center;">\n', '\n</div>'), title: 'Centralizar' },
    { icon: AlignRight, action: () => insertFormatting('<div style="text-align: right;">\n', '\n</div>'), title: 'Alinhar à Direita' },
  ];

  return (
    <div className="space-y-6">
      {/* Título do Artigo */}
      <div className="space-y-2">
        <Label htmlFor="article-title" className="text-lg font-semibold">Título do Artigo</Label>
        <Input
          id="article-title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Digite o título do artigo"
          className="text-lg font-medium p-4"
        />
      </div>

      {/* Imagem Destacada */}
      <div className="space-y-2">
        <Label className="text-lg font-semibold">Imagem Destacada</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          {featuredImage ? (
            <div className="space-y-3">
              <img 
                src={featuredImage} 
                alt="Imagem destacada" 
                className="max-w-full h-48 object-cover rounded-lg mx-auto"
              />
              <div className="flex gap-2 justify-center">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowFeaturedImageDialog(true)}
                  className="text-sm"
                >
                  <FileImage className="w-4 h-4 mr-2" />
                  Alterar Imagem
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => onFeaturedImageChange('')}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remover
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-3">Adicione uma imagem destacada para o artigo</p>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setShowFeaturedImageDialog(true)}
              >
                <FileImage className="w-4 h-4 mr-2" />
                Adicionar Imagem Destacada
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Resumo */}
      <div className="space-y-2">
        <Label htmlFor="summary-editor" className="text-lg font-semibold">Resumo</Label>
        <div className="border rounded-lg">
          {/* Barra de ferramentas para resumo */}
          <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('**', '**', 'summary')}
              title="Negrito"
              className="h-8 w-8 p-0"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('*', '*', 'summary')}
              title="Itálico"
              className="h-8 w-8 p-0"
            >
              <Italic className="w-4 h-4" />
            </Button>
          </div>
          <Textarea
            id="summary-editor"
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            placeholder="Digite um resumo atraente do artigo"
            rows={3}
            className="border-0 resize-none focus:ring-0"
          />
        </div>
      </div>

      {/* Editor de Conteúdo */}
      <div className="space-y-2">
        <Label htmlFor="content-editor" className="text-lg font-semibold">Conteúdo</Label>
        <div className="border rounded-lg">
          {/* Barra de ferramentas completa */}
          <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
            {formatButtons.map((button, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                onClick={button.action}
                title={button.title}
                className="h-8 w-8 p-0"
              >
                <button.icon className="w-4 h-4" />
              </Button>
            ))}
            
            <div className="w-px h-6 bg-gray-300 mx-1" />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowImageDialog(true)}
              title="Inserir Imagem"
              className="h-8 w-8 p-0"
            >
              <Image className="w-4 h-4" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowLinkDialog(true)}
              title="Inserir Link"
              className="h-8 w-8 p-0"
            >
              <Link2 className="w-4 h-4" />
            </Button>
          </div>

          <Textarea
            id="content-editor"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={placeholder || "Digite o conteúdo completo do artigo usando Markdown e HTML para formatação avançada"}
            rows={15}
            className="font-mono text-sm border-0 resize-none focus:ring-0"
          />
        </div>
      </div>

      {/* Dialog para inserir imagem destacada */}
      {showFeaturedImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 space-y-4">
            <h3 className="text-lg font-semibold">Definir Imagem Destacada</h3>
            <div className="space-y-2">
              <Label htmlFor="featuredImageUrl">URL da Imagem</Label>
              <Input
                id="featuredImageUrl"
                value={tempFeaturedImage}
                onChange={(e) => setTempFeaturedImage(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                onClick={() => setShowFeaturedImageDialog(false)} 
                variant="outline"
              >
                Cancelar
              </Button>
              <Button onClick={setFeaturedImage}>
                Definir Imagem
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog para inserir imagem no conteúdo */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 space-y-4">
            <h3 className="text-lg font-semibold">Inserir Imagem</h3>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageAlt">Texto Alternativo (opcional)</Label>
              <Input
                id="imageAlt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Descrição da imagem"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                onClick={() => setShowImageDialog(false)} 
                variant="outline"
              >
                Cancelar
              </Button>
              <Button onClick={insertImage}>Inserir</Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog para inserir link */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 space-y-4">
            <h3 className="text-lg font-semibold">Inserir Link</h3>
            <div className="space-y-2">
              <Label htmlFor="linkText">Texto do Link</Label>
              <Input
                id="linkText"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Texto que aparecerá"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://exemplo.com"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                onClick={() => setShowLinkDialog(false)} 
                variant="outline"
              >
                Cancelar
              </Button>
              <Button onClick={insertLink}>Inserir</Button>
            </div>
          </div>
        </div>
      )}

      {/* Dicas de uso */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Dicas de Formatação:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use os botões da barra de ferramentas para formatação rápida</li>
          <li>• Selecione texto antes de aplicar formatação</li>
          <li>• Suporte completo a Markdown e HTML</li>
          <li>• A imagem destacada aparecerá no topo do artigo</li>
          <li>• O resumo será exibido nas listagens de artigos</li>
        </ul>
      </div>
    </div>
  );
};

export default WordPressEditor;
