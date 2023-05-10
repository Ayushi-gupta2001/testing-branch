FROM ubuntu:20.04 
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
     apt-get install -y tzdata && \
     ln -fs /usr/share/zoneinfo/Europe/London> /etc/localtime && \
     dpkg-reconfigure --frontend noninteractive tzdata && \ 
    apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release -y && \
    mkdir -m 0755 -p /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin -y && \
    apt-get install make -y && \
    apt update && apt upgrade -y && \
   apt-get install dnsutils -y 
  
RUN apt-get update -y 
RUN apt-get install curl unzip awscli -y 

WORKDIR /app

VOLUME ["/app/shared"]
RUN curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"

RUN unzip awscli-bundle.zip && \
    rm -rf awscli-bundle.zip 
ARG aws_access_key_id
ARG aws_secret_access_key 
ENV aws_access_key_id=$aws_access_key_id 
ENV aws_secret_access_key=$aws_secret_access_key

#COPY ./.aws /root/.aws
COPY . /app
RUN aws configure list 

#COPY build_report.sh /usr/bin

#RUN chmod +x /usr/bin/build_report.sh

#CMD ["/bin/bash", "-c", "service docker start && /usr/bin/build_report.sh "]












