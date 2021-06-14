#from rest_framework import routers
#from .api import ExampleViewSet

#router = routers.DefaultRouter()
#router.register('api/example', ExampleViewSet, 'example')

#urlpatterns = router.urls
from django.urls import path
from . import views

urlpatterns = [
    path("imports/import-compounds/", views.import_compounds, name="import-compounds"),
    path("imports/import-new-crystals/", views.import_new_crystals, name="import-new-crystals"),
    path("verify-visit/", views.verify_visit, name="verify-visit"),
]
