import os
from app import app
from flask import render_template
from flask_mail import Mail, Message
from threading import Thread

HOMEPATH = os.getcwd()

mail = Mail(app)


# start send mail functions
def start_send(app, message):
    with app.app_context():
        mail.send(message)


# send the mail with html template
def send_mail(recipients, title, template, ics_path, **kwargs):
    """
    send mail with/without files
    @param recipients: recipient emails
    @param title: email title
    @param template: the html template
    @param ics_path: if is none then ignore
    @param kwargs: html args
    @return:
    """
    message = Message(title, recipients=recipients, sender=('Shunyang Li', 'nomoreprojectpls@gmail.com'))
    message.html = render_template(template + '.html', **kwargs)
    if ics_path is not None:
        message.attach('event.ics', 'text/calendar;method=REQUEST;name={}.ics'.format(ics_path),
                       data=open(HOMEPATH + '/static/{}.ics'.format(ics_path)).read())
    thr = Thread(target=start_send, args=[app, message])
    thr.start()

