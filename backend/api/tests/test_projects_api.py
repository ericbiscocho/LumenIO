import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.test import APIClient
from api.models import Project


def test_user_only_sees_own_projects():
    """
    Ensures authenticated users cannot see projects owned by other users (multi-tenant safety).
    """
    # Create two users.
    user_1 = User.objects.create_user(username='user_1', password='password123')
    user_2 = User.objects.create_user(username='user_2', password='password123')

    # Create projects for both users.
    Project.objects.create(name='Project 1', owner=user_1)
    Project.objects.create(name='Project 2', owner=user_2)

    # Authenticate as user_1.
    client = APIClient()
    client.force_authenticate(user=user_1)

    # Make a request to the projects endpoint.
    response = client.get('/api/projects/')

    # Check that the response is successful.
    assert response.status_code == 200

    # Check that only user_1's project is returned.
    project_names = [project['name'] for project in response.data['results']]
    assert 'Project 1' in project_names
    assert 'Project 2' not in project_names

    # Clean up created users (projects are deleted when the users who created them are deleted).
    user_1.delete()
    user_2.delete()
