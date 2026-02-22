# MeuFlix

Frontend React para a plataforma de streaming de vídeo self-hosted MeuFlix.

## Funcionalidades

- 🔐 **Autenticação** – Login e cadastro com JWT
- 🎬 **Listagem de vídeos** – Grid responsivo com thumbnails, título, descrição, duração e status
- 📺 **Player HLS adaptativo** – Reprodução via hls.js com seleção de qualidade
- ⬆️ **Upload de vídeos** – Formulário com barra de progresso em tempo real
- 📊 **Status de processamento** – Polling automático (ready / processing / error)
- 👤 **Admin** – Gerenciamento de roles de usuários

## Tecnologias

- [React](https://reactjs.org/) + TypeScript
- [styled-components](https://styled-components.com/) (CSS-in-JS)
- [React Router v7](https://reactrouter.com/)
- [axios](https://axios-http.com/) (requisições HTTP com Bearer token)
- [hls.js](https://github.com/video-dev/hls.js/) (player HLS)

## Configuração

1. Instale as dependências:
   ```bash
   cd frontend
   npm install
   ```

2. Configure a URL da API (opcional — padrão: `http://localhost:8080`):
   ```bash
   cp .env.example .env.local
   # edite REACT_APP_API_URL conforme seu backend
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

4. Acesse em: http://localhost:3000

## Build de produção

```bash
cd frontend
npm run build
```

## Estrutura do projeto

```
frontend/src/
  api/            # Camada de serviços (axios)
  context/        # AuthContext (JWT)
  components/     # Componentes reutilizáveis
    Layout/       # Navbar + Layout
    VideoCard/    # Card de vídeo
    VideoPlayer/  # Player HLS com seleção de qualidade
    UploadProgress/ # Barra de progresso
  pages/          # Páginas da aplicação
    LoginPage
    RegisterPage
    HomePage      # Listagem de vídeos
    VideoDetailPage # Detalhes + player
    UploadPage    # Upload com progresso
    AdminPage     # Gerenciamento de usuários
  styles/         # GlobalStyle
  types/          # Tipos TypeScript
```

## Backend

Este frontend consome a API do [video-plataform](https://github.com/diegoluanfs/video-plataform).
Documentação Swagger disponível em `/swagger/index.html`.
