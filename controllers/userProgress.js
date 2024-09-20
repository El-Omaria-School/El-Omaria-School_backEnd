const nodemailer = require("nodemailer");
const UserProgress = require("../models/UserProgress");

class UserProgressController {
  constructor(userRepository, lessonRepository) {
    this.userRepository = userRepository;
    this.lessonRepository = lessonRepository;
  }

  async getUserProgress(userId) {
    let progress = await UserProgress.findOne({ userId })
      .populate("lessonsIds")
      .populate("tasksIds");
    return progress;
  }

  async openLesson(userId, lessonId) {
    const user = await this.userRepository.findUserById(userId);
    const lesson = await this.lessonRepository.getLessonById(lessonId);
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    let mailOptions = {
      from: process.env.USER_EMAIL,
      to: user.email,
      subject: "😃تم فتح درس جديد",
      html: `<div>
        <h4 style='color: #749b8c'>${lesson.name} تم فتح</h4>
        <p>افتح تطبيق مدرسة العمرية لرؤية الدرس المفتوح</p>
        </div>`,
    };

    await transporter.sendMail(mailOptions);

    let videos = await UserProgress.findOne({ userId });
    if (!videos) {
      await UserProgress.create({ userId, lessonsIds: [lessonId] });
    } else {
      videos.lessonsIds.push(lessonId);
      await videos.save();
    }
  }

  async taskDone(userId, taskId) {
    let videos = await UserProgress.findOne({ userId });
    videos.tasksIds.push(taskId);
    await videos.save();
  }
}

module.exports = UserProgressController;
