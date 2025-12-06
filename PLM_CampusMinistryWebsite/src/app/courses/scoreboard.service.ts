import { Injectable } from '@angular/core';

export interface UserScore {
  userId: string;
  userName: string;
  totalXP: number;
  coursesCompleted: number;
  streak: number;
  lastActive: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScoreboardService {
  private readonly STORAGE_KEY = 'course_scores';

  getUserScore(userId: string): UserScore | null {
    const scores = this.getAllScores();
    return scores.find(s => s.userId === userId) || null;
  }

  updateUserScore(userId: string, userName: string, xp: number, coursesCompleted: number, streak: number): void {
    const scores = this.getAllScores();
    const existingIndex = scores.findIndex(s => s.userId === userId);
    
    const userScore: UserScore = {
      userId,
      userName,
      totalXP: xp,
      coursesCompleted,
      streak,
      lastActive: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      scores[existingIndex] = userScore;
    } else {
      scores.push(userScore);
    }

    // Sort by XP (descending)
    scores.sort((a, b) => b.totalXP - a.totalXP);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores));
  }

  getAllScores(): UserScore[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  getTopScores(limit: number = 10): UserScore[] {
    const scores = this.getAllScores();
    return scores.slice(0, limit);
  }

  getCurrentUserId(): string {
    let userId = localStorage.getItem('current_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('current_user_id', userId);
    }
    return userId;
  }

  getCurrentUserName(): string {
    return localStorage.getItem('current_user_name') || 'Anonymous User';
  }

  setCurrentUserName(name: string): void {
    localStorage.setItem('current_user_name', name);
  }
}

