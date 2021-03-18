from rest_framework import routers
from .api import ExampleViewSet

router = routers.DefaultRouter()
router.register('api/example', ExampleViewSet, 'example')

urlpatterns = router.urls
