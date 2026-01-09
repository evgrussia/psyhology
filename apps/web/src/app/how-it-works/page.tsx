export default function HowItWorksPage() {
  return (
    <main className="container" id="content">
      <h1>Как проходит консультация</h1>
      <p className="lead">
        Здесь будет описание процесса: структура, формат, правила отмен/переноса и что ожидать на первой встрече.
      </p>
      <div className="ctaRow" aria-label="Действия">
        <a className="btn btnPrimary" href="/booking/">
          Запись
        </a>
        <a className="btn btnSecondary" href="/about/">
          О психологе
        </a>
      </div>
    </main>
  );
}

