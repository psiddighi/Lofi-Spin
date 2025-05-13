// Utility functions for the Lofi Beats App

/**
 * Get the local IP address of the machine
 * This allows the app to be accessible from other devices on the same network
 * @returns {string} The local IP address
 */
function getLocalIpAddress() {
  const { networkInterfaces } = require('os');
  
  const nets = networkInterfaces();
  const results = {};

  // Look through all network interfaces
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (loopback) addresses
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  // Find a suitable IP address (prefer en0 for macOS)
  let ipAddress = '0.0.0.0'; // Default fallback
  
  // First try to find en0 (common on macOS for WiFi)
  if (results['en0'] && results['en0'].length > 0) {
    ipAddress = results['en0'][0];
  } 
  // Then try other common interfaces
  else if (results['eth0'] && results['eth0'].length > 0) {
    ipAddress = results['eth0'][0];
  } else if (results['wlan0'] && results['wlan0'].length > 0) {
    ipAddress = results['wlan0'][0];
  } else {
    // Just use the first available non-internal IPv4 address
    for (const iface of Object.values(results)) {
      if (iface && iface.length > 0) {
        ipAddress = iface[0];
        break;
      }
    }
  }
  
  return ipAddress;
}

module.exports = {
  getLocalIpAddress
};