from __future__ import unicode_literals
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.contrib.postgres.fields import ArrayField


# comtrobr forange keys  db_column='nuemroTiquet', null=False)
# comproboar ondelete y on crate


# Taula (comensals, numTaula, ocupada)
class FiDia(models.Model):
    id = models.AutoField(primary_key=True)  # AutoField = se va aumentando solo
    numeroFiDia = models.IntegerField(null=False)
    data = models.DateTimeField(default=timezone.now, null=False)
    total = models.FloatField(null=False)
    totalImpostos = models.FloatField(null=False)

# si haces one to one en vez de forange keys pueses hacer el camino por ambos lados
# mirar tambien e oneToMany


class Tiquet(models.Model):
    id = models.AutoField(primary_key=True)  # AutoField = se va aumentando solo
    # fijar corectamente el numero de tiquet---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    numeroTiquet = models.IntegerField()  # ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    TIPOS_PAGAMENT = ((1, 'Efectiu'), (2, 'Targeta'), (3, 'Tiquets Restaurant'), (4, 'Altres'))  # tipos de pago
    tipusPagament = models.IntegerField(null=False, choices=TIPOS_PAGAMENT, default=1)
    dataHora = models.DateTimeField(default=timezone.now, null=False)
    TIPOS_ESTAT = ((1, 'No actiu'), (2, 'Actiu'), (3, 'Eliminat'), (4, 'Empaquetat fi dia'))  # tipos de pago
    estat = models.IntegerField(null=False, choices=TIPOS_ESTAT, default=1)
    idClient = models.ForeignKey('Client', models.DO_NOTHING, blank=True, null=True)  # Calu foranea de client
    idRestaurant = models.ForeignKey('Restaurant', models.DO_NOTHING, null=False)
    idFidia = models.ForeignKey('FiDia', models.DO_NOTHING, null=True, blank=True)

    def __str__(self):
        return str(self.numeroTiquet)


class Client(models.Model):
    id = models.AutoField(primary_key=True)  # AutoField = se va aumentando solo
    nom = models.CharField(max_length=256, null=False)
    direccio = models.CharField(max_length=256, null=False)
    NIF_DNI = models.CharField(max_length=14, null=False)
    actiu = models.BooleanField(default=True, null=False)

    def __str__(self):
        return self.nom


class Restaurant(models.Model):
    id = models.AutoField(primary_key=True)  # AutoField = se va aumentando solo
    nom = models.CharField(max_length=256, null=False)
    direccio = models.CharField(max_length=256, null=False)
    telefon = models.IntegerField(null=False)
    NIF = models.CharField(max_length=14, null=False)
    nTiquets = models.IntegerField(null=False, default=0)
    nFiDia = models.IntegerField(null=False, default=0)
    actiu = models.BooleanField(default=True, null=False)
    brut = models.BooleanField(default=False, null=False)
    logo = models.ImageField(upload_to='Images/', blank=True, null=True)

    def __str__(self):
        return self.nom


class Taula(models.Model):
    id = models.AutoField(primary_key=True)  # AutoField = se va aumentando solo
    comensals = models.IntegerField(null=False)
    numTaula = models.IntegerField(null=False)
    tiquetActiu = models.IntegerField(blank=True, null=True)
    actiu = models.BooleanField(default=True, null=False)
    idRestaurant = models.ForeignKey('Restaurant', models.DO_NOTHING, null=False)  # Calu foranea de Restaurant

    def __str__(self):
        return str(self.numTaula) + ' (' + str(self.idRestaurant) + ')'


class Categoria(models.Model):
    id = models.AutoField(primary_key=True)  # AutoField = se va aumentando solo
    nom = models.CharField(max_length=256, null=False)
    nivell = models.IntegerField(null=False, default=1)
    idCategoriasFills = ArrayField(
        models.IntegerField(), blank=True, null=True
    )
    # idCategoria = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True)  # bucle
    idCategoriaPare= models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True)  # bucle

    def __str__(self):
        return self.nom


class Consumible(models.Model):
    id = models.AutoField(primary_key=True)  # AutoField = se va aumentando solo
    nom = models.CharField(max_length=256, null=False)
    preu = models.FloatField(null=False)
    descripcio = models.TextField(blank=True, null=True)
    iva = models.FloatField(null=False)
    foto = models.ImageField(upload_to='Images/', blank=True, null=True)
    actiu = models.BooleanField(default=True, null=False)
    idCategoria = models.ForeignKey('Categoria', null=False)
    elaborat = models.BooleanField(default=False, null=False)

    def __str__(self):
        return self.nom


class LiniaTiquet(models.Model):
    id = models.AutoField(primary_key=True)  # AutoField = se va aumentando solo
    preuActual = models.FloatField(null=False)
    quantitat = models.IntegerField(null=False)
    ivaActual = models.FloatField(null=False)
    dataHora = models.DateTimeField(default=timezone.now, null=False)
    idConsumible = models.ForeignKey('Consumible', models.DO_NOTHING, null=False)
    idTaula = models.ForeignKey('Taula', models.DO_NOTHING, blank=True, null=True)
    idTiquet = models.ForeignKey('Tiquet', models.DO_NOTHING, null=False)
    TIPOS_ELABORACI = ((1, 'Sense elaboracio'), (2, 'No elaborat'), (3, 'Elaborant'), (4, 'Finalitzat')) # tipos de elaboracio
    elaboracio = models.IntegerField(null=False, choices=TIPOS_ELABORACI, default=1)

    def __str__(self):
        return self.idConsumible.nom + ' ' + str(self.quantitat)


class gestiona(models.Model): #-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    id = models.AutoField(primary_key=True)  # AutoField = se va aumentando solo
    idUsuari = models.ForeignKey(User, models.DO_NOTHING, null=False)
    idRestaurant = models.ForeignKey('Restaurant', models.DO_NOTHING, null=False)

    def __str__(self):
        return str(self.id)


# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=80)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class UserProfile(models.Model):  # clase que exteinde el usuario
    # user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE, primary_key=True)
    id = models.AutoField(primary_key=True)  # AutoField = se va aumentando solo
    user = models.OneToOneField(User, null=False)
    nom = models.CharField(max_length=360)
    DNI = models.CharField(max_length=14, null=False)
    TIPOS_CARREC = ((1, 'Encarregat'), (2, 'Responsable'), (3, 'Usuari'))  # tipos de pago
    carrec = models.IntegerField(null=False, choices=TIPOS_CARREC, default=3)

    def __str__(self):
        return self.user.username

    def get_absolute_url(self):
        return reverse('user-profile', kwargs={'pk': self.user.pk})


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'
