# Guia de Instalação - BomCorte Black Friday Landing Page

## Requisitos do Servidor

- **PHP 7.4 ou superior** (recomendado PHP 8.0+)
- **MySQL 5.7 ou superior** (recomendado MySQL 8.0+)
- **Apache com mod_rewrite habilitado**
- **Extensões PHP necessárias**:
  - PDO
  - PDO_MySQL
  - JSON
  - MBString
  - OpenSSL

## Arquivos do Sistema

Após a compilação, você terá os seguintes arquivos:

### Backend PHP
- `config.php` - Configuração do banco e sessões
- `login.php` - Página de login
- `logout.php` - Script de logout
- `index.php` - Landing page pública
- `.htaccess` - Regras de roteamento

### API REST
- `api/leads.php` - Gerenciamento de leads
- `api/config.php` - Gerenciamento de configurações

### Painel Administrativo (Protegido)
- `admin/dashboard.php` - Dashboard principal
- `admin/editor.php` - Editor da landing page
- `admin/users.php` - Gerenciamento de usuários

### Frontend Compilado
- `dist/assets/index.js` - JavaScript compilado (247KB)
- `dist/assets/index.css` - CSS compilado com Tailwind (33KB)
- `dist/index.html` - Template HTML

### Banco de Dados
- `database.sql` - Estrutura completa do banco

---

## Passo 1: Configurar o Banco de Dados

### 1.1 Criar o Banco de Dados

1. Acesse o painel de controle da Hostinger (hPanel)
2. Navegue até **"Bancos de Dados MySQL"**
3. Clique em **"Criar novo banco de dados"**
4. Nome do banco: `bomcorte_db`
5. Anote as seguintes informações:
   - **Host**: geralmente `localhost`
   - **Nome do banco**: `bomcorte_db`
   - **Usuário**: fornecido pela Hostinger
   - **Senha**: fornecido pela Hostinger

### 1.2 Importar Estrutura do Banco

1. Acesse o **phpMyAdmin** através do hPanel
2. Selecione o banco de dados `bomcorte_db`
3. Clique na aba **"Importar"**
4. Clique em **"Escolher arquivo"** e selecione `database.sql`
5. Clique em **"Executar"**
6. Aguarde a mensagem de sucesso

O banco de dados criará automaticamente:
- 6 tabelas (users, leads, landing_page_config, admin_logs, page_views, integrations)
- 4 views para relatórios
- 2 stored procedures
- 1 trigger para auditoria
- Usuário administrador padrão
- Configurações iniciais da landing page

---

## Passo 2: Compilar o Frontend

No seu computador local, na pasta do projeto:

```bash
# Instalar dependências
npm install

# Compilar para produção
npm run build
```

Isso criará a pasta `dist/` com:
- `dist/assets/index.js` (247KB)
- `dist/assets/index.css` (33KB)
- `dist/index.html` (template de referência)

---

## Passo 3: Estrutura de Diretórios no Servidor

Crie a seguinte estrutura no seu servidor (geralmente em `/public_html/`):

```
/public_html/
├── .htaccess
├── config.php
├── index.php
├── login.php
├── logout.php
├── api/
│   ├── leads.php
│   └── config.php
├── admin/
│   ├── dashboard.php
│   ├── editor.php
│   └── users.php
└── assets/
    ├── index.js
    └── index.css
```

---

## Passo 4: Upload dos Arquivos

### 4.1 Fazer Upload via FTP ou Gerenciador de Arquivos

**Arquivos da raiz:**
- `.htaccess`
- `index.php`
- `login.php`
- `logout.php`

**Pasta `api/`:**
- `api/leads.php`
- `api/config.php`

**Pasta `admin/`:**
- `admin/dashboard.php`
- `admin/editor.php`
- `admin/users.php`

**Pasta `assets/`:**
- Copie `dist/assets/index.js` para `assets/index.js`
- Copie `dist/assets/index.css` para `assets/index.css`

**⚠️ IMPORTANTE**:
- **NÃO** faça upload do arquivo `database.sql` para o servidor
- **NÃO** faça upload do arquivo `config.php` ainda (vamos editá-lo primeiro)

---

## Passo 5: Configurar Conexão com o Banco

### 5.1 Editar config.php

Abra o arquivo `config.php` em um editor de texto e altere:

```php
// Configurações do banco de dados
define('DB_HOST', 'localhost');           // Host do MySQL (fornecido pela Hostinger)
define('DB_NAME', 'bomcorte_db');        // Nome do banco criado
define('DB_USER', 'seu_usuario_mysql');  // Usuário do MySQL
define('DB_PASS', 'sua_senha_mysql');    // Senha do MySQL
define('DB_CHARSET', 'utf8mb4');

// Configurações gerais
define('SITE_URL', 'https://seudominio.com.br'); // Sua URL completa
```

### 5.2 Fazer Upload do config.php

Após editar, faça upload do arquivo `config.php` para a raiz do servidor.

---

## Passo 6: Verificar Permissões

Certifique-se que as permissões estão corretas:

- **Arquivos PHP**: `644` ou `-rw-r--r--`
- **Diretórios**: `755` ou `drwxr-xr-x`
- **config.php**: `600` ou `-rw-------` (mais restritivo para segurança)

Via FTP, clique com o botão direito > Permissões/CHMOD

---

## Passo 7: Testar a Instalação

### 7.1 Testar Landing Page Pública

Acesse: `https://seudominio.com.br`

✅ Deve exibir a landing page da Black Friday com:
- Contador regressivo
- Formulário de captura de leads
- Seção de produtos

### 7.2 Testar Login Administrativo

Acesse: `https://seudominio.com.br/login.php`

✅ Deve exibir a tela de login

**Credenciais padrão:**
- **Email**: `admin@bomcorte.com`
- **Senha**: `admin123`

### 7.3 Testar Painel Administrativo

Após fazer login, você será redirecionado para:
`https://seudominio.com.br/admin/dashboard.php`

✅ Deve exibir o painel com estatísticas de leads

---

## Passo 8: Alterar Senha do Administrador (OBRIGATÓRIO)

### Opção 1: Pelo phpMyAdmin

1. Acesse **phpMyAdmin**
2. Selecione o banco `bomcorte_db`
3. Clique na tabela `users`
4. Clique em **"Editar"** no usuário `admin@bomcorte.com`

### Opção 2: Gerar Hash de Senha

Crie um arquivo temporário `gerar_senha.php` na raiz:

```php
<?php
$senha = 'MinhaS3nh@S3gur@2025';
echo password_hash($senha, PASSWORD_DEFAULT);
?>
```

1. Acesse: `https://seudominio.com.br/gerar_senha.php`
2. Copie o hash gerado
3. Cole no campo `password_hash` da tabela `users`
4. **DELETE o arquivo `gerar_senha.php` após o uso!**

---

## Passo 9: Configurar SSL (HTTPS)

A Hostinger oferece **SSL grátis**:

1. No hPanel, vá em **"SSL"**
2. Ative o SSL para seu domínio
3. Aguarde a ativação (pode levar alguns minutos)
4. Verifique se o site está acessível via `https://`

O arquivo `.htaccess` já força o redirecionamento para HTTPS.

---

## Estrutura de URLs do Sistema

### Área Pública
- **Landing Page**: `https://seudominio.com.br/`

### Área Administrativa (Requer Login)
- **Login**: `https://seudominio.com.br/login.php`
- **Dashboard**: `https://seudominio.com.br/admin/dashboard.php`
- **Editor**: `https://seudominio.com.br/admin/editor.php`
- **Usuários**: `https://seudominio.com.br/admin/users.php` (apenas admin)
- **Logout**: `https://seudominio.com.br/logout.php`

### API REST (Usada pelo Frontend)
- `POST /api/leads.php` - Criar novo lead
- `GET /api/leads.php` - Listar leads (requer auth)
- `GET /api/leads.php?stats=1` - Estatísticas (requer auth)
- `PUT /api/leads.php` - Atualizar lead (requer auth)
- `DELETE /api/leads.php` - Excluir lead (requer admin)
- `GET /api/config.php` - Obter configurações (requer auth)
- `POST /api/config.php` - Atualizar configurações (requer editor/admin)

---

## Recursos do Banco de Dados

### Tabelas Criadas
1. **users** - Usuários do sistema administrativo
2. **leads** - Leads capturados pela landing page
3. **landing_page_config** - Configurações customizáveis
4. **admin_logs** - Logs de ações administrativas
5. **page_views** - Estatísticas de visualizações
6. **integrations** - Configurações de webhooks e APIs

### Views para Relatórios
- `vw_leads_by_state` - Leads agrupados por estado
- `vw_leads_by_utm_source` - Leads por fonte de tráfego
- `vw_representative_performance` - Performance de vendedores
- `vw_daily_leads_summary` - Resumo diário de leads

### Stored Procedures
- `sp_update_lead_status` - Atualizar status do lead
- `sp_get_dashboard_stats` - Obter estatísticas do dashboard

---

## Segurança

### ✅ Checklist de Segurança

- [ ] Senha padrão do admin alterada
- [ ] SSL (HTTPS) ativado
- [ ] Permissões de arquivos configuradas corretamente
- [ ] Arquivo `database.sql` não está no servidor
- [ ] Backup do banco de dados configurado
- [ ] `.htaccess` protege arquivos sensíveis
- [ ] Headers de segurança configurados
- [ ] Sessões PHP com cookies seguros

### 🔒 Headers de Segurança Incluídos

O `config.php` já inclui:
```php
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
```

---

## Solução de Problemas

### ❌ Erro 500 - Internal Server Error

**Possíveis causas:**
- mod_rewrite não habilitado
- Permissões incorretas
- Erro de sintaxe no `.htaccess`

**Solução:**
1. Verifique os logs de erro: `public_html/error_log`
2. Teste sem o `.htaccess` (renomeie temporariamente)
3. Contate o suporte da Hostinger para habilitar mod_rewrite

### ❌ Erro de Conexão com o Banco

**Sintoma:** "Erro ao conectar ao banco de dados"

**Solução:**
1. Verifique as credenciais no `config.php`
2. Confirme que o banco foi criado
3. Teste a conexão via phpMyAdmin
4. Verifique se o host é realmente `localhost`

### ❌ CSS/JS não carrega

**Sintoma:** Landing page sem estilos

**Solução:**
1. Verifique se `assets/index.css` e `assets/index.js` existem
2. Verifique permissões da pasta `assets/`
3. Limpe o cache do navegador (Ctrl+F5)
4. Verifique o console do navegador (F12)

### ❌ Login não funciona

**Sintoma:** Credenciais corretas mas não loga

**Solução:**
1. Verifique se a tabela `users` foi criada
2. Confirme que o usuário existe: `SELECT * FROM users;`
3. Verifique se as sessões PHP estão funcionando
4. Limpe cookies do navegador

### ❌ Formulário não envia leads

**Sintoma:** Formulário envia mas não salva no banco

**Solução:**
1. Abra o console do navegador (F12)
2. Verifique se há erros de JavaScript
3. Teste a API diretamente: `/api/leads.php`
4. Verifique se a tabela `leads` foi criada

---

## Manutenção

### Backup Regular

**Banco de Dados:**
1. phpMyAdmin > Exportar
2. Formato: SQL
3. Salvar em local seguro

**Arquivos:**
1. Baixe toda a pasta `public_html/`
2. Salve em local seguro

Frequência recomendada: **semanal** ou antes de grandes alterações

### Logs

Verifique regularmente:
- **Erro do PHP**: `public_html/error_log`
- **Logs do sistema**: Tabela `admin_logs`
- **Apache logs**: Disponível no hPanel

### Atualizar Conteúdo

Para alterar a landing page:
1. Faça login no admin
2. Acesse `/admin/editor.php`
3. Edite textos, cores, imagens
4. Salve as alterações

---

## Suporte Técnico

### Hostinger
- **Chat 24/7**: Disponível no hPanel
- **Tutoriais**: https://support.hostinger.com

### Verificações do Sistema
```sql
-- Ver total de leads
SELECT COUNT(*) FROM leads;

-- Ver leads pendentes
SELECT * FROM leads WHERE status = 'Pendente';

-- Ver últimos acessos admin
SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 10;
```

---

## Checklist Final

Antes de colocar em produção:

- [ ] Banco de dados importado e configurado
- [ ] Todos os arquivos enviados para o servidor
- [ ] Permissões corretas configuradas
- [ ] config.php editado com dados corretos
- [ ] Senha do admin alterada
- [ ] SSL/HTTPS ativado e funcionando
- [ ] Landing page carrega corretamente
- [ ] Login administrativo funciona
- [ ] Formulário envia leads para o banco
- [ ] Backup inicial criado
- [ ] Testes em diferentes navegadores realizados
- [ ] Testes em mobile realizados

---

## Informações Adicionais

**Versão**: 2.0
**Data**: 2025-10-09
**PHP**: 7.4+ (Recomendado 8.0+)
**MySQL**: 5.7+ (Recomendado 8.0+)
**Frontend**: React 19 + Tailwind CSS v4
**Build**: Vite 6

---

**🎉 Instalação Concluída!**

Seu sistema está pronto para capturar leads da Black Friday!
