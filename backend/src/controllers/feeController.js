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
const getAllFees = async(req,res) => {
    try {
        const fees = await studentFeeModel.find().populate({
            path: "studentId",
            populate: {
                path: "userId",
                select: "name email"
            }
        })

        const formattedFees = fees.map((fee) => ({
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
             paymentHistory: []
        }));


    return res.status(200).json({

      success: true,

      fees: formattedFees

    });
    } catch (error) {
          console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
    }
}
export default { collectFee, getAllFees };