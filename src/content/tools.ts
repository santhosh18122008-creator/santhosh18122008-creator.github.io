export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolSection {
  heading: string;
  body: string;
}

export interface Tool {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  status: 'draft' | 'published';
  component: 'percentage-calculator';
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
];

export const publishedTools = tools.filter((t) => t.status === 'published');

export function getTool(slug: string): Tool | undefined {
  return publishedTools.find((t) => t.slug === slug);
}
