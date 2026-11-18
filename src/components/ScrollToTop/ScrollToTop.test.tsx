import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ScrollToTop } from './ScrollToTop';

// jsdom не даёт управлять scrollY напрямую, поэтому переопределяем свойство
function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    writable: true,
    value,
  });
}

// Хелпер: имитирует прокрутку и дожидается эффектов React
function scrollTo(value: number) {
  setScrollY(value);
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

describe('ScrollToTop', () => {
  let scrollToSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    setScrollY(0);
    scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    scrollToSpy.mockRestore();
  });

  it('не рендерит кнопку при scrollY = 0', () => {
    render(<ScrollToTop />);

    expect(screen.queryByRole('button', { name: 'Наверх' })).not.toBeInTheDocument();
  });

  it('показывает кнопку, когда scrollY > 300', () => {
    render(<ScrollToTop />);

    scrollTo(301);

    expect(screen.getByRole('button', { name: 'Наверх' })).toBeInTheDocument();
  });

  it('не показывает кнопку ровно на границе 300', () => {
    render(<ScrollToTop />);

    scrollTo(300);

    expect(screen.queryByRole('button', { name: 'Наверх' })).not.toBeInTheDocument();
  });

  it('скрывает кнопку при обратном скролле до 300 или меньше', () => {
    render(<ScrollToTop />);

    scrollTo(400);
    expect(screen.getByRole('button', { name: 'Наверх' })).toBeInTheDocument();

    scrollTo(100);
    expect(screen.queryByRole('button', { name: 'Наверх' })).not.toBeInTheDocument();
  });

  it('вызывает window.scrollTo({ top: 0, behavior: "smooth" }) по клику', async () => {
    const user = userEvent.setup();
    render(<ScrollToTop />);

    scrollTo(500);
    await user.click(screen.getByRole('button', { name: 'Наверх' }));

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
  });

  it('снимает обработчик scroll при размонтировании', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ScrollToTop />);

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeSpy.mockRestore();
  });

  it('не обновляет состояние и не падает при scroll после размонтирования', () => {
    const { unmount } = render(<ScrollToTop />);
    unmount();

    // Если обработчик не снят, это вызовет setState на размонтированном
    // компоненте — React 19 в dev-режиме ругается в консоль.
    expect(() => scrollTo(500)).not.toThrow();
  });
});
