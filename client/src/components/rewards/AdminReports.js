import React, { useState } from 'react';
import { getTransactionHistory } from '../../services/rewardService';
import { CSVLink } from 'react-csv';

const AdminReports = () => {
  const [reportType, setReportType] = useState('transactions');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    setReportGenerated(false);
  };

  const generateReport = async () => {
    setLoading(true);
    setError('');
    setReportGenerated(false);

    try {
      let data;
      // For this demo, we're just getting transaction history as an example
      // In a real app, you'd have different endpoints for different report types
      data = await getTransactionHistory();
      
      // Filter by date range if provided
      if (dateRange.startDate && dateRange.endDate) {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59); // Set to end of day
        
        data = data.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }

      // Format data based on report type
      if (reportType === 'transactions') {
        setReportData(data.map(transaction => ({
          id: transaction._id,
          date: new Date(transaction.date).toLocaleDateString(),
          studentId: transaction.student,
          type: transaction.type,
          points: transaction.points,
          description: transaction.description,
          originalPrice: transaction.originalPrice || 'N/A',
          discountedPrice: transaction.discountedPrice || 'N/A'
        })));
      } else if (reportType === 'student-summary') {
        // Group transactions by student
        const studentSummaries = {};
        
        data.forEach(transaction => {
          const studentId = transaction.student;
          if (!studentSummaries[studentId]) {
            studentSummaries[studentId] = {
              studentId,
              totalEarned: 0,
              totalSpent: 0,
              currentBalance: 0,
              transactions: 0
            };
          }
          
          if (transaction.type === 'earned') {
            studentSummaries[studentId].totalEarned += transaction.points;
            studentSummaries[studentId].currentBalance += transaction.points;
          } else if (transaction.type === 'spent') {
            studentSummaries[studentId].totalSpent += transaction.points;
            studentSummaries[studentId].currentBalance -= transaction.points;
          }
          
          studentSummaries[studentId].transactions += 1;
        });
        
        setReportData(Object.values(studentSummaries));
      }

      setReportGenerated(true);
      setLoading(false);
    } catch (err) {
      setError('Failed to generate report');
      setLoading(false);
    }
  };

  const getHeaders = () => {
    if (reportType === 'transactions') {
      return [
        { label: 'Transaction ID', key: 'id' },
        { label: 'Date', key: 'date' },
        { label: 'Student ID', key: 'studentId' },
        { label: 'Type', key: 'type' },
        { label: 'Points', key: 'points' },
        { label: 'Description', key: 'description' },
        { label: 'Original Price', key: 'originalPrice' },
        { label: 'Discounted Price', key: 'discountedPrice' }
      ];
    } else if (reportType === 'student-summary') {
      return [
        { label: 'Student ID', key: 'studentId' },
        { label: 'Total Points Earned', key: 'totalEarned' },
        { label: 'Total Points Spent', key: 'totalSpent' },
        { label: 'Current Balance', key: 'currentBalance' },
        { label: 'Total Transactions', key: 'transactions' }
      ];
    }
    return [];
  };

  const getReportFilename = () => {
    const today = new Date().toISOString().slice(0, 10);
    return `${reportType}-report-${today}.csv`;
  };

  return (
    <div className="admin-reports">
      <h3>Generate Reports</h3>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="reportType">Report Type</label>
        <select
          id="reportType"
          value={reportType}
          onChange={handleReportTypeChange}
          className="form-control"
        >
          <option value="transactions">Transaction History</option>
          <option value="student-summary">Student Points Summary</option>
        </select>
      </div>
      
      <div className="date-range">
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            className="form-control"
          />
        </div>
      </div>
      
      <button
        onClick={generateReport}
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Report'}
      </button>
      
      {reportGenerated && reportData.length > 0 && (
        <div className="report-results">
          <h4>Report Results</h4>
          <p>{reportData.length} records found</p>
          
          <CSVLink
            data={reportData}
            headers={getHeaders()}
            filename={getReportFilename()}
            className="btn btn-success"
            target="_blank"
          >
            Download CSV
          </CSVLink>
          
          <div className="report-preview">
            <h5>Preview</h5>
            <table className="table table-striped">
              <thead>
                <tr>
                  {getHeaders().map((header, index) => (
                    <th key={index}>{header.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.slice(0, 5).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {getHeaders().map((header, colIndex) => (
                      <td key={colIndex}>{row[header.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {reportData.length > 5 && (
              <p>Showing 5 of {reportData.length} records</p>
            )}
          </div>
        </div>
      )}
      
      {reportGenerated && reportData.length === 0 && (
        <div className="alert alert-info mt-3">
          No data found for the selected criteria
        </div>
      )}
    </div>
  );
};

export default AdminReports; 