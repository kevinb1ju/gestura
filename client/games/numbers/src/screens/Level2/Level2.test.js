import { render, screen } from '@testing-library/react';
import Level2 from './Level2';

// Mock dependencies
jest.mock('../../components/train/Bogey', () => () => <div data-testid="bogey">Bogey</div>);
jest.mock('../../components/common/Level2Music', () => () => <div data-testid="music">Music</div>);
jest.mock('../../utils/speak', () => ({
    speak: jest.fn(),
}));

// Mock window.speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
    value: {
        cancel: jest.fn(),
    },
});

describe('Level2 Component', () => {
    test('renders without crashing', () => {
        render(<Level2 />);
        expect(screen.getByTestId('music')).toBeInTheDocument();
        expect(screen.getByText(/Score:/i)).toBeInTheDocument();
    });
});
