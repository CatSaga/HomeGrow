import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import AboutUs from './AboutUs'; // 파일 이름과 경로 확인
import Homegrow from './Homegrow';
import CalendarImage from "./CalenderImage";// Homegrow 컴포넌트 추가
import ControlMode from "./ControlMode";

ReactDOM.render(
    <React.StrictMode>
        <AboutUs />
        <Homegrow />
        <CalendarImage />
        <ControlMode />
    </React.StrictMode>,
    document.getElementById('root')
);
