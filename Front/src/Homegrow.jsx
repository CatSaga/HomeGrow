import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Homegrow() {
    const [sensorData, setSensorData] = useState({
        temperature: 'N/A',
        humidity: 'N/A',
        light: 'N/A',
    });

    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/sensor_data/');
                setSensorData(response.data);
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            }
        };

        fetchSensorData();
        const interval = setInterval(fetchSensorData, 5000); // 5초마다 데이터 갱신

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center space-y-6 mt-10 text-center">
            <h1 className="text-5xl font-bold text-white dark:text-white">HomeGrow System Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20 text-center">
                <SensorCard
                    title="Temperature"
                    value={`${sensorData.temperature}°C`}
                    icon="🌡️"
                    className="w-40 h-40 mx-auto flex flex-col items-center justify-center"
                />
                <SensorCard
                    title="Humidity"
                    value={`${sensorData.humidity}%`}
                    icon="💧"
                    className="w-40 h-40 mx-auto flex flex-col items-center justify-center"
                />
                <SensorCard
                    title="Light"
                    value={`${sensorData.light_percentage}%`}
                    icon="☀️"
                    className="w-40 h-40 mx-auto flex flex-col items-center justify-center"
                />
            </div>
        </div>
    );
}

function SensorCard({ title, value, icon, className }) {
    return (
        <div className={`sensor-card ${className}`}>
            <div className="flex flex-col items-center justify-center h-full">
                <span className="text-4xl">{icon}</span>
                <h2 className="text-xl font-bold mt-2">{title}</h2>
                <p className="text-3xl font-bold text-blue-500">{value}</p> {/* 텍스트 크기 증가 */}
            </div>
        </div>
    );
}




