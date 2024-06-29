from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task, Department, Project, Board, Subtask, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ['id', 'title', 'is_completed', 'task']


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at']


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'department']


class TaskSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    department = DepartmentSerializer()
    project = ProjectSerializer()
    assigned_by = UserSerializer()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'is_completed', 'user', 'department', 'project', 'assigned_by',
                  'comments']
        read_only_fields = ['assigned_by']


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['id', 'name', 'tasks']
