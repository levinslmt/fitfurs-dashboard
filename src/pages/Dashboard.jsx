import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, PawPrint, CalendarCheck, TrendingUp } from "lucide-react";
import { db } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardAnalytics() {
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let loadedCount = 0;

    // Listen to users collection
    const unsubscribeUsers = onSnapshot(
      query(collection(db, "users")),
      (snapshot) => {
        setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        loadedCount++;
        if (loadedCount >= 3) setLoading(false);
      },
      (error) => {
        console.error("Error loading users:", error);
        loadedCount++;
        if (loadedCount >= 3) setLoading(false);
      }
    );

    // Listen to pets collection
    const unsubscribePets = onSnapshot(
      query(collection(db, "pets")),
      (snapshot) => {
        setPets(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        loadedCount++;
        if (loadedCount >= 3) setLoading(false);
      },
      (error) => {
        console.error("Error loading pets:", error);
        loadedCount++;
        if (loadedCount >= 3) setLoading(false);
      }
    );

    // Listen to appointments collection
    const unsubscribeAppointments = onSnapshot(
      query(collection(db, "appointments")),
      (snapshot) => {
        setAppointments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        loadedCount++;
        if (loadedCount >= 3) setLoading(false);
      },
      (error) => {
        console.error("Error loading appointments:", error);
        loadedCount++;
        if (loadedCount >= 3) setLoading(false);
      }
    );

    return () => {
      unsubscribeUsers();
      unsubscribePets();
      unsubscribeAppointments();
    };
  }, []);

  // Calculate real data from Firestore

  // 1. Appointments by day of week
  const appointmentsByDay = (() => {
    const daysMap = {
      0: "Sun",
      1: "Mon",
      2: "Tue",
      3: "Wed",
      4: "Thu",
      5: "Fri",
      6: "Sat",
    };
    const acc = {};

    appointments.forEach((apt) => {
      if (apt.date) {
        try {
          const date = new Date(apt.date);
          const dayName = daysMap[date.getDay()];
          acc[dayName] = (acc[dayName] || 0) + 1;
        } catch (e) {
          console.error("Invalid date:", apt.date);
        }
      }
    });

    const dayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayOrder.map((day) => ({
      name: day,
      appointments: acc[day] || 0,
    }));
  })();

  // 2. Pet type distribution
  const petTypeData = (() => {
    const types = {};
    pets.forEach((pet) => {
      const type = pet.type || "other";
      types[type] = (types[type] || 0) + 1;
    });

    return Object.entries(types).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  })();

  // 3. Appointment status distribution
  const appointmentStatusData = (() => {
    const statuses = {
      confirmed: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
    };

    appointments.forEach((apt) => {
      const status = apt.status || "pending";
      if (status in statuses) {
        statuses[status]++;
      }
    });

    return Object.entries(statuses).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  })();

  // 4. Appointment trend (last 6 weeks)
  const appointmentTrendData = (() => {
    const weeks = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + 7 * i));
      const weekKey = `Week ${6 - i}`;
      weeks[weekKey] = 0;
    }

    appointments.forEach((apt) => {
      if (apt.date) {
        try {
          const aptDate = new Date(apt.date);
          const weekNum = Math.floor((now - aptDate) / (7 * 24 * 60 * 60 * 1000));
          if (weekNum >= 0 && weekNum < 6) {
            const weekKey = `Week ${6 - weekNum}`;
            if (weekKey in weeks) {
              weeks[weekKey]++;
            }
          }
        } catch (e) {
          console.error("Invalid date for trend:", apt.date);
        }
      }
    });

    return Object.entries(weeks).map(([name, value]) => ({
      name,
      appointments: value,
    }));
  })();

  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending"
  ).length;
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  ).length;

  if (loading) {
    return (
      <Layout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard Overview
        </h1>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Users
              </CardTitle>
              <Users className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-slate-500">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">
                Registered Pets
              </CardTitle>
              <PawPrint className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pets.length}</div>
              <p className="text-xs text-slate-500">Total pets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Appointments
              </CardTitle>
              <CalendarCheck className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-slate-500">{pendingAppointments} pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">
                Completed
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAppointments}</div>
              <p className="text-xs text-slate-500">Appointments completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments by Day */}
          <Card>
            <CardHeader>
              <CardTitle>Appointments by Day</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {appointmentsByDay.some((d) => d.appointments > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={appointmentsByDay}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip cursor={{ fill: "#f1f5f9" }} />
                    <Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300] flex items-center justify-center text-slate-500">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appointment Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Trend</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {appointmentTrendData.some((d) => d.appointments > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={appointmentTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip cursor={{ fill: "#f1f5f9" }} />
                    <Line
                      type="monotone"
                      dataKey="appointments"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300] flex items-center justify-center text-slate-500">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pet Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Pet Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {petTypeData.length > 0 && petTypeData.some((p) => p.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={petTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} (${value})`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {petTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-300 flex items-center justify-center text-slate-500">
                  No pet data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appointment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Status</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {appointmentStatusData.length > 0 && appointmentStatusData.some((a) => a.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appointmentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} (${value})`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {appointmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-300 flex items-center justify-center text-slate-500">
                  No appointment data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
