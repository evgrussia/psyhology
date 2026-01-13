import { IMarkdownRenderer } from '../services/IMarkdownRenderer';
import {
  RenderMarkdownPreviewRequestDto,
  RenderMarkdownPreviewResponseDto,
} from '../dto/ContentDtos';
import { ValidationError } from '../../shared/errors/ApplicationError';

/**
 * Use Case: Рендер markdown в HTML для preview (админка).
 * Задача — гарантировать, что preview использует тот же renderer, что и публичная выдача.
 */
export class RenderMarkdownPreviewUseCase {
  constructor(private readonly markdownRenderer: IMarkdownRenderer) {}

  async execute(dto: RenderMarkdownPreviewRequestDto): Promise<RenderMarkdownPreviewResponseDto> {
    const markdown = dto.markdown ?? '';

    if (typeof markdown !== 'string') {
      throw new ValidationError('markdown must be a string');
    }

    const html = await this.markdownRenderer.render(markdown);
    return { html };
  }
}

