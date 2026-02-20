import os
from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///platenkast.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

db = SQLAlchemy(app)

class Vinyl(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titel = db.Column(db.String(100), nullable=False)
    artiest = db.Column(db.String(100), nullable=False)
    hoes = db.Column(db.String(200), default='')

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    platen = Vinyl.query.order_by(Vinyl.artiest).all()
    return render_template('index.html', platen=platen)

@app.route('/add', methods=['GET', 'POST'])
def add_lp():
    if request.method == 'POST':
        titel = request.form['titel']
        artiest = request.form['artiest']
        file = request.files['afbeelding']
        filename = ''
        if file and file.filename != '':
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        nieuwe_lp = Vinyl(titel=titel, artiest=artiest, hoes=filename)
        db.session.add(nieuwe_lp)
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('add.html', lp=None)

@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit_lp(id):
    lp = Vinyl.query.get_or_404(id)
    if request.method == 'POST':
        lp.titel = request.form['titel']
        lp.artiest = request.form['artiest']
        file = request.files['afbeelding']
        if file and file.filename != '':
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            lp.hoes = filename
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('add.html', lp=lp)

@app.route('/delete/<int:id>')
def delete_lp(id):
    lp = Vinyl.query.get_or_404(id)
    db.session.delete(lp)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/settings')
def settings():
    return render_template('settings.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)