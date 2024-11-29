import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ControlMode() {
    const [mode, setMode] = useState('manual');
    const [fanState, setFanState] = useState(false);
    const [pumpState, setPumpState] = useState(false);
    const [switchState, setSwitchState] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInitialStates();
    }, []);

    const fetchInitialStates = async () => {
        try {
            const [modeRes, fanRes, pumpRes, switchRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/control-mode/'),
                axios.get('http://127.0.0.1:8000/api/fan-control/'),
                axios.get('http://127.0.0.1:8000/api/pump-control/'),
                axios.get('http://127.0.0.1:8000/api/switch-control/')
            ]);

            setMode(modeRes.data.is_auto ? 'auto' : 'manual');
            setFanState(fanRes.data.state);
            setPumpState(pumpRes.data.state);
            setSwitchState(switchRes.data.state);
        } catch (error) {
            setError('Failed to fetch initial states');
        }
    };

    const toggleMode = async () => {
        const newMode = mode === 'manual' ? 'auto' : 'manual';
        try {
            await axios.post('http://127.0.0.1:8000/api/control-mode/set_mode/', { is_auto: newMode === 'auto' });
            setMode(newMode);
            setError(null);
        } catch (error) {
            setError('Failed to update mode');
        }
    };

    const toggleControl = async (controlType, currentState, setStateFunction) => {
        try {
            const command = currentState ? 0 : 1;
            await axios.post(`http://127.0.0.1:8000/api/${controlType}-control/`, { command });
            setStateFunction(!currentState);
            setError(null);
        } catch (error) {
            setError(`Failed to update ${controlType} state`);
        }
    };

    return (
    <div className="space-y-6 text-center flex flex-col items-center">
        <h2 className="text-4xl font-bold text-white dark:text-white mt-5">System Control Panel</h2>
        <div className="grid gap-40 md:grid-cols-2 lg:grid-cols-4 justify-items-center"> {/* justify-items-center로 중앙 정렬 */}
            <ControlCard title="Mode Control" state={mode} toggleFunction={toggleMode} buttonText={`Switch to ${mode === 'manual' ? 'Auto' : 'Manual'}`} />
            <ControlCard title="Fan Control" state={fanState} toggleFunction={() => toggleControl('fan', fanState, setFanState)} buttonText={`Fan ${fanState ? 'Off' : 'On'}`} />
            <ControlCard title="Pump Control" state={pumpState} toggleFunction={() => toggleControl('pump', pumpState, setPumpState)} buttonText={`Pump ${pumpState ? 'Off' : 'On'}`} />
            <ControlCard title="LED Control" state={switchState} toggleFunction={() => toggleControl('switch', switchState, setSwitchState)} buttonText={`LED ${switchState ? 'Off' : 'On'}`} />
        </div>
        {error && <p className="text-red-500">{error}</p>}
    </div>
);
	





}

function ControlCard({ title, state, toggleFunction, buttonText }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96 h-50 transition-all duration-300 hover:shadow-xl flex flex-col items-center justify-center">
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">{title}</h3>
            <button
                onClick={toggleFunction}
                className={`w-full py-8 px-6 text-xl rounded-md font-medium transition-colors duration-300 ${
                    state
                        ? 'bg-gray-700 hover:bg-gray-300 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
                }`}
            >
                {buttonText}
            </button>
        </div>
    );
}







