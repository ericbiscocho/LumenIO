from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import Project, Shot, Task, Version
from .serializers import ProjectSerializer, ShotSerializer, TaskSerializer, VersionSerializer


# Create your views here.
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ShotViewSet(viewsets.ModelViewSet):
    queryset = Shot.objects.all()
    serializer_class = ShotSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class VersionViewSet(viewsets.ModelViewSet):
    ALLOWED_VERSION_STATUS_TRANSITIONS = {
        'pending': ['approved', 'needs_changes'],
        'needs_changes': ['pending'],
        'approved': [],
    }
    queryset = Version.objects.all()
    serializer_class = VersionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        instance = self.get_object()
        new_status = self.request.data.get('status')

        if new_status:
            allowed = self.ALLOWED_VERSION_STATUS_TRANSITIONS.get(instance.status, [])
            if new_status not in allowed:
                raise ValidationError(f'Invalid status transition from {instance.status} to {new_status}.')

        if instance.status == 'approved':
            raise ValidationError('Approved versions cannot be modified.')

        serializer.save()
