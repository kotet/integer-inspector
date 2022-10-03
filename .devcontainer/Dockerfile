FROM ubuntu:20.04

ENV HOME /root

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        tzdata \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* \
    && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo 'Asia/Tokyo' >/etc/timezone

RUN apt-get update \
    && apt-get install -y \
        make build-essential curl \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install nodejs \
    && npm install -g yarn

RUN groupadd --gid 1000 vscode \
    && useradd --uid 1000 --gid 1000 -m vscode

USER vscode
ENV HOME /home/vscode