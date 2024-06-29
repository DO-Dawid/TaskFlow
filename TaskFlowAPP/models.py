from django.db import models
from django.contrib.auth.models import User

class Role(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Department(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
    assigned_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks')

    def __str__(self):
        return self.title

    def completion_percentage(self):
        subtasks = self.subtasks.all()
        if not subtasks:
            return 0
        completed_subtasks = subtasks.filter(is_completed=True).count()
        return int((completed_subtasks / subtasks.count()) * 100)

class Subtask(models.Model):
    title = models.CharField(max_length=200)
    is_completed = models.BooleanField(default=False)
    task = models.ForeignKey(Task, related_name='subtasks', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class Board(models.Model):
    name = models.CharField(max_length=200)
    tasks = models.ManyToManyField(Task)

    def __str__(self):
        return self.name

class Comment(models.Model):
    task = models.ForeignKey(Task, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user} on {self.task}"
