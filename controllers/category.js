const Category = require('../models/catergory');

const getCategoryById = (req, res, next, id) => {
    Category.findById(id, (err, category) => {
        if(err || !category) {
            return res.status(400).json({
                error: "No Category Available On This Id"
            });
        }
        req.category = category;
        next();
    })
}

const createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if(err) {
            return res.status(400).json({
                error: "Unable To Create A Category"
            });
        }

        res.json(category);
    })
}

const getCategory = (req, res) => {
    res.json(req.category);
}
const getAllCategories = (req, res) => {
    Category.find((err, categories) => {
        if(err) {
            return res.status(400).json({
                error: "No Categories Found"
            });
        }

        res.json(categories);
    })
};

const updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, updatedCategory) => {
        if(err) {
            return res.status(400).json({
                error: "Failed To Update"
            });
        }

        res.json(updatedCategory);
    })
}

const deleteCategory = (req, res) => {
    const category = req.category;
    category.remove((err, category) => {
        if(err) {
            return res.status(400).json({
                error: "Failed To Update"
            });
        }

        res.json({
            message: `${ category.name } Category Deleted Successfully`
        });
    })
}

module.exports = {
    getCategoryById,
    createCategory,
    getCategory, 
    getAllCategories,
    updateCategory,
    deleteCategory
}