import React, { useState } from "react"; 
import PendingRequests from "../rewards/PendingRequests"; 
import AdminTransactionHistory from "../rewards/AdminTransactionHistory"; 
import AdminReports from "../rewards/AdminReports"; 

const AdminDashboard = ({ user }) => { 
  const [activeTab, setActiveTab] = useState("profile"); 
  
  return ( 
    <div className="admin-dashboard"> 
      <div className="dashboard-header"> 
        <h2>Admin Dashboard</h2> 
        <span className="admin-badge">Administrator</span> 
      </div> 
      
      <div className="dashboard-tabs"> 
        <button 
          className={`tab-button ${activeTab === "profile" ? "active" : ""}`} 
          onClick={() => setActiveTab("profile")}
        > 
          Profile 
        </button> 
        <button 
          className={`tab-button ${activeTab === "pending" ? "active" : ""}`} 
          onClick={() => setActiveTab("pending")}
        > 
          Pending Requests 
        </button> 
        <button 
          className={`tab-button ${activeTab === "transactions" ? "active" : ""}`} 
          onClick={() => setActiveTab("transactions")}
        > 
          Transaction History 
        </button> 
        <button 
          className={`tab-button ${activeTab === "reports" ? "active" : ""}`} 
          onClick={() => setActiveTab("reports")}
        > 
          Reports 
        </button> 
      </div> 
      
      <div className="dashboard-content"> 
        {activeTab === "profile" && ( 
          <div className="profile-section"> 
            <h3>Admin Profile</h3> 
            <p><strong>Name:</strong> {user.name}</p> 
            <p><strong>Email:</strong> {user.email}</p> 
            <p><strong>Role:</strong> {user.role}</p> 
            <p><strong>Joined:</strong> {new Date(user.date).toLocaleDateString()}</p> 
          </div> 
        )} 
        
        {activeTab === "pending" && ( 
          <div className="pending-section"> 
            <h3>Pending Reward Requests</h3> 
            <PendingRequests /> 
          </div> 
        )} 
        
        {activeTab === "transactions" && ( 
          <div className="transactions-section"> 
            <h3>All Transaction History</h3> 
            <AdminTransactionHistory /> 
          </div> 
        )} 
        
        {activeTab === "reports" && ( 
          <div className="reports-section"> 
            <h3>Reports & Analytics</h3> 
            <AdminReports /> 
          </div> 
        )} 
      </div> 
    </div> 
  ); 
}; 

export default AdminDashboard;
