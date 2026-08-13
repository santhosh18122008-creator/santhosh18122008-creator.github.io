export interface ToolFaq { q: string; a: string; }
export interface ToolSection { heading: string; body: string; }

export type ToolComponent = 
  | 'percentage-calculator' 
  | 'grade-calculator' 
  | 'gpa-calculator'
  | 'attendance-calculator'
  | 'average-calculator';

export interface Tool {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  status: 'draft' | 'published';
  component: ToolComponent;
  intro: string;
  sections: ToolSection[];
  faqs: ToolFaq[];
}

export const tools: Tool[] = [
  {
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    category: 'student-tools',
    shortDescription: 'Calculate X% of a number, what percent X is of Y, and percentage change.',
    seoTitle: 'Percentage Calculator — Free Online Tool | MarqDesk',
    seoDescription: 'Free percentage calculator with three modes: find X% of Y, find what percent X is of Y, and calculate percentage increase or decrease.',
    featured: true,
    status: 'published',
    component: 'percentage-calculator',
    intro: 'Use this free percentage calculator to solve the three most common percentage problems. Everything runs directly in your browser.',
    sections: [
      { heading: 'What is a percentage?', body: 'A percentage is a way of expressing a number as a fraction of 100.' },
      { heading: 'The formulas', body: '1) X% of Y = (X ÷ 100) × Y. 2) X is what percent of Y = (X ÷ Y) × 100. 3) Percentage change = ((New − Original) ÷ |Original|) × 100.' },
    ],
    faqs: [{ q: 'Is this calculator free?', a: 'Yes, it runs entirely in your browser.' }],
  },
  {
    slug: 'grade-calculator',
    title: 'Grade Calculator',
    category: 'student-tools',
    shortDescription: 'Convert marks obtained out of maximum marks into a percentage and a letter grade.',
    seoTitle: 'Grade Calculator — Marks to Percentage and Letter Grade | MarqDesk',
    seoDescription: 'Free grade calculator for students. Enter marks obtained and maximum marks to see your percentage and letter grade instantly.',
    featured: false,
    status: 'published',
    component: 'grade-calculator',
    intro: 'Enter the marks you obtained and the maximum possible marks, and this calculator shows your percentage together with the matching letter grade.',
    sections: [
      { heading: 'Grading scale used', body: 'A+ = 90–100%, A = 80–89.99%, B = 70–79.99%, C = 60–69.99%, D = 50–59.99%, F = below 50%.' },
    ],
    faqs: [{ q: 'Is this grading scale universal?', a: 'No. Scales differ by institution.' }],
  },
  {
    slug: 'gpa-calculator',
    title: 'GPA Calculator',
    category: 'student-tools',
    shortDescription: 'Calculate your GPA on the 4.0 scale from letter grades and credit hours.',
    seoTitle: 'GPA Calculator — 4.0 Scale with Credits | MarqDesk',
    seoDescription: 'Free GPA calculator for students. Add your courses with letter grades and credit hours to calculate your GPA on the 4.0 scale instantly.',
    featured: false,
    status: 'published',
    component: 'gpa-calculator',
    intro: 'Add one row per course, choose the letter grade, enter the credit hours, and calculate your grade point average on the standard 4.0 scale.',
    sections: [
      { heading: 'Grade point values used', body: 'A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, C− = 1.7, D+ = 1.3, D = 1.0, F = 0.0.' },
    ],
    faqs: [{ q: 'Which grading scale is used?', a: 'The common 4.0 scale with plus and minus grades.' }],
  },
  {
    slug: 'attendance-calculator',
    title: 'Attendance Calculator',
    category: 'student-tools',
    shortDescription: 'Calculate your current attendance percentage and find out how many classes you need to attend or can skip.',
    seoTitle: 'Attendance Calculator — Reach Your Target Percentage | MarqDesk',
    seoDescription: 'Free attendance calculator for students. Find your current attendance percentage and see how many classes you need to attend to reach your target (e.g. 75%).',
    featured: false,
    status: 'published',
    component: 'attendance-calculator',
    intro: 'Find out if your attendance meets your required target, how many consecutive classes you need to attend if you are short, or how many classes you can safely skip.',
    sections: [
      { heading: 'How it works', body: 'The calculator compares your current ratio of attended classes to total classes against your target percentage. If you are above the target, it calculates how many consecutive absences you can afford while staying above the target. If you are below, it calculates how many consecutive classes you must attend to catch up.' },
    ],
    faqs: [{ q: 'What is the default target?', a: 'The default target is 75%, which is a common requirement in many universities. You can change it to any value between 1 and 100.' }],
  },
  {
    slug: 'average-calculator',
    title: 'Average Calculator',
    category: 'student-tools',
    shortDescription: 'Calculate the mean, sum, and count for a list of numbers instantly.',
    seoTitle: 'Average Calculator — Mean, Sum, and Count | MarqDesk',
    seoDescription: 'Free average calculator. Add a list of numbers to find their mathematical mean, sum, and count instantly. No sign-up required.',
    featured: false,
    status: 'published',
    component: 'average-calculator',
    intro: 'Add as many numbers as you need. This calculator will instantly compute the mathematical mean (average), the total sum, and the count of values.',
    sections: [
      { heading: 'The formula', body: 'Mean = (Sum of all values) ÷ (Number of values). The calculator performs this addition and division exactly, avoiding floating point artifacts for standard decimal values.' },
    ],
    faqs: [{ q: 'How many numbers can I add?', a: 'You can add up to 50 numbers at once.' }],
  },
];

export const publishedTools = tools.filter((t) => t.status === 'published');
export function getTool(slug: string): Tool | undefined {
  return publishedTools.find((t) => t.slug === slug);
}
