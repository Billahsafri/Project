const path = require('path');

require('dotenv').config(); // Load environment variables from .env file

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

console.log(stripeSecretKey, stripePublicKey)

const express = require('express');
const app = express();
const port = 3000
const fs = require ('fs')
const stripe = require('stripe')(stripeSecretKey)

app.use(express.json());
app.use(express.static('public'));

app.get('/store', function(req, res) {
    fs.readFile('items.json', function(error, data) {
        if(error){
            res.status(500).end()
        } else {
            res.render('store.ejs', {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
            })
        }
    })
})

app.post('/purchase', function(req, res) {
    fs.readFile('items.json', function(error, data) {
        if(error){
            res.status(500).end()
        } else {
            const itemsJson = JSON.parse(data)
            const itemsArray = itemsJson.music.concat(itemsJson.merch)
            let total = 0
            req.body.items.forEach(function(item) {
                const itemJson = itemsArray.find(function(i) {
                    return i.id == item.id
                })
                total = total + itemJson.price * item.quantity
            })

            stripe.charges.create ({
                amount: total,
                source: req.body.stripeTokenId,
                currency: 'sgd'
            }).then(function() {
                console.log('Charge Successful')
                res.json({ message: 'successfully Purchased Items'})
            }).catch(function() {
                console.log('Charge Failed')
                res.status(500).end()
            })
        }
    })
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
