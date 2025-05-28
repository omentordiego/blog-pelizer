
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  AlignRight
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const RichTextEditor = ({ value, onChange, placeholder, rows = 8 }: RichTextEditorProps) => {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Restaurar foco e posição do cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const insertImage = () => {
    if (imageUrl.trim()) {
      const imageMarkdown = `![${imageAlt || 'Imagem'}](${imageUrl})`;
      const newText = value + '\n\n' + imageMarkdown + '\n\n';
      onChange(newText);
      setImageUrl('');
      setImageAlt('');
      setShowImageDialog(false);
    }
  };

  const insertLink = () => {
    if (linkUrl.trim() && linkText.trim()) {
      const linkMarkdown = `[${linkText}](${linkUrl})`;
      const newText = value + linkMarkdown;
      onChange(newText);
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
    }
  };

  const formatButtons = [
    { icon: Bold, action: () => insertFormatting('**', '**'), title: 'Negrito' },
    { icon: Italic, action: () => insertFormatting('*', '*'), title: 'Itálico' },
    { icon: Type, action: () => insertFormatting('## ', ''), title: 'Título' },
    { icon: List, action: () => insertFormatting('- ', ''), title: 'Lista' },
    { icon: ListOrdered, action: () => insertFormatting('1. ', ''), title: 'Lista Numerada' },
    { icon: Quote, action: () => insertFormatting('> ', ''), title: 'Citação' },
  ];

  return (
    <div className="space-y-2">
      {/* Barra de ferramentas */}
      <div className="flex flex-wrap gap-1 p-2 border border-gray-200 rounded-lg bg-gray-50">
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

      {/* Editor de texto */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="font-mono text-sm"
      />

      {/* Dialog para inserir imagem */}
      {showImageDialog && (
        <div className="p-4 border border-gray-200 rounded-lg bg-white space-y-3">
          <h4 className="font-medium">Inserir Imagem</h4>
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
          <div className="flex gap-2">
            <Button onClick={insertImage} size="sm">Inserir</Button>
            <Button 
              onClick={() => setShowImageDialog(false)} 
              variant="outline" 
              size="sm"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Dialog para inserir link */}
      {showLinkDialog && (
        <div className="p-4 border border-gray-200 rounded-lg bg-white space-y-3">
          <h4 className="font-medium">Inserir Link</h4>
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
          <div className="flex gap-2">
            <Button onClick={insertLink} size="sm">Inserir</Button>
            <Button 
              onClick={() => setShowLinkDialog(false)} 
              variant="outline" 
              size="sm"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Dica de uso */}
      <p className="text-xs text-gray-500">
        Dica: Selecione texto antes de aplicar formatação. Use Markdown para formatação avançada.
      </p>
    </div>
  );
};

export default RichTextEditor;
