FROM ubuntu:23.04 

RUN apt update && apt -y dist-upgrade && apt -y install curl gnupg2 ca-certificates lsb-release ubuntu-keyring 
RUN curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    |  tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null

RUN echo 'Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n' \
    |  tee /etc/apt/preferences.d/99nginx

RUN echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
    http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    |  tee /etc/apt/sources.list.d/nginx.list 

RUN apt update && apt -y install nginx nginx-module-njs

CMD nginx
