from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Project(models.Model):
    STATUS_CHOICES = [
        ('bidding', 'Bidding'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='bidding')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')

    def __str__(self):
        return self.name


class Shot(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
    ]
    project = models.ForeignKey(Project, related_name='shots', on_delete=models.CASCADE)

    name = models.CharField(max_length=255)
    description = models.TextField()
    frame_start = models.IntegerField()
    frame_end = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')

    def __str__(self):
        return self.name


class Task(models.Model):
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('review', 'In Review'),
        ('done', 'Done'),
    ]
    PIPELINE_STEPS = [
        ('modeling', 'Modeling'),
        ('texturing', 'Texturing'),
        ('rigging', 'Rigging'),
        ('animation', 'Animation'),
        ('lighting', 'Lighting'),
        ('compositing', 'Compositing'),
    ]
    shot = models.ForeignKey(Shot, related_name='tasks', on_delete=models.CASCADE)

    name = models.CharField(max_length=255)
    pipeline_step = models.CharField(max_length=20, choices=PIPELINE_STEPS, default='modeling')
    assigned_to = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')

    def __str__(self):
        return self.name


class Version(models.Model):
    STATUS_CHOICES = [
        ('approved', 'Approved'),
        ('needs_changes', 'Needs Changes'),
        ('needs_review', 'Needs Review'),
        ('pending', 'Pending'),
        ('rejected', 'Rejected'),
    ]
    shot = models.ForeignKey(Shot, related_name='versions', on_delete=models.CASCADE)

    name = models.CharField(max_length=255)
    version_number = models.PositiveIntegerField(blank=True, null=True)
    file_path = models.FileField(upload_to='versions/')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='needs_review')

    class Meta:
        unique_together = ('shot', 'version_number')
        ordering = ['shot', '-version_number']

    def save(self, *args, **kwargs):
        if not self.version_number:
            last_version = Version.objects.filter(shot=self.shot).order_by('-version_number').first()
            self.version_number = 1 if not last_version else last_version.version_number + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.shot.name}_v{self.version_number:04d}"
