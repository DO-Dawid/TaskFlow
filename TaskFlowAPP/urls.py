from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, DepartmentViewSet, ProjectViewSet, BoardViewSet, SubtaskViewSet, register

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'boards', BoardViewSet)
router.register(r'subtasks', SubtaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
]
