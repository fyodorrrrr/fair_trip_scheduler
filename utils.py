# Utility functions for fair trip assignment using different algorithms
import random
from typing import List, Dict, Tuple, Any, Optional


def assign_trips_greedy(drivers, trips):
    """Original implementation - kept for backward compatibility."""
    assignments = {driver: [] for driver in drivers}
    earnings = {driver: 0.0 for driver in drivers}
    for trip in trips:
        selected_driver = min(earnings, key=earnings.get)
        assignments[selected_driver].append(trip)
        earnings[selected_driver] += trip
    return assignments, earnings


def assign_trip_greedy(drivers: List[Dict[str, Any]], trip_location: str, trip_compensation: float) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
    """
    Greedy algorithm implementation for assigning a single trip.
    Returns the selected driver and the updated drivers list.
    
    Time complexity: O(n) where n is the number of drivers
    Space complexity: O(1) additional space
    """
    if not drivers:
        return None, drivers
    
    # Find drivers with minimum compensation
    min_comp = min(driver['compensation'] for driver in drivers)
    candidates = [d for d in drivers if d['compensation'] == min_comp]
    
    # Select the best candidate (currently first one, could be improved)
    selected_driver = candidates[0]
    
    # Update driver data
    selected_driver['compensation'] += trip_compensation
    selected_driver['trips'].append({
        'location': trip_location, 
        'compensation': trip_compensation
    })
    
    return selected_driver, drivers


def assign_trip_random(drivers: List[Dict[str, Any]], trip_location: str, trip_compensation: float) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
    """
    Randomly assign a trip (for comparison).
    Returns the selected driver and the updated drivers list.
    """
    if not drivers:
        return None, drivers
    
    selected_driver = random.choice(drivers)
    
    # Update driver data
    selected_driver['compensation'] += trip_compensation
    selected_driver['trips'].append({
        'location': trip_location, 
        'compensation': trip_compensation
    })
    
    return selected_driver, drivers


def assign_trip_round_robin(
    drivers: List[Dict[str, Any]], 
    trip_location: str, 
    trip_compensation: float,
    last_assigned_index: int = 0
) -> Tuple[Dict[str, Any], List[Dict[str, Any]], int]:
    """
    Round-robin assignment (for comparison).
    Returns the selected driver, updated drivers list, and the next index.
    """
    if not drivers:
        return None, drivers, 0
    
    next_index = (last_assigned_index + 1) % len(drivers)
    selected_driver = drivers[next_index]
    
    # Update driver data
    selected_driver['compensation'] += trip_compensation
    selected_driver['trips'].append({
        'location': trip_location, 
        'compensation': trip_compensation
    })
    
    return selected_driver, drivers, next_index


def calculate_stats(drivers: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate statistics about the current driver assignments."""
    if not drivers:
        return {
            'min_comp': 0,
            'max_comp': 0,
            'avg_comp': 0,
            'total_comp': 0,
            'total_trips': 0,
            'total_drivers': 0,
            'std_dev': 0  # Standard deviation of compensation
        }
    
    compensations = [d['compensation'] for d in drivers]
    trip_counts = [len(d['trips']) for d in drivers]
    
    total_comp = sum(compensations)
    total_drivers = len(drivers)
    avg_comp = total_comp / total_drivers
    
    # Calculate standard deviation
    variance = sum((c - avg_comp) ** 2 for c in compensations) / total_drivers
    std_dev = variance ** 0.5
    
    return {
        'min_comp': min(compensations),
        'max_comp': max(compensations),
        'avg_comp': avg_comp,
        'total_comp': total_comp,
        'total_trips': sum(trip_counts),
        'total_drivers': total_drivers,
        'std_dev': std_dev
    }


def generate_comparison_data(drivers: List[Dict[str, Any]], num_trips: int = 100) -> Dict[str, Any]:
    """
    Generate comparison data for different algorithms.
    
    Simulates assigning trips using different algorithms and 
    returns statistics for comparison.
    """
    # Create deep copies of the drivers for each algorithm
    greedy_drivers = [{
        'name': d['name'],
        'compensation': d['compensation'],
        'trips': [trip.copy() for trip in d['trips']]
    } for d in drivers]
    
    random_drivers = [{
        'name': d['name'],
        'compensation': d['compensation'],
        'trips': [trip.copy() for trip in d['trips']]
    } for d in drivers]
    
    round_robin_drivers = [{
        'name': d['name'],
        'compensation': d['compensation'],
        'trips': [trip.copy() for trip in d['trips']]
    } for d in drivers]
    
    # Initialize tracking variables
    round_robin_index = 0
    
    # Generate random trips
    for _ in range(num_trips):
        location = chr(65 + random.randint(0, 25))  # A-Z
        compensation = round(random.uniform(5.0, 30.0), 2)
        
        # Apply each algorithm
        _, greedy_drivers = assign_trip_greedy(greedy_drivers, location, compensation)
        _, random_drivers = assign_trip_random(random_drivers, location, compensation)
        _, round_robin_drivers, round_robin_index = assign_trip_round_robin(
            round_robin_drivers, location, compensation, round_robin_index
        )
    
    # Calculate statistics for each algorithm
    return {
        'greedy': calculate_stats(greedy_drivers),
        'random': calculate_stats(random_drivers),
        'round_robin': calculate_stats(round_robin_drivers)
    }
