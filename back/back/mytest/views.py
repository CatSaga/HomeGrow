from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from .serial_data import send_data  # 아두이노로 명령을 전송하는 함수
from .models import SensorData, ControlMode, UploadedImage
from .serializers import SensorDataSerializer, ControlModeSerializer, UploadedImageSerializer
from django.db import transaction
import base64
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils.dateparse import parse_date

class SensorDataViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SensorData.objects.order_by('-timestamp')[:1]
    serializer_class = SensorDataSerializer

    def list(self, request, *args, **kwargs):
        sensor_data = self.get_queryset().first()
        if sensor_data:
            serializer = self.get_serializer(sensor_data)
            return Response(serializer.data)
        return Response({'temperature': 'N/A', 'humidity': 'N/A', 'light_percentage': 'N/A'}, status=status.HTTP_204_NO_CONTENT)
        
class ControlModeViewSet(viewsets.ViewSet):
    """
    제어 모드 및 장치 제어를 위한 엔드포인트
    """

    def list(self, request):
        control_mode = ControlMode.objects.first()
        is_auto = control_mode.mode == 'auto' if control_mode else False
        return Response({'is_auto': is_auto}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='set_mode')
    def set_mode(self, request):
        is_auto = request.data.get('is_auto', False)
        control_mode, _ = ControlMode.objects.get_or_create(id=1)
        control_mode.mode = 'auto' if is_auto else 'manual'
        control_mode.save()
        mode_command = 'CMD:mode:auto' if is_auto else 'CMD:mode:manual'
        send_data(mode_command)
        return Response({'status': 'Mode change completed'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='fan-control')
    def fan_control(self, request):
        command = request.data.get('command')
        if command not in [0, 1]:
            return Response({'error': 'Invalid command'}, status=status.HTTP_400_BAD_REQUEST)
        send_data(f"CMD:fan:{command}")
        return Response({'status': 'Fan control successful'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='pump-control')
    def pump_control(self, request):
        command = request.data.get('command')
        if command not in [0, 1]:
            return Response({'error': 'Invalid command'}, status=status.HTTP_400_BAD_REQUEST)
        send_data(f"CMD:pump:{command}")
        return Response({'status': 'Pump control successful'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='switch-control')
    def switch_control(self, request):
        command = request.data.get('command')
        if command not in [0, 1]:
            return Response({'error': 'Invalid command'}, status=status.HTTP_400_BAD_REQUEST)
        send_data(f"CMD:switch:{command}")
        return Response({'status': 'Switch control successful'}, status=status.HTTP_200_OK)



class UploadedImageViewSet(viewsets.ModelViewSet):
    queryset = UploadedImage.objects.all()
    serializer_class = UploadedImageSerializer

    def create(self, request, *args, **kwargs):
        date_str = request.data.get('date')  # 전달된 날짜 값을 가져옴
        image_file = request.FILES.get('image')

        # 날짜를 파싱하여 DateField에 맞게 변환
        date = parse_date(date_str) if date_str else None

        # 이미지 저장
        image_instance = UploadedImage(image=image_file, date=date)
        image_instance.save()
        return Response(UploadedImageSerializer(image_instance).data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        images = self.get_queryset()
        image_list = []
        for image in images:
            with open(image.image.path, "rb") as img_file:
                img_data = img_file.read()
                img_base64 = base64.b64encode(img_data).decode('utf-8')
            image_list.append({
                'id': image.id,
                'date': image.date.strftime('%Y-%m-%d'),  # timestamp 대신 date 사용
                'image': img_base64
            })
        return Response(image_list)
