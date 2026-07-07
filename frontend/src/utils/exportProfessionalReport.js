import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const addChartToPDF = (
    pdf,
    chartRef,
    title
) => {

    if (!chartRef?.current)
        return;

    const chartImage =
        chartRef.current.toBase64Image();

    pdf.addPage();

    pdf.setFontSize(18);

    pdf.text(
        title,
        15,
        20
    );

    pdf.addImage(
        chartImage,
        "PNG",
        15,
        35,
        180,
        90
    );
};

export const exportProfessionalReport = (
    stats,
    topCrops,
    topFarmers,
    revenueChartRef,
    farmerChartRef,
    cropChartRef
) => {

    const pdf =
        new jsPDF();

    /*
    PAGE 1
    COVER
    */

    pdf.setFontSize(26);

    pdf.text(
        "KissanPWA",
        70,
        60
    );

    pdf.setFontSize(18);

    pdf.text(
        "Business Intelligence Report",
        40,
        80
    );

    pdf.setFontSize(12);

    pdf.text(
        new Date().toLocaleDateString(),
        80,
        100
    );

    /*
    PAGE 2
    KPI
    */

    pdf.addPage();

    pdf.setFontSize(18);

    pdf.text(
        "Dashboard KPI Summary",
        15,
        20
    );

    autoTable(pdf,{
        startY:35,

        head:[
            [
                "Metric",
                "Value"
            ]
        ],

        body:[
            [
                "Revenue",
                stats.totalRevenue
            ],
            [
                "Online Payments",
                stats.totalOnline
            ],
            [
                "COD Pending",
                stats.codPending
            ],
            [
                "Orders",
                stats.totalOrders
            ]
        ]
    });

    /*
    PAGE 3
    REVENUE
    */

    addChartToPDF(
        pdf,
        revenueChartRef,
        "Revenue Trend"
    );

    /*
    PAGE 4
    FARMERS
    */

    addChartToPDF(
        pdf,
        farmerChartRef,
        "Farmer Earnings"
    );

    /*
    PAGE 5
    CROPS
    */

    addChartToPDF(
        pdf,
        cropChartRef,
        "Crop Analytics"
    );

    /*
    PAGE 6
    TOP CROPS
    */

    pdf.addPage();

    pdf.text(
        "Top Selling Crops",
        15,
        20
    );

    autoTable(pdf,{
        startY:35,

        head:[
            [
                "Crop",
                "Quantity Sold"
            ]
        ],

        body:
        topCrops.map(
            crop => [

                crop.crop_name,

                crop.total_sold

            ]
        )
    });

    /*
    PAGE 7
    TOP FARMERS
    */

    pdf.addPage();

    pdf.text(
        "Top Farmers",
        15,
        20
    );

    autoTable(pdf,{
        startY:35,

        head:[
            [
                "Farmer",
                "Revenue"
            ]
        ],

        body:
        topFarmers.map(
            farmer => [

                farmer.full_name,

                farmer.revenue

            ]
        )
    });

    pdf.save(
        "KissanPWA_BI_Report.pdf"
    );
};