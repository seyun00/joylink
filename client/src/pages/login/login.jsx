import React from "react";
import { Link } from "react-router-dom";
import { supabase } from '../../App';
import { useState } from 'react';

export default function Login() {
    const [testData, setTestData] = useState(null);

    // 구글 로그인 처리
    const handleGoogleLogin = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {}
            });
            if (error) throw error;
            console.log("Google Login Data:", data);
        } catch (error) {
            console.error('Google Login Error:', error);
        }
    };

    // 테스트 요청 처리
    const handleTest1 = async () => {
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'GET'
            });
            const data = await response.json(); // JSON 형태로 데이터 변환
            setTestData(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // 일반 로그인 처리 (아직 기능 구현 필요)
    const handleLogin = () => {
        console.log('Login button clicked');
        // 여기에 로그인 로직 추가
    };

    // 회원가입 처리 (아직 기능 구현 필요)
    const handleSignUp = () => {
        console.log('Sign Up button clicked');
        // 여기에 회원가입 로직 추가
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className='boxGroup'>
                <div className="loginBox bg-gray-100 p-4 rounded-lg">
                    <div className="inputBox mb-4">
                        <input type="text" className="inputField w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:border-blue-500" placeholder="아이디" />
                        <input type="password" className="inputField w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:border-blue-500 mt-2" placeholder="비밀번호" />
                    </div>
                    <button className="loginButton bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full" onClick={handleLogin}>로그인</button>
                </div>
                <div className="findBox mt-4 text-center">
                    <button id='findId' className="text-blue-500 hover:underline">아이디/비밀번호 찾기</button>
                    <h5 className="mt-2">계정이 없으신가요?</h5>
                    <div className="flex justify-center mt-4">
                        <button onClick={handleGoogleLogin} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2">구글로그인</button>
                        <button onClick={handleTest1} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">TEST Button</button>
                        <button id='join' onClick={handleSignUp} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">회원가입</button>
                    </div>
                </div>
            </div>
            <div>
                {testData && (
                    <div>
                        <h3>받아온 데이터:</h3>
                        <p>Text: {testData[0].text}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
