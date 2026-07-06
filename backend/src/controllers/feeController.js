import studentFeeModel from "../models/studentFee.model.js";
import feePaymentModel from "../models/feePayment.model.js";


const collectFee = async (req, res) => {
  try {
    const { studentId, amountPaid, paymentMethod } = req.body;

    const fee = await studentFeeModel.findOne({ studentId });

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found"
      });
    }

    const newPaidAmount = fee.paidAmount + Number(amountPaid);
    const newDueAmount = fee.totalFee - newPaidAmount;

    let status = "Pending";

    if (newDueAmount <= 0) {
      status = "Paid";
    } else if (newPaidAmount > 0) {
      status = "Partial";
    }

    fee.paidAmount = newPaidAmount;
    fee.dueAmount = Math.max(0, newDueAmount);
    fee.status = status;

    await fee.save();

    const receiptNo = `REC-${Date.now()}`;

    await feePaymentModel.create({
      studentId,
      amount: amountPaid,
      paymentMethod,
      receiptNo
    });

    return res.status(200).json({
      success: true,
      message: "Fee collected successfully",
      receiptNo
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const getFeeHistory = async (req, res) => {
  try {
    const { month, year, paymentMethod, studentId } = req.query;

    const filter = {};

    // Filter by student
    if (studentId) {
      filter.studentId = studentId;
    }

    // Filter by payment method
    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    // Filter by month & year
    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);

      const endDate = new Date(Number(year), Number(month), 1);

      filter.createdAt = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const payments = await feePaymentModel
      .find(filter)
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email"
        }
      })
      .sort({ createdAt: -1 });

    const formattedHistory = payments.map((payment) => ({
      id: payment._id,

      studentId: payment.studentId?._id,

      name: payment.studentId?.userId?.name,

      email: payment.studentId?.userId?.email,

      admissionNo: payment.studentId?.admissionNo,

      className: `${payment.studentId?.class}-${payment.studentId?.section}`,

      amount: payment.amount,

      paymentMethod: payment.paymentMethod,

      receiptNo: payment.receiptNo,

      date: payment.createdAt.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    }));

    const totalCollection = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    return res.status(200).json({
      success: true,
      totalPayments: payments.length,
      totalCollection,
      history: formattedHistory
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
const getAllFees = async (req, res) => {
  try {
    const { status, className, section } = req.query;

    // StudentFee filters
    const feeFilter = {};

    if (status) {
      feeFilter.status = status;
    }

    const fees = await studentFeeModel
      .find(feeFilter)
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email"
        }
      });

    // Class & Section filter
    let filteredFees = fees;

    if (className) {
      filteredFees = filteredFees.filter(
        fee => fee.studentId?.class === className
      );
    }

    if (section) {
      filteredFees = filteredFees.filter(
        fee => fee.studentId?.section === section
      );
    }

    const formattedFees = await Promise.all(
      filteredFees.map(async (fee) => {

        const payments = await feePaymentModel
          .find({ studentId: fee.studentId._id })
          .sort({ createdAt: -1 });

        return {
          id: fee._id,

          studentId: fee.studentId?._id,

          name: fee.studentId?.userId?.name,

          email: fee.studentId?.userId?.email,

          admissionNo: fee.studentId?.admissionNo,

          className: `${fee.studentId?.class}-${fee.studentId?.section}`,

          totalFee: fee.totalFee,

          paidAmount: fee.paidAmount,

          dueAmount: fee.dueAmount,

          status: fee.status,

          paymentHistory: payments.map(payment => ({
            amount: payment.amount,

            paymentMethod: payment.paymentMethod,

            receiptNo: payment.receiptNo,

            date: payment.createdAt.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })
          }))
        };
      })
    );

    // Summary
    const summary = {
      totalStudents: filteredFees.length,

      pending: filteredFees.filter(f => f.status === "Pending").length,

      partial: filteredFees.filter(f => f.status === "Partial").length,

      paid: filteredFees.filter(f => f.status === "Paid").length
    };

    return res.status(200).json({
      success: true,
      summary,
      fees: formattedFees
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
export default { collectFee, getAllFees ,getFeeHistory};