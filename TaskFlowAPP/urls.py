from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, DepartmentViewSet, ProjectViewSet, BoardViewSet, SubtaskViewSet, UserViewSet, register, MyTokenObtainPairView, add_task

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'boards', BoardViewSet)
router.register(r'subtasks', SubtaskViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('add_task/', add_task, name='add_task'),
]
