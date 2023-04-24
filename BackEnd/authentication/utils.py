from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string


import threading



class EmailThread(threading.Thread):

    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)

    def run(self):
        self.email.send()

class Utils:
    @staticmethod
    def send_email(data):
        html_template = 'verifymail.html'
        html_message = render_to_string(html_template, context=data)
        print(html_message)
        email=EmailMessage(
            subject=data['subject'],
            body=data['body'],
            from_email=settings.EMAIL_HOST_USER,
            to=[data['to_email'],],
        )
        EmailThread(email).start()
