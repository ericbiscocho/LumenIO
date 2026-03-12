from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import Project, Shot, Task, Version
from .serializers import ProjectSerializer, ShotSerializer, TaskSerializer, VersionSerializer


# Create your views here.
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ShotViewSet(viewsets.ModelViewSet):
    serializer_class = ShotSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Shot.objects.filter(project__owner=self.request.user)
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.filter(shot__project__owner=self.request.user)
        shot_id = self.request.query_params.get('shot')
        if shot_id:
            queryset = queryset.filter(shot_id=shot_id)
        return queryset


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
