from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import copy
import random
import os
from typing import List, Dict, Any
from dotenv import load_dotenv
from utils import (
    assign_trip_greedy, assign_trip_random, assign_trip_round_robin,
    calculate_stats, generate_comparison_data
)

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY')

# Constants
NUM_DRIVERS = 200
MIN_COMPENSATION = 5.0
MAX_COMPENSATION = 30.0
BASE_COMP_MIN = 0.0
BASE_COMP_MAX = 100.0

# Store last round robin index in session
def get_round_robin_index():
    if 'round_robin_index' not in session:
        session['round_robin_index'] = 0
    return session['round_robin_index']

def set_round_robin_index(index):
    session['round_robin_index'] = index
    session.modified = True


def get_drivers() -> List[Dict[str, Any]]:
    """Initialize and return the list of drivers in session."""
    if 'drivers' not in session:
        session['drivers'] = []
        for i in range(1, NUM_DRIVERS + 1):
            name = f"Driver_{i}"
            base_comp = round(random.uniform(BASE_COMP_MIN, BASE_COMP_MAX), 2)
            trips = []
            trip_count = random.randint(0, 5)
            for t in range(trip_count):
                loc = chr(65 + (i + t) % 26)  # A-Z cycling
                comp = round(random.uniform(MIN_COMPENSATION, MAX_COMPENSATION), 2)
                trips.append({'location': loc, 'compensation': comp})
                base_comp += comp
            session['drivers'].append({'name': name, 'compensation': base_comp, 'trips': trips})
    return session['drivers']


def update_driver(name: str, location: str, compensation: float) -> None:
    """Update a driver's compensation and trips."""
    drivers = get_drivers()
    for driver in drivers:
        if driver['name'] == name:
            driver['compensation'] += compensation
            driver['trips'].append({'location': location, 'compensation': compensation})
            break
    session.modified = True


@app.route('/')
def index():
    """Show the main driver list with their total compensation."""
    drivers = get_drivers()
    min_comp = min(driver['compensation'] for driver in drivers)
    return render_template('driver_list.html', drivers=drivers, min_comp=min_comp)


@app.route('/assign', methods=['GET'])
def assign_auto():
    """Redirect to assign page for the driver with the lowest compensation (greedy)."""
    drivers = get_drivers()
    if not drivers:
        flash('No drivers available.', 'warning')
        return redirect(url_for('index'))
    min_comp = min(driver['compensation'] for driver in drivers)
    greedy_candidates = [d for d in drivers if d['compensation'] == min_comp]
    driver = greedy_candidates[0]
    return redirect(url_for('assign_driver', driver_name=driver['name']))


@app.route('/assign/<driver_name>', methods=['GET', 'POST'])
def assign_driver(driver_name: str):
    """Assign a trip to the driver with the lowest compensation (greedy)."""
    drivers = get_drivers()
    min_comp = min(driver['compensation'] for driver in drivers)
    driver = next((d for d in drivers if d['compensation'] == min_comp), None)
    if not driver:
        flash('Driver not found.', 'danger')
        return redirect(url_for('index'))
    if request.method == 'POST':
        location = request.form['location']
        try:
            compensation = float(request.form['compensation'])
            if compensation < MIN_COMPENSATION or compensation > MAX_COMPENSATION:
                raise ValueError('Compensation out of range.')
        except ValueError:
            return render_template('assign.html', driver=driver, error=f'Invalid compensation value. Must be between {MIN_COMPENSATION} and {MAX_COMPENSATION}.')
        update_driver(driver['name'], location, compensation)
        flash(f"Trip assigned to {driver['name']}!", "success")
        # Prepare summary stats for results page
        drivers = get_drivers()
        assignments = {d['name']: d['trips'] for d in drivers}
        earnings = {d['name']: d['compensation'] for d in drivers}
        total_drivers = len(assignments)
        total_trips = sum(len(trips) for trips in assignments.values())
        total_comp = sum(earnings.values())
        avg_comp = total_comp / total_drivers if total_drivers else 0
        return render_template('results.html', assignments=assignments, earnings=earnings, total_drivers=total_drivers, total_trips=total_trips, total_comp=total_comp, avg_comp=avg_comp)
    return render_template('assign.html', driver=driver)


@app.route('/reset')
def reset():
    """Reset all drivers and trips."""
    session.pop('drivers', None)
    session.pop('round_robin_index', None)
    flash('All drivers and trips have been reset.', 'info')
    return redirect(url_for('index'))


@app.route('/algorithm-demo')
def algorithm_demo():
    """Demonstrate the greedy algorithm with step-by-step visualization."""
    drivers = get_drivers()
    # Get first 10 drivers for display
    display_drivers = sorted(drivers, key=lambda d: d['compensation'])[:10]
    
    driver_names = [d['name'] for d in display_drivers]
    compensations = [d['compensation'] for d in display_drivers]
    
    # Highlight min compensation driver
    colors = ['#3498db' for _ in range(len(display_drivers))]
    min_idx = compensations.index(min(compensations))
    colors[min_idx] = '#e74c3c'
    
    # Generate algorithm steps for demo
    algorithm_steps = [
        "Start with a list of drivers and their current compensation",
        "Find the driver with the minimum total compensation",
        f"Select driver '{driver_names[min_idx]}' with compensation ${compensations[min_idx]:.2f}",
        "Assign the new trip to this driver",
        "Update the driver's compensation total",
        "Repeat for the next trip assignment"
    ]
    
    return render_template('algorithm_demo.html', 
                          driver_names=driver_names,
                          compensations=compensations,
                          colors=colors,
                          algorithm_steps=algorithm_steps)


@app.route('/compare-algorithms')
def compare_algorithms():
    """Compare different trip assignment algorithms."""
    drivers = get_drivers()
    comparison_data = generate_comparison_data(drivers, num_trips=50)
    
    # Extract key metrics for comparison
    algorithms = ['greedy', 'random', 'round_robin']
    metrics = {
        'min_comp': [comparison_data[alg]['min_comp'] for alg in algorithms],
        'max_comp': [comparison_data[alg]['max_comp'] for alg in algorithms],
        'avg_comp': [comparison_data[alg]['avg_comp'] for alg in algorithms],
        'std_dev': [comparison_data[alg]['std_dev'] for alg in algorithms]
    }
    
    return render_template('compare_algorithms.html',
                          algorithms=algorithms,
                          metrics=metrics,
                          comparison_data=comparison_data)


@app.route('/about-algorithm')
def about_algorithm():
    """Provide information about the algorithm."""
    algorithm_info = {
        'name': 'Greedy Trip Assignment',
        'time_complexity': 'O(n) where n is the number of drivers',
        'space_complexity': 'O(1) additional space',
        'description': 'This algorithm always assigns a trip to the driver with the lowest current compensation.',
        'advantages': [
            'Simple to implement',
            'Efficiently balances compensation over time',
            'Minimal computational overhead'
        ],
        'disadvantages': [
            'Does not consider driver location',
            'May not produce globally optimal solutions',
            'Does not account for driver preferences'
        ]
    }
    return render_template('about_algorithm.html', info=algorithm_info)


if __name__ == '__main__':
    app.run(debug=True)
