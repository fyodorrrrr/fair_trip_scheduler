# Fair Trip Scheduler

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/Python-3.6%2B-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A web application that ensures fair distribution of trips among drivers using advanced greedy algorithms. Built for transportation companies seeking to optimize driver compensation equity.

## 🚀 Features

- **Intelligent Trip Assignment** - Uses greedy algorithms to balance compensation across all drivers
- **Interactive Dashboard** - Real-time visualization of driver compensation metrics
- **Algorithm Comparison** - Compare different scheduling algorithms side-by-side
- **Driver Management** - Add, edit, and manage driver profiles
- **Trip History** - Track past assignments and compensation patterns

## 📊 Algorithm Overview

This application implements three main trip assignment strategies:

1. **Greedy Algorithm** - Assigns each trip to the driver with the lowest current compensation
2. **Round Robin** - Distributes trips in sequential order among all drivers
3. **Random Assignment** - Randomly assigns trips to provide baseline comparison

The default greedy algorithm provides the most equitable distribution of compensation over time.

## 🔧 Installation

### Prerequisites
- Python 3.6+
- Flask

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fair_trip_scheduler.git
   cd fair_trip_scheduler
   ```

2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the application:
   ```bash
   python app.py
   ```

5. Open your browser and navigate to:
   [http://127.0.0.1:5000](http://127.0.0.1:5000)

## 📝 Usage Guide

### Basic Trip Assignment

1. Navigate to the main dashboard
2. Add drivers using the "Add Driver" button
3. Assign individual trips by clicking on a driver and entering trip details
4. View the compensation distribution chart to monitor fairness

### Algorithm Comparison

1. Go to "Compare Algorithms" page
2. Adjust simulation parameters (number of trips, value ranges)
3. Run the simulation to see how different algorithms perform
4. Export results for further analysis

## 🔄 Algorithm Comparison

| Algorithm     | Pros                                   | Cons                                     |
|---------------|----------------------------------------|------------------------------------------|
| Greedy        | Best overall fairness, simple          | May not optimize for route efficiency    |
| Round Robin   | Predictable rotation, easy to follow   | Doesn't consider compensation values     |
| Random        | Simple baseline, easy to implement     | No fairness guarantees                   |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- Chart.js for data visualization
- Flask framework for web development
- All contributors who have helped shape this project

## 📞 Contact

Project Link: [https://github.com/fyodorrrrr/fair_trip_scheduler](https://github.com/fyodorrrrr/fair_trip_scheduler)