import React from "react";

const Dashboard = () => {
    return <>
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4">Dashboard</h1>
            <div className="space-y-4">
                <p className="text-md text-gray-700">
                    Niebawem cos sie tutaj pojawi...
                    Prawdopodobnie statystyki zalogowanego pracownika.
                    A takze jego stanowisko i poziom dostepu do poszczegolnych dzialow.
                </p>

                <p className="text-md text-red-700">Serwis w budowie...</p>
            </div>
        </div>
    </>    
}

export default Dashboard;