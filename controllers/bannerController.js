const connectDB = require('../config/connection')
const bannerHelper = require('../helpers/bannerHelper');
const productHelpers = require('../helpers/product-helpers');


const adminBanners = async(req,res)=>{
    try {
         const banners = await bannerHelper.adminGetAllBanner();
         
        // const itemsPerPage = 3;
        // const currentPage = parseInt(req.query.page)|| 1;
        // const startIndex = (currentPage -1)* itemsPerPage;
        // const endIndex = startIndex + itemsPerPage;
        // const paginatedBanners = banners.slice(startIndex,endIndex);
        // const totalPages = Math.ceil(banners.length / itemsPerPage);
        // const pages =[];
        // for(let i = 1;i<=totalPages;i++){
        //     pages.push(i);
        // }
        res.render("admin/adminBanners",{
            // banners:paginatedBanners,
            // currentpage,
            // totalPages,
            // pages,
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
      console.log(banner, 'banner is here');
      
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
            console.log(bannerId,'bannerid here===');
            
            
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
            console.log(req.body,'print this=====');
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