const { canRentCar, calculateRentalPrice } = require('../main/rentalPrice');

describe('calculateRentalPrice function tests', () => {
    test('Driver under 18 cannot rent a car', () => {
        expect(calculateRentalPrice('2024-01-01', '2024-02-02', 'Compact', 15, 2)).toBe('Driver too young - cannot rent a car.');
    });

    test('Driver must hold a license for at least one year to rent a car', () => {
        expect(calculateRentalPrice('2024-07-15', '2024-07-20', 'Compact', 20, 0)).toBe('Driver must hold a license for at least one year to rent a car.');
    });

    test('Drivers aged 18-21 can only rent Compact cars', () => {
        expect(calculateRentalPrice('2024-07-15', '2024-07-20', 'SUV', 20, 2)).toBe('Drivers aged 18-21 can only rent Compact cars.');
    });

    test('Calculate rental price for Racer car in high season under 25', () => {
        expect(calculateRentalPrice('2024-07-15', '2024-07-20', 'Racer', 24, 5)).toBe('$150.00');
    });

    test('Calculate rental price with high season price increase', () => {
        expect(calculateRentalPrice('2024-07-15', '2024-07-20', 'Standard', 30, 5)).toBe('$207.00');
    });

    test('Apply discount for more than 10 days rental', () => {
        expect(calculateRentalPrice('2024-11-01', '2024-11-15', 'Standard', 30, 5)).toBe('$382.50');
    });

    test('Apply license years threshold increase in high season', () => {
        expect(calculateRentalPrice('2024-07-15', '2024-07-20', 'Standard', 30, 2)).toBe('$375.00');
    });

    test('Calculate rental price in low season', () => {
        expect(calculateRentalPrice('2024-01-15', '2024-01-20', 'Standard', 30, 5)).toBe('$180.00');
    });

    test('Return unknown season for invalid date', () => {
        expect(calculateRentalPrice('2024-13-15', '2024-13-20', 'Standard', 30, 5)).toBe('$NaN');
    });
});