import serial
import time
import requests
import json
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 시리얼 포트 설정
SERIAL_PORT = '/dev/ttyACM0'  # 아두이노가 연결된 포트
BAUD_RATE = 9600

# Django 서버 URL
SERVER_URL = 'http://127.0.0.1:8000/api/sensor/'  # Django 서버 주소와 포트에 맞게 수정

def read_serial_data(ser):
    """아두이노에서 시리얼 데이터를 읽는 함수."""
    while True:
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').strip()
            logger.info(f"수신된 데이터: {line}")
            yield line

def parse_sensor_data(data):
    """온도와 습도를 파싱하는 함수."""
    try:
        # 데이터 형식: "temperature,humidity"
        temp, humid = map(float, data.split(','))
        return {
            "temperature": temp,
            "humidity": humid,
        }
    except ValueError as e:
        logger.error(f"데이터 파싱 오류: {e}")
        return None

def send_to_server(data):
    """서버에 데이터를 전송하는 함수."""
    try:
        response = requests.post(SERVER_URL, json=data)
        if response.status_code == 201:
            logger.info("데이터 전송 성공")
        else:
            logger.error(f"서버 응답 오류: {response.status_code}, {response.text}")
    except requests.RequestException as e:
        logger.error(f"서버 통신 오류: {e}")

def main():
    try:
        with serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1) as ser:
            logger.info("시리얼 포트 연결 성공")
            for data in read_serial_data(ser):
                # 아두이노 응답 처리
                logger.info(f"아두이노 응답: {data}")

                parsed_data = parse_sensor_data(data)
                if parsed_data:
                    send_to_server(parsed_data)
                
                time.sleep(1)  # 1초 대기
    except serial.SerialException as e:
        logger.error(f"시리얼 포트 연결 오류: {e}")

if __name__ == "__main__":
    main()
