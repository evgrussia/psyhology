import type { IHomepageRepository } from '../../domain/homepage/IHomepageRepository';
import type { HomepageModel } from '../../domain/homepage/HomepageModel';

export class StaticHomepageRepository implements IHomepageRepository {
  async getHomepageModel(params: { locale: 'ru' }): Promise<HomepageModel> {
    // locale пока не влияет на контент; оставляем для будущей локализации.
    void params;

    const bookingHref = '/booking/';
    const telegramHref =
      // В релиз 1 можно заменить на bot/channel + deep links (см. Tracking Plan / TG schema)
      'https://t.me/';

    return {
      pagePath: '/',
      ctas: {
        bookingHref,
        telegramHref,
        firstStepHref: '/start/first-step/',
        navigatorHref: '/start/navigator/',
      },
      featured: [
        {
          id: 'featured_first_step',
          kind: 'interactive',
          title: 'Первый шаг (1–3 минуты)',
          description: 'Быстрое упражнение, чтобы немного стабилизировать состояние “здесь и сейчас”.',
          href: '/start/first-step/',
        },
        {
          id: 'featured_navigator',
          kind: 'interactive',
          title: 'Навигатор состояния',
          description: 'Пара выборов → аккуратный ориентир и следующие шаги.',
          href: '/start/navigator/',
        },
        {
          id: 'featured_resources',
          kind: 'content',
          title: 'Ресурсы и статьи',
          description: 'Короткие материалы без перегруза.',
          href: '/resources/',
        },
      ],
      topics: [
        {
          code: 'anxiety',
          slug: 'trevoga',
          title: 'Тревога',
          description: 'Когда “накрывает”, сложно успокоиться и держать фокус.',
          href: '/s-chem-ya-pomogayu/trevoga/',
        },
        {
          code: 'burnout',
          slug: 'vygoranie',
          title: 'Выгорание',
          description: 'Когда нет сил, мотивации и всё раздражает.',
          href: '/s-chem-ya-pomogayu/vygoranie/',
        },
        {
          code: 'relationships',
          slug: 'otnosheniya',
          title: 'Отношения',
          description: 'Конфликты, дистанция, повторяющиеся сценарии.',
          href: '/s-chem-ya-pomogayu/otnosheniya/',
        },
        {
          code: 'boundaries',
          slug: 'granicy',
          title: 'Границы',
          description: 'Трудно говорить “нет”, отстаивать себя и не рушиться.',
          href: '/s-chem-ya-pomogayu/granicy/',
        },
        {
          code: 'selfesteem',
          slug: 'samoocenka',
          title: 'Самооценка',
          description: 'Самокритика, стыд, страх ошибиться и “быть недостаточным”.',
          href: '/s-chem-ya-pomogayu/samoocenka/',
        },
      ],
      trustBlocks: [
        {
          id: 'how_it_works',
          title: 'Как проходит работа',
          body: 'Структурно и бережно: цель → план → шаги между сессиями. Можно остановиться в любой момент.',
          href: '/how-it-works/',
          hrefLabel: 'Подробнее',
        },
        {
          id: 'confidentiality',
          title: 'Конфиденциальность и границы',
          body: 'Безопасность важнее “эффекта”. Никаких “диагнозов по переписке”, только работа в рамках запроса.',
          href: '/about/',
          hrefLabel: 'Мой подход',
        },
        {
          id: 'education',
          title: 'Профессиональная опора',
          body: 'Чёткие правила, прозрачность и уважение к вашему темпу. Подход подбирается под задачу.',
          href: '/about/',
          hrefLabel: 'О психологе',
        },
      ],
      faq: [
        {
          id: 'faq_process_01',
          group: 'process',
          question: 'Нужно ли “сразу всё рассказывать”?',
          answer:
            'Нет. Двигаемся в комфортном темпе: можно начать с одной ситуации и постепенно расширять контекст.',
        },
        {
          id: 'faq_privacy_01',
          group: 'privacy',
          question: 'Будет ли что-то “куда-то передано”?',
          answer:
            'Нет. Мы не передаём третьим лицам детали вашего запроса. На сайте мы также избегаем трекинга чувствительных текстов.',
        },
        {
          id: 'faq_booking_01',
          group: 'booking',
          question: 'Если мне сложно выбрать формат — что делать?',
          answer:
            'Можно начать с короткого ориентира в Telegram или просто перейти к записи — там тоже будет подсказка, что выбрать.',
        },
      ],
    };
  }
}

