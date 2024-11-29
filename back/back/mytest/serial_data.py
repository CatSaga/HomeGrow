import serial
import logging
import time
from .models import SensorData
from django.db import transaction
import threading


SERIAL_PORT = '/dev/arduino_mega'
BAUD_RATE = 9600
_serial_connection = None

# 시리얼 연결 초기화
def get_serial_connection():
    global _serial_connection
    if _serial_connection is None or not _serial_connection.is_open:
        try:
            _serial_connection = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2)
            _serial_connection.setDTR(False)
            time.sleep(1.5)
            _serial_connection.flushInput()
            _serial_connection.flushOutput()
            logging.info(f"Serial connection established on {SERIAL_PORT}")
        except serial.SerialException as e:
            logging.error(f"Serial port error: {str(e)}")
            _serial_connection = None
    return _serial_connection

# 센서 데이터 저장 함수
def save_sensor_data(temperature, humidity, light_percentage):
    try:
        with transaction.atomic():
            SensorData.objects.create(
                temperature=temperature,
                humidity=humidity,
                light_percentage=light_percentage
            )
            logging.info(f"Data saved: Temperature={temperature}, Humidity={humidity}, Light Percentage={light_percentage}")
    except Exception as e:
        logging.error(f"Error saving data: {e}")

# 시리얼 데이터 수신 함수
def receive_data():
    ser = get_serial_connection()
    while ser and ser.is_open:
        if ser.in_waiting > 0:
            try:
                # 시리얼 데이터 읽기
                data = ser.readline().decode('utf-8', errors='ignore').strip()
                logging.info(f"Raw Serial Data: {data}")

                # 데이터 파싱
                if "Humidity:" in data and "Temperature:" in data and "Light:" in data:
                    # 공백으로 데이터를 나누고 각 값을 파싱
                    parts = data.split(" ")
                    humidity = float(parts[1])
                    temperature = float(parts[3])
                    light_percentage = int(parts[5])

                    logging.info(f"Parsed Data - Temperature: {temperature}, Humidity: {humidity}, Light Percentage: {light_percentage}")

                    # 데이터 저장
                    save_sensor_data(temperature, humidity, light_percentage)
                else:
                    logging.warning(f"Unexpected data format: {data}")

            except Exception as e:
                logging.error(f"Error parsing or saving data: {e}")

        time.sleep(0.1)


# 자동 제어 명령 전송 함수
def auto_control(temperature, humidity, light_percentage):
    ser = get_serial_connection()
    if ser:
        try:
            # 조도 값에 따라 스위치 제어
            switch_command = "CMD:switch:1" if light_percentage < 10 else "CMD:switch:0"
            send_data(switch_command)

            # 온도에 따라 팬 제어
            fan_command = "CMD:fan:1" if temperature > 25 else "CMD:fan:0"
            send_data(fan_command)

            # 습도에 따라 펌프 제어
            pump_command = "CMD:pump:1" if humidity < 50 else "CMD:pump:0"
            send_data(pump_command)
        except Exception as e:
            logging.error(f"Error in auto control: {e}")

# 명령 전송 함수
def send_data(command):
    ser = get_serial_connection()
    if ser:
        try:
            ser.write(command.encode('utf-8'))
            logging.info(f"Sent command: {command}")
        except serial.SerialException as e:
            logging.error(f"Serial port error while sending command: {str(e)}")

# 데이터 수신 스레드 실행
sensor_receive_thread = threading.Thread(target=receive_data)
sensor_receive_thread.daemon = True
sensor_receive_thread.start()
