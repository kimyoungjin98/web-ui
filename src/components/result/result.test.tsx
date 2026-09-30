import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Result } from './result';

test('renders the result title as a level-two heading', () => {
  render(<Result title="다시 시도해 주세요" />);

  expect(screen.getByRole('heading', { level: 2, name: '다시 시도해 주세요' })).toBeInTheDocument();
});

test('hides the figure from assistive technology', () => {
  render(<Result figure={<img src="/error.png" alt="오류 그림" />} title="오류" />);

  expect(screen.queryByRole('img', { name: '오류 그림' })).toBeNull();
});

test('omits optional regions when they are not supplied', () => {
  const { container } = render(<Result title="완료" />);

  expect(container.querySelector('[data-result-figure]')).toBeNull();
  expect(container.querySelector('[data-result-description]')).toBeNull();
  expect(container.querySelector('[data-result-button]')).toBeNull();
});

test('Result.Button is full width and preserves disabled button behavior', async () => {
  const onClick = vi.fn();
  const user = userEvent.setup();
  render(
    <Result
      title="오류"
      button={
        <Result.Button disabled onClick={onClick}>
          다시 시도
        </Result.Button>
      }
    />,
  );

  const button = screen.getByRole('button', { name: '다시 시도' });
  expect(button).toBeDisabled();
  expect(button).toHaveClass('ds:w-full');
  await user.click(button);
  expect(onClick).not.toHaveBeenCalled();
});
