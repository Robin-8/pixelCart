const Category = require('../models/categoryModel')


// for category

const loadCategory = async(req,res)=>{
    try {
        res.render('admin/add-category')
    } catch (error) {
        console.log(error.message);
    }
}

const createCategory = async(req,res)=>{
    try {
        console.log(req.body);
        const {name,description}= req.body
        
        const newCategory = new Category({name,description});
        await newCategory.save()

        res.redirect('/admin/allCategory')
        
    } catch (error) {
        console.log(error.message);
    }
}

const  getAllCategory = async (req, res) => {
    try {
        
      const categories = await Category.find();
     
      console.log('Categories:', categories); // Add this line to see the fetched categories
      res.render('admin/adminPanelCat', { categories }); 
    } catch (error) {
      console.log(error.message);
    }
  }
  

const getEditCategory = async(req,res)=>{
    try {
        const categoryId = req.params.categoryId
        const category = await Category.findById(categoryId)
        res.render('admin/admincat-edit',{category})
    } catch (error) {
        console.log(error.message);
    }
}

const postEditCategory = async (req, res) => {
    try {
        console.log(req.body,'body here]]]');
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
    deleteCategory
}