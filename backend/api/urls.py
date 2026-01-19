from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, ShotViewSet, TaskViewSet, VersionViewSet


router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'shots', ShotViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'versions', VersionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
