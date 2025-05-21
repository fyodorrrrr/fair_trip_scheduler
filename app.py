from flask import Flask, render_template, request, redirect, url_for, session, flash
import copy
import random
from typing import List, Dict, Any

app = Flask(__name__)
app.secret_key = 'RAH'  # Replace with a secure key in production

NUM_DRIVERS = 200
MIN_COMPENSATION = 5.0
MAX_COMPENSATION = 30.0
BASE_COMP_MIN = 0.0
BASE_COMP_MAX = 100.0


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
    drivers = copy.deepcopy(get_drivers())
    for driver in drivers:
        if driver['name'] == name:
            driver['compensation'] += compensation
            driver['trips'].append({'location': location, 'compensation': compensation})
            break
    session['drivers'] = drivers
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
    flash('All drivers and trips have been reset.', 'info')
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True)
