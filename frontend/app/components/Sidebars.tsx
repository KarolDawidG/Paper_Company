import Link from 'next/link';
import { FaShoppingCart, FaWarehouse, FaRegMoneyBillAlt, FaUserTie, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import { FiCompass } from 'react-icons/fi'; 
import { useRouter } from 'next/router';
import React from 'react';

export const Sidebars = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const isActive = (path:any) => router.pathname === path;
    return (
        <div>
            <div>
                <div>
                    
                    <Link href='/dashboard'>
                        <div title="Dashboard" className={`icon-container p-3 rounded-lg cursor-pointer ${isActive('/dashboard') ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'}`}>
                            <FiCompass size={isActive('/dashboard') ? 26 : 18}/>
                        </div>
                    </Link>

                    <Link href='/sales-and-orders'>
                    <div title="Sales and Orders" className={`icon-container p-3 rounded-lg cursor-pointer ${isActive('/sales-and-orders') ? 'bg-yellow-500 text-white' : 'bg-indigo-700 text-white'}`}>
                            <FaShoppingCart size={isActive('/sales-and-orders') ? 26 : 18}/>
                        </div>
                    </Link>

                    <Link href='/warehouse'>
                        <div title="Warehouse" className={`icon-container p-3 rounded-lg cursor-pointer ${isActive('/warehouse') ? 'bg-yellow-500 text-white' : 'bg-blue-700 text-white'}`}>                           
                        <FaWarehouse size={isActive('/warehouse') ? 26 : 18}/>
                        </div>
                    </Link>
                    
                    <Link href='/accounting'>
                        <div title="Accountingders" className={`icon-container p-3 rounded-lg cursor-pointer ${isActive('/accounting') ? 'bg-yellow-500 text-white' : 'bg-blue-400 text-white'}`}>                         
                        <FaRegMoneyBillAlt size={isActive('/accounting') ? 26 : 18}/>
                        </div>
                    </Link>

                    <Link href='/human-resources'>
                        <div title="Human Resources" className={`icon-container p-3 rounded-lg cursor-pointer ${isActive('/human-resources') ? 'bg-yellow-500 text-white' : 'bg-yellow-700 text-white'}`}>
                            <FaUserTie size={isActive('/human-resources') ? 26 : 18}/>
                        </div>
                    </Link>

                    <Link href='/data-analysis'>
                        <div title="Data Analysis" className={`icon-container p-3 rounded-lg cursor-pointer ${isActive('/data-analysis') ? 'bg-yellow-500 text-white' : 'bg-red-700 text-white'}`}>
                            <FaChartLine size={isActive('/data-analysis') ? 26 : 18}/>
                        </div>
                    </Link>

                    <Link href='/security'>
                        <div title="Security" className={`icon-container p-3 rounded-lg cursor-pointer ${isActive('/security') ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-white'}`}>
                            <FaShieldAlt size={isActive('/security') ? 26 : 18}/>
                        </div>
                    </Link>
                    
                </div>
            </div>
            <main className='ml-20 w-full'>{children}</main>
        </div>
    )
}