export default async function TopicLandingPage(props: { params: Promise<{ topic: string }> }) {
  const { topic } = await props.params;

  return (
    <main className="container" id="content">
      <h1>Тема: {topic}</h1>
      <p className="lead">
        Здесь будет лендинг темы (контент из CMS, FEAT-CNT-01): признаки, “что попробовать сейчас”, доверие и CTA.
      </p>
      <div className="ctaRow" aria-label="Действия">
        <a className="btn btnPrimary" href="/booking/">
          Запись
        </a>
        <a className="btn btnSecondary" href="/start/first-step/">
          Первый шаг
        </a>
      </div>
    </main>
  );
}

