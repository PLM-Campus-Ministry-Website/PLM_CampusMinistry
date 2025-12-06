import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScoreboardService } from './scoreboard.service';
import { CertificateService } from './certificate.service';

interface Course {
  id: number;
  title: string;
  description?: string;
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {
  courses: Course[] = [
    {
      id: 1,
      title: 'Introduction to the Catholic Faith',
    },
    {
      id: 2,
      title: 'Understanding the Holy Mass',
    },
    {
      id: 3,
      title: 'The Sacraments: Channels of God\'s Grace',
    },
    {
      id: 4,
      title: 'The Bible and How Catholics Read It',
    },
    {
      id: 5,
      title: 'The Creed: What Catholics Believe',
    },
    {
      id: 6,
      title: 'The Life and Teachings of Jesus Christ',
    },
    {
      id: 7,
      title: 'Foundations of Christian Prayer',
    },
    {
      id: 8,
      title: 'The Ten Commandments and Moral Living',
    },
    {
      id: 9,
      title: 'The Holy Trinity Explained',
    },
    {
      id: 10,
      title: 'Who Is the Blessed Virgin Mary?',
    },
    {
      id: 11,
      title: 'The Church: One, Holy, Catholic, and Apostolic',
    },
    {
      id: 12,
      title: 'The Saints and the Communion of Saints',
    },
    {
      id: 13,
      title: 'Introduction to Catholic Social Teaching',
    },
    {
      id: 14,
      title: 'Understanding Sin, Grace, and Salvation',
    },
    {
      id: 15,
      title: 'Angels, Demons, and Spiritual Warfare',
    },
    {
      id: 16,
      title: 'The Liturgical Year: Seasons and Celebrations',
    },
    {
      id: 17,
      title: 'The Eucharist: Source and Summit of Christian Life',
    },
    {
      id: 18,
      title: 'Confession and the Mercy of God',
    },
    {
      id: 19,
      title: 'Christian Discipleship and Mission',
    },
    {
      id: 20,
      title: 'Introduction to the Catechism of the Catholic Church',
    },
    {
      id: 21,
      title: 'How to Pray the Rosary and Marian Devotions',
    },
    {
      id: 22,
      title: 'Basic Apologetics: Defending the Catholic Faith',
    },
    {
      id: 23,
      title: 'Living the Virtues: Faith, Hope, and Charity',
    },
    {
      id: 24,
      title: 'The Holy Spirit and His Gifts',
    },
    {
      id: 25,
      title: 'Introduction to Church History',
    },
    {
      id: 26,
      title: 'Understanding the Last Things: Death, Judgment, Heaven, and Hell',
    },
    {
      id: 27,
      title: 'Marriage and Family in the Catholic Church',
    },
    {
      id: 28,
      title: 'Introduction to Liturgy and Sacramentals',
    },
    {
      id: 29,
      title: 'The Role of the Laity in the Church',
    },
    {
      id: 30,
      title: 'How to Discern God\'s Will',
    },
  ];

  myScore: any = null;
  certificates: any[] = [];
  completedCourses: any[] = [];
  showScoreboard: boolean = false;
  totalXP: number = 0;
  coursesCompleted: number = 0;
  streak: number = 0;

  constructor(
    private router: Router,
    private scoreboardService: ScoreboardService,
    private certificateService: CertificateService
  ) {}

  ngOnInit() {
    this.loadUserScoreboard();
    this.loadCertificates();
    this.loadCompletedCourses();
  }

  loadUserScoreboard() {
    // Get all course progress from localStorage
    let totalXP = 0;
    let coursesCompleted = 0;
    let allStreaks: number[] = [];
    let maxStreak = 0;

    // Check all courses (1-30)
    for (let courseId = 1; courseId <= 30; courseId++) {
      const saved = localStorage.getItem(`course_progress_${courseId}`);
      if (saved) {
        const progress = JSON.parse(saved);
        totalXP += progress.totalXP || 0;
        allStreaks.push(progress.streak || 0);
        
        // Check if course is completed (all lessons done)
        const courseLessons = this.getCourseLessonsCount(courseId);
        if (courseLessons > 0 && progress.lessonsCompleted && progress.lessonsCompleted.length === courseLessons) {
          coursesCompleted++;
        }
      }
    }

    maxStreak = allStreaks.length > 0 ? Math.max(...allStreaks) : 0;

    this.totalXP = totalXP;
    this.coursesCompleted = coursesCompleted;
    this.streak = maxStreak;
  }

  getCourseLessonsCount(courseId: number): number {
    // Return lesson count for each course
    if (courseId === 1) return 14; // Introduction to Catholic Faith
    if (courseId === 2) return 16; // Understanding the Holy Mass
    // Add more as courses are implemented
    return 0;
  }

  loadCertificates() {
    this.certificates = this.certificateService.getAllCertificates();
  }

  loadCompletedCourses() {
    this.completedCourses = [];
    
    // Check all courses and see which are completed
    for (let courseId = 1; courseId <= 30; courseId++) {
      const saved = localStorage.getItem(`course_progress_${courseId}`);
      if (saved) {
        const progress = JSON.parse(saved);
        const courseLessons = this.getCourseLessonsCount(courseId);
        
        if (courseLessons > 0 && progress.lessonsCompleted && progress.lessonsCompleted.length === courseLessons) {
          const courseTitle = this.getCourseTitle(courseId);
          this.completedCourses.push({
            id: courseId,
            title: courseTitle,
            completedDate: progress.lastStudyDate || new Date().toISOString(),
            xp: progress.totalXP || 0
          });
        }
      }
    }
  }

  getCourseTitle(courseId: number): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.title : `Course ${courseId}`;
  }

  toggleScoreboard() {
    this.showScoreboard = !this.showScoreboard;
    if (this.showScoreboard) {
      this.loadUserScoreboard();
      this.loadCompletedCourses();
    }
  }

  downloadCertificate(certificate: any) {
    this.certificateService.downloadCertificateAsImage(certificate);
  }

  openCourse(course: Course) {
    this.router.navigate(['/courses', course.id]);
  }
}

