import { Space, Text } from '@enterslash/react-ui';
import { UserData } from '../data/data';
import DashboardLayout from '../layout/dashbaord';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Tooltip,
  Line,
} from 'recharts';
import { DashCard } from '../components/DashCard';
import { useHttp } from '../hook/useHttp';
import { DashboardDataDTO, UserType } from '@enterslash/enterus/types';
import { get_dashboard_data } from '@enterslash/enterus/http-client';
import { useEffect, useState } from 'react';
import { checkAccess } from '../utils/checkAccess';
import { ICON } from '@enterslash/react-icons';

export function Index() {
  const isProvider = checkAccess(UserType.PROVIDER);
  const [dashboard, setDashboard] = useState<DashboardDataDTO>();
  const { request: requestDashboard } = useHttp<DashboardDataDTO>(() => {
    return get_dashboard_data();
  });

  useEffect(() => {
    requestDashboard().then((data) => {
      if (data) {
        setDashboard(data);
      }
    });
  }, []);

  return (
    <DashboardLayout>
      <Text size="sectionTitle">Dashboard</Text>
      <Space height={10} />
      <div className={`grid grid-cols-1 ${isProvider ? "md:grid-cols-2" : "md:grid-cols-3"} gap-2`}>
        <DashCard
          title="Total Booking"
          meddleTitle={` ${
            dashboard?.totalBookings ? dashboard?.totalBookings : '00'
          }`}
        />
        <DashCard
          title="Total Earning"
          meddleTitle={dashboard?.totalEarnings?.toString() || '00'}
        />
        {!isProvider && (
          <DashCard
            title="New Users"
            meddleTitle={dashboard?.totalUser?.toString() || '0'}
          />
        )}
      </div>

      <div className="chart mt-20 grid grid-cols-1 md:grid-cols-2">
        <div className="bardChart w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={200}
              data={dashboard?.bookingsByDay}
              syncId="anyId"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalBookings"
                name="Total Booking"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="paiChart w-full   h-96">
          {/* <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={UserData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />

              <Legend />
              <Bar dataKey="pv" fill="#82ca9d" />
              <Bar dataKey="uv" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer> */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={200}
              data={dashboard?.bookingsByDay}
              syncId="anyId"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="earningsForDay"
                name="Total Earnings"
                stroke="#82c"
                fill="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Index;
