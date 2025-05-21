import unittest
from utils import assign_trips_greedy

class TestFairTripAssignment(unittest.TestCase):
    def test_basic_assignment(self):
        drivers = ['Alice', 'Bob']
        trips = [10, 20, 30]
        assignments, earnings = assign_trips_greedy(drivers, trips)
        self.assertEqual(sum(earnings.values()), sum(trips))
        self.assertEqual(len(assignments['Alice']) + len(assignments['Bob']), 3)

    def test_empty_drivers(self):
        drivers = []
        trips = [10, 20]
        assignments, earnings = assign_trips_greedy(drivers, trips)
        self.assertEqual(assignments, {})
        self.assertEqual(earnings, {})

    def test_empty_trips(self):
        drivers = ['Alice', 'Bob']
        trips = []
        assignments, earnings = assign_trips_greedy(drivers, trips)
        self.assertEqual(assignments, {'Alice': [], 'Bob': []})
        self.assertEqual(earnings, {'Alice': 0.0, 'Bob': 0.0})

if __name__ == '__main__':
    unittest.main()
