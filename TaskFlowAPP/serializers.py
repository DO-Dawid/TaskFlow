from rest_framework import serializers, viewsets
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated

from .models import Task, Department, Project, Board, Subtask, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ['id', 'title', 'task', 'status']

    def create(self, validated_data):
        subtask = Subtask.objects.create(**validated_data)
        subtask.task.update_completion_status()
        return subtask


class SubtaskViewSet(viewsets.ModelViewSet):
    queryset = Subtask.objects.all()
    serializer_class = SubtaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    task = serializers.PrimaryKeyRelatedField(queryset=Task.objects.all())

    class Meta:
        model = Comment
        fields = ['id', 'user', 'task', 'content', 'created_at']


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
    completionPercentage = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'is_completed', 'user', 'department', 'project', 'assigned_by',
                  'comments', 'completionPercentage']
        read_only_fields = ['assigned_by']

    def get_completionPercentage(self, obj):
        return obj.completion_percentage()


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['id', 'name', 'tasks']


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        department_id = self.request.query_params.get('department')
        user_id = self.request.query_params.get('user')
        project_id = self.request.query_params.get('project')

        if department_id:
            queryset = queryset.filter(department_id=department_id)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if project_id:
            queryset = queryset.filter(project_id=project_id)

        return queryset

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        if 'is_completed' in request.data:
            task.is_completed = request.data['is_completed']
            task.save()
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        task = self.get_object()
        if task.assigned_by != request.user:
            raise PermissionDenied("You did not create this task.")
        return super().destroy(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        task = self.get_object()
        response = super().partial_update(request, *args, **kwargs)
        task.update_completion_status()
        return response