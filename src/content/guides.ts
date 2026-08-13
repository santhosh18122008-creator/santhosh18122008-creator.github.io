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
      { heading: 'The three most common percentage problems', body: '<strong>1. Finding a percentage of a number.</strong> For example, what is 20% of $50? The formula is: (Percentage ÷ 100) × Number. So, (20 ÷ 100) × 50 = 0.20 × 50 = $10.<br><br><strong>2. Finding what percent one number is of another.</strong> For example, if you got 45 points out of a possible 60, what is your grade? The formula is: (Part ÷ Whole) × 100. So, (45 ÷ 60) × 100 = 75%.<br><br><strong>3. Calculating percentage change.</strong> For example, if a stock goes from $100 to $120. The formula is: ((New - Old) ÷ |Old|) × 100. So, ((120 - 100) ÷ 100) × 100 = 20%.' },
      { heading: 'Mental math tricks', body: 'To find 15% of a number, find 10% (move the decimal point one place left) and add half of that (which is 5%). Example: 15% of 80. 10% of 80 = 8. 5% of 80 = 4. 8 + 4 = 12.' },
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
      { heading: 'Length beats complexity', body: 'For years, the standard advice was to use a mix of symbols like <code>P@ssw0rd!</code>. Today, security experts agree that length is far more important. An 8-character password with symbols can be cracked much faster than a 16-character password made only of lowercase letters.' },
      { heading: 'Understanding password entropy', body: 'Entropy is a measure of how unpredictable your password is, usually expressed in "bits". The more bits, the stronger the password. A 16-character password using all character types has over 100 bits of entropy, which is considered extremely strong.' },
      { heading: 'Never reuse passwords', body: 'The biggest risk to your online security is a reused password. If you use the same password everywhere and one site gets hacked, attackers will immediately try that password on your bank and email. Every account needs a unique password.' },
      { heading: 'Use a password manager', body: 'Because you need a unique, long, random password for every site, it is impossible to remember them all. Use a password manager to generate and store them securely.' },
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
      { heading: 'What is the Pomodoro Technique?', body: 'The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.' },
      { heading: 'The basic steps', body: '<strong>1. Choose a task.</strong><br><strong>2. Set the timer.</strong> Set your timer for 25 minutes.<br><strong>3. Work until the timer rings.</strong> Focus entirely on the task.<br><strong>4. Take a short break.</strong> Take a 5-minute break. Stand up, stretch, or get some water.<br><strong>5. Repeat.</strong> After four intervals, take a longer 15 to 30-minute break.' },
      { heading: 'Why it works for students', body: 'It works because it lowers the barrier to starting. Telling yourself "I need to study for 4 hours" is overwhelming. Telling yourself "I just need to focus for 25 minutes" is easy. It also forces you to take breaks, which prevents mental fatigue.' },
    ]
  }
];

export const publishedGuides = guides;
export function getGuide(slug: string): Guide | undefined { return publishedGuides.find((g) => g.slug === slug); }
