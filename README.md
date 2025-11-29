# 🌟 Star Wars Characters Explorer

![Star Wars](https://img.shields.io/badge/Star%20Wars-API-FFE81F?style=for-the-badge&logo=star-wars&logoColor=black)
![React](https://img.shields.io/badge/React-17.0.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant%20Design-4.24.16-0170FE?style=for-the-badge&logo=ant-design&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

Uma aplicação React moderna e responsiva que lista personagens do universo Star Wars, consumindo a API SWAPI (Star Wars API). Desenvolvido com TypeScript, Ant Design e um design system inspirado na galáxia distante.

## ✨ Características

- 🎨 **Design System Completo** - Paleta de cores inspirada em Star Wars com variáveis CSS customizáveis
- 📱 **100% Responsivo** - Funciona perfeitamente em dispositivos mobile, tablet e desktop
- 🔍 **Busca em Tempo Real** - Filtre personagens pelo nome com interface intuitiva
- 📄 **Paginação** - Navegação eficiente entre páginas (10 registros por vez)
- 🎭 **Detalhes Completos** - Drawer lateral com informações detalhadas de cada personagem
- ⚡ **Animações Suaves** - Transições fluidas usando react-spring
- 🧪 **Testes Unitários** - Cobertura de testes com Jest e React Testing Library
- ♿ **Acessibilidade** - Implementado com boas práticas de acessibilidade (ARIA)
- 🎯 **TypeScript** - Tipagem estática para maior segurança e manutenibilidade

## 🚀 Tecnologias

- **React 17.0.2** - Biblioteca JavaScript para interfaces
- **TypeScript 4.9.5** - Superset tipado do JavaScript
- **Ant Design 4.24.16** - Framework de componentes UI
- **Lucide React** - Biblioteca de ícones moderna
- **React Spring** - Animações baseadas em física
- **Jest** - Framework de testes
- **React Testing Library** - Testes focados no usuário
- **SWAPI** - API pública de Star Wars

## 📦 Estrutura do Projeto

\`\`\`
src/
├── api/
│ └── swapi.ts # Cliente da API SWAPI
├── components/
│ └── CharacterList.tsx # Componente principal de listagem
├── hooks/
│ └── useUsMobile.ts # Hook para detecção de mobile
├── types/
│ └── Character.ts # Interfaces TypeScript
├── utils/
│ └── fetchResourceName.ts # Utilitário para resolver URLs
├── **tests**/ # Testes unitários
│ ├── App.test.tsx
│ ├── CharacterList.test.tsx
│ ├── useIsMobile.test.ts
│ └── fetchResourceName.test.ts
├── App.tsx # Componente raiz
├── theme.css # Design System completo
└── index.tsx # Entrada da aplicação
\`\`\`

## 🎨 Design System

O projeto utiliza um design system completo com variáveis CSS organizadas:

### Paleta de Cores

- **Cores Base**: Tons de azul espacial e dourado inspirados em Star Wars
- **Cores de UI**: Branco, cinzas e tons de destaque
- **Cores Temáticas**: Azul Jedi, Vermelho Sith, Dourado Estrela

### Tipografia

- **Display**: Orbitron (títulos e headings)
- **Body**: Rajdhani (texto corrido)

### Espaçamento

Escala baseada em múltiplos de 4px (4, 8, 16, 24, 32, 48, 64)

### Componentes

Todos os componentes do Ant Design foram customizados para seguir o tema Star Wars.

## 🛠️ Instalação

1. Clone o repositório:

\`\`\`bash
git clone <url-do-repositorio>
cd swapi-react
\`\`\`

2. Instale as dependências:

\`\`\`bash
npm install
\`\`\`

3. Inicie o servidor de desenvolvimento:

\`\`\`bash
npm start
\`\`\`

4. Acesse no navegador:

\`\`\`
http://localhost:3000
\`\`\`

## 🧪 Testes

Execute os testes unitários:

\`\`\`bash
npm test
\`\`\`

Execute os testes com cobertura:

\`\`\`bash
npm test -- --coverage
\`\`\`

### Cobertura de Testes

Os testes cobrem:

- ✅ Renderização de componentes
- ✅ Interações do usuário (busca, paginação, abertura de drawer)
- ✅ Chamadas à API
- ✅ Resolução de recursos (planetas, filmes, etc.)
- ✅ Responsividade (hook useIsMobile)
- ✅ Estados de loading e erro
- ✅ Utilitários e funções auxiliares

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints definidos:

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

### Características Responsivas

- Grid adaptativo (1 a 4 colunas)
- Header flexível
- Drawer ajustável (90vw em mobile)
- Tipografia fluida (clamp)
- Botões e ícones otimizados para touch

## 🎯 Funcionalidades

### 1. Listagem de Personagens

- Grid responsivo com cards de personagens
- Skeleton loading durante carregamento
- Animações suaves de entrada

### 2. Busca

- Campo de busca no header
- Busca em tempo real
- Reset automático para página 1

### 3. Paginação

- Navegação entre páginas
- 10 registros por página
- Controles estilizados

### 4. Detalhes do Personagem

Drawer lateral com:

- Características físicas
- Identidade e origem
- Filmes em que aparece
- Veículos e naves
- Espécies
- Timeline de criação/edição

## 🔧 Configuração da API

A aplicação consome a SWAPI (Star Wars API):

\`\`\`typescript
const BASE = "https://swapi.dev/api";
\`\`\`

Não é necessária autenticação ou chave de API.

## 🎨 Customização

### Cores

Edite as variáveis CSS em `src/theme.css`:

\`\`\`css
:root {
--color-jedi-blue: #4a9eff;
--color-star-gold: #ffd700;
/_ ... outras variáveis _/
}
\`\`\`

### Fontes

As fontes são carregadas via Google Fonts:

- Orbitron (display)
- Rajdhani (body)

### Componentes

Todos os componentes do Ant Design podem ser customizados através das classes CSS do tema.

## 📊 Performance

- ⚡ Lazy loading de imagens
- 🎯 Memoização de componentes
- 📦 Code splitting automático (React)
- 🔄 Debounce implícito na busca
- 💾 Requisições otimizadas

## ♿ Acessibilidade

- ✅ Roles ARIA apropriados
- ✅ Alt text em imagens
- ✅ Labels semânticos
- ✅ Navegação por teclado
- ✅ Contraste de cores WCAG AA
- ✅ Screen reader friendly

## 🐛 Troubleshooting

### Erro ao iniciar

\`\`\`bash
rm -rf node_modules
npm install
npm start
\`\`\`

### Testes falhando

\`\`\`bash
npm test -- --clearCache
npm test
\`\`\`

### API não responde

Verifique se a SWAPI está online em: https://swapi.dev/

## 📝 Boas Práticas Implementadas

1. **TypeScript**: Tipagem forte em todo o código
2. **Componentização**: Componentes reutilizáveis e modulares
3. **Hooks Customizados**: Lógica encapsulada e reutilizável
4. **Design System**: Variáveis CSS para consistência
5. **Testes**: Cobertura de testes unitários
6. **Acessibilidade**: WCAG 2.1 Level AA
7. **Performance**: Otimizações e lazy loading
8. **Responsividade**: Mobile-first approach
9. **Clean Code**: Código limpo e documentado
10. **Error Handling**: Tratamento adequado de erros

## 👥 Autora

**Andreza** - Desenvolvedora do projeto

## 📄 Licença

Este projeto é privado e para fins educacionais.

## 🙏 Agradecimentos

- [SWAPI](https://swapi.dev/) - Star Wars API
- [Ant Design](https://ant.design/) - Framework de componentes
- [Lucide](https://lucide.dev/) - Ícones
- [React Spring](https://www.react-spring.dev/) - Animações

---

⭐ **May the Force be with you!** ⭐
