const API_URL = import.meta.env.VITE_API_URL || 'https://react-with-fake-api.onrender.com/api';

class AdminService {
  async getDashboardStats() {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.stats;
  }

  async getUserActivity() {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/admin/activity`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  }

  async getSystemLogs(limit = 50) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/admin/logs?limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.logs;
  }
}

export default new AdminService();
