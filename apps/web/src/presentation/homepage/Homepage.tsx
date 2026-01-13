import React from 'react';
import type { HomepageModel } from '../../domain/homepage/HomepageModel';
import { HomepageTrackingBindings } from './HomepageTrackingBindings';
import { HomepageFeaturedFromApi } from './HomepageFeaturedFromApi';

export function Homepage({ model }: { model: HomepageModel }) {
  return (
    <>
      <a className="skipLink" href="#content">
        Перейти к содержимому
      </a>

      <HomepageTrackingBindings />

      <header className="siteHeader">
        <div className="container headerInner">
          <div className="brand" aria-label="Эмоциональный баланс">
            Эмоциональный баланс
          </div>

          <nav aria-label="Основная навигация">
            <ul className="navList">
              <li>
                <a className="navLink" href="/start/">
                  С чего начать
                </a>
              </li>
              <li>
                <a className="navLink" href="/s-chem-ya-pomogayu/">
                  С чем я помогаю
                </a>
              </li>
              <li>
                <a className="navLink" href="/about/">
                  О психологе
                </a>
              </li>
              <li>
                <a
                  className="btn btnPrimary"
                  href={model.ctas.bookingHref}
                  data-event="cta_click"
                  data-cta-id="booking_primary"
                  data-cta-target="booking"
                >
                  Запись
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="content" className="container">
        <section className="hero" aria-label="Вступление">
          <h1>Эмоциональный баланс</h1>
          <p className="lead">
            Быстрый первый шаг, чтобы стало чуть легче — и понятный путь к консультации, если нужно больше поддержки.
          </p>

          <div className="ctaRow" aria-label="Ключевые действия">
            <a
              className="btn btnPrimary"
              href={model.ctas.bookingHref}
              data-event="cta_click"
              data-cta-id="booking_primary"
              data-cta-target="booking"
            >
              Записаться
            </a>
            <a
              className="btn btnSecondary"
              href={model.ctas.telegramHref}
              target="_blank"
              rel="noreferrer"
              data-event="cta_click"
              data-cta-id="telegram_secondary"
              data-cta-target="telegram"
            >
              Получить план в Telegram
            </a>
          </div>

          <p className="note">
            Без давления: можно начать с короткого упражнения и вернуться к записи позже.
          </p>
        </section>

        <section aria-labelledby="topics-title">
          <div className="sectionHeader">
            <h2 id="topics-title">С чем сейчас сложнее всего?</h2>
            <p className="sectionSub">
              Выберите тему — вы попадёте на страницу с понятным описанием и следующим шагом.
            </p>
          </div>

          <ul className="cardGrid" aria-label="Темы">
            {model.topics.map((t, idx) => (
              <li key={t.slug} className="card">
                <a
                  className="cardLink"
                  href={t.href}
                  data-event="view_problem_card"
                  data-topic={t.code}
                  data-card-slug={t.slug}
                  data-position={idx + 1}
                >
                  <div className="cardTitle">{t.title}</div>
                  <div className="cardBody">{t.description}</div>
                  <div className="cardCta" aria-hidden="true">
                    Открыть →
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="first-step-title" className="firstStep">
          <div className="sectionHeader">
            <h2 id="first-step-title">С чего начать за 1–3 минуты</h2>
            <p className="sectionSub">Если важно быстро “приземлиться” — начните с малого. Дальше станет понятнее.</p>
          </div>

          <div className="firstStepGrid">
            <div className="panel">
              <h3 className="h3">Первый шаг</h3>
              <p>Короткое упражнение для стабилизации состояния здесь и сейчас.</p>
              <a
                className="btn btnPrimary"
                href={model.ctas.firstStepHref}
                data-event="cta_click"
                data-cta-id="start_first_step"
                data-cta-target="start"
              >
                Начать
              </a>
            </div>

            <div className="panel">
              <h3 className="h3">Навигатор состояния</h3>
              <p>Пара простых выборов → аккуратный ориентир и следующие шаги.</p>
              <a
                className="btn btnSecondary"
                href={model.ctas.navigatorHref}
                data-event="cta_click"
                data-cta-id="start_navigator"
                data-cta-target="start"
              >
                Открыть навигатор
              </a>
            </div>
          </div>

          <HomepageFeaturedFromApi fallback={model.featured} />
        </section>

        <section aria-labelledby="trust-title">
          <div className="sectionHeader">
            <h2 id="trust-title">Как я работаю и что важно знать</h2>
            <p className="sectionSub">Немного опоры: процесс, границы, конфиденциальность.</p>
          </div>

          <div className="trustGrid" aria-label="Блоки доверия">
            {model.trustBlocks.map((b) => (
              <article
                key={b.id}
                className="trustCard"
                data-trust-block={b.id}
                aria-label={b.title}
              >
                <h3 className="h3">{b.title}</h3>
                <p>{b.body}</p>
                {b.href ? (
                  <a
                    className="trustLink"
                    href={b.href}
                    data-event="cta_click"
                    data-cta-id={`trust_${b.id}`}
                    data-cta-target="trust"
                  >
                    {b.hrefLabel ?? 'Подробнее'}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="faq-title" className="faq">
          <div className="sectionHeader">
            <h2 id="faq-title">Мини‑FAQ</h2>
          </div>

          <div className="faqList">
            {model.faq.map((item) => (
              <details key={item.id} className="faqItem" data-faq-id={item.id} data-faq-group={item.group}>
                <summary>{item.question}</summary>
                <div className="faqAnswer">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="links-title" className="links">
          <div className="sectionHeader">
            <h2 id="links-title">Ещё полезное</h2>
            <p className="sectionSub">Подборки и материалы — чтобы поддерживать себя между встречами.</p>
          </div>

          <ul className="linkList">
            <li>
              <a className="linkCard" href="/resources/" data-event="cta_click" data-cta-id="resources" data-cta-target="content">
                Ресурсы
              </a>
            </li>
            <li>
              <a className="linkCard" href="/blog/" data-event="cta_click" data-cta-id="blog" data-cta-target="content">
                Блог
              </a>
            </li>
          </ul>
        </section>
      </main>

      <footer className="siteFooter">
        <div className="container footerInner">
          <div className="footerLinks">
            <a className="navLink" href="/emergency/">
              Экстренная помощь
            </a>
            <a className="navLink" href="/legal/privacy/">
              Политика конфиденциальности
            </a>
          </div>
          <div className="footerNote">© {new Date().getFullYear()} Эмоциональный баланс</div>
        </div>
      </footer>
    </>
  );
}

