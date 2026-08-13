export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolSection {
  heading: string;
  body: string;
}

export type ToolComponent = 'percentage-calculator' | 'grade-calculator' | 'gpa-calculator';

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
    shortDescription:
      'Calculate X% of a number, what percent X is of Y, and percentage change — instantly in your browser.',
    seoTitle: 'Percentage Calculator — Free Online Tool | MarqDesk',
    seoDescription:
      'Free percentage calculator with three modes: find X% of Y, find what percent X is of Y, and calculate percentage increase or decrease. Fast, private, no sign-up.',
    featured: true,
    status: 'published',
    component: 'percentage-calculator',
    intro:
      'Use this free percentage calculator to solve the three most common percentage problems. Everything runs directly in your browser — nothing you type is uploaded or stored.',
    sections: [
      {
        heading: 'What is a percentage?',
        body: 'A percentage is a way of expressing a number as a fraction of 100. For example, 25% means 25 out of every 100, or 0.25 in decimal form. Percentages are used everywhere: grades, discounts, attendance, interest rates, and statistics.',
      },
      {
        heading: 'The three formulas this tool uses',
        body: '1) X% of Y = (X ÷ 100) × Y.  2) X is what percent of Y = (X ÷ Y) × 100.  3) Percentage change = ((New − Original) ÷ |Original|) × 100. The absolute value in the third formula keeps increase/decrease direction meaningful when the original value is negative.',
      },
      {
        heading: 'How to use this calculator',
        body: 'Choose a mode using the tabs, type your two values (decimals and negative numbers are allowed), then press Calculate. Press Reset to clear everything and start again.',
      },
      {
        heading: 'Worked examples',
        body: '25% of 200 = 50.  50 is 25% of 200.  A change from 100 to 120 is +20%.  A change from 120 to 100 is about −16.67%.',
      },
      {
        heading: 'Common mistakes to avoid',
        body: 'Dividing by zero is undefined — the calculator blocks this instead of showing Infinity. Also, do not confuse "percent of" with "percent change": 50 is 25% of 200, but going from 200 to 50 is a −75% change.',
      },
    ],
    faqs: [
      {
        q: 'Is this calculator free to use?',
        a: 'Yes. It runs entirely in your browser and does not require an account or installation.',
      },
      {
        q: 'Is my input sent to a server?',
        a: 'No. All calculations happen locally on your device.',
      },
      {
        q: 'Can I use decimals or negative numbers?',
        a: 'Yes. Values like 12.5 or -40 are valid. Percentage change from a negative original value is handled using the absolute value of the original.',
      },
    ],
  },
  {
    slug: 'grade-calculator',
    title: 'Grade Calculator',
    category: 'student-tools',
    shortDescription:
      'Convert marks obtained out of maximum marks into a percentage and a letter grade, instantly.',
    seoTitle: 'Grade Calculator — Marks to Percentage and Letter Grade | MarqDesk',
    seoDescription:
      'Free grade calculator for students. Enter marks obtained and maximum marks to see your percentage and letter grade instantly. Fast, private, no sign-up.',
    featured: false,
    status: 'published',
    component: 'grade-calculator',
    intro:
      'Enter the marks you obtained and the maximum possible marks, and this calculator shows your percentage together with the matching letter grade. All calculations happen in your browser.',
    sections: [
      {
        heading: 'How your grade is calculated',
        body: 'First the percentage is calculated: (marks obtained ÷ maximum marks) × 100. The percentage is then mapped to a letter grade using the scale described below.',
      },
      {
        heading: 'Grading scale used by this calculator',
        body: 'A+ = 90–100%, A = 80–89.99%, B = 70–79.99%, C = 60–69.99%, D = 50–59.99%, F = below 50%. Grading scales differ between schools and countries, so use the percentage result to apply the scale used by your own institution.',
      },
      {
        heading: 'How to use this calculator',
        body: 'Type the marks obtained and the maximum marks (decimals are allowed), then press Calculate. Press Reset to clear the form.',
      },
      {
        heading: 'Worked examples',
        body: '85 out of 100 = 85% (A).  62 out of 80 = 77.5% (B).  45 out of 100 = 45% (F).',
      },
      {
        heading: 'Common mistakes to avoid',
        body: 'Swapping the two inputs (obtained vs maximum), leaving the maximum at zero (division by zero is blocked), and assuming one universal grading scale everywhere.',
      },
    ],
    faqs: [
      {
        q: 'Is this grading scale universal?',
        a: 'No. Scales differ by institution and country. The calculator always shows the percentage too, so you can map it to your own scale.',
      },
      {
        q: 'Can marks obtained be higher than the maximum?',
        a: 'No. The calculator returns an error because a score above the maximum is not valid here.',
      },
      {
        q: 'Is my input sent to a server?',
        a: 'No. All calculations happen locally on your device.',
      },
    ],
  },
  {
    slug: 'gpa-calculator',
    title: 'GPA Calculator',
    category: 'student-tools',
    shortDescription:
      'Calculate your GPA on the 4.0 scale from letter grades and credit hours, with support for multiple courses.',
    seoTitle: 'GPA Calculator — 4.0 Scale with Credits | MarqDesk',
    seoDescription:
      'Free GPA calculator for students. Add your courses with letter grades and credit hours to calculate your GPA on the 4.0 scale instantly. No sign-up required.',
    featured: false,
    status: 'published',
    component: 'gpa-calculator',
    intro:
      'Add one row per course, choose the letter grade, enter the credit hours, and calculate your grade point average on the standard 4.0 scale. Everything runs in your browser.',
    sections: [
      {
        heading: 'What is GPA?',
        body: 'GPA (grade point average) is a credit-weighted average of your grade points. Courses with more credits influence the GPA more than courses with fewer credits.',
      },
      {
        heading: 'Grade point values used',
        body: 'A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, C− = 1.7, D+ = 1.3, D = 1.0, F = 0.0.',
      },
      {
        heading: 'The GPA formula',
        body: 'GPA = (sum of grade points × credits for each course) ÷ (sum of all credits).',
      },
      {
        heading: 'How to use this calculator',
        body: 'Use "Add course" to create one row per subject, pick the letter grade, type the credit hours (decimals allowed), then press Calculate GPA. Use the ✕ button to remove a row.',
      },
      {
        heading: 'Worked examples',
        body: 'A (3 credits) + B (3 credits) = 3.50 GPA.  A (4 credits) + F (1 credit) = 3.20 GPA.  A single F = 0.00 GPA.',
      },
      {
        heading: 'Common mistakes to avoid',
        body: 'Averaging grades without weighting them by credits, entering zero or blank credits, and comparing GPAs between schools that use different grading scales.',
      },
    ],
    faqs: [
      {
        q: 'Which grading scale is used?',
        a: 'The common 4.0 scale with plus and minus grades. If your school uses a different scale, convert your results to letter grades first.',
      },
      {
        q: 'Can I include only some of my courses?',
        a: 'Yes. Add only the courses you want to include; the GPA is calculated from the rows you provide.',
      },
      {
        q: 'Is my input sent to a server?',
        a: 'No. All calculations happen locally on your device.',
      },
    ],
  },
];

export const publishedTools = tools.filter((t) => t.status === 'published');

export function getTool(slug: string): Tool | undefined {
  return publishedTools.find((t) => t.slug === slug);
}
