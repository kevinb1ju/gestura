import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TeacherDashboard from './TeacherDashboard';

// Mock everything external
jest.mock('lucide-react', () => ({
  Users: () => <div />,
  PlusCircle: () => <div />,
  MessageSquare: () => <div />,
  TrendingUp: () => <div />,
  Award: () => <div />,
  Search: () => <div />,
  LayoutGrid: () => <div />,
  List: () => <div />,
  Send: () => <div />,
  Bot: () => <div />,
  X: () => <div />,
  ChevronRight: () => <div />,
  UserPlus: () => <div />,
  Activity: () => <div />,
  BookOpen: () => <div />,
  Calendar: () => <div />
}));

global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ institutions: [] }) }));

test('it renders without crashing', () => {
  render(
    <BrowserRouter>
      <TeacherDashboard />
    </BrowserRouter>
  );
});
