import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer
} from 'recharts';
import { getAllIssues } from '../api';
import Navbar from '../components/Navbar';

const COLORS = ['#2d6a4f', '#52b788', '#95d5b2', '#d8f3dc', '#e74c3c', '#f39c12'];

const Analytics = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await getAllIssues();
      setIssues(res.data.issues);
    } catch (err) {
      console.error('Failed to fetch issues', err);
    }
    setLoading(false);
  };

  // Process data for charts
  const categoryData = Object.entries(
    issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const statusData = Object.entries(
    issues.reduce((acc, issue) => {
      acc[issue.status] = (acc[issue.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.replace('_', ' '), value }));

  const severityData = Object.entries(
    issues.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Issues over time (by date)
  const timeData = Object.entries(
    issues.reduce((acc, issue) => {
      const date = new Date(issue.created_at).toLocaleDateString('en-IN');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {})
  ).map(([date, count]) => ({ date, count })).slice(-7);

  // Key stats
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const openIssues = issues.filter(i => i.status === 'open').length;
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;
  const totalUpvotes = issues.reduce((sum, i) => sum + i.upvote_count, 0);
  const mostCommonCategory = categoryData.length > 0
    ? categoryData.reduce((a, b) => a.value > b.value ? a : b).name
    : 'N/A';

  if (loading) return (
    <div>
      <Navbar />
      <div style={styles.loading}>Loading analytics...</div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.pageTitle}>📊 City Issue Analytics</h2>

        {/* Key Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{totalIssues}</div>
            <div style={styles.statLabel}>Total Issues</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #dc3545' }}>
            <div style={styles.statNumber}>{openIssues}</div>
            <div style={styles.statLabel}>Open Issues</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #28a745' }}>
            <div style={styles.statNumber}>{resolutionRate}%</div>
            <div style={styles.statLabel}>Resolution Rate</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #ffc107' }}>
            <div style={styles.statNumber}>{totalUpvotes}</div>
            <div style={styles.statLabel}>Total Upvotes</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #17a2b8' }}>
            <div style={styles.statNumber}>{mostCommonCategory}</div>
            <div style={styles.statLabel}>Most Reported</div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div style={styles.chartsRow}>
          {/* Category Pie Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Issues by Category</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Bar Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Issues by Status</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#2d6a4f" name="Issues" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div style={styles.chartsRow}>
          {/* Severity Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Issues by Severity</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Issues">
                  {severityData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.name === 'critical' ? '#dc3545' :
                        entry.name === 'high' ? '#fd7e14' :
                        entry.name === 'moderate' ? '#ffc107' : '#28a745'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Time Line Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Issues Reported Over Time</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2d6a4f"
                  strokeWidth={2}
                  name="Issues"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' },
  loading: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '50vh', fontSize: '18px'
  },
  pageTitle: { color: '#2d6a4f', marginBottom: '24px', fontSize: '24px' },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px', marginBottom: '24px'
  },
  statCard: {
    backgroundColor: 'white', padding: '20px',
    borderRadius: '12px', textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    borderTop: '4px solid #2d6a4f'
  },
  statNumber: { fontSize: '28px', fontWeight: 'bold', color: '#2d6a4f' },
  statLabel: { fontSize: '13px', color: '#666', marginTop: '4px' },
  chartsRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '20px', marginBottom: '20px'
  },
  chartCard: {
    backgroundColor: 'white', padding: '20px',
    borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  chartTitle: { color: '#333', marginBottom: '16px', fontSize: '16px' }
};

export default Analytics;