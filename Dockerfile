# Use a imagem base do Nginx
FROM nginx:latest

# Remova o arquivo de configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copie o arquivo de configuração personalizado do Nginx
COPY nginx.conf /etc/nginx/conf.d

# Copie todos os arquivos do seu projeto para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# Exponha a porta 80 para acesso externo
EXPOSE 80
