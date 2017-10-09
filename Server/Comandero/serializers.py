from django.contrib.auth.models import User, Group
from models import *
from rest_framework import serializers

class FiDiaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = FiDia
        fields = ('url', 'id', 'numeroFiDia', 'data', 'total', 'totalImpostos')


class TiquetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tiquet
        fields = ('url', 'id', 'numeroTiquet', 'tipusPagament', 'dataHora', 'estat', 'idClient', 'idRestaurant', 'idFidia')


class ClientSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Client
        fields = ('url', 'id', 'nom', 'direccio', 'NIF_DNI', 'actiu')


class RestaurantSerializer(serializers.HyperlinkedModelSerializer):

    logo = serializers.ImageField(max_length=None, use_url=True, allow_null=True)

    class Meta:
        model = Restaurant
        fields = ('url', 'id', 'nom', 'direccio', 'telefon', 'nTiquets', 'nFiDia', 'NIF', 'actiu', 'brut', 'logo')


class TaulaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Taula
        fields = ('url', 'id', 'comensals', 'numTaula', 'tiquetActiu', 'actiu', 'idRestaurant')


class CategoriaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Categoria
        fields = ('url', 'id', 'nom', 'nivell', 'idCategoriasFills', 'idCategoriaPare')


class ConsumibleSerializer(serializers.HyperlinkedModelSerializer):

    foto = serializers.ImageField(max_length=None, use_url=True, allow_null=True)

    class Meta:
        model = Consumible
        fields = ('url', 'id', 'nom', 'preu', 'descripcio', 'iva', 'foto', 'actiu', 'idCategoria', 'elaborat')


class LiniaTiquetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = LiniaTiquet
        fields = ('url', 'id', 'preuActual', 'quantitat', 'ivaActual', 'dataHora', 'idConsumible', 'idTaula', 'idTiquet', 'elaboracio')


class gestionaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = gestiona
        fields = ('url', 'id', 'idUsuari', 'idRestaurant')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('url', 'user', 'nom', 'DNI', 'carrec')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')