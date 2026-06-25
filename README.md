<div align="center">

# ⚽ SIGD: Sistema Integrado de Gestão Desportiva

**Plataforma de gestão desportiva, clínica e financeira desenvolvida para apoiar a reestruturação do Boavista Futebol Clube.**

[![Java 21](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)]()
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?style=for-the-badge&logo=spring&logoColor=white)]()
[![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?style=for-the-badge&logo=react&logoColor=black)]()
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)]()
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)]()

</div>

<br>

> **Missão Omnisystema:** Desmaterializar e unificar o ecossistema tecnológico do Boavista FC, substituindo processos analógicos por uma plataforma centralizada que garante rigor financeiro, prontidão clínica e agilidade no relvado.

## 📖 Sobre o Projeto

O **SIGD** nasce no contexto da unidade curricular de Laboratórios de Informática IV da Universidade do Minho. Face à crise administrativa do Boavista Futebol Clube, o projeto visa modernizar a gestão das suas modalidades amadoras e futebol de formação. 

A plataforma resolve o isolamento de dados entre departamentos através de um Monólito Modular, cruzando a situação financeira de um associado com a sua elegibilidade clínica para competir. O projeto destaca-se pela adoção de uma metodologia inovadora de **Engenharia de Software Assistida por Inteligência Artificial (LLMs)**, aplicada desde a eliciação de requisitos até à geração de código estrutural e documentação técnica.

## ✨ Principais Funcionalidades

O sistema está segmentado num modelo de Controlo de Acessos Baseado em Perfis (RBAC), garantindo um isolamento total de responsabilidades:

* **👨‍💼 Executivo (CEO/CFO):** Dashboards macroscópicos, KPIs em tempo real e segregação lógica e financeira de receitas entre o Clube e a SAD.
* **🏢 Secretaria:** Motor de pesquisa unificada, gestão de inscrições e validação documental com máquina de estados.
* **🩺 Clínica:** Registo de ocorrências, gestão de Exames Médico-Desportivos (EMD) e cálculo dinâmico do **Semáforo de Elegibilidade**.
* **🏟️ Equipa Técnica:** App mobile-first para o relvado. Permite registar assiduidade, classificar o rendimento tático, convocar atletas (com bloqueio automático de atletas inaptos) e preencher fichas de jogo.
* **📱 Portal do Encarregado de Educação:** Acesso self-service a obrigações financeiras, pagamentos, calendário desportivo e histórico do atleta.

## 🛠️ Arquitetura e Stack Tecnológica

A solução adota uma **Layered Architecture** orquestrada através de um monólito modular, separando a API REST do cliente multiplataforma.

### Backend (Server-Side)
* **Linguagem & Framework:** Java 21 LTS + Spring Boot 3.4.x
* **Segurança:** Spring Security com JSON Web Tokens (JWT) Stateless e proteção Anti-Brute Force.
* **Persistência & ORM:** Hibernate/Spring Data JPA.
* **Versionamento de BD:** Flyway (com validação DDL-Auto no arranque).

### Frontend (Client-Side)
* **Framework:** React Native suportado por Expo SDK 51.
* **Linguagem:** TypeScript (tipagem estática forte).
* **Paradigma:** Multiplataforma (Desktop-first para Backoffice, Mobile-first para Treinadores).

### Infraestrutura
* **Base de Dados:** MySQL 8.0 (Containerizado).
* **Orquestração:** Docker & Docker Compose.

## 🚀 Como Executar o Projeto Localmente

O repositório está otimizado para proporcionar uma *Developer Experience* (DX) fluida, isolando dependências através de Docker.

### Pré-requisitos
* [Docker](https://www.docker.com/) e Docker Compose instalados.
* [Node.js](https://nodejs.org/) (v18+) e npm.
* [Java JDK 21](https://jdk.java.net/21/).
* PowerShell (para execução do script de automação).

### Instalação em 3 Passos

**1. Clonar o repositório**
```bash
git clone [https://github.com/teu-user/sigd-boavista.git](https://github.com/teu-user/sigd-boavista.git)
cd sigd-boavista
