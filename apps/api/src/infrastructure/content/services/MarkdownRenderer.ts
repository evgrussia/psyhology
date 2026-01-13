import { IMarkdownRenderer } from '../../../application/content/services/IMarkdownRenderer';
import { marked } from 'marked';

/**
 * Реализация IMarkdownRenderer с использованием библиотеки marked
 */
export class MarkdownRenderer implements IMarkdownRenderer {
  constructor() {
    // Настройка marked для безопасности (базовая конфигурация)
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: false, // не конвертировать одинарные переносы в <br>
      mangle: false, // не мangle email адреса
    });
  }

  async render(markdown: string): Promise<string> {
    if (!markdown || markdown.trim().length === 0) {
      return '';
    }

    try {
      // Рендерим markdown в HTML
      const result = await marked.parse(markdown);

      // В будущем можно добавить санитизацию HTML (например, с помощью DOMPurify)
      // для безопасности от XSS атак

      // marked.parse возвращает string | Promise<string>
      const html = typeof result === 'string' ? result : await result;

      return html;
    } catch (error) {
      // В случае ошибки рендеринга возвращаем fallback
      console.error('Error rendering markdown:', error);
      return `<pre>${escapeHtml(markdown)}</pre>`;
    }
  }
}

/**
 * Экранирование HTML для fallback
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
