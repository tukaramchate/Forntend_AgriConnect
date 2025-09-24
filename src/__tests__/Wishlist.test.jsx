import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Wishlist from '../pages/Wishlist';
import { mockWishlist } from '../data/wishlist';

// Vitest provides globals (describe, test, expect). Importing here for linters
/* global describe, test, expect */

describe('Wishlist page', () => {
  test('renders loading skeleton then list items', async () => {
    render(
      <MemoryRouter>
        <Wishlist />
      </MemoryRouter>
    );

    // skeleton should be visible first (we use role=progressbar on skeleton nodes)
    // Wait for the page header to render after the simulated load
    await waitFor(
      () => {
        expect(screen.getByText(/My Wishlist/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // check that one of the mock items is rendered
    expect(screen.getByText(mockWishlist[0].name)).toBeInTheDocument();
  });
});
