// rentalPrice.js

const SEASONS = {
    LOW: "Low",
    HIGH: "High"
};

const CLASS_PRICES = {
    COMPACT: "Compact",
    ELECTRIC: "Electric",
    CABRIO: "Cabrio",
    RACER: "Racer",
    UNKNOWN: "Unknown"
};

const MINIMUM_AGE_TO_RENT = 18;
const MINIMUM_LICENSE_DURATION = {
    FIRST_TIER: 1,
    SECOND_TIER: 2,
    THIRD_TIER: 3
};
const HIGH_SEASON_EXTRA_FEE = 0.15;
const HIGH_SEASON_EXTRA_FEE_AMOUNT = 15;
const LONG_RENTAL_DISCOUNT_THRESHOLD = 10;
const LONG_RENTAL_DISCOUNT = 0.1;

// Function to calculate rental price
function calculateRentalPrice(pickup, dropoff, pickupDate, dropoffDate, type, age, licenseDuration) {
    const clazz = getClazz(type);

    if (age < MINIMUM_AGE_TO_RENT) {
        return { error: "Driver too young - cannot quote the price" };
    }

    if (age <= 21 && clazz !== CLASS_PRICES.COMPACT) {
        return { error: "Drivers 21 y/o or less can only rent Compact vehicles" };
    }

    if (licenseDuration < MINIMUM_LICENSE_DURATION.FIRST_TIER) {
        return { error: "Driver's license held for less than a year - cannot rent" };
    }

    let rentalPrices = {
        compactPrice: calculateBaseRentalPrice(pickupDate, dropoffDate, CLASS_PRICES.COMPACT, age, licenseDuration),
        electricPrice: calculateBaseRentalPrice(pickupDate, dropoffDate, CLASS_PRICES.ELECTRIC, age, licenseDuration),
        cabrioPrice: calculateBaseRentalPrice(pickupDate, dropoffDate, CLASS_PRICES.CABRIO, age, licenseDuration),
        racerPrice: calculateBaseRentalPrice(pickupDate, dropoffDate, CLASS_PRICES.RACER, age, licenseDuration)
    };

    return rentalPrices;
}

// Function to calculate base rental price for a specific car class
function calculateBaseRentalPrice(pickupDate, dropoffDate, clazz, age, licenseDuration) {
    let basePrice = age; // Minimum rental price per day is equivalent to the age of the driver

    const days = getDays(pickupDate, dropoffDate);

    // Apply price adjustment based on car class
    switch (clazz) {
        case CLASS_PRICES.ELECTRIC:
            basePrice += 50;
            break;
        case CLASS_PRICES.RACER:
            basePrice += 100;
            if (age <= 25 && !isLowSeason(pickupDate, dropoffDate)) {
                basePrice *= 1.5; // Increase price by 50% for drivers 25 y/o or younger during high season
            }
            break;
        case CLASS_PRICES.CABRIO:
            basePrice += 80;
            break;
        case CLASS_PRICES.COMPACT:
        default:
            basePrice += 40;
            break;
    }

    // Apply high season extra fee
    if (isHighSeason(pickupDate, dropoffDate)) {
        basePrice *= 1 + HIGH_SEASON_EXTRA_FEE;
    }

    // Apply long rental discount
    if (days > LONG_RENTAL_DISCOUNT_THRESHOLD) {
        basePrice *= 1 - LONG_RENTAL_DISCOUNT;
    }

    return basePrice;
}

function getClazz(type) {
    switch (type.toLowerCase()) {
        case "compact":
            return CLASS_PRICES.COMPACT;
        case "electric":
            return CLASS_PRICES.ELECTRIC;
        case "cabrio":
            return CLASS_PRICES.CABRIO;
        case "racer":
            return CLASS_PRICES.RACER;
        default:
            return CLASS_PRICES.UNKNOWN;
    }
}

function getDays(pickupDate, dropoffDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(pickupDate);
    const secondDate = new Date(dropoffDate);

    return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
}

function isHighSeason(pickupDate, dropoffDate) {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);

    const start = 4; // April
    const end = 10; // October

    const pickupMonth = pickup.getMonth();
    const dropoffMonth = dropoff.getMonth();

    return (
        (pickupMonth >= start && pickupMonth <= end) ||
        (dropoffMonth >= start && dropoffMonth <= end) ||
        (pickupMonth < start && dropoffMonth > end)
    );
}

function isLowSeason(pickupDate, dropoffDate) {
    return !isHighSeason(pickupDate, dropoffDate);
}

module.exports = { calculateRentalPrice };
