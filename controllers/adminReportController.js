const dashbordHelper = require('../helpers/dashbordHelper');
const orderHelper = require('../helpers/orderHelper')
const productHelpers = require('../helpers/product-helpers')
const exceljs = require('exceljs')
const PdfPrinter = require('pdfmake')
const fs = require('fs');
const puppeteer = require('puppeteer')
const generatePdfTemplate = require('../public/reports/getPdfTemplate');
// const { default: orders } = require('razorpay/dist/types/orders');



const totalSaleExcel = async (req, res) => {
  try {

    const totalSaleToday = await dashbordHelper.totalSaleToday()

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('orders');
    const columns = [
      { header: "S:no", key: "s_no" },
      { header: "Id", key: "_id" },
      { header: 'Product', key: "Name" },
      { header: "Total", key: "totalPrice" },
      { header: "Payment Method", key: "payment" },
      { header: "Delivered Status", key: "status" },
      { header: "Order Date", key: "createdOn" },
      { header: "__v", key: "__v" }
    ];
    worksheet.columns = columns;

    let s_no = 1;
    totalSaleToday.forEach(order => {
      order.products.forEach(products => {
        console.log(s_no, order._id, products, order.totalPrice, order.payment, order.status, order.createdOn, order.__v, "revenue")
        worksheet.addRow({
          s_no: s_no++,
          _id: order._id,
          product: products,
          totalPrice: order.totalPrice,
          payment: order.payment,
          status: order.status,
          createdOn: order.createdOn,
          __v: order.__v
        })
      })
    })

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    })

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", 'attachment;filename=revenue.xlsx');
    return workbook.xlsx.write(res).then(() => {
      res.status(200);
    })
  } catch (error) {
    console.log(error);
  }
}

const totalRevenueExcel = async (req, res) => {
  try {
    const allOrder = await orderHelper.findOrderDeliverd()
    console.log(allOrder, 'orderhere');
    const workbook = new exceljs.Workbook()
    const worksheet = workbook.addWorksheet('orders')
    const columns = [
      { header: "S:no", key: "s_no" },
      { header: "Order Id", key: "_id" },
      { header: "Products", key: "products" },
      { header: "Total", key: "totalPrice" },
      { header: "Payment Method", key: "payment" },
      { header: "Delivered Status", key: "status" },
      { header: "Order Date", key: "createdOn" },
      { header: "__v", key: "__v" }
    ];
    worksheet.columns = columns;
    let s_no = 1;
    allOrder.forEach(order => {
      order.products.forEach(products => {

        worksheet.addRow({
          s_no: s_no++,
          _id: order._id,
          product: products,
          totalPrice: order.totalPrice,
          paymentMethod: order.payment,
          deliverdStatus: order.status,
          createdOn: order.createdOn,
          __v: order.__v
        })
      })
    })
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
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

const productListExcel = async (req, res) => {

  try {

    const productModelList = await productHelpers.getAllproducts()
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('orders');
    worksheet.columns = [
      { header: "S no", key: "s_no" },
      { header: "Id", key: "_id" },
      { header: "productName", key: "Name" },
      { header: "Category", key: "Category" },
      { header: "Description", key: "Description" },
      { header: "Price", key: "Price" }
    ];
    let counter = 1;
    productModelList.forEach(element => {
      element.s_no = counter;
      worksheet.addRow(element);
      counter++;
    });
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
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
const allOrderStatus = async (req, res) => {
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
    allOrder.forEach(order => {
      order.products.forEach(product => {
        worksheet.addRow({
          s_no: s_no++,
          _id: order._id,
          userId: order.userId,
          Name: product,
          totalPrice: order.totalPrice,
          payment: order.payment,
          status: order.status,
          createdOn: order.createdOn,
        })
      })
    })
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
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
const customPDF = async (req, res) => {
  try {
    const startDate = req.query.start;
    const endDate = req.query.end;
    const allOrder = await orderHelper.findOrderByDate(startDate, endDate)
    const browser = await puppeteer.launch();
    const page = await browser.newPage()

    let netTotalAmount = 0
    allOrder.forEach(it=>{
      netTotalAmount += it.totalPrice
    })

    const content = generatePdfTemplate({
      orders: allOrder,
      netTotalAmount,
      netFinalAmount: netTotalAmount,
      netDiscount:0,
    })

    await page.setContent(content)
    const pdfBuffer = await page.pdf({ format: 'A4' })

    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  totalSaleExcel,
  totalRevenueExcel,
  productListExcel,
  customPDF,
  allOrderStatus
}