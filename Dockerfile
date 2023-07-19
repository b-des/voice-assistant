#FROM  vcatechnology/linux-mint
FROM node:18
#--platform=linux/arm64 node:18

#RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app
COPY package*.json ./

USER root

RUN apt update

#RUN apt install python3 -y

RUN rm -rf node_modules/

RUN apt install curl alsa-utils unzip  -y

#RUN apt install libc6-dev -y

#RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -

#RUN apt install nodejs -y

#RUN npm update

RUN npm install

RUN curl -sL https://alphacephei.com/vosk/models/vosk-model-small-uk-v3-nano.zip --output vosk-model-small-uk-v3-nano.zip
RUN unzip vosk-model-small-uk-v3-nano.zip

#RUN wget https://alphacephei.com/vosk/models/vosk-model-small-uk-v3-nano.zip | unzip
RUN curl -sL https://github.com/alphacep/vosk-api/releases/download/v0.3.45/vosk-linux-aarch64-0.3.45.zip --output vosk-linux-aarch64-0.3.45.zip

RUN unzip vosk-linux-aarch64-0.3.45.zip
RUN cp vosk-linux-aarch64-0.3.45/libvosk.so node_modules/vosk/lib/linux-x86_64/

ARG LD_DEBUG=libs
#ARG LD_LIBRARY_PATH=/home/node/app/

#RUN npm install node-rdkafka --no-package-lock

COPY *.js .

#COPY vosk-model-small-uk-v3-small .
EXPOSE 8080

#RUN ldd ./libvosk.so

ARG DEVICE_NAME="plughw:1,0"



#CMD [ "node", "app.js" ]

ENTRYPOINT ["tail", "-f", "/dev/null"]