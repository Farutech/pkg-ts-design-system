/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SideNavItem } from './SideNavItem';

describe('SideNavItem', () => {
  it('renderiza etiqueta, descripción y badge', () => {
    render(
      <SideNavItem
        label="Catálogo de Repos"
        description="Inventario vivo ecosystem.yaml"
        badge="15"
      />
    );

    expect(screen.getByRole('button', { name: /Catálogo de Repos/ })).toBeInTheDocument();
    expect(screen.getByText('Inventario vivo ecosystem.yaml')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renderiza sin descripción ni badge cuando no se proveen', () => {
    render(<SideNavItem label="Dashboard" />);

    const item = screen.getByRole('button', { name: 'Dashboard' });
    expect(item).toBeInTheDocument();
    expect(item).not.toHaveAttribute('aria-current');
    expect(screen.queryByText('Inventario vivo ecosystem.yaml')).not.toBeInTheDocument();
    // Sin badge no queda ningún nodo extra con texto dentro del botón
    expect(item.textContent).toBe('Dashboard');
  });

  it('marca aria-current cuando está activo', () => {
    render(<SideNavItem label="Guía" active />);

    expect(screen.getByRole('button', { name: 'Guía' })).toHaveAttribute('aria-current', 'page');
  });

  it('dispara onClick al hacer clic', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<SideNavItem label="ADRs" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'ADRs' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('no dispara onClick cuando está deshabilitado', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<SideNavItem label="GitOps" disabled onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'GitOps' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('permite que el consumidor sobrescriba estilos vía className (y badge via badgeClassName)', () => {
    render(
      <SideNavItem
        label="Estándares"
        active
        className="bg-slate-800 text-cyan-300"
        badgeClassName="bg-cyan-500/20 text-cyan-300"
        badge="20"
      />
    );

    const item = screen.getByRole('button', { name: /Estándares/ });
    expect(item.className).toContain('bg-slate-800');
    expect(item.className).toContain('text-cyan-300');
    expect(screen.getByText('20').className).toContain('bg-cyan-500/20');
  });

  it('renderiza el ícono decorativo pasado por prop', () => {
    render(<SideNavItem label="Scaffolding" icon={<svg data-testid="icon" />} />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    // El ícono no debe aportar al nombre accesible del botón
    expect(screen.getByRole('button', { name: 'Scaffolding' })).toBeInTheDocument();
  });
});
