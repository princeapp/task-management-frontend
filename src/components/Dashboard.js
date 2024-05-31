import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchTasks(filterDate); // Fetch tasks initially without filter
    fetchCategories();
  }, [filterDate]); // Include filterDate in dependency array to refetch tasks when it changes

  const fetchTasks = async (filterDate) => {
    try {
      let url = '/task';
      if (filterDate) {
        // Append filterDate as query parameter if present
        url += `?date=${filterDate}`;
      }
      const response = await api.get(url);
      setTasks(response.data.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  const groupTasksByCategory = () => {
    const grouped = categories.reduce((acc, category) => {
      acc[category.id] = {
        name: category.name,
        tasks: [],
      };
      return acc;
    }, {});

    tasks.forEach((task) => {
      const category = task.category_id;
      if (grouped[category]) {
        grouped[category].tasks.push(task);
      } else {
        if (!grouped["Uncategorized"]) {
          grouped["Uncategorized"] = {
            name: "Uncategorized",
            tasks: [],
          };
        }
        grouped["Uncategorized"].tasks.push(task);
      }
    });

    return grouped;
  };

  const groupedTasks = groupTasksByCategory();

  const handleDateFilterChange = (e) => {
    setFilterDate(e.target.value);
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="date-filter">
        <label>Date Filter:</label>
        <input type="date" value={filterDate} onChange={handleDateFilterChange} />
      </div>
      {error && <p className="error">{error}</p>}
      <div className="task-groups">
        {Object.keys(groupedTasks).map((categoryId) => (
          <div key={categoryId} className="task-group">
            
            {groupedTasks[categoryId].tasks.length > 0 && (
              <>
              <h3>{groupedTasks[categoryId].name}</h3>
              <table className="task-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedTasks[categoryId].tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>{task.priority}</td>
                      <td>{task.due_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
