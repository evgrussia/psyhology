/**
 * Интерфейс для рендеринга markdown в HTML
 */
export interface IMarkdownRenderer {
  /**
   * Рендерить markdown в HTML
   */
  render(markdown: string): Promise<string>;
}
