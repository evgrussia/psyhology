import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionItem } from './Accordion';

describe('Accordion', () => {
  it('рендерится с заголовком', () => {
    render(
      <AccordionItem title="Вопрос 1">
        Ответ 1
      </AccordionItem>
    );
    
    expect(screen.getByRole('button', { name: 'Вопрос 1' })).toBeInTheDocument();
  });

  it('скрывает контент по умолчанию', () => {
    render(
      <AccordionItem title="Вопрос">
        Скрытый ответ
      </AccordionItem>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Скрытый ответ')).not.toBeVisible();
  });

  it('показывает контент когда defaultOpen', () => {
    render(
      <AccordionItem title="Вопрос" defaultOpen>
        Видимый ответ
      </AccordionItem>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Видимый ответ')).toBeVisible();
  });

  it('открывает/закрывает при клике', async () => {
    const user = userEvent.setup();
    render(
      <AccordionItem title="Вопрос">
        Контент
      </AccordionItem>
    );
    
    const button = screen.getByRole('button');
    const content = screen.getByText('Контент');
    
    // Изначально закрыт
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(content).not.toBeVisible();
    
    // Открыть
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(content).toBeVisible();
    
    // Закрыть
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(content).not.toBeVisible();
  });

  it('имеет правильные aria-атрибуты', () => {
    render(
      <AccordionItem title="Вопрос">
        Ответ
      </AccordionItem>
    );
    
    const button = screen.getByRole('button');
    const contentId = button.getAttribute('aria-controls');
    
    expect(contentId).toBeTruthy();
    expect(button).toHaveAttribute('aria-expanded', 'false');
    
    const region = screen.getByRole('region', { hidden: true });
    expect(region).toHaveAttribute('id', contentId);
  });

  it('рендерит несколько элементов в Accordion', () => {
    render(
      <Accordion>
        <AccordionItem title="Вопрос 1">Ответ 1</AccordionItem>
        <AccordionItem title="Вопрос 2">Ответ 2</AccordionItem>
        <AccordionItem title="Вопрос 3">Ответ 3</AccordionItem>
      </Accordion>
    );
    
    expect(screen.getByRole('button', { name: 'Вопрос 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Вопрос 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Вопрос 3' })).toBeInTheDocument();
  });

  it('позволяет открывать несколько элементов одновременно', async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <AccordionItem title="Вопрос 1">Ответ 1</AccordionItem>
        <AccordionItem title="Вопрос 2">Ответ 2</AccordionItem>
      </Accordion>
    );
    
    const button1 = screen.getByRole('button', { name: 'Вопрос 1' });
    const button2 = screen.getByRole('button', { name: 'Вопрос 2' });
    
    await user.click(button1);
    await user.click(button2);
    
    expect(button1).toHaveAttribute('aria-expanded', 'true');
    expect(button2).toHaveAttribute('aria-expanded', 'true');
  });
});
