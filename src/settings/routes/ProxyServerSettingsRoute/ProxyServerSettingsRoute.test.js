import { MemoryRouter } from 'react-router-dom';

/*
 * IMPORTANT -- in order to mock react query successfully
 * below you must import it into the test
 */
import _ReactQuery from 'react-query';

import { Button as MockButton } from '@folio/stripes/components';
import {
  Button,
  Callout,
  renderWithIntl
} from '@folio/stripes-erm-testing';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import translationsProperties from '../../../../test/helpers/translationsProperties';
import ProxyServerSettingsRoute from './ProxyServerSettingsRoute';

jest.mock('react-query', () => {
  const { mockReactQuery } = jest.requireActual('@folio/stripes-erm-testing');
  return ({
    ...jest.requireActual('react-query'),
    ...mockReactQuery,
    useMutation: () => ({ mutateAsync: () => Promise.resolve(true) }),
  });
});

jest.mock('../../components/ProxyServerSettingsConfig/ProxyServerSettingsForm', () => {
  return (props) => {
    return (
      <div>
        <div>ProxyServerSettingsForm</div>
        <MockButton onClick={props.onSave}>SaveButton</MockButton>
        <MockButton onClick={props.onDelete}>DeleteButton</MockButton>
      </div>
    );
  };
});

const initialValues = {
  'stringTemplates': []
};

describe('ProxyServerSettingsRoute', () => {
  describe('rendering the route', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <ProxyServerSettingsRoute
            initialValues={initialValues}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the ProxyServerSettingsForm component', () => {
      const { getByText } = renderComponent;
      expect(getByText('ProxyServerSettingsForm')).toBeInTheDocument();
    });

    test('clicking on the SaveButton fires the callout', async () => {
      await waitFor(async () => {
        await Button('SaveButton').click();
      });

      await Callout('External data source successfully saved.').exists();
    });

    test('clicking on the DeleteButton fires the callout', async () => {
      await waitFor(async () => {
        await Button('DeleteButton').click();
      });

      await Callout('External data source successfully deleted.').exists();
    });
  });
});
