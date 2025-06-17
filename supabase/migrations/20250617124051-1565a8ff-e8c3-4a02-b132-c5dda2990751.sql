
-- Habilitar RLS para todas as tabelas analytics
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de dados de analytics (público pode inserir)
CREATE POLICY "Allow public insert analytics_data" ON analytics_data
FOR INSERT TO public
WITH CHECK (true);

-- Política para permitir leitura de dados de analytics (público pode ler)
CREATE POLICY "Allow public select analytics_data" ON analytics_data
FOR SELECT TO public
USING (true);

-- Política para permitir atualização de views nos artigos (público pode atualizar)
CREATE POLICY "Allow public update article views" ON articles
FOR UPDATE TO public
USING (true)
WITH CHECK (true);

-- Política para permitir leitura de artigos (público pode ler)
CREATE POLICY "Allow public select articles" ON articles
FOR SELECT TO public
USING (true);

-- Política para permitir leitura de categorias (público pode ler)
CREATE POLICY "Allow public select categories" ON categories
FOR SELECT TO public
USING (true);

-- Habilitar realtime para a tabela analytics_data
ALTER TABLE analytics_data REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE analytics_data;

-- Habilitar realtime para a tabela articles
ALTER TABLE articles REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE articles;
