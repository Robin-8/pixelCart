const connectDB = require('../config/connection')
const bannerHelper = require('../helpers/bannerHelper');
const productHelpers = require('../helpers/product-helpers');


const adminBanners = async(req,res)=>{
    try {
         const banners = await bannerHelper.adminGetAllBanner();
         
        
        res.render("admin/adminBanners",{
          
            banners,
            admin:true,
            title:"Admin-Banners"
        })
    } catch (error) {
        console.log(error);
    }
}

const  adminAddBannerPage = (req,res)=>{
    try {
        res.render('admin/bannerAdd',{admin:true,title:'Admin add Banner'})
    } catch (error) {
        console.log(error,'cannot add banner');
    }
}
const adminAddBanner = async (req, res) => {
  console.log(req.file)
    try {
      req.body.bannerImage = req.file.filename
      const banner = await bannerHelper.addBanner(req.body , req.file);
     
      
      if (req.files && req.files["bannerImage"]) {
        const images = req.files["bannerImage"];
        const movePromises = [];
        
       
  
        Promise.all(movePromises)
          .then(() => {
            res.redirect("/admin/admin-banners");
          })
          .catch((error) => {
            console.log("Failed to move images:", error);
            res.status(500).send("Failed to add banner");
          });
      } else {
        res.redirect("/admin/admin-banners");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

  const adminGetBanner = async(req,res)=>{
    try {
        
        try {
            const bannerId = req.query.bannerId;
       
            
            
            const banner = await bannerHelper.getBannerById({_id: bannerId});
            
            if(!banner){
                return res.redirect('/admin/admin-banners');
            }
            res.render('admin/adminBanner-edit',{
                banner,
                admin:true,
                title:"Admin Edit Banner"
            })

        } catch (error) {
            console.log(error);
            res.redirect('/admin/admin-banners')
        }
    } catch (error) {
        console.log(error,'cannot edit banner');
    }
  }
  const adminEditBanner = async (req, res) => {
    try {
      req.body.bannerImage = req.file.filename
      await bannerHelper.updateBanner(req.params.id, req.body);
     
      if (req.files && req.files["bannerImage"]) {
        const image = req.files["bannerImage"];
  
        try {
          await bannerHelper.moveImage(image);
          res.redirect("/admin/admin-banners");
        } catch (error) {
          console.log("Failed to move images:", error);
          res.status(500).send("Failed to add banner");
        }
      } else {
        res.redirect("/admin/admin-banners");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const adminDeleteBanner = async(req,res)=>{
    try {
      
      try {
        const bannerId = req.query.bannerId
        const banner = await bannerHelper.getBannerById({_id:bannerId})
        if(!banner){
          return res.redirect('/admin/admin-banners')
        } 

        await bannerHelper.softDeleteBanner({_id:bannerId})
        res.redirect("/admin/admin-banners")
      } catch (error) {
        console.log(error,'cannot delete banner');
      }
    } catch (error) {
      console.log(error,'not delete banner');
    }
  }

  const adminRecoverBanner = async(req,res)=>{
    try {
      
      try {
        const bannerId = req.query.bannerId
        
       const banner = await bannerHelper.getBannerById({_id:bannerId})
  
        if(!banner){
          return res.redirect('/admin/admin-banners')
        }

        await bannerHelper.softRecoverBanner({_id:bannerId});
        res.redirect("/admin/admin-banners")
      } catch (error) {
        console.log(error,'cannot recover');
      }
    } catch (error) {
      console.log(error,'cannt recover banner');
    }
  }
  
  
  

module.exports = {
    adminAddBannerPage,
    adminAddBanner,
    adminBanners,
    adminGetBanner,
    adminEditBanner,
    adminDeleteBanner,
    adminRecoverBanner
}