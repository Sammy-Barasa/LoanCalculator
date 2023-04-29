from django.core.mail import EmailMessage
from django.conf import settings
# from django.template.loader import render_to_string
from django.template.loader import get_template
from pathlib import Path


import threading
import os


class EmailThread(threading.Thread):

    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)

    def run(self):
        self.email.send()

class Utils:
    @staticmethod
    def send_email(data):

        html_message = get_template("verifymail.html").render({"information":data['body'],"username":data["username"],"verifylink":data["verifylink"]})
        print(html_message)
        email=EmailMessage(
            subject=data['subject'],
            body=html_message,
            from_email=settings.EMAIL_HOST_USER,
            to=[data['to_email'],],
        )
        email.content_subtype = "html"
        EmailThread(email).start()
        
    @staticmethod
    def send_email_with_attachment(data,file_information,file_name):
        # Attach the file to the email
        html_message = get_template("verifymail.html").render({"information":data['body']})
        email = EmailMessage(
            subject=data['subject'],
            body=html_message,
            from_email=settings.EMAIL_HOST_USER,
            to=[data['to_email'],],
        )
        
        with open(file_name, 'rb') as file:
            email.attach(file_name, file.read(), 'text/csv')

        # Send the email
        email.content_subtype = "html"
        EmailThread(email).start()