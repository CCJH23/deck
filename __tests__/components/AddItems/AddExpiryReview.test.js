import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import AddExpiryReview from '../../../components/AddItems/AddExpiryReview';

const expiryFormData = {
  image: 'test-image-url',
  name: 'Test Item',
  type: 'Type A',
  unit: 'Unit A',
  expiry: [
    {
      date: '2023-06-30',
      total_quantityopen: 10,
      total_quantityunopened: 5,
    },
    {
      date: '2023-07-15',
      total_quantityopen: 8,
      total_quantityunopened: 3,
    },
  ],
  min_quantityopen: 1,
  min_quantityunopened: 2,
};

describe('AddExpiryReview', () => {
  it('renders the component with correct item data', () => {
    const { getByText, getByAltText } = render(
      <AddExpiryReview expiryFormData={expiryFormData} />,
    );

    expect(getByText('Confirm New Item:')).toBeInTheDocument();
    expect(getByAltText('new-item')).toHaveAttribute('src', 'test-image-url');
    expect(getByText('Name:')).toBeInTheDocument();
    expect(getByText('Test Item')).toBeInTheDocument();
    expect(getByText('Type:')).toBeInTheDocument();
    expect(getByText('Type A')).toBeInTheDocument();
    expect(getByText('Unit:')).toBeInTheDocument();
    expect(getByText('Unit A')).toBeInTheDocument();
    expect(getByText('2023-06-30')).toBeInTheDocument();
    expect(getByText('10')).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
    expect(getByText('2023-07-15')).toBeInTheDocument();
    expect(getByText('8')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
    expect(getByText('Min Quantity (Open):')).toBeInTheDocument();
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('Min Quantity (Unopened):')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();

    const expiryDateElements = screen.getAllByText('Expiry Date:');
    expect(expiryDateElements).toHaveLength(2);
    const totalOpenElements = screen.getAllByText('Total Quantity (Open):');
    expect(totalOpenElements).toHaveLength(2);
    const totalUnopenedElements = screen.getAllByText(
      'Total Quantity (Unopened):',
    );
    expect(totalUnopenedElements).toHaveLength(2);
  });
});
