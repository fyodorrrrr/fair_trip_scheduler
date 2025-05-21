# Fair Trip Scheduler

A web application for fair trip assignment using greedy algorithms in driver scheduling.

## Features
- Assigns trips to drivers to balance total compensation using a greedy approach.
- Simple web interface built with Flask and Bootstrap.

## Setup
1. Install dependencies:
   ```bash
   pip install flask
   ```
2. Run the app:
   ```bash
   python app.py
   ```
3. Open your browser at [http://127.0.0.1:5000](http://127.0.0.1:5000)

## Usage
- Enter driver names and trip compensation values (comma-separated).
- Click 'Assign Trips' to see fair assignments.

## Project Structure
- `app.py`: Main Flask app
- `templates/`: HTML templates
- `static/`: Static files (CSS)
- `utils.py`: Assignment logic (optional, for code organization)
- `tests.py`: Basic tests
