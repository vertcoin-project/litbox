FROM alpine
ENTRYPOINT ["/entrypoint.sh"]
EXPOSE 22
COPY entrypoint.sh /entrypoint.sh
RUN apk add --no-cache openssh 
COPY generate_authorized_keys.sh /root
COPY sshd_config /etc/ssh/sshd_config
