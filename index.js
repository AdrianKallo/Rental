// index.js

const express = require('express');
const bodyParser = require('body-parser');
const rental = require('./rentalPrice');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/pictures', express.static('images'));

const formHtml = fs.readFileSync('form.html', 'utf8');
const resultHtml = fs.readFileSync('result.html', 'utf8');

app.post('/', (req, res) => {
    const post = req.body;

    // Extracting driver's license duration from input
    const licenseStartDate = new Date(post.licensedate);
    const currentDate = new Date();
    const licenseDurationInYears = (currentDate - licenseStartDate) / (1000 * 60 * 60 * 24 * 365);

    const result = rental.calculateRentalPrice(
        String(post.pickup),
        String(post.dropoff),
        Date.parse(post.pickupdate),
        Date.parse(post.dropoffdate),
        String(post.type),
        Number(post.age),
        licenseDurationInYears // Pass license duration to rental price calculation function
    );

    res.send(formHtml + generateResultHtml(result));
});

app.get('/', (req, res) => {
    res.send(formHtml);
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// Function to generate HTML for displaying rental price result
function generateResultHtml(result) {
    let html = `<ul class="car-list">`;

    for (const [key, value] of Object.entries(result)) {
        if (key === 'error') {
            html += `<li class="error-message">${value}</li>`;
        } else {
            html += `<li class="car-item">
                        <div class="car-details">
                            <div class="car-name">${key}</div>
                            <div class="car-price">Price: $${value.toFixed(2)} per day</div>
                        </div>
                    </li>`;
        }
    }
    
    html += `</ul>`;
    return html;
}
