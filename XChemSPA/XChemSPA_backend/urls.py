#from rest_framework import routers
#from .api import ExampleViewSet

#router = routers.DefaultRouter()
#router.register('api/example', ExampleViewSet, 'example')

#urlpatterns = router.urls
from django.urls import path
from . import views

urlpatterns = [
    path("imports/import-compounds/", views.import_compounds, name="import_compounds"),
]
