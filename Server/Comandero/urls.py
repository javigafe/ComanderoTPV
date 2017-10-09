from django.conf.urls import include, url
from rest_framework import routers
from . import views
from django.conf.urls.static import static
from django.conf import settings

from django.contrib import admin



router = routers.DefaultRouter()
router.register(r'fidia', views.FiDiaViewSet)
router.register(r'tiquet', views.TiquetViewSet)
router.register(r'client', views.ClientViewSet)
router.register(r'restaurant', views.RestaurantViewSet)
router.register(r'taula', views.TaulaViewSet)
router.register(r'categoria', views.CategoriaViewSet)
router.register(r'consumible', views.ConsumibleViewSet)
router.register(r'liniatiquet', views.LiniaTiquetViewSet)
router.register(r'gestiona', views.gestionaViewSet)
router.register(r'userprofile', views.UserProfileViewSet)
router.register(r'user', views.UserViewSet)
router.register(r'group', views.GroupViewSet)


urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration', include('rest_auth.registration.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)