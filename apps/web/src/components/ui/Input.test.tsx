import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('рендерится с label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('связывает label с input через htmlFor', () => {
    render(<Input id="email-input" label="Email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'email-input');
  });

  it('показывает hint текст', () => {
    render(<Input label="Email" hint="Введите ваш email" />);
    expect(screen.getByText('Введите ваш email')).toBeInTheDocument();
  });

  it('показывает error вместо hint', () => {
    render(
      <Input
        label="Email"
        hint="Введите ваш email"
        error="Email обязателен"
      />
    );
    
    expect(screen.getByText('Email обязателен')).toBeInTheDocument();
    expect(screen.queryByText('Введите ваш email')).not.toBeInTheDocument();
  });

  it('устанавливает aria-invalid при ошибке', () => {
    render(<Input label="Email" error="Неверный формат" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('отключается когда disabled', () => {
    render(<Input label="Email" disabled />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeDisabled();
  });

  it('показывает required звёздочку', () => {
    render(<Input label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('позволяет вводить текст', async () => {
    const user = userEvent.setup();
    render(<Input label="Email" />);
    
    const input = screen.getByLabelText('Email');
    await user.type(input, 'test@example.com');
    
    expect(input).toHaveValue('test@example.com');
  });

  it('рендерит иконки', () => {
    render(
      <Input
        label="Search"
        leftIcon={<span data-testid="left-icon">🔍</span>}
        rightIcon={<span data-testid="right-icon">✕</span>}
      />
    );
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('поддерживает forwardRef', () => {
    const ref = vi.fn();
    render(<Input ref={ref} label="Email" />);
    expect(ref).toHaveBeenCalled();
  });

  it('связывает hint с input через aria-describedby', () => {
    render(<Input label="Email" hint="Подсказка" />);
    const input = screen.getByLabelText('Email');
    const hintId = input.getAttribute('aria-describedby');
    expect(hintId).toBeTruthy();
    expect(document.getElementById(hintId!)).toHaveTextContent('Подсказка');
  });
});
