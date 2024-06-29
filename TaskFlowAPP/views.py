from django.contrib.auth.models import User
from rest_framework import status, viewsets, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Task, Department, Project, Board, Subtask, Comment
from .serializers import TaskSerializer, DepartmentSerializer, ProjectSerializer, BoardSerializer, SubtaskSerializer, UserSerializer, CommentSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    logger.info(f"Register request received with username: {username}, email: {email}")

    if not username or not password or not email:
        logger.error("All fields are required")
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        logger.error("Username already exists")
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(username=username, password=password, email=email)
        logger.info(f"User {username} created successfully")
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_task(request):
    title = request.data.get('title')
    description = request.data.get('description')
    user_id = request.data.get('user_id')
    department_id = request.data.get('department_id')
    project_id = request.data.get('project_id')
    assigned_by_id = request.data.get('assigned_by_id')

    logger.info(f"Add task request received with title: {title}, user_id: {user_id}, department_id: {department_id}, project_id: {project_id}, assigned_by_id: {assigned_by_id}")

    if not title or not user_id or not assigned_by_id:
        logger.error("Title, user_id, and assigned_by_id are required")
        return Response({'error': 'Title, user_id, and assigned_by_id are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
        assigned_by = User.objects.get(id=assigned_by_id)
        department = Department.objects.get(id=department_id) if department_id else None
        project = Project.objects.get(id=project_id) if project_id else None

        task = Task.objects.create(
            title=title,
            description=description,
            user=user,
            department=department,
            project=project,
            assigned_by=assigned_by
        )
        logger.info(f"Task {title} created successfully")
        return Response({'message': 'Task created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error creating task: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request):
    content = request.data.get('content')
    task_id = request.data.get('task_id')
    user_id = request.data.get('user_id')

    if not content or not task_id or not user_id:
        return Response({'error': 'Content, task_id, and user_id are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        task = Task.objects.get(id=task_id)
        user = User.objects.get(id=user_id)

        comment = Comment.objects.create(
            content=content,
            task=task,
            user=user
        )
        return Response({'message': 'Comment added successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({'username': self.user.username})
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]

class SubtaskViewSet(viewsets.ModelViewSet):
    queryset = Subtask.objects.all()
    serializer_class = SubtaskSerializer
    permission_classes = [IsAuthenticated]

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        if task.assigned_by != request.user:
            raise PermissionDenied("You did not create this task.")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        task = self.get_object()
        if task.assigned_by != request.user:
            raise PermissionDenied("You did not create this task.")
        return super().destroy(request, *args, **kwargs)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
