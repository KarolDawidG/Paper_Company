import React from "react";
import useTranslation from '../app/components/language/useTranslation';

const SalesAndOrders = () => {
    const currentLocale = localStorage.getItem('locale') || 'en';
    const t = useTranslation(currentLocale);
    
    if (!t.sales_and_orders) {
        return <div>Loading translations...</div>;
      }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4">{t.sales_and_orders.title}</h1>
            <div className="space-y-4">
                <p className="text-md text-gray-700">{t.sales_and_orders.intro}</p>
                <p className="text-md text-gray-700">{t.sales_and_orders.protocols}</p>
                <p className="text-md text-gray-700">{t.sales_and_orders.tools}</p>
                <p className="text-md text-gray-700">{t.sales_and_orders.tools2}</p>
                <p className="text-md text-red-700">{t.sales_and_orders.warning}</p>
            </div>
        </div>
    );
};

export default SalesAndOrders;
