#FROM  vcatechnology/linux-mint
FROM --platform=linux ubuntu
#--platform=linux/arm64 node:18

#RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app
COPY package*.json ./

USER root

RUN apt update

RUN apt install python3 -y

RUN rm -rf node_modules/

RUN apt install curl build-essential  -y

#RUN apt install libc6-dev -y

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -

RUN apt install nodejs -y

#RUN npm update

RUN npm install

ARG LD_DEBUG=libs
#ARG LD_LIBRARY_PATH=/home/node/app/

#RUN npm install node-rdkafka --no-package-lock

COPY app.js .
COPY handler.js .
COPY index.js .
COPY libvosk.so .
COPY build ./build
COPY prebuilds ./prebuilds
#COPY vosk-model-small-uk-v3-small .
RUN chmod +x ./libvosk.so
EXPOSE 8080

#RUN ldd ./libvosk.so

RUN echo LD_LIBRARY_PATH

CMD [ "node", "index.js" ]

#ENTRYPOINT ["tail", "-f", "/dev/null"]