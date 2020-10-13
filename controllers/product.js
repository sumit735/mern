const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

const getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if(err || !product) {
            return res.status(400).json({
                error: "No Product Available On Thid Id"
            });
        }

        req.product = product;
        next();
    });
}

const createProduct = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err) {
            return res.status(400).json({
                error: "Something Went Wrong While Uploading your file"
            });
        }

        // destructure fields
        const { name, description, price, category, stock } = fields;

        if(!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: "Please Include All Fields"
            });
        }

        let product = new Product(fields);
        // Handle file here
        if(file.photo) {
            if(file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File is too large."
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // save to db
        product.save((err, product) => {
            if(err) {
                return res.status(400).json({
                    error: "Failed to save in db"
                });
            }

            res.json(product);
        })
    })
}

const getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

// middleware
const photo = (req, res, next) => {
    if(req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}


const updateProduct = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err) {
            return res.status(400).json({
                error: "Something Went Wrong While Uploading your file"
            });
        }

        // Updation of fields
        let product = req.product;
        product = _.extend(product, fields);
        // Handle file here
        if(file.photo) {
            if(file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File is too large."
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // save to db
        product.save((err, product) => {
            if(err) {
                return res.status(400).json({
                    error: "Failed to update in db"
                });
            }
            res.json(product);
        });
    });
}

const deleteProduct = (req, res) => {
    const product = req.product;
    product.remove((err, product) => {
        if(err) {
            return res.status(400).json({
                error: "Failed To Remove"
            });
        }

        res.json({
            message: `${ product.name } Product Deleted Successfully`
        });
    })
}

const getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 2;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
    .populate('category')
    .select("-photo") //remove photo from query
    .sort([[sortBy, "asc"]]) //basic sorting
    .limit(limit) 
    .exec((err, products) => {
        if(err || !products) {
            return res.status(400).json({
                error: "No Products Avaialble To Show"
            });
        }

        res.json(products);
    });
}

const updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(product => {
        return {
            updateOne: {
                filter: { _id: product._id }, //locate product
                update: { $inc: {
                    stock: -product.count, sold: +product.count
                } }
            }
        }
    });

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err) {
            return res.status(400).json({
                error: "Failed to Perform Operations"
            })
        }
    })
}

const getAllUniqueCategories = (req, res, next) => {
    Product.distinct("category", {}, (err, category) => {
        if(err) {
            res.status(400).json({
                error: "No Category Available"
            });
        }

        res.json(category);
    })
}

module.exports = {
    getProductById,
    createProduct,
    getProduct,
    photo,
    updateProduct,
    deleteProduct,
    getAllProducts,
    updateStock,
    getAllUniqueCategories
}