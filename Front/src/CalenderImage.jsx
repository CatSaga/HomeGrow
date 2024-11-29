import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CalendarImage() {
    const [date, setDate] = useState('');
    const [file, setFile] = useState(null);
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    // 이미지 목록을 불러오는 함수
    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/images/');
            setImages(response.data);
        } catch (error) {
            console.error('Error loading images:', error);
        }
    };

    // 이미지 업로드 함수
    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('date', date);
        formData.append('image', file);

        try {
            await axios.post('http://127.0.0.1:8000/api/images/', formData);
            loadImages();
            setDate('');
            setFile(null);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    // 선택된 날짜에 해당하는 이미지를 불러오는 함수
    const handleViewImages = async (selectedDate) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/images/?date=${selectedDate}`);
            setSelectedImages(response.data);
        } catch (error) {
            console.error('Error loading images for date:', error);
        }
    };

    // 이미지 삭제 함수
    const handleDeleteImage = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/images/${id}/`);
            loadImages();
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    return (
        <div className="space-y-5 size-box">
            <h2 className="text-3xl font-bold text-white dark:text-white mt-10 text-center">Calendar Images</h2>

            {/* 이미지 업로드 폼 */}
            <form onSubmit={handleUpload} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3"> {/* 3개의 열로 분리 */}
                    
                    {/* 캘린더 상자 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 text-center">Upload Image to Calendar</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* 파일 업로드 상자 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
			<h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 text-center">Select File</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                accept="image/*"
                                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* 업로드 버튼 상자 */}
                    <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"> {/* 업로드 버튼만 포함 */}
                        <button
                            type="submit"
                            className="px-40 py-8 bg-blue-500 hover:bg-blue-600 text-white font-medium text-2xl rounded-md transition-colors duration-300"
                        >
                            Upload
                        </button>
                    </div>
                    
                </div>
            </form>

            {/* 이미지 목록 카드 그리드 */}
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 text-center">Uploaded Images</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> {/* 그리드로 3개씩 배치 */}
        {images.map((image) => (
            <div key={image.id} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
                <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Date:</strong> {image.date}</p>
                <div className="flex justify-between">
                    <button
                        onClick={() => handleViewImages(image.date)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-300"
                    >
                        View Images
                    </button>
                    <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors duration-300 ml-2"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ))}
    </div>
</div>


            {/* 선택된 날짜에 대한 이미지 표시 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 text-center">Images for Selected Date</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedImages.map((img) => (
                        <img
                            key={img.id}
                            src={`data:image/jpeg;base64,${img.image}`}
                            alt={`Image for ${img.date}`}
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

