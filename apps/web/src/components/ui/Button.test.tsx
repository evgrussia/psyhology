import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('рендерится с текстом', () => {
    render(<Button>Нажми меня</Button>);
    expect(screen.getByRole('button', { name: 'Нажми меня' })).toBeInTheDocument();
  });

  it('применяет правильный вариант', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(button).toHaveClass('secondary');
  });

  it('применяет правильный размер', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('sm');

    rerender(<Button size="lg">Large</Button>);
    expect(button).toHaveClass('lg');
  });

  it('отключается когда disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('отключается когда loading', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('вызывает onClick при клике', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('не вызывает onClick когда disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('рендерит pill вариант с иконкой', () => {
    render(
      <Button variant="pill" icon={<span data-testid="icon">→</span>}>
        Pill Button
      </Button>
    );
    
    expect(screen.getByText('Pill Button')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('поддерживает forwardRef', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>With Ref</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it('имеет правильные aria-атрибуты', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });
});
