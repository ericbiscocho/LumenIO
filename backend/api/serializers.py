from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, Shot, Task, Version


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        read_only_fields = ['id']


class VersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Version
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'version_number']

    def validate(self, attrs):
        if 'version_number' in self.initial_data:
            raise serializers.ValidationError({'version_number': 'Version number is auto-assigned.'})
        return attrs


class ShotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shot
        fields = '__all__'
        read_only_fields = ['id']


class TaskSerializer(serializers.ModelSerializer):
    shots = ShotSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['id']


class ProjectSerializer(serializers.ModelSerializer):
    shots = ShotSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'created_at', 'updated_at', 'status', 'shots']
        # read_only_fields = ['id', 'created_at']
