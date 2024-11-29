from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static  # static을 추가로 import
from rest_framework.routers import DefaultRouter
from .views import ControlModeViewSet, SensorDataViewSet, UploadedImageViewSet

# 기본 라우터 설정
router = DefaultRouter()
router.register(r'sensor_data', SensorDataViewSet, basename='sensor_data')
router.register(r'images', UploadedImageViewSet, basename='uploadedimage')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/control-mode/', ControlModeViewSet.as_view({'get': 'list', 'post': 'set_mode'}), name='control-mode'),
    path('api/control-mode/set_mode/', ControlModeViewSet.as_view({'post': 'set_mode', 'get': 'set_mode'}), name='set-mode'),
    path('api/fan-control/', ControlModeViewSet.as_view({'post': 'fan_control', 'get': 'fan_control'}), name='fan-control'),
    path('api/pump-control/', ControlModeViewSet.as_view({'post': 'pump_control', 'get': 'pump_control'}), name='pump-control'),
    path('api/switch-control/', ControlModeViewSet.as_view({'post': 'switch_control', 'get': 'switch_control'}), name='switch-control'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
