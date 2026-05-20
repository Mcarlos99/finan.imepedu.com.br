# 🚀 Guia de Deploy - EduFinance no CloudPanel (Hostinger VPS)

Este guia prático ensina o passo a passo para hospedar o aplicativo **EduFinance - Gestão Escolar e Financeira** em sua VPS Hostinger gerenciada pelo **CloudPanel**.

---

## 📋 Pré-requisitos na VPS

1. Ter o **CloudPanel** instalado em sua VPS Hostinger.
2. Seu domínio ou subdomínio (ex: `financeiro.suaescola.com.br`) apontado para o IP da VPS.

---

## 🛠️ Passo 1: Criar o Banco de Dados MySQL no CloudPanel

1. Acesse o painel do **CloudPanel**.
2. No menu lateral, clique em **Databases** (Bancos de dados) e clique em **Add Database**.
3. Preencha as informações:
   - **Database Name**: `edufinance`
   - **Database User**: `edufinance_user`
   - **Database Password**: *[Crie uma senha forte e armazene-a]*
4. Clique em **Add Database**.
5. Abra o gerenciador de banco de dados (como o phpMyAdmin integrado ao CloudPanel) e execute/importe o código localizado no arquivo `schema.sql` (na raiz do seu projeto) para criar as tabelas e povoá-las com os dados iniciais.

---

## 🌐 Passo 2: Adicionar um Site Node.js no CloudPanel

1. No CloudPanel, vá em **Sites** e clique em **Add Site**.
2. Escolha **Create a Node.js Site** (ou adicione como Reverse Proxy se desejar, mas o tipo Node.js oficial é ideal).
3. Insira as informações do site:
   - **Domain Name**: `financeiro.suaescola.com.br` (seu domínio)
   - **Node.js Version**: Selecione a versão recomendada (v20 ou v22).
   - **App Port**: `3000` (porta padrão na qual o nosso servidor Express roda).
4. Clique em **Create**.

---

## 📂 Passo 3: Upload do Código do Projeto

1. Acesse sua VPS via SSH ou use o **File Manager** integrado do CloudPanel para acessar a pasta do domínio criada em:
   `/home/cloudpanel/htdocs/financeiro.suaescola.com.br/`
2. Remova os arquivos padrão se houver, e faça upload dos arquivos do projeto (zipados, exceto `node_modules` e `.git`).
3. Extraia o código dentro dessa pasta.

---

## ⚙️ Passo 4: Configurar as Variáveis de Ambiente (`.env`)

Na raiz do projeto no servidor (mesmo diretório do `package.json`), copie ou crie o arquivo `.env`:

```env
# Porta do servidor Express (Fixada em 3000 para sincronizar com o CloudPanel)
PORT=3000
NODE_ENV=production

# URLs de Referência
APP_URL=https://financeiro.suaescola.com.br

# Chave API do Gemini (Para o Consultor de Finanças e Desempenho Escolar)
GEMINI_API_KEY=SUA_CHAVE_AQUI_DO_GOOGLE_AI_STUDIO

# Configurações de Conectividade do Banco de Dados MySQL (Hostinger)
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=edufinance_user
MYSQL_PASSWORD=SUA_SENHA_FORTE_CONFIGURADA_ANTERIORMENTE
MYSQL_DATABASE=edufinance
```

---

## 📦 Passo 5: Compilar e Instalar Dependências

Conectado ao SSH da VPS, vá até a pasta do projeto e execute os seguintes comandos como usuário do CloudPanel (ou use `sudo -u clp-user` se apropriado):

```bash
# Entrar na pasta do projeto
cd /home/cloudpanel/htdocs/financeiro.suaescola.com.br

# Instalar dependências produtivas e de compilação
npm install

# Executar a compilação do projeto (React Frontend e Express Server)
npm run build
```

Isso gerará os seguintes elementos:
- O frontend em React compilado estaticamente em `dist/`
- O backend Express empacotado e compilado em `dist/server.cjs`

---

## 🔄 Passo 6: Executar a Aplicação em Segundo Plano com o PM2

Para garantir que a aplicação rode sem parar e reinicie automaticamente se o servidor for desligado, usamos o gerenciador de processos **PM2**.

Se o PM2 ainda não estiver instalado globalmente na VPS, instale-o com:
```bash
sudo npm install -g pm2
```

Agora, inicie a aplicação a partir do arquivo compilado `dist/server.cjs`:

```bash
# Iniciar o servidor Express em produção
pm2 start dist/server.cjs --name "edufinance-app"

# Salvar a lista para restaurar em caso de reboot
pm2 save

# Configurar reinicialização automática do PM2 com o boot da VPS
pm2 startup
```

Pronto! Sua aplicação Express rodará em segundo plano respondendo internamente na porta `3000`. O Nginx do CloudPanel fará o proxy reverso automático de `https://financeiro.suaescola.com.br` para a porta `3000`.

---

## 🔒 Passo 7: Ativar o Certificado SSL Grátis (Let's Encrypt)

1. No **CloudPanel**, acesse a aba do seu site (`financeiro.suaescola.com.br`).
2. Clique no menu **SSL/TLS**.
3. Selecione **New Let's Encrypt Certificate** e clique em **Create and Install**.
4. Em instantes, o cadeado verde de segurança HTTPS estará ativo.

---

## 💡 Dica Extra: Atualizando o Aplicativo no Futuro

Quando você fizer alguma modificação no código e precisar atualizar sua VPS Hostinger:

```bash
# No diretório do projeto:
git pull (ou envie os arquivos atualizados via File Manager)
npm install
npm run build
pm2 restart edufinance-app
```
