from django.contrib.auth.models import User
from rest_framework import status, viewsets, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Task, Department, Project, Board, Subtask
from .serializers import TaskSerializer, DepartmentSerializer, ProjectSerializer, BoardSerializer, SubtaskSerializer, UserSerializer
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


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'is_completed']

    def get_queryset(self):
        queryset = Task.objects.all()
        department = self.request.query_params.get('department')
        user = self.request.query_params.get('user')
        project = self.request.query_params.get('project')
        if department:
            queryset = queryset.filter(department__id=department)
        if user:
            queryset = queryset.filter(user__id=user)
        if project:
            queryset = queryset.filter(project__id=project)
        return queryset

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
        except Exception as e:
            logger.error(f"Error updating task: {str(e)}")
            logger.error(f"Serializer errors: {serializer.errors}")
            raise e
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()



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


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
