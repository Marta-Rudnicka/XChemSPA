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
    path("create-batches/", views.create_batches, name="create-batches"),
    path("imports/create-combinations/", views.create_combinations, name="create_combinations"),
    path("exports/echo-soak/<int:pk>/<int:soak>/", views.serve_soak_echo_file, name="echo_soak"),
    path("exports/echo-cryo/<int:pk>/<int:soak>/", views.serve_cryo_echo_file, name="echo_cryo"),
    path("exports/save-timestamp/<int:pk>/<str:attr>/", views.add_transfer_date, name="add_transfer_date"),
    path("exports/save-soak-time/<int:pk>/", views.add_soak_time, name="add_soak_time"),
    path("exports/shifter-input/<int:pk>/", views.serve_shifter_input, name="serve_shifter_input"),
    path("imports/shifter-output/<int:pk>/", views.import_shifter_data, name="import_shifter_data"),
]
