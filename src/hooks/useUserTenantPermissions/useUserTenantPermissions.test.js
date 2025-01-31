import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import permissions from 'fixtures/permissions';
import useUserTenantPermissions from './useUserTenantPermissions';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const response = {
  permissionNames: permissions,
  totalRecords: permissions.length,
};

describe('useUserTenantPermissions', () => {
  const getMock = jest.fn(() => ({
    json: () => Promise.resolve(response),
  }));
  const setHeaderMock = jest.fn();
  const kyMock = {
    extend: jest.fn(({ hooks: { beforeRequest } }) => {
      beforeRequest.forEach(handler => handler({ headers: { set: setHeaderMock } }));

      return {
        get: getMock,
      };
    }),
  };

  beforeEach(() => {
    getMock.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should fetch user permissions for specified tenant', async () => {
    const options = {
      userId: 'userId',
      tenantId: 'tenantId',
    };
    const { result, waitFor } = renderHook(() => useUserTenantPermissions(options), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(setHeaderMock).toHaveBeenCalledWith('X-Okapi-Tenant', options.tenantId);
    expect(getMock).toHaveBeenCalledWith(`perms/users/${options.userId}/permissions`, expect.objectContaining({}));
  });
});
