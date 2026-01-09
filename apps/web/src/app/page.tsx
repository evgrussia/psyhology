import { GetHomepageModelUseCase } from '../application/homepage/GetHomepageModelUseCase';
import { StaticHomepageRepository } from '../infrastructure/homepage/StaticHomepageRepository';
import { Homepage } from '../presentation/homepage/Homepage';

export default async function HomePage() {
  const isEnabled = process.env.NEXT_PUBLIC_HOMEPAGE_V1_ENABLED !== 'false';

  if (!isEnabled) {
    return (
      <main id="content">
        <h1>Эмоциональный баланс</h1>
        <p>Каркас проекта (homepage v1 выключен фича‑флагом).</p>
      </main>
    );
  }

  const useCase = new GetHomepageModelUseCase(new StaticHomepageRepository());
  const model = await useCase.execute({ locale: 'ru' });

  return <Homepage model={model} />;
}
