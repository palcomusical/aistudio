# BomCorte Black Friday Landing Page (PHP Version)

Esta é uma versão da aplicação com backend em PHP e banco de dados MySQL, projetada para ser implantada em servidores de hospedagem tradicionais.

## Instruções de Instalação

### 1. Pré-requisitos
- Um servidor web com suporte a PHP 7.4 ou superior (ex: Apache).
- Um servidor de banco de dados MySQL ou MariaDB.
- Acesso ao gerenciador de banco de dados (ex: phpMyAdmin).

### 2. Configuração do Banco de Dados
1. Crie um novo banco de dados no seu servidor MySQL (ex: `bomcorte_db`).
2. Acesse o phpMyAdmin, selecione o banco de dados que você acabou de criar.
3. Vá para a aba "Importar", selecione o arquivo `database.sql` deste projeto e execute a importação. Isso criará todas as tabelas necessárias e inserirá o conteúdo padrão e um usuário administrador.

### 3. Configuração da Aplicação
1. Abra o arquivo `config.php` em um editor de texto.
2. Altere os valores de `DB_HOST`, `DB_NAME`, `DB_USER`, e `DB_PASS` para corresponder às credenciais do seu banco de dados criado no passo anterior.

### 4. Permissões para Upload de Arquivos
1. Crie um diretório chamado `uploads` na pasta raiz do seu projeto (no mesmo nível que `index.php`).
2. Dê permissão de escrita para o servidor neste diretório. Em servidores Linux, o comando comum é `chmod 755 uploads` ou, em alguns casos, `chmod 777 uploads`. Este diretório é essencial para que o painel de administração possa salvar as imagens do logo, fundo e produtos.

### 5. Implantação (Deployment)
1. Faça o upload de todos os arquivos e da pasta `uploads/` para o diretório principal do seu site na sua hospedagem (geralmente `public_html` ou `www`).
2. Certifique-se de remover todos os arquivos antigos da versão em React (.tsx, .ts, .html, etc.) para evitar conflitos.

### 6. Acessando a Aplicação
- **Landing Page**: Navegue para o seu domínio (ex: `http://seusite.com/`).
- **Painel Administrativo**: Navegue para `http://seusite.com/admin.php`.

### Login Padrão do Administrador
- **Email**: `admin@bomcorte.com`
- **Senha**: `password123`

**IMPORTANTE:** Por segurança, é altamente recomendável que você acesse o painel de administração e crie um novo usuário administrador com uma senha forte, e depois exclua o usuário padrão.
