// seed.js
const mongoose = require("mongoose");

// 🔑 Conexión a Mongo Atlas (ajusta la URI con tu usuario/contraseña)

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

/* ============= MODELOS ============= */
const UserSchema = new mongoose.Schema({
  email: String,
  password: String, // 🔐 en producción usar hash
  role: { type: String, enum: ["admin", "instructor", "learner"], default: "learner" },
});
const User = mongoose.model("User", UserSchema);

const ChapterSchema = new mongoose.Schema({
  title: String,
  description: String,
  order: Number,
  resourceType: { type: String, enum: ["video", "pdf", "image", "link"] },
  resourceUrl: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});
const Chapter = mongoose.model("Chapter", ChapterSchema);

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  coverImage: String,
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
  resources: [{ resourceType: String, url: String }],
});
const Course = mongoose.model("Course", CourseSchema);

const EnrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  completedChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
});
const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);

const BadgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  name: String,
  icon: String,
});
const Badge = mongoose.model("Badge", BadgeSchema);

/* ============= SEED ============= */
async function seed() {
  try {
    await mongoose.connection.dropDatabase(); // ⚠️ limpia la BD (para pruebas)

    // Crear usuarios
    const admin = await User.create({ email: "admin@coe.com", password: "123456", role: "admin" });
    const instructor = await User.create({ email: "instructor@coe.com", password: "123456", role: "instructor" });
    const learner = await User.create({ email: "learner@coe.com", password: "123456", role: "learner" });

    // Crear curso
    const course = await Course.create({
      title: "Curso de HTML Básico",
      description: "Aprende los fundamentos de HTML",
      category: "Frontend",
      status: "published",
      coverImage: "https://placehold.co/600x400",
    });

    // Crear capítulos
    const ch1 = await Chapter.create({
      title: "Introducción a HTML",
      description: "Qué es HTML y su estructura básica",
      order: 1,
      resourceType: "video",
      resourceUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE",
      courseId: course._id,
    });

    const ch2 = await Chapter.create({
      title: "Etiquetas principales",
      description: "Conoce las etiquetas más usadas",
      order: 2,
      resourceType: "pdf",
      resourceUrl: "https://example.com/html-basico.pdf",
      courseId: course._id,
    });

    // Vincular capítulos al curso
    course.chapters.push(ch1._id, ch2._id);
    await course.save();

    // Crear inscripción de learner
    await Enrollment.create({
      userId: learner._id,
      courseId: course._id,
      completedChapters: [ch1._id], // ya completó el capítulo 1
    });

    // Crear insignia de prueba
    await Badge.create({
      userId: learner._id,
      courseId: course._id,
      name: " HTML Beginner",
      icon: "https://cdn-icons-png.flaticon.com/512/919/919827.png",
    });

    console.log("Base de datos poblada con datos de prueba");
    process.exit();
  } catch (err) {
    console.error(" Error en seed:", err);
    process.exit(1);
  }
}

seed();