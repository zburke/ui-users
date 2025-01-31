import React from 'react';

import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithRouter from 'helpers/renderWithRouter';
import ConditionsForm from './ConditionsForm';

import '__mock__/stripesCore.mock';

jest.unmock('@folio/stripes/components');
jest.unmock('@folio/stripes/smart-components');

const initialValues = {
  blockBorrowing: false,
  blockRenewals: false,
  blockRequests: false,
  id: '3d7c52dc-c732-4223-8bf8-e5917801386f',
  message: '',
  name: 'Maximum number of items charged out',
  valueType: 'Integer'
};

const handleSubmitMock = jest.fn();
const getStateMock = jest.fn();

const propData = {
  label: 'Maximum number of items charged out',
  initialValues,
  pristine: false,
  submitting: false,
  onSubmit: handleSubmitMock,
  form: {
    getState: getStateMock,
  },
  handleSubmit: handleSubmitMock,
  areConditionsEditable: true,
};

const renderConditionsForm = async (props) => renderWithRouter(<ConditionsForm {...props} />);

describe('Conditions Form Component', () => {
  beforeEach(async () => {
    await waitFor(() => renderConditionsForm(propData));
  });
  it('component must be rendered', async () => {
    expect(screen.getByText('Maximum number of items charged out')).toBeInTheDocument();
  });
  it('Checkbox selection', async () => {
    userEvent.click(document.querySelector('[id="blockRenewals"]'));
    userEvent.type(document.querySelector('[data-test-block-message="true"]'), 'Testing');
    expect(screen.getByText('Testing')).toBeInTheDocument();
  });
  it('handle Submit in conditions form', async () => {
    userEvent.click(screen.getByText('stripes-core.button.save'));
    expect(handleSubmitMock).toHaveBeenCalledTimes(0);
  });
});

describe('When areConditionsEnable prop is false', () => {
  beforeEach(async () => {
    const alteredPropData = {
      ...propData,
      areConditionsEditable: false,
    };
    await waitFor(() => renderConditionsForm(alteredPropData));
  });

  it('component must be rendered', async () => {
    expect(screen.getByText('Maximum number of items charged out')).toBeInTheDocument();
  });

  it('should render checkboxes as read only', () => {
    const checkboxes = screen.getAllByRole('checkbox');

    checkboxes.forEach(cb => {
      expect(cb).toBeDisabled();
    });
  });

  it('should render block message as disabled text area', () => {
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
