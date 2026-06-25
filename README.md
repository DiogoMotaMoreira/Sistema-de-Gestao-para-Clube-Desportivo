<div align="center">

# ⚽ SIGD: Sistema Integrado de Gestão Desportiva

**Plataforma de gestão desportiva, clínica e financeira desenvolvida para apoiar a reestruturação do Boavista Futebol Clube.**

[![Java 21](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)]()
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?style=for-the-badge&logo=spring&logoColor=white)]()
[![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?style=for-the-badge&logo=react&logoColor=black)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)]()
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)]()
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)]()

</div>

<br>

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Arquitetura e Stack Tecnológica](#arquitetura-e-stack-tecnológica)
- [Instalação e Setup](#instalação-e-setup)
- [Como Utilizar](#como-utilizar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Autores](#autores)
- [Licença](#licença)

---

## 🎯 Sobre o Projeto

O **SIGD** nasce no contexto da unidade curricular de **Laboratórios de Informática IV** da Universidade do Minho. Desenvolvido em resposta aos desafios administrativos enfrentados pelo Boavista Futebol Clube, este projeto visa **modernizar e unificar o ecossistema tecnológico** da instituição.

### Objetivo Principal

Desmaterializar e centralizar todos os processos do clube, substituindo sistemas analógicos e dispersos por uma plataforma integrada que garante:
- ✅ **Rigor financeiro** com segregação de receitas (Clube vs SAD)
- ✅ **Eficiência administrativa** e gestão documental
- ✅ **Decisões baseadas em dados** através de KPIs em tempo real
- ✅ **Elegibilidade automática** de atletas (cruzamento de dados clínicos e financeiros)

### Contexto

A plataforma resolve o **isolamento de dados entre departamentos** através de um **Monólito Modular**, permitindo uma visão 360º de cada associado:
- Situação financeira ↔ Elegibilidade clínica
- Histórico médico ↔ Disponibilidade para competições
- Obrigações do responsável ↔ Desempenho do atleta

---

## ✨ Principais Funcionalidades

O sistema implementa um modelo de **Controlo de Acessos Baseado em Perfis (RBAC)**, garantindo isolamento total de responsabilidades:

### 👨‍💼 Executivo (CEO/CFO)
- Dashboards macroscópicos com KPIs em tempo real
- Segregação lógica e financeira de receitas (Clube | SAD)
- Relatórios analíticos e simulações financeiras
- Auditoria completa de transações

### 🏢 Secretaria
- Motor de pesquisa unificada de associados
- Gestão de inscrições e validação documental
- Máquina de estados para fluxos de aprovação
- Geração automática de certificados

### 🩺 Clínica
- Registo de ocorrências e lesões
- Gestão de Exames Médico-Desportivos (EMD)
- **Semáforo de Elegibilidade** dinâmico (Apto | Amarelo | Inapto)
- Histórico médico completo e alertas automáticos

### 🏟️ Equipa Técnica (App Mobile)
- Interface mobile-first otimizada para relvado
- Registo de assiduidade e rendimento tático
- Convocação de atletas com bloqueio automático de inaptos
- Gestão de formações e substituições

### 📱 Portal do Encarregado de Educação
- Acesso self-service às obrigações financeiras
- Consulta de pagamentos e histórico
- Calendário desportivo e notificações
- Visualização do desempenho do atleta

---

## 🛠️ Arquitetura e Stack Tecnológica

A solução adota uma **Arquitetura em Camadas (Layered Architecture)** orquestrada através de um **Monólito Modular**, separando completamente a API REST do cliente multiplataforma.

### Backend (Server-Side)

| Aspecto | Tecnologia |
|---------|-----------|
| **Linguagem & Framework** | Java 21 LTS + Spring Boot 3.4.x |
| **Segurança** | Spring Security, JWT (Stateless), Anti-Brute Force |
| **ORM & Persistência** | Hibernate, Spring Data JPA |
| **Versionamento de BD** | Flyway com validação DDL-Auto |
| **API** | REST com OpenAPI/Swagger |
| **Logging** | SLF4J + Logback |

### Frontend (Client-Side)

| Aspecto | Tecnologia |
|---------|-----------|
| **Framework** | React Native (Expo SDK 51) |
| **Linguagem** | TypeScript com tipagem estática forte |
| **Paradigma** | Multiplataforma (Desktop-first Backoffice, Mobile-first Treinadores) |
| **State Management** | Redux / Context API |
| **Styling** | React Native Paper / Tailwind |

### Infraestrutura

| Serviço | Especificações |
|--------|--------|
| **Base de Dados** | MySQL 8.0 (Containerizado) |
| **Orquestração** | Docker & Docker Compose |
| **Ambiente de Dev** | Automated Setup via PowerShell |

---

## 🚀 Instalação e Setup

O repositório está otimizado para proporcionar uma **Developer Experience (DX) fluida**, isolando dependências através de Docker.

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose instalados
- [Node.js](https://nodejs.org/) v18+ e npm
- [Java JDK 21](https://jdk.java.net/21/)
- [Git](https://git-scm.com/)
- PowerShell (opcional, para script de automação)

### 🔧 Instalação em 3 Passos

#### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/DiogoMotaMoreira/Sistema-de-Gestao-para-Clube-Desportivo.git
cd Sistema-de-Gestao-para-Clube-Desportivo
```

#### 2️⃣ Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sigd_boavista
DB_USER=root
DB_PASSWORD=your_password

# Backend
JAVA_OPTS=-Xmx512m
JWT_SECRET=your_jwt_secret_key

# Frontend
EXPO_UPDATES_URL=http://localhost:8080
API_BASE_URL=http://localhost:8080/api
```

#### 3️⃣ Executar com Docker Compose

```bash
# Iniciar todos os serviços (MySQL, Backend, Frontend)
docker-compose up -d

# Acompanhar logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### 📱 Alternativa: Setup Manual (Desenvolvimento Local)

```bash
# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend
cd frontend
npm install
npm start
```

---

## 📖 Como Utilizar

### 🔐 Autenticação

1. Aceda à plataforma em `http://localhost:3000`
2. Faça login com as suas credenciais
3. O sistema redirecionará para o dashboard correspondente ao seu perfil

### 📊 Exemplos de Uso

#### Como CEO: Consultar Dashboard Financeiro
1. Aceda à aba **Analytics**
2. Selecione o período desejado
3. Analise KPIs e receitas segmentadas

#### Como Treinador: Convocar Atletas
1. Abra a app mobile
2. Navegue para **Convocações**
3. Selecione atletas (apenas os Aptos surgem como opção)
4. Confirme a convocação

#### Como Encarregado: Consultar Obrigações
1. Aceda ao **Portal do Responsável**
2. Visualize pagamentos pendentes
3. Efetue pagamentos online

---

## 📂 Estrutura do Projeto

```
Sistema-de-Gestao-para-Clube-Desportivo/
│
├── backend/
│   ├── src/
│   │   ├── main/java/com/sigd/
│   │   │   ├── controller/        # Controllers REST
│   │   │   ├── service/           # Lógica de negócio
│   │   │   ├── repository/        # Persistência (JPA)
│   │   │   ├── entity/            # Modelos JPA
│   │   │   ├── security/          # Autenticação & Autorização
│   │   │   └── config/            # Configurações
│   │   └── resources/
│   │       ├── application.yml    # Configuração do app
│   │       └── db/migration/      # Scripts Flyway
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── screens/               # Ecrãs React Native
│   │   ├── components/            # Componentes reutilizáveis
│   │   ├── services/              # Chamadas API
│   │   ├── redux/                 # State Management
│   │   └── navigation/            # Navegação
│   ├── app.json                   # Config Expo
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔒 Segurança

- **Autenticação:** JWT com ciclo de vida configurável
- **Autorização:** RBAC (Role-Based Access Control) granular
- **Proteção:** CORS, CSRF tokens, rate limiting
- **Dados Sensíveis:** Encriptação de passwords com BCrypt
- **Conformidade:** Logs de auditoria para operações críticas

---

## 📈 Roadmap Futuro

- [ ] Integração com sistemas de pagamento (MB Way, Stripe)
- [ ] Notificações em tempo real (WebSockets)
- [ ] Machine Learning para previsão de lesões
- [ ] API pública para integrações externas
- [ ] App web responsiva (Progressive Web App)
- [ ] Suporte multi-idioma (EN, ES, FR)

---

## 🤝 Contribuindo

As contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para a sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit das alterações (`git commit -m 'Add MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📞 Autores

**Projeto desenvolvido por:**
- [Diogo Mota Moreira](https://github.com/DiogoMotaMoreira)

**Contexto:** Laboratórios de Informática IV - Universidade do Minho

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - consulte o arquivo [LICENSE](LICENSE) para detalhes.

---

## 📚 Recursos Adicionais

- [Documentação Spring Boot](https://spring.io/projects/spring-boot)
- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

<div align="center">

**Desenvolvido com ❤️ para o Boavista Futebol Clube**

</div>
