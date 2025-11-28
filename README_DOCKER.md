# SWAPI React — Ambiente Docker Completo

Este guia documenta de forma oficial como rodar o projeto **SWAPI React** usando Docker tanto em ambiente de desenvolvimento quanto em produção.

O objetivo é:

- Isolar o ambiente da aplicação
- Facilitar setup e testes
- Reproduzir cenários profissionais
- Permitir build final com NGINX
- Suportar testes com Jest dentro do container

---

## 1. Estrutura de Arquivos Docker no Projeto

Você deve possuir exatamente estes arquivos na raiz:

```bash
/
├── Dockerfile               # Build final (produção + Nginx)
├── dockerfile.dev           # Ambiente de desenvolvimento (Node)
├── docker-compose.yml       # Orquestração do ambiente dev
├── package.json
├── README_DOCKER.md         # este arquivo
└── src/ ...
```

---

## 2. Dockerfile (Produção)

O Dockerfile real do seu projeto cria uma imagem em duas etapas:

1. Build React (Node 18)
2. Servir estáticos com Nginx

Executando:

```bash
docker build -t swapi-react .
```

Depois, rodando:

```bash
docker run -p 3000:80 swapi-react
```

A aplicação ficará disponível em:

```bash
http://localhost:3000
```

---

## 3. Dockerfile.dev (Ambiente de Desenvolvimento)

Esse arquivo é usado exclusivamente pelo Docker Compose e permite:

- Hot reload
- Bind mounts
- Execução do CRA no modo dev

Rodando com:

```bash
docker-compose up --build
```

Disponível em:

```bash
http://localhost:3000
```

---

## 4. docker-compose.yml

O compose utiliza:

- Node (via Dockerfile.dev)
- Volume para sincronizar o código
- Volume separado para node_modules
- Suporte a terminal interativo (stdin_open + tty)

Inicialização:

```bash
docker-compose up --build
```

Parar ambiente:

```bash
docker-compose down
```

---

## 5. Rodando a Aplicação

Ambiente de desenvolvimento (recomendado)

```bash
docker-compose up --build
```

Ambiente de produção

```bash
docker build -t swapi-react .
docker run -p 3000:80 swapi-react
```

---

## 6. Rodando Testes Dentro do Docker

Rodar testes Jest:

```bash
docker-compose exec web npm test
```

Modo watch:

```bash
docker-compose exec web npm test -- --watch
```

---

## 7. Limpar Containers, Volumes e Imagens

```bash
docker system prune -af
```

---

## 8. Estrutura esperada do projeto

```bash
/swapi-react
 ├── Dockerfile
 ├── dockerfile.dev
 ├── docker-compose.yml
 ├── README_DOCKER.md
 ├── package.json
 ├── tsconfig.json
 ├── public/
 └── src/
      ├── api/
      ├── components/
      ├── hooks/
      ├── types/
      ├── utils/
      ├── __tests__/
      ├── App.tsx
      ├── index.tsx
      ├── theme.css
```

---

## 9. Fluxo Completo (Resumo Final)

DEV

```bash
docker-compose up --build
```

PROD

```bash
docker build -t swapi-react .
docker run -p 3000:80 swapi-react
```

TESTES

```bash
docker-compose exec web npm test
```

---
