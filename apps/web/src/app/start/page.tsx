export default function StartHubPage() {
  return (
    <main className="container" id="content">
      <h1>С чего начать</h1>
      <p className="lead">Выберите короткий формат — можно начать без записи и без контакта.</p>

      <ul className="linkList" aria-label="Интерактивы">
        <li>
          <a className="linkCard" href="/start/first-step/">
            Первый шаг (1–3 минуты)
          </a>
        </li>
        <li>
          <a className="linkCard" href="/start/navigator/">
            Навигатор состояния
          </a>
        </li>
        <li>
          <a className="linkCard" href="/start/quizzes/">
            Мини‑диагностики (квизы)
          </a>
        </li>
      </ul>
    </main>
  );
}

