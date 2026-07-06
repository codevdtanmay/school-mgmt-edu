




import studentModel from "../models/student.model.js";
import teacherModel from "../models/teacherSchema.model.js";
import noticeModel from "../models/notice.model.js";

const getDashboardStats = async (req, res) => {
  try {

    const totalStudents =
      await studentModel.countDocuments();

    const totalTeachers =
      await teacherModel.countDocuments();

    const activeNotices =
      await noticeModel.countDocuments();

    const students =
      await studentModel.find();

    const feesCollected =
      students.reduce(
        (sum, student) =>
          sum + student.paidAmount,
        0
      );

    return res.status(200).json({
      success: true,
      totalStudents,
      totalTeachers,
      feesCollected,
      activeNotices
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};

const getFeeSummary = async (req, res) => {

  const students =
    await studentModel.find();

  const collected =
    students.reduce(
      (sum, student) =>
        sum + student.paidAmount,
      0
    );

  const pending =
    students.reduce(
      (sum, student) =>
        sum + student.dueAmount,
      0
    );

  const total =
    collected + pending;

  return res.json({
    success: true,
    collected,
    pending,
    total
  });
};

const getRecentNotices = async (
  req,
  res
) => {

  const notices =
    await noticeModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5);

  res.json({
    success: true,
    notices
  });
};

const getActivities = async (
  req,
  res
) => {

  const students =
    await studentModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId","name");

  const activities =
    students.map(student => ({
      activity:
        `New student ${student.userId.name} admitted`,
      time:
        student.createdAt
    }));

  res.json({
    success: true,
    activities
  });
};

export default {
  getDashboardStats,
  getFeeSummary,
  getRecentNotices,
  getActivities
}