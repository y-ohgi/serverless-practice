FROM amazonlinux:2

RUN curl --silent --location https://rpm.nodesource.com/setup_9.x | bash - && \
    yum install -y nodejs awscli jq && \
    npm install -g yarn && \
    npm install -g serverless 

WORKDIR /opt
