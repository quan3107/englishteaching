import React from 'react';
import './styles/DashboardOverview.css';
import { useAuth } from '../Routes/Auth'; // Assuming AuthContext provides user data

// Placeholder icons (you can use SVGs or an icon library like react-icons)
const BookIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"></path></svg>;
const AssignmentIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z"></path><path d="M12 11.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm0 3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM10 8h4v2h-4z"></path></svg>;
const ChartIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path><path d="M7 10h2v7H7zm4 0h2v7h-2zm4-3h2v10h-2z"></path></svg>;
const BellIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></svg>;


function DashboardOverview() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || user?.lastname || 'Student';

  // Dummy data - replace with actual data from your backend or state
  const stats = [
    { id: 1, title: 'Courses Enrolled', value: '5', icon: <BookIcon />, trend: '+1 this month' },
    { id: 2, title: 'Assignments Due', value: '3', icon: <AssignmentIcon />, trend: '2 in next 7 days' },
    { id: 3, title: 'Overall Progress', value: '75%', icon: <ChartIcon />, trend: '+5% this week' },
    { id: 4, title: 'Notifications', value: '2', icon: <BellIcon />, trend: '1 unread' },
  ];

  const recentActivities = [
    { id: 1, text: 'New grade posted for "Speaking 2.3".', time: '2 hours ago', type: 'grade' },
    { id: 2, text: 'Assignment "Listening TPO 11 task 2" deadline is tomorrow.', time: '1 day ago', type: 'deadline' },
    { id: 3, text: 'Welcome to "IELTS Writing" ', time: '3 days ago', type: 'course' },
  ];

  return (
    <div className="dashboard-overview">
      <header className="overview-header">
        <h2>Welcome back, {firstName}!</h2>
        <p>Here's what's happening with your courses today.</p>
      </header>

      <section className="stats-grid">
        {stats.map(stat => (
          <div key={stat.id} className="stat-card">
            <div className="stat-card-icon">{stat.icon}</div>
            <div className="stat-card-info">
              <h4>{stat.title}</h4>
              <p className="stat-value">{stat.value}</p>
              {stat.trend && <p className="stat-trend">{stat.trend}</p>}
            </div>
          </div>
        ))}
      </section>

      <section className="main-content-area">
        <div className="chart-container card">
          <h3>Your Learning Activity</h3>
          {/* Placeholder for a chart component */}
          <div className="chart-placeholder">
            <ChartIcon />
            <p>Learning activity chart will be displayed here.</p>
            <p>(e.g., hours spent, modules completed over time)</p>
          </div>
        </div>

        <div className="recent-activity card">
          <h3>Recent Activity & Announcements</h3>
          <ul>
            {recentActivities.map(activity => (
              <li key={activity.id} className={`activity-item activity-${activity.type}`}>
                <div className="activity-icon">
                  {activity.type === 'grade' && <ChartIcon />}
                  {activity.type === 'deadline' && <AssignmentIcon />}
                  {activity.type === 'course' && <BookIcon />}
                </div>
                <div className="activity-details">
                  <p>{activity.text}</p>
                  <small>{activity.time}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default DashboardOverview;
