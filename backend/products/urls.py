from django.urls import path
from .views import products_json

urlpatterns = [
    path('', products_json, name='products-json'),
]