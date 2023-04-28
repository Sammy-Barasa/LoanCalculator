import pyrebase
import os
from dotenv import dotenv_values
config = dotenv_values(".env")
print(config)
email_val = config["FIREBASE_EMAIL"]
pass_val = config["FIREBASE_PASSWORD"]


class ConnectToFirebase():
    
    def __init__(self, database_endpoint, data_to_send ):
        self.database_endpoint = database_endpoint
        self.data_to_send = data_to_send
        self.firebaseConfig = {
            "apiKey": "AIzaSyCJZJVSecrTTHHPOR6axx0s4MplRnXNjCY",
            "authDomain": "loaninterestcalculator-47138.firebaseapp.com",
            "databaseURL": "https://loaninterestcalculator-47138-default-rtdb.firebaseio.com",
            "projectId": "loaninterestcalculator-47138",
            "storageBucket": "loaninterestcalculator-47138.appspot.com",
            "messagingSenderId": "809479780786",
            "appId": "1:809479780786:web:d82d9a3013cdfc041f8cab",
            "measurementId": "G-6JPM2VVNMR"
            }
        self.database = None
        self.user =  None
    def run_firebase(self):
        firebase=pyrebase.initialize_app(self.firebaseConfig)
        auth = firebase.auth()
        user_firebase = auth.sign_in_with_email_and_password(os.environ.get("FIREBASE_EMAIL",email_val),os.environ.get("FIREBASE_PASSWORD",pass_val) )
        user_firebase = auth.refresh(user_firebase['refreshToken'])
        self.database=firebase.database()
        self.user = user_firebase

    def firebase_send(self):
        self.run_firebase()
        self.database.child(self.database_endpoint).push(self.data_to_send, self.user_firebase['idToken'])



