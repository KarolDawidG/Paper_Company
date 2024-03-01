import React, { useState, useEffect } from "react";
import axiosInstance from '../app/api/axiosInstance'; 

interface UserData {
    username: string;
    email: string;
    role: string;
    created_at: string,
  }
  
const Dashboard = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
  

    useEffect(() => {
        const idUser = localStorage.getItem('idUser');

        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(`/users/${idUser}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Nie udało się pobrać danych użytkownika:', error);
            }
        };

        fetchUserData();
    }, []);
    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4">Dashboard</h1>
            {userData && (
                <div className="space-y-4">
                    <p>Dane użytkownika:</p>
                    <ul>
                        <li>Username: {userData.username}</li>
                        <li>E-mail: {userData.email}</li>
                        <li>User role: {userData.role}</li>
                        <li>Account creation date:: {formatDate(userData.created_at)}</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
