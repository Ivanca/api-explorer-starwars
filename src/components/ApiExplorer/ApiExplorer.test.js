import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ApiExplorer from './ApiExplorer';

describe('<ApiExplorer />', () => {
  test('it should mount', () => {
    render(<ApiExplorer />);
    
    const apiExplorer = screen.getByTestId('ApiExplorer');

    expect(apiExplorer).toBeInTheDocument();
  });
});