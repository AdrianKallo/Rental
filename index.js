const express = require('express');
const bodyParser = require('body-parser');
const rental = require('./main/rentalPrice');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/pictures', express.static('images'));

// Read HTML files
const formHtml = fs.readFileSync('form.html', 'utf8');
const resultHtml = fs.readFileSync('result.html', 'utf8');

// POST route to handle form submission
app.post('/', (req, res) => {
    const formData = req.body;
    const carClass = formData.type;
    const rentalPrice = rental.calculateRentalPrice(
        formData.pickupdate,
        formData.dropoffdate,
        carClass,
        parseInt(formData.age),
        parseInt(formData.licenseYears) 
    );

    // JavaScript code to display result based on car class
    const script = `
        <script>
            document.querySelectorAll('.car-item').forEach(item => {
                item.style.display = 'none';
            });
            document.getElementById('${carClass.toLowerCase()}-result').style.display = 'block';
        </script>
    `;

    // Replace $0 in result HTML with calculated rental price
    let resultHtmlWithPrice = resultHtml.replace(/\$0/g, rentalPrice);

    // Append JavaScript code to result HTML
    resultHtmlWithPrice += script;

    // Send form HTML with updated result to the client
    res.send(formHtml + resultHtmlWithPrice);
});

// GET route to serve form HTML
app.get('/', (req, res) => {
    res.send(formHtml);
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
