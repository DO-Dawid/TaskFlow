# serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task, Department, Project, Board, Subtask


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ['id', 'title', 'is_completed', 'task']


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'department']


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['id', 'name', 'tasks']


class TaskSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True)
    department_id = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), source='department', write_only=True)
    project_id = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), source='project', write_only=True)
    assigned_by_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='assigned_by', write_only=True)

    user = UserSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    assigned_by = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'is_completed', 'user_id', 'department_id', 'project_id', 'assigned_by_id', 'user', 'department', 'project', 'assigned_by']
        read_only_fields = ['assigned_by', 'user', 'department', 'project']
