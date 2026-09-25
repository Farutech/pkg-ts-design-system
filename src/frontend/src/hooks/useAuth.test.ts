/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with unauthenticated state when storage is empty', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs in successfully and persists user in localStorage', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('admin@farutech.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('admin@farutech.com');
    expect(result.current.user?.role).toBe('admin');
    expect(localStorage.getItem('auth_token')).toBeTruthy();
  });

  it('rejects invalid email on login', async () => {
    const { result } = renderHook(() => useAuth());

    await expect(
      act(async () => {
        await result.current.login('invalid-email', '123456');
      })
    ).rejects.toThrow('inválida');
  });

  it('registers new user and sets role to user', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register('Carlos Dev', 'carlos@farutech.com', 'securepass');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.name).toBe('Carlos Dev');
    expect(result.current.user?.role).toBe('user');
  });

  it('cleans storage and state on logout', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('lead@farutech.com', 'pass');
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });

  it('updates user data correctly', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('admin@farutech.com', 'pass');
    });

    act(() => {
      result.current.updateUser({ name: 'Super Admin FaruTech' });
    });

    expect(result.current.user?.name).toBe('Super Admin FaruTech');
  });
});
