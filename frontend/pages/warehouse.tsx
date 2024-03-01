import React from "react";

const Warehouse = () => {
    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4">Zarządzanie Magazynem</h1>
            <div className="space-y-4">
                <p className="text-md text-gray-700">
                    System zarządzania magazynem umożliwia dokładne monitorowanie poziomów zapasów oraz generowanie alertów w przypadku niskiego stanu magazynowego lub zbliżających się terminów ważności produktów.
                </p>
                <p className="text-md text-gray-700">
                    Efektywne zarządzanie miejscami składowania produktów zapewnia optymalne wykorzystanie dostępnej przestrzeni magazynowej oraz ułatwia szybkie lokalizowanie i dostęp do potrzebnych towarów.
                </p>
                <p className="text-md text-gray-700">
                    Nasze rozwiązania w zakresie logistyki wewnętrznej skupiają się na optymalizacji rozmieszczenia towarów w magazynie, co przyczynia się do zwiększenia efektywności procesów składowania i kompletacji zamówień.
                </p>
                <p className="text-md text-red-700">Serwis w budowie...</p>
            </div>
        </div>
    );
} 

export default Warehouse