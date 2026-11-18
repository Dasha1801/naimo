import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { QueryState } from './QueryState';

describe('QueryState', () => {
  describe('type = "loading"', () => {
    it('рендерит 3 скелетон-карточки с корректной aria-разметкой', () => {
      const { container } = render(<QueryState type="loading" />);

      const wrapper = screen.getByLabelText('Загрузка');
      expect(wrapper).toHaveAttribute('aria-busy', 'true');

      // 3 карточки — проверяем по прямому ребёнку-контейнеру скелетонов
      const cards = wrapper.querySelectorAll(':scope > div');
      expect(cards).toHaveLength(3);

      // Каждая карточка содержит аватар, контент и блок зарплаты
      cards.forEach((card) => {
        expect(card.children).toHaveLength(2); 
      });

      expect(container.firstChild).toBe(wrapper);
    });

    it('игнорирует title, description, action и children', () => {
      const onClick = vi.fn();
      render(
        <QueryState
          type="loading"
          title="Не должно быть"
          description="И это тоже"
          action={{ label: 'Не должно быть', onClick }}
        >
          <span>children не рендерится</span>
        </QueryState>,
      );

      expect(screen.queryByText('Не должно быть')).not.toBeInTheDocument();
      expect(screen.queryByText('И это тоже')).not.toBeInTheDocument();
      expect(screen.queryByText('children не рендерится')).not.toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('type = "error"', () => {
    it('рендерит alert с дефолтным заголовком и иконкой AlertCircle', () => {
      const { container } = render(<QueryState type="error" />);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Произошла ошибка');
      expect(container.querySelector('.lucide-alert-circle')).toBeInTheDocument();
    });

    it('рендерит кастомный title и description', () => {
      render(
        <QueryState type="error" title="Не удалось загрузить" description="Попробуйте позже" />,
      );

      expect(screen.getByText('Не удалось загрузить')).toBeInTheDocument();
      expect(screen.getByText('Попробуйте позже')).toBeInTheDocument();
    });

    it('не рендерит description, если он не передан', () => {
      const { container } = render(<QueryState type="error" />);

      // description — единственный <p> внутри state; если его нет — запрос пуст
      expect(container.querySelector('p')).toBeNull();
    });
  });

  describe('type = "empty"', () => {
    it('рендерит status с дефолтным заголовком и иконкой BriefcaseBusiness', () => {
      const { container } = render(<QueryState type="empty" />);

      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Нет данных');
      expect(container.querySelector('.lucide-briefcase-business')).toBeInTheDocument();
    });

    it('рендерит кастомный title и description', () => {
      render(<QueryState type="empty" title="Пока пусто" description="Загляните позже" />);

      expect(screen.getByText('Пока пусто')).toBeInTheDocument();
      expect(screen.getByText('Загляните позже')).toBeInTheDocument();
    });
  });

  describe('action', () => {
    it('рендерит кнопку с label и вызывает onClick по клику', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<QueryState type="error" action={{ label: 'Попробовать снова', onClick }} />);

      const button = screen.getByRole('button', { name: /Попробовать снова/ });
      expect(button).not.toBeDisabled();

      await user.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('показывает «Загрузка...», блокирует кнопку и крутит иконку при action.loading', () => {
      render(
        <QueryState
          type="error"
          action={{ label: 'Попробовать снова', onClick: vi.fn(), loading: true }}
        />,
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Загрузка...');
      expect(button).not.toHaveTextContent('Попробовать снова');

      const refreshIcon = button.querySelector('.lucide-refresh-cw');
      expect(refreshIcon).toBeInTheDocument();
      expect(refreshIcon?.getAttribute('class')).toMatch(/spinning/);
    });

    it('не рендерит кнопку, если action не передан', () => {
      render(<QueryState type="error" />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('children', () => {
    it('рендерит children в ветке error', () => {
      render(
        <QueryState type="error">
          <span>Дополнительный контент</span>
        </QueryState>,
      );

      expect(screen.getByText('Дополнительный контент')).toBeInTheDocument();
    });

    it('рендерит children в ветке empty', () => {
      render(
        <QueryState type="empty">
          <span>Дополнительный контент</span>
        </QueryState>,
      );

      expect(screen.getByText('Дополнительный контент')).toBeInTheDocument();
    });
  });
});
