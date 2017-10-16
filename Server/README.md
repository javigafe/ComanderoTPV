# Server ComanderoTPV


### INSTAL·LACIÓ
1.	Instalar python, al terminal:
```
sudo apt-get install python-setuptools -y
sudo apt-get install python
```
2.	Instal·lar Django i llibreries necessàries, al terminal (pot ser necessari súper usuari):
# Instal·lar Django
```
pip install django docutils
pip install django-cors-headers
# API REST Django
pip install djangorestframework
# API REST Django al navegador
pip install markdown
# Filtres a API REST Django
pip install django-filter

# Adaptador PostgreSQL per a Python
pip install psycopg2

# Llibreria per a les imatges
pip install Pillow

# Autenticació per a l’API REST Django
pip install django-rest-auth
pip install django-rest-framework
pip install django-allauth
```
3.	Instal·lar PostgreSQL, al terminal:
```
sudo apt-get install libpq-dev python-dev
sudo apt-get install postgresql postgresql-contrib
```
4.	Configurar Postgre i crear una base de dades.
5.	Configurar Django, Dins de la capeta Server/dabd és necessari editar l’arxiu settings.py:
5.1.	Establir la base de dades:
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'xxxxx',
        'USER': 'xxxxxx',
        'PASSWORD': 'xxxxxx',
        'HOST': 'localhost',
        'PORT': '',
    }
}
```
5.2.	Afegir els hosts permesos:
```
ALLOWED_HOSTS = ['XX.XX.XX.XX', ‘ xxxxxxxxx.xx’]
```
6.	Migrar Django, per a traslladar el model a la base de dades, al terminal on tinguis l’arxiu manage.py:
```
python manage.py makemigrations Comandero
python manage.py migrate
```
7.	Crear super usuari Django, al terminal:
```
python manage.py createsuperuser
```
8.	Executar Django, al terminal:
```
python manage.py runserver
```
# Si vols executar el servidor per a una determinada IP i un determinat port
```
python manage.py runserver [IP]:[port]
# Exemple: python manage.py runserver 192.168.1.50:8000
```

To get more help on the Django go check out the [Django documentation](https://github.com/django/django/blob/master/README.rst).
