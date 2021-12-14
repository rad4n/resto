const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql2/promise");
const config = require('config');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();     //continue to look for additional specification that will match /dishes
})
.get( async (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    try {
        const [rows] = await db.query("SELECT * FROM dishes;");
        res.json(rows);
        next();
    } catch (error) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/json');
        res.json({"status":"tidak bisa konek db"});
    }
    
})
.post((req, res, next) => {
    const dish = {  dish_name: req.body.dish_name,
                    dish_price: req.body.dish_price,
                    isAvailable: req.body.isAvailable,
                    dish_type: req.body.dish_type.toLowerCase(),  //starter, main course, desserts 
                    dish_rest_id: req.body.dish_rest_id
                }

    var currDishType = dish.dish_type;
    var types = ['starter','main course','dessert', 'snack', 'beverage'];
    if (types.indexOf(currDishType) >= 0) {
        db.query(`INSERT INTO dishes (dish_name, dish_price, isAvailable, dish_type, dish_rest_id) VALUES ("${dish.dish_name}", ${dish.dish_price}, ${dish.isAvailable}, "${dish.dish_type}", "${dish.dish_rest_id}");`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/json');
        res.json(dish);
    }else{
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/json');
        res.json({"status":"false"});
    }
});

dishRouter.route('/:dishID')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();     //continue to look for additional specification that will match /dishes
}).put((req, res, next) => {
    const dish = {  dish_name: req.body.dish_name,
                    dish_price: req.body.dish_price,
                    isAvailable: req.body.isAvailable,
                    dish_type: req.body.dish_type.toLowerCase(),  //starter, main course, desserts 
                    dish_rest_id: req.body.dish_rest_id
                    // dish_id = req.params.dishID
                }

              
        console.log(req.params.dishID);
        var currDishType = dish.dish_type;
        var types = ['starter','main course','dessert', 'snack', 'beverage'];
        if (types.indexOf(currDishType) >= 0) {
        db.query(`UPDATE dishes SET dish_name = "${dish.dish_name}", dish_price = ${dish.dish_price}, isAvailable= ${dish.isAvailable}, dish_type= "${dish.dish_type}", dish_rest_id = "${dish.dish_rest_id}" WHERE dish_id = ${req.params.dishID} ;`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/json');
        res.json(dish);
    }else{
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/json');
        res.json({"status":"false"});
    }
})
.delete(async (req, res, next) => {
    await db.query(`DELETE FROM dishes WHERE dish_id = ${req.params.dishID};`);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json');
    res.json({"status":"true"});
});

async function main(){
    db = await mysql.createConnection({
      host: config.get('db.host'),
      user: config.get('db.user'),
      password: config.get('db.password'),
      database: config.get('db.database'),
      timezone: config.get('db.timezone'),
      charset: config.get('db.charset')
    });  
}
main();

module.exports = dishRouter;