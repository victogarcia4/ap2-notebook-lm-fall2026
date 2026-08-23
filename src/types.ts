/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LearningOutcome {
  id: string;
  chap: string;
  topic: string;
  desc: string;
}

export interface Student {
  id: string;
  name: string;
  gradeBasis: string;
  units: string;
  plan: string;
  level: string;
  exam1?: LearningOutcome;
  exam2?: LearningOutcome;
  exam3?: LearningOutcome;
  exam4?: LearningOutcome;
  exam5?: LearningOutcome;
}

export interface SubmittedNotebook {
  id: string;
  title: string;
  url: string;
  author: string;
  role: 'student' | 'instructor';
  examId: 'exam1' | 'exam2' | 'exam3' | 'exam4' | 'exam5';
  topic: string;
  description: string;
  createdAt: string;
}

export interface SubmittedGame {
  id: string;
  title: string;
  url: string;
  author: string;
  role: 'student' | 'instructor';
  examId: 'exam1' | 'exam2' | 'exam3' | 'exam4' | 'exam5';
  topic: string;
  description: string;
  createdAt: string;
}

export type AcademicSession = 'su26' | 'fa26' | 'sp27';
export type DistributionPolicy = 'balanced' | 'pure';

