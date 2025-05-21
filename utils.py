# Utility functions for fair trip assignment using greedy algorithms

def assign_trips_greedy(drivers, trips):
    assignments = {driver: [] for driver in drivers}
    earnings = {driver: 0.0 for driver in drivers}
    for trip in trips:
        selected_driver = min(earnings, key=earnings.get)
        assignments[selected_driver].append(trip)
        earnings[selected_driver] += trip
    return assignments, earnings
