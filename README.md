# Vidify

O Vidify é um gerador de vídeos que utiliza inteligência artificial para automatizar a criação de vídeos explicativos. Ele pesquisa o termo que você deseja, cria a narração em áudio, adiciona legendas e uma capa para o vídeo. No documento, você encontrará instruções detalhadas sobre como configurar e usar o Vidify.

**Utilizando o app**

https://github.com/limazia/Vidify/assets/32038004/d7a5c40e-8741-43f2-af72-505edf9a4b68

**Resultado**

https://github.com/limazia/Vidify/assets/32038004/b223299e-7bb7-4408-a58c-58d3d8b3cdad


## Tecnologias Utilizadas

- [Puppeteer](https://pptr.dev/): Para gerar a capa do vídeo e o código do exemplo de uso da feature.
- [AWS Polly](https://aws.amazon.com/polly/): Para gerar a narração do vídeo.
- [OpenAI API](https://beta.openai.com/): Para gerar o código, a narração e detalhes da capa do vídeo.
- [FFmpeg](https://www.ffmpeg.org/): Para juntar todas as partes do vídeo.
- [Express.js](https://expressjs.com/): Para criar as rotas da API.
- [Vite](https://vitejs.dev/), [shadcn/ui](https://shadcn.github.io/), [Tailwind CSS](https://tailwindcss.com/), e [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API): Para desenvolver o frontend.
- [Socket.io](https://socket.io/): Para comunicar entre o frontend e o backend durante as etapas de geração do vídeo.
- [Docker](https://www.docker.com/): Para containerizar a aplicação.

## Configuração

### Variáveis de Ambiente

Crie um arquivo chamado `.env` na pasta `server/` do seu projeto, seguindo o formato fornecido no arquivo `.env.example`.

```env
# OpenAi
OPENAI_API_KEY=your_openai_api_key

# AWS
AWS_REGION="us-east-1" 
AWS_ACCESS_KEY_ID=your_aws_access_key_id 
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
```

### Dockerfile

O `Dockerfile` incluído no projeto define o ambiente necessário para executar o Vidify. Ele começa com uma imagem base do Node.js, instala o FFmpeg, copia o código fonte do projeto para a imagem e constrói o frontend e a API antes de expor a porta 10000 para comunicação.

### Docker Compose

O `docker-compose.yml` define como os serviços do Vidify são orquestrados. Inclui três serviços: `api`, `image-generator`, e `carbonara`. O serviço `api` constrói o contexto atual, expõe as portas necessárias, e define as dependências necessárias. Os serviços `image-generator` e `carbonara` são configurados de maneira semelhante, com o `image-generator` construindo a partir de um subdiretório do projeto.

## Executando o Vidify

1. Certifique-se de que o Docker e o Docker Compose estão instalados em sua máquina.
2. Navegue até o diretório raiz do projeto no terminal.
3. Execute o comando `docker-compose up --build -d` para construir e iniciar todos os serviços definidos no `docker-compose.yml`.
4. Uma vez que todos os serviços estejam em execução, acesse `http://localhost:10000` em seu navegador para acessar a interface do usuário do Vidify.
5. Use a interface do usuário para gerar vídeos, especificando o termo desejado.

## Rotas da API

- **POST** `/api/generate`: Gera um vídeo com base nos parâmetros fornecidos no corpo da requisição.
  - Corpo da requisição: `{ "term": "termo_desejado" }`
- **GET** `/api/download/:id`: Baixa o vídeo gerado, onde `:id` é o UUID do vídeo gerado.
- **GET** `/`: Serve o cliente frontend.

## Desenvolvimento Frontend

O frontend do Vidify foi desenvolvido usando Vite, shadcn/ui, Tailwind CSS, e IndexedDB. Você pode encontrar os arquivos de origem no diretório `client/`. Para desenvolver localmente, navegue até este diretório e execute `npm i` para instalar as dependências e `npm run dev` para iniciar o servidor de desenvolvimento.

## Autores

O Vidify é uma evolução do projeto original, [Tik-Tech by @ViniciusSantos45](https://github.com/viniciussantos45/tik-tech), que incorpora melhorias significativas para aumentar sua eficácia e funcionalidade.
 
<table>
  <tr>
    <td align="center"><a href="https://www.limazia.dev/"><img src="https://avatars.githubusercontent.com/u/32038004?v=4" width="100px;" alt=""/><br /><sub><b>Acacio de Lima</b></sub></a></td>
    <td align="center"><a href="https://github.com/viniciussantos45"><img src="https://avatars.githubusercontent.com/u/47752947?v=4" width="100px;" alt=""/><br /><sub><b>Vinicius Gomes</b></sub></a></td>
  </tr>
</table>
