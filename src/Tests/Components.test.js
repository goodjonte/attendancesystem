import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Absences from '../Components/Absences';
import AdminActions from '../Components/AdminActions';
import AdminCreationForm from '../Components/AdminCreationForm';
import AssignStudents from '../Components/AssignStudents';
import NoticeBoard from '../Components/NoticeBoard';

describe('Test Components', () => {
    it('Absences', () => {
        render(<Absences displayAsPage={true} />);
        let HeadingText = screen.getByText(/View Attendance Code/i);
        expect(HeadingText).toBeInTheDocument(); 
    });
    it('AdminActions', () => {
        render(<AdminActions  />);
        let HeadingText = screen.getByText(/Admin Actions:/i);
        expect(HeadingText).toBeInTheDocument(); 
    });
    it('AdminCreationForm', () => {
        render(<AdminCreationForm />);
        let HeadingText = screen.getByText(/FirstName/i);
        expect(HeadingText).toBeInTheDocument(); 
    });
    it('AssignStudents', () => {
        render(<AssignStudents />);
        let HeadingText = screen.getByText(/Assign Students to Class/i);
        expect(HeadingText).toBeInTheDocument(); 
    });
    it('NoticeBoard', () => {
        render(<NoticeBoard />);
        let HeadingText = screen.getByText(/Notices/i);
        expect(HeadingText).toBeInTheDocument(); 
    });
});
