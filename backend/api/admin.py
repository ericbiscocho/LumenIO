from django.contrib import admin
from .models import Project, Shot, Task, Version

# Register your models here.
admin.site.register(Project)
admin.site.register(Shot)
admin.site.register(Task)
admin.site.register(Version)
