# apps.py
from django.apps import AppConfig

class MyAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'  # 애플리케이션 이름을 여기에 맞게 수정하세요.

    def ready(self):
        from . import initial_setup
        initial_setup.set_auto_mode()
