export interface GuideSection { heading: string; body: string; }
export interface Guide {
  slug: string; title: string; description: string; publishDate: string;
  seoTitle: string; seoDescription: string; relatedTools: string[]; sections: GuideSection[];
}

export const guides: Guide[] = [
  {
    slug: 'how-to-calculate-percentages',
    title: 'How to Calculate Percentages Easily',
    description: 'A simple guide to understanding and calculating percentages, with real-world examples like discounts, tips, and grades.',
    publishDate: '2026-08-13',
    seoTitle: 'How to Calculate Percentages Easily: A Simple Guide | MarqDesk',
    seoDescription: 'Learn the basic formulas for calculating percentages, percentage change, and discounts. A clear, easy-to-understand guide for students.',
    relatedTools: ['percentage-calculator', 'grade-calculator'],
    sections: [
      { heading: 'What is a percentage?', body: 'The word "percent" comes from the Latin "per centum", meaning "by the hundred". A percentage is simply a fraction where the denominator is always 100. When you see 25%, it literally means 25 out of 100, which is the same as the decimal 0.25 or the fraction 1/4.' },
      { heading: 'The three most common percentage problems', body: '<strong>1. Finding a percentage of a number.</strong> (Percentage ÷ 100) × Number. Example: (20 ÷ 100) × 50 = $10.<br><br><strong>2. Finding what percent one number is of another.</strong> (Part ÷ Whole) × 100. Example: (45 ÷ 60) × 100 = 75%.<br><br><strong>3. Calculating percentage change.</strong> ((New - Old) ÷ |Old|) × 100. Example: ((120 - 100) ÷ 100) × 100 = 20%.' },
      { heading: 'Mental math tricks', body: 'To find 15% of a number, find 10% (move the decimal point one place left) and add half of that (5%). Example: 15% of 80 → 8 + 4 = 12.' },
    ]
  },
  {
    slug: 'how-to-create-a-strong-password',
    title: 'How to Create a Strong Password',
    description: 'Learn why password length matters more than complexity, how entropy works, and the best practices for keeping your accounts secure.',
    publishDate: '2026-08-13',
    seoTitle: 'How to Create a Strong Password: Length, Entropy, and Security | MarqDesk',
    seoDescription: 'A practical guide to creating unbreakable passwords. Learn why length beats complexity, how password entropy works, and why you should use a password manager.',
    relatedTools: ['password-generator'],
    sections: [
      { heading: 'Length beats complexity', body: 'Security experts agree that length is far more important than complexity. An 8-character password with symbols can be cracked much faster than a 16-character password made only of lowercase letters.' },
      { heading: 'Understanding password entropy', body: 'Entropy measures how unpredictable your password is, in "bits". A 16-character password using all character types has over 100 bits of entropy, which is extremely strong.' },
      { heading: 'Never reuse passwords', body: 'If you reuse one password and a single site gets breached, attackers will try it on your bank and email. Every account needs a unique password.' },
      { heading: 'Use a password manager', body: 'Because you need unique, long, random passwords everywhere, use a password manager to generate and store them. You only remember one strong master password.' },
    ]
  },
  {
    slug: 'pomodoro-technique-guide',
    title: 'The Pomodoro Technique: A Simple Guide to Focused Study',
    description: 'How to use the Pomodoro technique to beat procrastination, maintain focus, and avoid burnout during long study sessions.',
    publishDate: '2026-08-13',
    seoTitle: 'The Pomodoro Technique: A Simple Guide for Students | MarqDesk',
    seoDescription: 'Learn how to use the Pomodoro technique to improve focus and study more effectively. A step-by-step guide to 25-minute focus intervals and breaks.',
    relatedTools: ['study-timer'],
    sections: [
      { heading: 'What is the Pomodoro Technique?', body: 'A time management method that breaks work into 25-minute intervals separated by short breaks. Each interval is called a "pomodoro".' },
      { heading: 'The basic steps', body: '<strong>1.</strong> Choose one task. <strong>2.</strong> Set a 25-minute timer. <strong>3.</strong> Work until it rings. <strong>4.</strong> Take a 5-minute break. <strong>5.</strong> After four pomodoros, take a 15–30 minute break.' },
      { heading: 'Why it works for students', body: 'It lowers the barrier to starting: "25 minutes" feels easy while "4 hours" feels overwhelming. Forced breaks also prevent mental fatigue.' },
    ]
  },
  {
    slug: 'how-to-calculate-gpa',
    title: 'How to Calculate GPA Step by Step',
    description: 'A clear guide to calculating your Grade Point Average on the 4.0 scale, with a fully worked example and common mistakes to avoid.',
    publishDate: '2026-08-14',
    seoTitle: 'How to Calculate GPA Step by Step (4.0 Scale) | MarqDesk',
    seoDescription: 'Learn how GPA is calculated on the 4.0 scale with credit weighting. Includes a worked example, grade point table, and common mistakes to avoid.',
    relatedTools: ['gpa-calculator', 'grade-calculator'],
    sections: [
      { heading: 'What GPA actually measures', body: 'GPA (grade point average) is a credit-weighted average of your grades. A 4-credit course influences your GPA more than a 1-credit course, which is why simple averaging of letter grades gives the wrong answer.' },
      { heading: 'Step-by-step calculation', body: '<strong>1.</strong> Convert each letter grade to grade points (A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, and so on).<br><strong>2.</strong> Multiply each grade point by the course credits.<br><strong>3.</strong> Add all those products together.<br><strong>4.</strong> Divide by the total number of credits.<br><br>Example: Course 1 = A (3 credits) → 12 points. Course 2 = B+ (3 credits) → 9.9 points. Total = 21.9 ÷ 6 credits = 3.65 GPA.' },
      { heading: 'Common GPA mistakes', body: 'Averaging grades without credit weighting is the most common error. Others include mixing different grading scales and forgetting that repeated courses may replace earlier grades depending on your institution’s policy.' },
    ]
  },
  {
    slug: 'ohms-law-explained',
    title: "Ohm's Law Explained with Simple Examples",
    description: 'Understand the relationship between voltage, current, and resistance with the water pipe analogy and fully worked examples.',
    publishDate: '2026-08-14',
    seoTitle: "Ohm's Law Explained with Examples (V = IR) | MarqDesk",
    seoDescription: "A beginner-friendly explanation of Ohm's Law with the water pipe analogy, the three formula forms, and worked circuit examples.",
    relatedTools: ['ohms-law-calculator'],
    sections: [
      { heading: 'The water pipe analogy', body: 'Think of electricity like water in a pipe. Voltage (V) is the water pressure pushing the flow. Current (I) is the amount of water flowing. Resistance (R) is anything narrowing the pipe and slowing the flow.' },
      { heading: 'The three forms of the formula', body: '<strong>V = I × R</strong> (find voltage). <strong>I = V ÷ R</strong> (find current). <strong>R = V ÷ I</strong> (find resistance).<br><br>Example: A 12 V battery connected to a 4 Ω resistor gives I = 12 ÷ 4 = 3 A of current.' },
      { heading: 'Connecting to power', body: 'Once you know voltage and current, electrical power is P = V × I. In the example above, the resistor dissipates 12 V × 3 A = 36 W of power.' },
    ]
  },
  {
    slug: 'attendance-75-percent-rule',
    title: 'The 75% Attendance Rule: How to Stay Eligible',
    description: 'Why institutions require 75% attendance, how to check where you stand, and the math behind catching up when you fall short.',
    publishDate: '2026-08-14',
    seoTitle: 'The 75% Attendance Rule Explained for Students | MarqDesk',
    seoDescription: 'Understand the 75% attendance requirement, calculate your current percentage, and learn the math of how many classes you need to attend to recover.',
    relatedTools: ['attendance-calculator'],
    sections: [
      { heading: 'Why 75%?', body: 'Many schools and universities require students to attend at least 75% of classes to remain eligible for exams. The rule exists because consistent attendance strongly correlates with learning outcomes.' },
      { heading: 'Checking where you stand', body: 'Divide attended classes by total classes and multiply by 100. Example: 45 attended out of 60 = 75% — exactly on the line. 50 out of 60 = 83.3% — comfortably safe.' },
      { heading: 'The math of catching up', body: 'If you are below the target, every future class you attend raises your percentage, because both the top and bottom of the fraction grow. To go from 70 attended out of 100 to 75%, you must attend 20 consecutive classes: (70 + 20) ÷ (100 + 20) = 90 ÷ 120 = 75%. This is exactly what the attendance calculator computes for you.' },
    ]
  },
];

export const publishedGuides = guides;
export function getGuide(slug: string): Guide | undefined { return publishedGuides.find((g) => g.slug === slug); }
