import studentModel from "../models/student.model.js";
import teacherModel from "../models/teacherSchema.model.js";

const getDashboardStats = async (req, res) => {
  try {

    const totalStudents = await studentModel.countDocuments({
      isDeleted: false
    });

    const totalTeachers = await teacherModel.countDocuments({
      isDeleted: false
    });

    const students = await studentModel.find(
      { isDeleted: false },
      "paidAmount dueAmount status"
    );

    const feesCollected = students.reduce(
      (sum, student) => sum + student.paidAmount,
      0
    );

    const pendingFees = students.reduce(
      (sum, student) => sum + student.dueAmount,
      0
    );

    const paidStudents = students.filter(
      student => student.status === "Paid"
    ).length;

    const partialStudents = students.filter(
      student => student.status === "Partial"
    ).length;

    const pendingStudents = students.filter(
      student => student.status === "Pending"
    ).length;

    return res.status(200).json({
      success: true,

      totalStudents,
      totalTeachers,

      feesCollected,
      pendingFees,

      paidStudents,
      partialStudents,
      pendingStudents
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};

const getFeeSummary = async (req, res) => {
  try {

    const students = await studentModel.find(
      { isDeleted: false },
      "paidAmount dueAmount"
    );

    const collected = students.reduce(
      (sum, student) => sum + student.paidAmount,
      0
    );

    const pending = students.reduce(
      (sum, student) => sum + student.dueAmount,
      0
    );

    const total = collected + pending;

    return res.status(200).json({
      success: true,
      collected,
      pending,
      total
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};

const getActivities = async (req, res) => {
  try {

    const students = await studentModel
      .find({
        isDeleted: false
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name");

    const activities = students.map(student => ({
      activity: `New student ${student.userId?.name} admitted`,
      time: student.createdAt
    }));

    return res.status(200).json({
      success: true,
      activities
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
  getDashboardStats,
  getFeeSummary,
  getActivities
};