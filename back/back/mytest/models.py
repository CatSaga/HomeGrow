from django.db import models

class SensorData(models.Model):
    temperature = models.FloatField()
    humidity = models.FloatField()
    light_percentage = models.IntegerField()  # 조도 필드
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'mytest_sensordata'  # 테이블 이름 명시



class ControlMode(models.Model):
    MODE_CHOICES = (
        ('auto', 'Automatic'),
        ('manual', 'Manual'),
    )
    mode = models.CharField(max_length=10, choices=MODE_CHOICES, default='auto')

class UploadedImage(models.Model):
    image = models.ImageField(upload_to='uploads/')
    date = models.DateField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image {self.id}"


class ControlMode(models.Model):
    MODE_CHOICES = (
        ('auto', 'Automatic'),
        ('manual', 'Manual'),
    )
    mode = models.CharField(max_length=10, choices=MODE_CHOICES, default='auto')

class UploadedImage(models.Model):
    image = models.ImageField(upload_to='uploads/')
    date = models.DateField()  # 날짜 필드 추가
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image {self.id}"
