# BACKEND-SETUP.md — SIGD Spring Boot Backend

**Status:** Pronto para implementação  
**Última atualização:** 24 de Maio de 2026  
**Audiência:** Equipa OmniSystema (Dev A — Backend)

---

## 1. Pré-requisitos

### Instalado localmente
- **Java 21** (JDK, não JRE) — Download: https://www.oracle.com/java/technologies/downloads/#java21
  - Verificar: `java -version` → deve mostrar `21.x.x`
- **Maven 3.9+** — Download: https://maven.apache.org/download.cgi
  - Verificar: `mvn -version` → deve mostrar `Maven 3.9.x` e Java 21
- **Docker Desktop** (já têm instalado)
  - Verificar: `docker -v` e `docker-compose -v`
- **Git** (para clonar o repo e commitar)
- **Intellij IDEA Community** OU **VS Code + Extension Spring Boot Extension Pack**

### Ficheiros que vão receber
Este setup gera:
```
sigd-backend/
├── pom.xml                      # Dependências Maven
├── docker-compose.yml           # MySQL 8 + PHPMyAdmin locais
├── .gitignore                   # Ignora .env, target/, etc.
├── .env.example                 # Template de variáveis
├── .env                         # Local (NUNCA fazer commit)
├── src/main/
│   ├── java/com/sigd/
│   │   ├── SigdApplication.java # Main class
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   ├── JwtConfig.java
│   │   │   └── CorsConfig.java
│   │   ├── core/
│   │   │   ├── model/           # Entidades JPA
│   │   │   ├── repository/      # JpaRepository
│   │   │   ├── dto/             # DTOs (records)
│   │   │   └── exception/       # Custom exceptions
│   │   ├── auth/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── dto/
│   │   │   ├── model/
│   │   │   └── repository/
│   │   ├── [clinica|relvado|desporto|tesouraria|portal]/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── dto/
│   │   │   ├── model/
│   │   │   └── repository/
│   │   ├── audit/
│   │   ├── notification/
│   │   └── exception/
│   └── resources/
│       ├── application.yml
│       ├── application-dev.yml
│       ├── application-test.yml
│       ├── application-prod.yml
│       └── db/migration/
│           └── V1__initial_schema.sql
└── src/test/
    └── java/com/sigd/
        └── [testes JUnit 5 + Mockito + TestContainers]
```

---

## 2. Versões Exatas

| Componente | Versão | Notas |
|-----------|--------|-------|
| Java | 21.0.x LTS | Suporte até 2031 |
| Spring Boot | 3.4.x | Latest stable, 3.4.0+ |
| Spring Security | 6.3.x | Incluída no Spring Boot 3.4.x |
| Spring Data JPA | 3.4.x | Incluída no Spring Boot 3.4.x |
| Hibernate | 6.5.x | ORM padrão, incluído no Spring Boot |
| MySQL JDBC Driver | 8.0.33+ | Compatível com MySQL 8.x |
| MySQL Server | 8.0.36+ | No Docker (docker-compose) |
| Maven | 3.9.x | Build tool |
| Lombok | 1.18.30 | Reduz boilerplate (opcional mas recomendado) |
| JUnit 5 | 5.9.x | Test framework, incluído no Spring Boot |
| Mockito | 5.2.x | Mock objects, incluído no Spring Boot test starter |
| TestContainers | 1.19.x | MySQL em Docker para testes |
| Jakarta Validation | 3.0.x | Bean Validation (incluído) |
| jjwt | 0.12.x | JWT library |
| Flyway | — | **NÃO usar** — migrations manuais em `db/migration/` |

---

## 3. Docker Compose — MySQL 8 Local

**Ficheiro:** `docker-compose.yml`

```yaml
version: '3.9'

services:
  mysql:
    image: mysql:8.0.36-debian
    container_name: sigd-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root_password_dev  # Apenas dev — mudar em prod!
      MYSQL_DATABASE: sigd_dev
      MYSQL_USER: sigd_user
      MYSQL_PASSWORD: sigd_password_dev       # Mudar em prod!
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./src/main/resources/db/migration/V1__initial_schema.sql:/docker-entrypoint-initdb.d/01-init.sql
    networks:
      - sigd-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-proot_password_dev"]
      timeout: 5s
      retries: 5
      start_period: 10s

  phpmyadmin:
    image: phpmyadmin:latest
    container_name: sigd-phpmyadmin
    environment:
      PMA_HOST: mysql
      PMA_USER: root
      PMA_PASSWORD: root_password_dev
    ports:
      - "8080:80"
    networks:
      - sigd-network
    depends_on:
      - mysql

volumes:
  mysql_data:

networks:
  sigd-network:
    driver: bridge
```

**Como usar:**
```bash
# Levantar MySQL + PHPMyAdmin
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f mysql

# Verificar saúde
docker-compose ps
```

---

## 4. Ficheiros de Configuração

### 4.1 `application.yml` (Desenvolvimento)

```yaml
spring:
  application:
    name: sigd
  
  jpa:
    hibernate:
      ddl-auto: validate  # Nunca usar 'create-drop' em prod!
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQL8Dialect
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true

  datasource:
    url: jdbc:mysql://localhost:3306/sigd_dev
    username: sigd_user
    password: sigd_password_dev
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 2
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000

  jackson:
    serialization:
      write-dates-as-timestamps: false
      indent-output: true
    default-property-inclusion: non_null

  mvc:
    throw-exception-if-no-handler-found: true
  web:
    resources:
      add-mappings: false

server:
  port: 8080
  servlet:
    context-path: /

logging:
  level:
    root: INFO
    com.sigd: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/sigd.log

# SIGD Custom Config
sigd:
  jwt:
    secret: ${JWT_SECRET:dev-secret-key-change-in-prod-minimum-32-chars}
    expiration: 3600000  # 1 hora em ms
    refresh-expiration: 604800000  # 7 dias em ms
  cors:
    allowed-origins: http://localhost:3000, http://localhost:5173, http://localhost:8081
    allowed-methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
    allowed-headers: '*'
    allow-credentials: true
    max-age: 3600
```

### 4.2 `application-dev.yml`

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  datasource:
    url: jdbc:mysql://localhost:3306/sigd_dev
    username: sigd_user
    password: sigd_password_dev

logging:
  level:
    com.sigd: DEBUG
    org.springframework.security: DEBUG

sigd:
  jwt:
    secret: dev-secret-key-minimum-32-chars-dev-only
```

### 4.3 `application-test.yml`

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: create-drop  # TestContainers cria DB nova por cada teste
    show-sql: false
  datasource:
    url: jdbc:mysql://localhost:3307/test_sigd  # Porta diferente de dev
    driver-class-name: com.mysql.cj.jdbc.Driver

logging:
  level:
    root: WARN
    com.sigd: INFO

sigd:
  jwt:
    secret: test-secret-minimum-32-chars-test
```

### 4.4 `application-prod.yml`

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # OBRIGATÓRIO em produção — nunca criar/drop
    show-sql: false
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5

logging:
  level:
    root: INFO
    com.sigd: INFO
  file:
    name: /var/log/sigd/app.log
    max-size: 10MB
    max-history: 30

server:
  port: 8080
  compression:
    enabled: true
    min-response-size: 1024

sigd:
  jwt:
    secret: ${JWT_SECRET}  # DEVE vir de variável de ambiente
    expiration: 3600000
    refresh-expiration: 604800000
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS:https://sigd.boavista.pt}
```

### 4.5 `.env.example` (versão pública)

```bash
# === DATABASE ===
DB_URL=jdbc:mysql://localhost:3306/sigd_dev
DB_USERNAME=sigd_user
DB_PASSWORD=sigd_password_dev

# === JWT ===
JWT_SECRET=seu-secret-minimo-32-caracteres-muito-seguro

# === CORS ===
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8081

# === SERVER ===
SERVER_PORT=8080

# === LOGGING ===
LOG_LEVEL_ROOT=INFO
LOG_LEVEL_SIGD=DEBUG
```

### 4.6 `.env` (local — NUNCA fazer commit)

Copiar `.env.example` para `.env` e preencher com valores locais.

```bash
# Exemplo:
DB_URL=jdbc:mysql://localhost:3306/sigd_dev
DB_USERNAME=sigd_user
DB_PASSWORD=sigd_password_dev
JWT_SECRET=dev-secret-minimum-32-characters-dev-only
```

---

## 5. Maven POM.xml

**Ficheiro:** `pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.sigd</groupId>
    <artifactId>sigd-backend</artifactId>
    <version>0.1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>SIGD Backend</name>
    <description>Sistema Integrado de Gestão Desportiva — Spring Boot Backend</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.0</version>
        <relativePath/>
    </parent>

    <properties>
        <java.version>21</java.version>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <jjwt.version>0.12.3</jjwt.version>
        <testcontainers.version>1.19.7</testcontainers.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Database -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok (opcional mas recomendado) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Development Tools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- TestContainers -->
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>testcontainers</artifactId>
            <version>${testcontainers.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>mysql</artifactId>
            <version>${testcontainers.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>${testcontainers.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>

            <!-- Compiler Plugin -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>21</source>
                    <target>21</target>
                </configuration>
            </plugin>

            <!-- Surefire (Test Runner) -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.1.2</version>
                <configuration>
                    <includes>
                        <include>**/*Test.java</include>
                        <include>**/*Tests.java</include>
                    </includes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## 6. SQL Inicial — Schema

**Ficheiro:** `src/main/resources/db/migration/V1__initial_schema.sql`

```sql
-- =====================================================================
-- SIGD — Schema Inicial
-- =====================================================================

-- === CORE TABLES ===

CREATE TABLE IF NOT EXISTS `utilizador` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `ativo` BOOLEAN NOT NULL DEFAULT TRUE,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_role` (`role`),
  INDEX `idx_ativo` (`ativo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `atleta` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome_completo` VARCHAR(255) NOT NULL,
  `data_nascimento` DATE NOT NULL,
  `nif` VARCHAR(20) UNIQUE,
  `numero_socio` VARCHAR(50),
  `posicao` VARCHAR(100),
  `estado_elegibilidade` VARCHAR(50) NOT NULL DEFAULT 'APTO',
  `equipa_id` BIGINT,
  `encarregado_id` BIGINT,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_estado` (`estado_elegibilidade`),
  INDEX `idx_nif` (`nif`),
  CONSTRAINT `fk_atleta_encarregado` FOREIGN KEY (`encarregado_id`) REFERENCES `encarregado_educacao` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `encarregado_educacao` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL,
  `nif` VARCHAR(20) UNIQUE,
  `email` VARCHAR(255),
  `telemovel` VARCHAR(20),
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_nif` (`nif`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `equipa` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL,
  `escalao_id` BIGINT NOT NULL,
  `modalidade_id` BIGINT NOT NULL,
  `ativa` BOOLEAN NOT NULL DEFAULT TRUE,
  `criada_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_escalao` (`escalao_id`),
  INDEX `idx_modalidade` (`modalidade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `escalao` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `designacao` VARCHAR(255) NOT NULL,
  `limite_idade_min` INT,
  `limite_idade_max` INT,
  `quota_anual` DECIMAL(10, 2),
  `mensalidade_base` DECIMAL(10, 2),
  `mensalidade_socio` DECIMAL(10, 2),
  `teto_convocatoria` INT,
  UNIQUE KEY `uk_escalao_designacao` (`designacao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `modalidade` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_log` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `usuario_id` BIGINT,
  `usuario_role` VARCHAR(50),
  `acao` VARCHAR(255) NOT NULL,
  `entidade` VARCHAR(255) NOT NULL,
  `entidade_id` BIGINT,
  `payload_antes` LONGTEXT,
  `payload_depois` LONGTEXT,
  INDEX `idx_timestamp` (`timestamp`),
  INDEX `idx_entidade` (`entidade`),
  INDEX `idx_usuario` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- === INSERTS INICIAIS ===

INSERT INTO `utilizador` (`username`, `email`, `password_hash`, `role`, `ativo`) VALUES
('admin', 'admin@sigd.local', '$2a$10$...<hash bcrypt>', 'ROLE_ADMIN', TRUE),
('ceo', 'ceo@boavista.pt', '$2a$10$...<hash bcrypt>', 'ROLE_CEO', TRUE),
('secretaria', 'secretaria@boavista.pt', '$2a$10$...<hash bcrypt>', 'ROLE_SECRETARIA', TRUE),
('medico', 'medico@boavista.pt', '$2a$10$...<hash bcrypt>', 'ROLE_MEDICO', TRUE),
('treinador', 'treinador@boavista.pt', '$2a$10$...<hash bcrypt>', 'ROLE_TREINADOR', TRUE);

INSERT INTO `modalidade` (`nome`) VALUES ('Futebol'), ('Futsal');

INSERT INTO `escalao` (`designacao`, `limite_idade_min`, `limite_idade_max`, `quota_anual`, `mensalidade_base`, `mensalidade_socio`, `teto_convocatoria`) VALUES
('Seniores', 18, NULL, 500.00, 100.00, 80.00, 25),
('Sub-19', 17, 19, 300.00, 80.00, 60.00, 22),
('Sub-17', 15, 17, 250.00, 70.00, 50.00, 20),
('Sub-15', 13, 15, 200.00, 60.00, 40.00, 18);
```

---

## 7. GitIgnore

**Ficheiro:** `.gitignore`

```
# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.iml
*.code-workspace

# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
.m2/

# Gradle
build/
.gradle/

# Spring Boot
logs/
*.log
spring-boot-devtools.properties

# OS
.DS_Store
Thumbs.db

# Docker
.dockerignore
```

---

## 8. Estrutura de Pastas (Maven Standard)

```
sigd-backend/
├── pom.xml
├── docker-compose.yml
├── .env.example
├── .env                      (ignorado no git)
├── .gitignore
├── README.md
│
├── src/main/java/com/sigd/
│   ├── SigdApplication.java         # @SpringBootApplication
│   │
│   ├── config/
│   │   ├── SecurityConfig.java      # @Configuration, @EnableWebSecurity
│   │   ├── JwtConfig.java           # JWT beans
│   │   ├── CorsConfig.java          # @Configuration para CORS
│   │   └── JpaConfig.java           # Hibernate/JPA beans
│   │
│   ├── core/
│   │   ├── model/
│   │   │   ├── Utilizador.java      # @Entity
│   │   │   ├── Atleta.java
│   │   │   ├── Equipa.java
│   │   │   ├── Escalao.java
│   │   │   ├── Modalidade.java
│   │   │   └── ... (outras entidades base)
│   │   ├── repository/
│   │   │   ├── UtilizadorRepository.java
│   │   │   ├── AtletaRepository.java
│   │   │   └── ...
│   │   ├── dto/
│   │   │   ├── UtilizadorDTO.java   # record
│   │   │   ├── AtletaDTO.java
│   │   │   └── ...
│   │   └── exception/
│   │       ├── SigdException.java    # Base exception
│   │       ├── UtilizadorNotFoundException.java
│   │       └── ...
│   │
│   ├── auth/
│   │   ├── controller/
│   │   │   └── AuthController.java   # POST /api/v1/auth/login, /refresh, /logout
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   ├── JwtService.java       # Gerar/validar JWT
│   │   │   └── RoleService.java      # RBAC
│   │   ├── dto/
│   │   │   ├── LoginRequest.java
│   │   │   ├── LoginResponse.java
│   │   │   ├── RefreshTokenRequest.java
│   │   │   └── TokenResponse.java
│   │   ├── model/
│   │   │   └── JwtToken.java         # Record com claims
│   │   ├── filter/
│   │   │   └── JwtAuthenticationFilter.java # @Component
│   │   └── repository/
│   │       └── TokenBlacklistRepository.java (se precisarem de logout)
│   │
│   ├── [clinica|relvado|desporto|tesouraria|portal]/
│   │   ├── controller/
│   │   │   ├── ClinicaController.java
│   │   │   └── ...
│   │   ├── service/
│   │   │   ├── ExameService.java
│   │   │   └── ...
│   │   ├── dto/
│   │   ├── model/
│   │   └── repository/
│   │
│   ├── audit/
│   │   ├── model/
│   │   │   └── AuditLog.java         # @Entity append-only
│   │   ├── repository/
│   │   │   └── AuditLogRepository.java
│   │   ├── listener/
│   │   │   └── AuditEntityListener.java # @EntityListeners
│   │   └── service/
│   │       └── AuditService.java
│   │
│   ├── notification/
│   │   └── service/
│   │       ├── EmailService.java     # Send notifications
│   │       └── NotificationService.java
│   │
│   └── exception/
│       └── GlobalExceptionHandler.java # @ControllerAdvice
│
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-test.yml
│   ├── application-prod.yml
│   ├── db/
│   │   └── migration/
│   │       └── V1__initial_schema.sql
│   └── logback.xml (se customizarem logging)
│
└── src/test/java/com/sigd/
    ├── auth/
    │   └── service/
    │       └── JwtServiceTest.java  # @SpringBootTest + @DataJpaTest
    ├── core/
    │   └── repository/
    │       └── AtletaRepositoryTest.java  # TestContainers
    └── ... (outros testes)
```

---

## 9. Instruções de Setup para o Team

### 9.1 Primeiro Setup (todos fazem uma vez)

```bash
# 1. Clone o repo
git clone <repo-url>
cd sigd-backend

# 2. Copiar .env.example para .env
cp .env.example .env

# 3. Editar .env com credenciais locais
nano .env  # ou usar o editor que quiserem

# 4. Levantar MySQL + PHPMyAdmin
docker-compose up -d

# 5. Verificar saúde (esperar ~10s)
docker-compose ps
docker-compose logs mysql

# 6. Build Maven
mvn clean install

# 7. Rodar a app
mvn spring-boot:run
# OU no IDE: Debug SigdApplication.java

# 8. Verificar que está de pé
curl -X GET http://localhost:8080/api/v1/health
# Esperado: 200 OK ou {"status":"UP"}
```

### 9.2 Dia a dia

```bash
# Levantar DB (se desligou)
docker-compose up -d

# Build + testes
mvn clean install

# Rodar app
mvn spring-boot:run

# Rodar só testes (com TestContainers)
mvn test

# Parar tudo
docker-compose down
```

### 9.3 Aceder à base de dados

**Via PHPMyAdmin:**
- URL: http://localhost:8080 (wait, that's the app)
- URL: http://localhost:8081 para PHPMyAdmin
- Username: `root`
- Password: `root_password_dev`

**Via MySQL CLI:**
```bash
docker exec -it sigd-mysql mysql -u sigd_user -psigd_password_dev -D sigd_dev
```

---

## 10. Exemplos de Código — Estrutura Base

### 10.1 SigdApplication.java

```java
package com.sigd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // Para cron jobs (alertas EMD, fecho fichas)
public class SigdApplication {

    public static void main(String[] args) {
        SpringApplication.run(SigdApplication.class, args);
    }

}
```

### 10.2 SecurityConfig.java (estrutura)

```java
package com.sigd.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.sigd.auth.filter.JwtAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/v1/auth/login", "/api/v1/auth/refresh").permitAll()
                .requestMatchers("/api/v1/**").authenticated()
                .anyRequest().denyAll()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8081"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 10.3 Exemplo de Entidade JPA (Atleta.java)

```java
package com.sigd.core.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "atleta", indexes = {
    @Index(name = "idx_estado", columnList = "estado_elegibilidade"),
    @Index(name = "idx_nif", columnList = "nif")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Atleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nomeCompleto;

    @NotNull
    @Column(nullable = false)
    private LocalDate dataNascimento;

    @Column(unique = true)
    private String nif;

    @Column(name = "numero_socio")
    private String numeroSocio;

    @Column(length = 100)
    private String posicao;

    @Column(nullable = false, length = 50)
    private String estadoElegibilidade = "APTO";

    @ManyToOne
    @JoinColumn(name = "equipa_id")
    private Equipa equipa;

    @ManyToOne
    @JoinColumn(name = "encarregado_id", nullable = false)
    private EncarregadoEducacao encarregado;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime atualizadoEm = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }
}
```

### 10.4 Exemplo de Teste (AtletaRepositoryTest.java)

```java
package com.sigd.core.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.sigd.core.model.Atleta;
import com.sigd.core.model.EncarregadoEducacao;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class AtletaRepositoryTest {

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0.36")
        .withDatabaseName("test_sigd")
        .withUsername("test_user")
        .withPassword("test_pass");

    @DynamicPropertySource
    static void registerDatasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
    }

    @Autowired
    private AtletaRepository atletaRepository;

    @Autowired
    private EncarregadoEducacaoRepository eeRepository;

    @Test
    void testSaveAndFindAtleta() {
        // Arrange
        EncarregadoEducacao ee = new EncarregadoEducacao(null, "João Pai", "12345678901", "pai@email.com", "966123456", null);
        eeRepository.save(ee);

        Atleta atleta = new Atleta(null, "João Silva", LocalDate.of(2008, 5, 15), "98765432101", null, "Avançado", "APTO", null, ee, LocalDateTime.now(), LocalDateTime.now());

        // Act
        Atleta saved = atletaRepository.save(atleta);

        // Assert
        assertNotNull(saved.getId());
        assertEquals("João Silva", saved.getNomeCompleto());
    }
}
```

---

## 11. Verificações Pré-Implementação

Antes de o agent começar a implementar, verifiquem:

- [ ] Java 21 instalado: `java -version`
- [ ] Maven 3.9+ instalado: `mvn -version`
- [ ] Docker running: `docker -v` e `docker ps`
- [ ] Repo criado e clonado
- [ ] Ficheiros acima copiados para o repo
- [ ] `.env` preenchido com credenciais
- [ ] `docker-compose up -d` funciona
- [ ] `mvn clean install` sem erros

---

## 12. Próximos Passos

Quando tudo estiver pronto:

1. **Dev A começa Auth Controller + JwtService**
   - `POST /api/v1/auth/login` — retorna JWT
   - `POST /api/v1/auth/refresh` — refresh token
   - Testes com Mockito

2. **Dev C escreve Design System Components** (frontend) em paralelo

3. **Semana 2:** Tesouraria Backend (Atleta, EE, escalões — tabelas base)

4. **Semana 3:** Tesouraria Frontend (screens que consomem API) + Relvado Backend em paralelo

...

---

**Documento pronto para entrega ao agent (Antigravity).**
