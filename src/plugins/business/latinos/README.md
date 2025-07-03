# Latinos Trading Bot System

An automated trading platform with bot functionality for stock market operations, integrated with a Python FastAPI microservice for real-time trading execution.

## Overview

The Latinos plugin provides:
- Trading bot management and configuration
- Real-time market data integration
- Automated trading strategy execution
- Performance analytics and monitoring
- Connection debugging and troubleshooting tools

## Architecture

The system consists of two main components:

1. **Payload CMS Plugin** (this codebase) - Provides the web interface, bot management, and data persistence
2. **Python FastAPI Microservice** - Handles real-time trading execution, market data, and bot logic

## Connection Troubleshooting

### Common Connection Issues

The Latinos Trading Bot System relies on a stable connection to the Python FastAPI microservice. Here are common issues and their solutions:

#### 1. Connection Refused (ECONNREFUSED)

**Symptoms:**
- Error: "Connection refused" or "ECONNREFUSED"
- Debug panel shows "Disconnected" status
- All endpoint tests fail

**Possible Causes:**
- Python FastAPI microservice is not running
- Wrong port number configured
- Microservice crashed or failed to start
- Port is blocked by firewall

**Troubleshooting Steps:**
1. **Check if the microservice is running:**
   ```bash
   # Check if process is running
   ps aux | grep python
   
   # Check if port is in use
   netstat -tlnp | grep 8000
   lsof -i :8000
   ```

2. **Start the Python FastAPI microservice:**
   ```bash
   # Navigate to your microservice directory
   cd /path/to/your/trading-microservice
   
   # Start the service (example commands)
   python main.py
   # or
   uvicorn main:app --host 0.0.0.0 --port 8000
   # or
   docker-compose up trading-service
   ```

3. **Verify the correct port in configuration:**
   - Check `BOT_MICROSERVICE_URL` in your `.env` file
   - Default: `http://localhost:8000`

4. **Test manually with curl:**
   ```bash
   curl http://localhost:8000/api/health
   ```

#### 2. Connection Timeout

**Symptoms:**
- Error: "Request timeout after Xms"
- Slow response times in debug panel
- Intermittent connection failures

**Possible Causes:**
- Microservice is overloaded
- Network latency issues
- Timeout setting too low
- Microservice is processing heavy operations

**Troubleshooting Steps:**
1. **Increase timeout setting:**
   ```env
   BOT_MICROSERVICE_TIMEOUT=30000  # 30 seconds
   ```

2. **Check microservice performance:**
   ```bash
   # Monitor CPU and memory usage
   top -p $(pgrep -f "python.*main")
   
   # Check microservice logs
   tail -f /path/to/microservice/logs/app.log
   ```

3. **Test network connectivity:**
   ```bash
   ping localhost
   traceroute localhost
   ```

#### 3. DNS Resolution Failed (ENOTFOUND)

**Symptoms:**
- Error: "getaddrinfo ENOTFOUND" or "ENOTFOUND"
- Cannot resolve hostname

**Possible Causes:**
- Invalid hostname in configuration
- DNS server issues
- Network connectivity problems

**Troubleshooting Steps:**
1. **Use IP address instead of hostname:**
   ```env
   BOT_MICROSERVICE_URL=http://127.0.0.1:8000
   ```

2. **Test DNS resolution:**
   ```bash
   nslookup localhost
   dig localhost
   ```

3. **Check network configuration:**
   ```bash
   cat /etc/resolv.conf
   ```

#### 4. HTTP 404 - Health Endpoint Not Found

**Symptoms:**
- Error: "HTTP 404: Not Found"
- Microservice is running but health endpoint fails

**Possible Causes:**
- Health endpoint not implemented in microservice
- Wrong API path configuration
- Microservice version mismatch

**Troubleshooting Steps:**
1. **Check microservice API documentation:**
   - Visit `http://localhost:8000/docs` for FastAPI auto-generated docs
   - Verify the health endpoint exists at `/api/health`

2. **Test other endpoints:**
   ```bash
   curl http://localhost:8000/
   curl http://localhost:8000/api/
   curl http://localhost:8000/docs
   ```

3. **Update microservice to include health endpoint:**
   ```python
   # In your FastAPI microservice
   @app.get("/api/health")
   async def health_check():
       return {"status": "healthy", "timestamp": datetime.now()}
   ```

#### 5. HTTP 500 - Internal Server Error

**Symptoms:**
- Error: "HTTP 500: Internal Server Error"
- Microservice responds but with errors

**Possible Causes:**
- Database connection issues in microservice
- Configuration errors
- Runtime errors in microservice code

**Troubleshooting Steps:**
1. **Check microservice logs:**
   ```bash
   # Check application logs
   tail -f /path/to/microservice/logs/error.log
   
   # Check system logs
   journalctl -u your-microservice-name -f
   ```

2. **Verify microservice configuration:**
   - Database connections
   - API keys and secrets
   - Environment variables

3. **Restart the microservice:**
   ```bash
   # Stop the service
   pkill -f "python.*main"
   
   # Start it again
   python main.py
   ```

### Using the Debug Panel

The Latinos plugin includes a comprehensive debug panel accessible through the admin interface:

#### Accessing the Debug Panel

1. Log into the Payload CMS admin interface
2. Navigate to the Latinos section
3. Look for "Connection Debug" or similar option

#### Debug Panel Features

**Overview Tab:**
- Connection status indicator
- Response time metrics
- Network reachability status
- Microservice information

**Endpoints Tab:**
- Individual endpoint test results
- Response times for each endpoint
- Detailed error messages

**Diagnostics Tab:**
- Automated issue detection
- Severity levels (Critical, High, Medium, Low)
- Possible causes and solutions
- Auto-fix suggestions where available

**Configuration Tab:**
- Current environment variables
- Connection settings
- Required configuration examples

#### Debug API Endpoints

You can also test the connection programmatically:

```bash
# Test connection status
curl -X GET http://localhost:3000/api/latinos/debug/connection \
  -H "Authorization: Bearer YOUR_TOKEN"

# Retry connection
curl -X POST http://localhost:3000/api/latinos/debug/retry-connection \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"maxRetries": 3, "retryDelay": 2000}'

# Get microservice health
curl -X GET http://localhost:3000/api/latinos/debug/microservice-health \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Environment Variables

Make sure these environment variables are properly configured:

```env
# Required
BOT_MICROSERVICE_URL=http://localhost:8000
BOT_MICROSERVICE_WS_URL=ws://localhost:8000/ws/trades

# Optional (with defaults)
BOT_MICROSERVICE_TIMEOUT=10000
BOT_MICROSERVICE_MAX_RETRIES=3
BOT_MICROSERVICE_RETRY_DELAY=2000
BOT_MICROSERVICE_DEBUG=false
```

### Advanced Troubleshooting

#### Enable Debug Logging

Set the debug flag to get detailed connection logs:

```env
BOT_MICROSERVICE_DEBUG=true
NODE_ENV=development
```

This will log:
- Connection attempts and retries
- Request/response details
- Error messages and stack traces
- Performance metrics

#### Connection Statistics

The system tracks connection statistics including:
- Success/failure rates
- Average response times
- Consecutive failure counts
- Connection history

Access these through the debug panel or programmatically via the API.

#### Network Diagnostics

For network-related issues:

1. **Check firewall settings:**
   ```bash
   # Ubuntu/Debian
   sudo ufw status
   
   # CentOS/RHEL
   sudo firewall-cmd --list-all
   ```

2. **Test port connectivity:**
   ```bash
   telnet localhost 8000
   nc -zv localhost 8000
   ```

3. **Monitor network traffic:**
   ```bash
   sudo tcpdump -i lo port 8000
   ```

### Getting Help

If you continue to experience connection issues:

1. **Check the debug panel** for automated diagnostics
2. **Review microservice logs** for detailed error information
3. **Test the connection manually** using curl or similar tools
4. **Verify environment configuration** matches your setup
5. **Contact system administrator** if network issues persist

### Performance Optimization

For optimal performance:

1. **Adjust timeout settings** based on your network conditions
2. **Configure retry logic** appropriately for your environment
3. **Monitor connection statistics** to identify patterns
4. **Use connection pooling** if available in your microservice
5. **Implement health checks** in your microservice for better monitoring

## Development

### Running in Development Mode

1. **Start the microservice:**
   ```bash
   cd /path/to/trading-microservice
   python main.py
   ```

2. **Start the CMS:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Enable debug mode:**
   ```env
   BOT_MICROSERVICE_DEBUG=true
   NODE_ENV=development
   ```

### Testing Connection

Use the built-in debug tools or test manually:

```bash
# Test health endpoint
curl http://localhost:8000/api/health

# Test system status
curl http://localhost:8000/api/system/status

# Test WebSocket connection
wscat -c ws://localhost:8000/ws/trades
```

## Production Deployment

### Security Considerations

1. **Use HTTPS** for production deployments
2. **Configure proper authentication** between services
3. **Set up monitoring** and alerting
4. **Use environment-specific configurations**
5. **Implement rate limiting** and request validation

### Monitoring

Set up monitoring for:
- Connection health and uptime
- Response times and performance
- Error rates and failure patterns
- Resource usage and capacity

### Backup and Recovery

Ensure you have:
- Database backups for bot configurations
- Configuration backups for environment settings
- Monitoring and alerting for service failures
- Recovery procedures for connection issues