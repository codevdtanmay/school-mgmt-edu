import studentModel from "../models/student.model.js";
import feeStructureModel from "../models/feeStructure.js";
import computeInstallmentDetails from "../utils/installmentCalculator.js";

const collectFee = async (req, res) => {
  try {

    const {
      studentId,
      amountPaid,
      paymentMethod
    } = req.body;

    if (!studentId || !amountPaid) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Amount are required"
      });
    }

    const student =
      await studentModel.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    if (amountPaid > student.dueAmount) {
      return res.status(400).json({
        success: false,
        message: "Amount exceeds due amount"
      });
    }

    const receiptNo =
      `REC-${Date.now()}`;

    const paymentRecord = {
      receiptNo,
      amount: amountPaid,
      date: new Date()
        .toISOString()
        .split("T")[0],
      paymentMethod:
        paymentMethod || "Cash"
    };

    student.paidAmount += Number(amountPaid);

    student.dueAmount =
      student.totalFee -
      student.paidAmount;

    if (
      student.paidAmount >=
      student.totalFee
    ) {

      student.status = "Paid";

    } else if (
      student.paidAmount > 0
    ) {

      student.status = "Partial";

    } else {

      student.status = "Unpaid";

    }

    student.paymentHistory.push(
      paymentRecord
    );

    await student.save();

    return res.status(200).json({
      success: true,
      message:
        "Fee Collected Successfully",
      receipt: paymentRecord,
      student
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error"
    });

  }
};

const getStudentFeeDetails = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const student =
      await studentModel.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const structure =
      await feeStructureModel.findById(
        student.feeStructureId
      );

    const installments =
      computeInstallmentDetails(
        student.paidAmount,
        structure
      );

    return res.status(200).json({
      success: true,

      totalFee: student.totalFee,
      paidAmount: student.paidAmount,
      dueAmount: student.dueAmount,
      status: student.status,

      installments
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }

};

const getPaymentHistory = async (req, res) => {
  try {

    const { id } = req.params;

    const student = await studentModel
      .findById(id)
      .populate("userId", "name");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    return res.status(200).json({
      success: true,
      studentName: student.userId.name,
      admissionNo: student.admissionNo,
      paymentHistory: student.paymentHistory
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};

const getFeeDashboard = async (req, res) => {
  try {

    const students = await studentModel.find();

    const totalStudents = students.length;

    const totalCollected = students.reduce(
      (sum, student) => sum + student.paidAmount,
      0
    );

    const totalPending = students.reduce(
      (sum, student) => sum + student.dueAmount,
      0
    );

    const studentsWithDue = students.filter(
      student => student.dueAmount > 0
    ).length;

    const fullyPaidStudents = students.filter(
      student => student.status === "Paid"
    ).length;

    return res.status(200).json({
      success: true,
      totalStudents,
      totalCollected,
      totalPending,
      studentsWithDue,
      fullyPaidStudents
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};

export default {
  collectFee,getStudentFeeDetails,getPaymentHistory,getFeeDashboard
};