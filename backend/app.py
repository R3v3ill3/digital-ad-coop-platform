from flask import Flask
app = Flask(__name__)

@app.route('/')
def home():
    return 'Digital Ad Co-Op Backend'

if __name__ == '__main__':
    app.run(debug=True)