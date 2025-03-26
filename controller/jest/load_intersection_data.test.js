const INTERSECTION_DATA = require('../src/load_intersection_data');

test('does load non-undefined intersection data', () => {
  expect(INTERSECTION_DATA).toBeDefined();
});
test('does load correct intersection data', () => {
    expect(INTERSECTION_DATA["groups"]["1"]).toEqual({
        intersects_with: [ 5, 9, 21, 28, 31, 38 ],
        is_inverse_of: false,
        extends_to: false,
        vehicle_type: [ 'car' ],
        lanes: { '1': {} },
        is_physical_barrier: false
      })
});
