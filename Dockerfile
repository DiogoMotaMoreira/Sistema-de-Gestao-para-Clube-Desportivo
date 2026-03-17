# Usar uma versão estável do Node
FROM node:20-bullseye

# Instalar Java 17 e ferramentas essenciais
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    unzip \
    wget \
    git \
    && rm -rf /var/lib/apt/lists/*

# Configurar variáveis de ambiente do Java e Android
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Instalar o Android Command Line Tools
RUN mkdir -p $ANDROID_HOME/cmdline-tools \
    && cd $ANDROID_HOME/cmdline-tools \
    && wget -q https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip -O cmdline-tools.zip \
    && unzip -q cmdline-tools.zip \
    && rm cmdline-tools.zip \
    && mv cmdline-tools latest

# Aceitar as licenças do Android e instalar os pacotes necessários (API 34)
RUN yes | sdkmanager --licenses \
    && sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Definir o diretório de trabalho
WORKDIR /app