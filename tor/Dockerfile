FROM  debian:jessie
ENV DEBIAN_FRONTEND=noninteractive
RUN   apt-get update && apt-get install -y tor 
COPY  ./docker-entrypoint.sh /docker-entrypoint.sh
COPY  ./torrc /etc/tor/torrc
CMD ["/docker-entrypoint.sh","tor"]
