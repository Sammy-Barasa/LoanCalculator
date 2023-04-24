from django.core.mail import EmailMessage
from django.conf import settings
# from django.template.loader import render_to_string
from django.template.loader import get_template



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

        html_message = get_template("verifymail.html").render({"information":data['body'],})
        print(html_message)
        email=EmailMessage(
            subject=data['subject'],
            body=html_message,
            from_email=settings.EMAIL_HOST_USER,
            to=[data['to_email'],],
        )
        email.content_subtype = "html"
        EmailThread(email).start()
