const dashbordHelper = require('../helpers/dashbordHelper');
const orderHelper = require('../helpers/orderHelper')
const productHelpers = require('../helpers/product-helpers')
const exceljs = require('exceljs')
const pdfPrinter = require('pdfmake')
const fs = require('fs');
// const { default: orders } = require('razorpay/dist/types/orders');
const PdfPrinter = require('pdfmake');


const totalSaleExcel = async(req,res)=>{
    try {
      
        const totalSaleToday = await dashbordHelper.totalSaleToday()
       
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('orders');
        const columns = [
            { header: "S:no", key: "s_no" },
            { header: "Id", key: "_id" },
            { header: "User Id", key: "userId" },
            { header: 'Product', key: "products" },
            { header: "Total", key: "totalPrice"},
            { header: "Payment Method", key:  "payment" },
            { header: "Delivered Status", key: "status" },
            { header: "Order Date", key: "createdOn" },
            { header: "__v", key: "__v" }
          ];
          worksheet.columns = columns;

          let s_no = 1;
          totalSaleToday.forEach(order=>{
            order.products.forEach(product=>{
                worksheet.addRow({
                    s_no:s_no++,
                   _id:order._id,
                   userId:order.userId,
                   product:product,
                   totalPrice:order.totalPrice,
                   paymentMethod:order.payment,
                   deliverdStatus:order.status,
                   date:order.createdOn,
                   __v:order.__v
                })
            })
          })

          worksheet.getRow(1).eachCell((cell)=>{
            cell.font = {bold:true}
          })

          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader("Content-Disposition", 'attachment;filename=revenue.xlsx');
          return workbook.xlsx.write(res).then(()=>{
            res.status(200);
          })
    } catch (error) {
        console.log(error);
    }
}

const totalRevenueExcel = async(req,res)=>{
    try {
        const allOrder = await orderHelper.findOrderDeliverd()
        const workbook = new exceljs.Workbook()
        const worksheet = workbook.addWorksheet('orders')
        const columns = [
            { header: "S:no", key: "s_no" },
            { header: "Order Id", key: "_id" },
            { header: "User Id", key: "userId" },
            { header: "Total", key: "totalPrice" },
            { header: "Payment Method", key: "payment" },
            { header: "Delivered Status", key: "status" },
            { header: "Order Date", key: "createdOn" },
            { header: "__v", key: "__v" }
          ];
          worksheet.columns = columns;
          let s_no = 1;
          allOrder.forEach(order=>{
            order.products.forEach(product =>{
                worksheet.addRow({
                    s_no:s_no++,
                    _id: order._id,
                    userId:order.userId,
                    totalPrice:order.totalPrice,
                    paymentMethod:order.payment,
                    deliverdStatus:order.status,
                    date:order.createdOn,
                    __v:order.__v
                })
            })
          })
          worksheet.getRow(1).eachCell((cell)=>{
            cell.font={bold:true}
          })
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader("Content-Disposition", 'attachment;filename=revenue.xlsx');
          return workbook.xlsx.write(res).then(() => {
            res.status(200);
          });
    } catch (error) {
        console.log(error);
    }
}

const productListExcel = async(req,res)=>{

 try {
  
  const productModelList = await productHelpers.getAllproducts()
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('orders');
  worksheet.columns = [
    { header: "S no", key: "s_no" },
    { header: "Id", key: "_id" },
    { header: "productName", key: "Name" },
    { header: "Category", key: "Category" },
    { header: "Description", key: "Description"},
    { header: "Price", key: "Price" }
  ];
  let counter =1;
  productModelList.forEach(element =>{
    element.s_no = counter;
    worksheet.addRow(element);
    counter++;
  });
  worksheet.getRow(1).eachCell((cell)=>{
    cell.font = {bold:true};
  });
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", 'attachment;filename=productList.xlsx');
  return workbook.xlsx.write(res).then(() => {
    res.status(200);

  });
 } catch (error) {
  console.log(error.message);
 }

}
const allOrderStatus = async (req,res)=>{
  try {
    const allOrder = await orderHelper.allOrders()
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('orders');
    const columns = [
      { header: "S:no", key: "s_no" },
      { header: "Order Id", key: "_id" },
      { header: "User Id", key: "userId" },
      { header: 'Product', key: " products" },
      { header: "Total", key: "totalPrice" },
      { header: "Payment Method", key: "payment" },
      { header: "Delivered Status", key: "status" },
      { header: "Order Date", key: "createdOn" },
    
    ];
      worksheet.columns = columns;

      let s_no = 1;
      allOrder.forEach(order=>{
        order.products.forEach(product =>{
          worksheet.addRow({
            s_no:s_no++,
            _id:order._id,
            userId:order.userId,
            product:product.product,
            totalPrice:order.totalPrice,
            paymentMethod:order.payment,
            deliverdStatus:order.status,
            date:order.createdOn,
          })
        })
      })
      worksheet.getRow(1).eachCell((cell)=>{
        cell.font = {bold:true};
      })
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", 'attachment;filename=orders.xlsx');
      return workbook.xlsx.write(res).then(() => {
        res.status(200);
      });
  } catch (error) {
    console.log(error);
  }
}
const customPDF = async (req,res)=>{
  try {
    const startDate = req.query.start;
    const endDate = req.query.end;
    const allOrder = await orderHelper.findOrderByDate(startDate,endDate)
    let startY = 150;
    const writeStream = fs.createWriteStream('order.pdf')
    const printer = new PdfPrinter({
      Roboto:{
        normal:"Helvetica",
        bold:"Helvetica-Bold",
        italics:"Helvetica-Oblique",
        bolditalics:"Helvetica-BoldOblique"
      },
    })

    const dateOptions = {year:"numeric", month:"long",day:"numeric"};
    const docDefinition = {
      content:[
        {text:'Camera Shutter',style:"header"},
        {text:"\n"},
        {text:"Order Information", style:"header1"},
        {text:"\n"},
        {text:"\n"}
      ],
      styles: {
        header: {
          fontSize: 25,
          alignment: "center",
        },
        header1: {
          fontSize: 12,
          alignment: "center",
        },
        total: {
          fontSize: 18,
          alignment: "center",
        },
      },
    };

    const tableBody =[
      ["Index", "Date","Name" ,"User", "address" ,"Status", "PayMode",  "Amount"],
    ];
    let totalPrice=0
    for(let i=0; i < allOrder.length;i++){
       const data = allOrder[i];
       let Name =[]
       let n;
       for(let i = 0; i<data.products.length;i++){
        Name.push(data.products[i].product.Name)
       }
       Name=""+Name
       totalPrice=totalPrice+data.totalPrice
       const formattedDate = new Intl.DateTimeFormat(
        "en-US",
        dateOptions
       ).format(new Date(data.createdOn));
       tableBody.push([
        (i+1).toString(),
        formattedDate,
        Name,
        data.status,
        data.payment,
        data.totalPrice
       ])
    }
    const table = {
      table: {
        widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
        headerRows: 1,
        body: tableBody,
      },
    };
      docDefinition.content.push(table);
      docDefinition.content.push([
        {
          text:"\n"
        },
        {text:`Total: ${totalPrice}`,style:"total"},

      ]);
      const pdfDoc = printer.createPdfKitDocument(docDefinition);

      pdfDoc.pipe(writeStream);
      pdfDoc.end();

      writeStream.on("finish",()=>{
        res.download("order.pdf", "order.pdf");

      })
  } catch (error) {
    console.log(error);
  }
}

module.exports={
  totalSaleExcel,
  totalRevenueExcel,
  productListExcel,
  customPDF,
  allOrderStatus
}