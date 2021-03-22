from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('source', views.index),
    path('crystals', views.index),
    path('batches', views.index)
]
