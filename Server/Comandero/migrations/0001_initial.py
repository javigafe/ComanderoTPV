# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-08-22 11:55
from __future__ import unicode_literals

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AuthGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80, unique=True)),
            ],
            options={
                'db_table': 'auth_group',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthGroupPermissions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'db_table': 'auth_group_permissions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthPermission',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('codename', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'auth_permission',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('is_superuser', models.BooleanField()),
                ('username', models.CharField(max_length=150, unique=True)),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('email', models.CharField(max_length=254)),
                ('is_staff', models.BooleanField()),
                ('is_active', models.BooleanField()),
                ('date_joined', models.DateTimeField()),
            ],
            options={
                'db_table': 'auth_user',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUserGroups',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'db_table': 'auth_user_groups',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUserUserPermissions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'db_table': 'auth_user_user_permissions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoAdminLog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action_time', models.DateTimeField()),
                ('object_id', models.TextField(blank=True, null=True)),
                ('object_repr', models.CharField(max_length=200)),
                ('action_flag', models.SmallIntegerField()),
                ('change_message', models.TextField()),
            ],
            options={
                'db_table': 'django_admin_log',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoContentType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('app_label', models.CharField(max_length=100)),
                ('model', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'django_content_type',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoMigrations',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('app', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('applied', models.DateTimeField()),
            ],
            options={
                'db_table': 'django_migrations',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoSession',
            fields=[
                ('session_key', models.CharField(max_length=40, primary_key=True, serialize=False)),
                ('session_data', models.TextField()),
                ('expire_date', models.DateTimeField()),
            ],
            options={
                'db_table': 'django_session',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nom', models.CharField(max_length=256)),
                ('nivell', models.IntegerField(default=1)),
                ('idCategoriasFills', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=None)),
                ('idCategoriaPare', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Comandero.Categoria')),
            ],
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nom', models.CharField(max_length=256)),
                ('direccio', models.CharField(max_length=256)),
                ('NIF_DNI', models.CharField(max_length=14)),
                ('actiu', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Consumible',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nom', models.CharField(max_length=256)),
                ('preu', models.FloatField()),
                ('descripcio', models.TextField(blank=True, null=True)),
                ('iva', models.FloatField()),
                ('foto', models.ImageField(blank=True, null=True, upload_to='Images/')),
                ('actiu', models.BooleanField(default=True)),
                ('elaborat', models.BooleanField(default=False)),
                ('idCategoria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Comandero.Categoria')),
            ],
        ),
        migrations.CreateModel(
            name='FiDia',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('numeroFiDia', models.IntegerField()),
                ('data', models.DateTimeField(default=django.utils.timezone.now)),
                ('total', models.FloatField()),
                ('totalImpostos', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='gestiona',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='LiniaTiquet',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('preuActual', models.FloatField()),
                ('quantitat', models.IntegerField()),
                ('ivaActual', models.FloatField()),
                ('dataHora', models.DateTimeField(default=django.utils.timezone.now)),
                ('elaboracio', models.IntegerField(choices=[(1, 'Sense elaboracio'), (2, 'No elaborat'), (3, 'Elaborant'), (4, 'Finalitzat')], default=1)),
                ('idConsumible', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='Comandero.Consumible')),
            ],
        ),
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nom', models.CharField(max_length=256)),
                ('direccio', models.CharField(max_length=256)),
                ('telefon', models.IntegerField()),
                ('NIF', models.CharField(max_length=14)),
                ('nTiquets', models.IntegerField(default=0)),
                ('nFiDia', models.IntegerField(default=0)),
                ('actiu', models.BooleanField(default=True)),
                ('brut', models.BooleanField(default=False)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='Images/')),
            ],
        ),
        migrations.CreateModel(
            name='Taula',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('comensals', models.IntegerField()),
                ('numTaula', models.IntegerField()),
                ('tiquetActiu', models.IntegerField(blank=True, null=True)),
                ('actiu', models.BooleanField(default=True)),
                ('idRestaurant', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='Comandero.Restaurant')),
            ],
        ),
        migrations.CreateModel(
            name='Tiquet',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('numeroTiquet', models.IntegerField()),
                ('tipusPagament', models.IntegerField(choices=[(1, 'Efectiu'), (2, 'Targeta'), (3, 'Tiquets Restaurant'), (4, 'Altres')], default=1)),
                ('dataHora', models.DateTimeField(default=django.utils.timezone.now)),
                ('estat', models.IntegerField(choices=[(1, 'No actiu'), (2, 'Actiu'), (3, 'Eliminat'), (4, 'Empaquetat fi dia')], default=1)),
                ('idClient', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='Comandero.Client')),
                ('idFidia', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='Comandero.FiDia')),
                ('idRestaurant', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='Comandero.Restaurant')),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=360)),
                ('DNI', models.CharField(max_length=14)),
                ('carrec', models.IntegerField(choices=[(1, 'Encarregat'), (2, 'Responsable'), (3, 'Usuari')], default=3)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='liniatiquet',
            name='idTaula',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='Comandero.Taula'),
        ),
        migrations.AddField(
            model_name='liniatiquet',
            name='idTiquet',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='Comandero.Tiquet'),
        ),
        migrations.AddField(
            model_name='gestiona',
            name='idRestaurant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='Comandero.Restaurant'),
        ),
        migrations.AddField(
            model_name='gestiona',
            name='idUsuari',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
    ]