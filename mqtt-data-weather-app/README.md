# 🌦️ MQTT Weather Station Application

Welcome to the **MQTT Weather Station Application**! This project is designed to collect, store, and visualize temperature and humidity data in real-time using MQTT, SQLite, and a responsive web interface. Whether you're monitoring your home environment or building a weather station, this app has you covered!

---

## 🚀 Features

- **🌡️ Real-Time Monitoring**: Track live temperature and humidity data with instant updates.
- **📈 Interactive Visualizations**: View real-time and historical data with dynamic charts.
- **💾 Data Storage**: Store all readings in an SQLite database for long-term analysis.
- **📱 Responsive Design**: Access the dashboard seamlessly on both desktop and mobile devices.
- **⏱️ 5-Minute Averages**: Automatically calculate and display 5-minute averages for better insights.

---

## 🛠️ Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or later)
- **npm** (v6 or later)
- **Git** (for cloning the repository)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dieudonne000/mqtt-weather-app.git
   cd mqtt-weather-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   node server.js
   ```

4. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

---

## 📂 Project Structure

Here’s an overview of the project structure:

```
mqtt-data-weather-app/
├── public/                # Frontend assets
│   └── index.html         # Main HTML file with Chart.js integration
├── server.js              # Backend logic (Express + SQLite)
├── package.json           # Node.js dependencies and scripts
├── weather_data.db        # SQLite database (auto-generated)
└── README.md              # Project documentation
```

---

## 🧠 How It Works

1. **Data Collection**:
   - The frontend connects to an MQTT broker to receive real-time temperature and humidity data.
   - Each MQTT message is sent to the backend for processing.

2. **Data Storage**:
   - Raw data is stored in an SQLite database for historical analysis.
   - Every 5 minutes, the backend calculates averages and stores them in a separate table.

3. **Data Visualization**:
   - The frontend displays real-time data and up to one hour of historical data (twelve 5-minute intervals) using interactive charts.

---

## 🔌 API Endpoints

The backend exposes the following REST API endpoints:

- **`POST /api/weather/data`**: Stores raw temperature and humidity readings.
- **`GET /api/weather/history`**: Retrieves historical data for charting.

---

## 🗃️ Database Schema

### Raw Data Table
Stores every reading received from the MQTT broker:
```sql
CREATE TABLE raw_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,        -- 'temperature' or 'humidity'
  value REAL NOT NULL,       -- The actual reading
  timestamp TEXT NOT NULL    
);
```

### Average Data Table
Stores 5-minute averages for temperature and humidity:
```sql
CREATE TABLE avg_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  avg_temperature REAL,      -- 5-minute average temperature
  avg_humidity REAL,         -- 5-minute average humidity
  timestamp TEXT NOT NULL    
);
```

---

## 🌟 Why Use This App?

- **Real-Time Insights**: Stay updated with live environmental data.
- **Historical Analysis**: Analyze trends over time with stored data.
- **Easy Setup**: Get started quickly with minimal configuration.
- **Open Source**: Customize and extend the app to fit your needs.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

For questions or feedback, feel free to reach out:

- **Email**: munezadieudonne2021@gmail.com

---

Enjoy monitoring your environment with the MQTT Weather Station Application! 🌤️