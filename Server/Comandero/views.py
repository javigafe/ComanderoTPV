from django.shortcuts import render
from .models import *
from .forms import *

from django.contrib.auth.models import User, Group
from models import *
from rest_framework import viewsets
from Comandero.serializers import *
from django.contrib.auth.models import User
from rest_framework.filters import *
from rest_framework import generics

# Create your views here.
class FiDiaViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = FiDia.objects.all().order_by()
    serializer_class = FiDiaSerializer
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filter_fields = ('id', 'numeroFiDia', 'data', 'total', 'totalImpostos')
    search_fields = ['data']


class TiquetViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Tiquet.objects.all().order_by()
    serializer_class = TiquetSerializer
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filter_fields = ('id', 'numeroTiquet', 'tipusPagament', 'dataHora', 'estat', 'idClient', 'idRestaurant', 'idFidia')
    search_fields = ['dataHora']


class ClientViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filter_fields = ('id', 'nom', 'direccio', 'NIF_DNI', 'actiu')
    search_fields = ['nom', 'NIF_DNI']


class RestaurantViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filter_fields = ('id', 'nom', 'direccio', 'telefon', 'nTiquets', 'nFiDia', 'NIF', 'actiu', 'brut')
    search_fields = ['nom', 'NIF']


class TaulaViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Taula.objects.all().order_by()
    serializer_class = TaulaSerializer
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    filter_fields = ('id', 'comensals', 'numTaula', 'tiquetActiu', 'actiu', 'idRestaurant')


class CategoriaViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ['nom']
    filter_fields = ('id', 'nom', 'nivell', 'idCategoriaPare')


class ConsumibleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Consumible.objects.all()
    serializer_class = ConsumibleSerializer
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filter_fields = ('id', 'nom', 'preu', 'descripcio', 'iva', 'actiu', 'idCategoria', 'elaborat')
    search_fields = ['nom']


class LiniaTiquetViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = LiniaTiquet.objects.all().order_by()
    serializer_class = LiniaTiquetSerializer
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    filter_fields = ('id', 'preuActual', 'quantitat', 'ivaActual', 'dataHora', 'idConsumible', 'idTaula', 'idTiquet', 'elaboracio')


class gestionaViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = gestiona.objects.all()
    serializer_class = gestionaSerializer
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    filter_fields = ('id', 'idUsuari', 'idRestaurant')


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by()
    serializer_class = UserSerializer
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    filter_fields = ('username', 'email', 'groups')


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = UserProfile.objects.all().order_by()
    serializer_class = UserProfileSerializer
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    filter_fields = ('user', 'nom', 'DNI', 'carrec')


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    filter_fields = ['name']
