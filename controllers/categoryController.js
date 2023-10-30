const Category = require('../models/categoryModel')




const loadCategory = async (req, res) => {
  try {
    res.render('admin/add-category')
  } catch (error) {
    console.log(error.message);
  }
}

const createCategory = async (req, res) => {
  try {
    console.log(req.body);
    const { name, description } = req.body;

    const existingCategory = await Category.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
    });

    if (existingCategory) {

      return res.render('./admin/add-category', {
        error: 'Category name already exists.',
        name, 
        description,
      });
    }

    const newCategory = new Category({ name, description });
    await newCategory.save();

    res.redirect('/admin/allCategory');
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'An error occurred while creating the category.' });
  }
};



const getAllCategory = async (req, res) => {
  try {

    const categories = await Category.find();
    

    res.render('admin/adminPanelCat', { categories });
  } catch (error) {
    console.log(error.message);
  }
}



getAllName = async () => {

  try {
    return await Category.distinct('name')
  } catch (error) {
    console.log(error, 'cannot find name in category');
  }
}


const getEditCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId
    const categories = await Category.findById(categoryId)
    res.render('admin/admincat-edit', { categories })
  } catch (error) {
    console.log(error.message);
  }
}

const postEditCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; 
   
    const { name, description } = req.body;
    await Category.findByIdAndUpdate(categoryId, { name, description });
    res.redirect('/admin/allCategory');
  } catch (error) {
    console.log(error.message);
  }
}

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    await Category.findByIdAndDelete(categoryId);
    res.redirect('/admin/allCategory');
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  createCategory,
  loadCategory,
  getAllCategory,
  getEditCategory,
  postEditCategory,
  deleteCategory,
  getAllName,
  
}