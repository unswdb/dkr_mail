FROM python:3.6.13-buster

RUN apt-get update && \
    apt-get install -y apache2 && \
    apt-get install -y tini && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY frontend /var/www/html/
COPY html /root/backend/
COPY run.sh /root/run.sh
COPY apache2 /etc/apache2

RUN chmod +x /root/run.sh

RUN pip3 install -r /root/backend/requirements.txt

ENTRYPOINT ["tini", "-g", "--", "/root/run.sh"]

CMD ["maildb"]
