# serializers.py
from rest_framework import serializers
from .models import SensorData, ControlMode, UploadedImage

class SensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorData
        fields = ['temperature', 'humidity', 'light_percentage', 'timestamp']  # light_percentage로 변경

class ControlModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlMode
        fields = ['mode']


class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ['id', 'image', 'timestamp']  # timestamp 필드 포함
