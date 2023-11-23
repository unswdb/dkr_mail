service apache2 start
pyuwsgi -d --ini /root/backend/mail.ini
tail -f /dev/null
