import React, { useEffect, useState } from 'react';
import useTranslation from "../../language/useTranslation";
import LinearProgress from "@mui/material/LinearProgress";
import axios from 'axios';
import { User, UserData } from './UsersTable/TableInterfaces';
import CustomTable from './Table';

const AuthorizedViewSecurity = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  const [data, setData] = useState<User[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<UserData>('http://localhost:3001/users');
        setData(response.data.usersList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!t.security) {
    return <LinearProgress />;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        <p>This view is only for admin</p>
        <CustomTable data={data} />
      </h1>
    </div>
  );
};

export default AuthorizedViewSecurity;
