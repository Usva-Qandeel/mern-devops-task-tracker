import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [frontendMetrics, setFrontendMetrics] = useState({});
  const [perfData, setPerfData] = useState({});
  const startTime = useRef(Date.now());

  // Collect frontend performance metrics
  useEffect(() => {
    // Page load metrics
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    
    // Memory usage (if supported)
    const memoryInfo = window.performance.memory ? {
      usedJSHeapSize: (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
      totalJSHeapSize: (window.performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
      jsHeapSizeLimit: (window.performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + ' MB'
    } : {};

    // Network info
    const connectionInfo = navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink + ' Mbps',
      rtt: navigator.connection.rtt + ' ms'
    } : {};

    const metrics = {
      appUptime: Math.floor((Date.now() - startTime.current) / 1000) + ' seconds',
      pageLoadTime: loadTime + ' ms',
      currentCount: count,
      totalClicks: count + Math.abs(count), // rough estimate
      screenResolution: `${window.screen.width} x ${window.screen.height}`,
      userAgent: navigator.userAgent.substring(0, 50) + '...',
      timestamp: new Date().toLocaleTimeString(),
      ...memoryInfo,
      ...connectionInfo
    };

    setFrontendMetrics(metrics);
    setPerfData({
      loadTime,
      memoryUsed: window.performance.memory?.usedJSHeapSize || 0
    });

  }, [count]);

  const increase = () => setCount(count + 1);
  const decrease = () => setCount(count - 1);
  const reset = () => setCount(0);

  // Calculate performance score
  const getPerformanceScore = () => {
    if (!perfData.loadTime) return 'Calculating...';
    
    let score = 100;
    if (perfData.loadTime > 3000) score -= 30;
    else if (perfData.loadTime > 2000) score -= 20;
    else if (perfData.loadTime > 1000) score -= 10;
    
    if (perfData.memoryUsed > 50 * 1024 * 1024) score -= 20; // >50MB
    else if (perfData.memoryUsed > 30 * 1024 * 1024) score -= 10; // >30MB
    
    return score + '/100';
  };

  const openLocalPrometheus = () => {
    // Simulated Prometheus metrics display
    const prometheusMetrics = `
# HELP frontend_counter_total Total counter value
# TYPE frontend_counter_total gauge
frontend_counter_total ${count}

# HELP frontend_clicks_total Total button clicks
# TYPE frontend_clicks_total counter
frontend_clicks_total ${count + Math.abs(count)}

# HELP frontend_performance_score Frontend performance score
# TYPE frontend_performance_score gauge
frontend_performance_score ${getPerformanceScore().split('/')[0] || 85}

# HELP page_load_time_ms Page load time in milliseconds
# TYPE page_load_time_ms gauge
page_load_time_ms ${perfData.loadTime || 0}
    `;
    
    alert('Prometheus Metrics (Simulated):\n\n' + prometheusMetrics);
  };

  const openLocalGrafana = () => {
    // Simulated Grafana dashboard
    const dashboardData = {
      dashboardTitle: "Frontend Monitoring Dashboard",
      panels: [
        {
          title: "Counter Value",
          value: count,
          type: "gauge",
          max: 100,
          min: -100
        },
        {
          title: "Performance Score",
          value: parseInt(getPerformanceScore()),
          type: "stat"
        },
        {
          title: "Page Load Time",
          value: perfData.loadTime,
          unit: "ms",
          type: "timeseries"
        }
      ]
    };
    
    alert('Grafana Dashboard (Simulated):\n\n' + JSON.stringify(dashboardData, null, 2));
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      marginTop: '30px', 
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#2c3e50' }}>🎯 DevOps Frontend Monitoring Demo</h1>
      <p style={{ color: '#7f8c8d' }}>Frontend-only Observability & Performance Monitoring</p>
      
      {/* Counter Section */}
      <div style={{ 
        backgroundColor: '#ecf0f1', 
        padding: '40px', 
        borderRadius: '15px',
        margin: '30px 0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          fontSize: '100px', 
          fontWeight: 'bold',
          color: count > 0 ? '#27ae60' : count < 0 ? '#e74c3c' : '#34495e'
        }}>
          {count}
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <button onClick={decrease} style={{ 
            fontSize: '20px', 
            padding: '15px 30px', 
            margin: '10px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            ➖ Decrease
          </button>
          
          <button onClick={reset} style={{ 
            fontSize: '20px', 
            padding: '15px 30px', 
            margin: '10px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            🔄 Reset
          </button>
          
          <button onClick={increase} style={{ 
            fontSize: '20px', 
            padding: '15px 30px', 
            margin: '10px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            ➕ Increase
          </button>
        </div>
      </div>

      {/* Monitoring Dashboard */}
      <div style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '25px',
        borderRadius: '15px',
        marginTop: '30px',
        textAlign: 'left'
      }}>
        <h2 style={{ marginTop: '0', color: '#ecf0f1' }}>📊 Frontend Monitoring Dashboard</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <MetricCard 
            title="Performance Score" 
            value={getPerformanceScore()} 
            color="#9b59b6"
          />
          <MetricCard 
            title="Page Load Time" 
            value={(perfData.loadTime || 0) + ' ms'} 
            color="#3498db"
          />
          <MetricCard 
            title="App Uptime" 
            value={frontendMetrics.appUptime || '0 seconds'} 
            color="#1abc9c"
          />
          <MetricCard 
            title="Screen Resolution" 
            value={frontendMetrics.screenResolution || 'Unknown'} 
            color="#e67e22"
          />
        </div>
        
        <div style={{ marginTop: '30px', backgroundColor: '#34495e', padding: '20px', borderRadius: '10px' }}>
          <h3>📈 Real-time Metrics</h3>
          <pre style={{ 
            backgroundColor: '#1a252f', 
            padding: '15px', 
            borderRadius: '8px',
            overflowX: 'auto',
            fontSize: '14px'
          }}>
            {JSON.stringify(frontendMetrics, null, 2)}
          </pre>
        </div>
      </div>

      {/* Monitoring Tools Buttons */}
      <div style={{ marginTop: '30px' }}>
        <h3>🔧 Monitoring Tools (Simulated)</h3>
        <div>
          <button onClick={openLocalPrometheus} style={{ 
            padding: '12px 25px', 
            margin: '10px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            📊 View Prometheus Metrics
          </button>
          
          <button onClick={openLocalGrafana} style={{ 
            padding: '12px 25px', 
            margin: '10px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            📈 Open Grafana Dashboard
          </button>
        </div>
        
        <p style={{ color: '#7f8c8d', fontSize: '14px', marginTop: '20px' }}>
          <strong>Demo Note:</strong> This is frontend-only monitoring simulation. 
          In real setup, Prometheus (port 9090) and Grafana (port 3001) would run separately.
        </p>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, color }) {
  return (
    <div style={{
      backgroundColor: color,
      padding: '20px',
      borderRadius: '10px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '14px', opacity: 0.9 }}>{title}</div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>{value}</div>
    </div>
  );
}

export default App;