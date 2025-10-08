# Guia de Instalação - BomCorte Black Friday Landing Page

## Requisitos do Servidor

- PHP 7.4 ou superior
- MySQL 5.7 ou superior
- Apache com mod_rewrite habilitado
- Extensões PHP necessárias: PDO, PDO_MySQL

## Passo 1: Configurar o Banco de Dados

1. Acesse o painel de controle da Hostinger (hPanel)
2. Vá em "Bancos de Dados MySQL"
3. Crie um novo banco de dados chamado `bomcorte_db`
4. Anote o usuário, senha e host do banco de dados
5. Acesse o phpMyAdmin
6. Selecione o banco de dados criado
7. Clique em "Importar" e selecione o arquivo `database.sql`
8. Execute a importação

## Passo 2: Compilar o Frontend

No seu computador local, execute:

```bash
npm install
npm run build
```

Isso criará uma pasta `dist` com os arquivos compilados.

## Passo 3: Fazer Upload dos Arquivos

Faça upload dos seguintes arquivos para o servidor via FTP ou Gerenciador de Arquivos:

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
    ├── index.js (da pasta dist)
    └── index.css (da pasta dist)
```

**IMPORTANTE**: NÃO faça upload do arquivo `database.sql` nem do `config.php` ainda.

## Passo 4: Configurar a Conexão com o Banco

1. Edite o arquivo `config.php`
2. Altere as seguintes linhas com os dados do seu banco:

```php
define('DB_HOST', 'localhost');  // ou o host fornecido pela Hostinger
define('DB_NAME', 'bomcorte_db');
define('DB_USER', 'seu_usuario_mysql');
define('DB_PASS', 'sua_senha_mysql');
```

3. Altere também a URL do site:

```php
define('SITE_URL', 'https://seudominio.com.br');
```

4. Faça upload do arquivo `config.php` editado

## Passo 5: Testar a Instalação

1. Acesse `https://seudominio.com.br` - deve mostrar a landing page
2. Acesse `https://seudominio.com.br/login.php` - deve mostrar a tela de login
3. Faça login com as credenciais padrão:
   - Email: `admin@bomcorte.com`
   - Senha: `admin123`

**IMPORTANTE**: Altere a senha padrão imediatamente!

## Passo 6: Alterar Senha do Administrador

1. Acesse phpMyAdmin
2. Selecione o banco de dados `bomcorte_db`
3. Clique na tabela `users`
4. Clique em "Editar" no usuário admin
5. Para gerar um novo hash de senha, use este script PHP temporário:

Crie um arquivo `gerar_senha.php` com o seguinte conteúdo:

```php
<?php
$senha = 'sua_nova_senha_segura';
echo password_hash($senha, PASSWORD_DEFAULT);
?>
```

Acesse o arquivo no navegador, copie o hash gerado, e cole no campo `password_hash` da tabela `users`.

## Passo 7: Verificar Permissões

Certifique-se que:
- O mod_rewrite está habilitado no Apache
- As permissões dos arquivos são 644
- As permissões das pastas são 755

## Estrutura de URLs

- Landing Page: `https://seudominio.com.br/`
- Login: `https://seudominio.com.br/login.php`
- Dashboard: `https://seudominio.com.br/admin/dashboard.php`
- Editor: `https://seudominio.com.br/admin/editor.php`
- Usuários: `https://seudominio.com.br/admin/users.php`

## Segurança

1. **Altere a senha padrão imediatamente**
2. Use HTTPS (SSL) - a Hostinger oferece SSL grátis
3. Mantenha o PHP atualizado
4. Faça backups regulares do banco de dados
5. Não compartilhe as credenciais do banco de dados

## Solução de Problemas

### Erro 500 - Internal Server Error
- Verifique se o mod_rewrite está habilitado
- Verifique as permissões dos arquivos
- Verifique os logs de erro do servidor

### Erro de Conexão com o Banco
- Verifique as credenciais no `config.php`
- Verifique se o banco de dados foi criado
- Verifique se as tabelas foram importadas corretamente

### Landing Page não carrega CSS/JS
- Verifique se os arquivos da pasta `dist` foram copiados para `assets/`
- Verifique os caminhos no arquivo `index.php`

## Suporte

Para problemas técnicos, verifique:
1. Logs de erro do PHP (no hPanel)
2. Console do navegador (F12)
3. Logs do Apache

## API Endpoints

- `POST /api/leads.php` - Criar novo lead
- `GET /api/leads.php` - Listar leads
- `GET /api/leads.php?stats=1` - Estatísticas
- `PUT /api/leads.php` - Atualizar lead
- `DELETE /api/leads.php` - Excluir lead
- `GET /api/config.php` - Obter configurações
- `POST /api/config.php` - Atualizar configurações
