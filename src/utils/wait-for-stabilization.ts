/**
 * Функция выполняется до тех пор, пока значение, возвращаемое функцией `getValue`, продолжает
 * изменяться от проверки к проверке через заданный интервал `gap`. Либо до тех пор, пока не истечёт
 * время, указанное в `timeout`.
 * @param getValue Функция, возвращающая значение, изменение которого нужно проверять.
 * @param equals Функция, сверяющая предыдущее и текущее значение, возвращаемое функцией `getValue`.
 * @param gap Временной интервал в миллисекундах, через который осуществляется повторная проверка.
 * @param timeout Время, через которое выполнение функции будет принудительно завершено не смотря
 * на продолжающееся изменение значения.
 */
export async function waitForStabilization<T>(
  getValue: () => T | Promise<T>,
  equals: (v1: T, v2: T) => boolean,
  gap: number,
  timeout?: number,
): Promise<void> {
  if (timeout !== undefined && timeout < gap) {
    timeout = gap;
  }

  const startAt = Date.now();
  let previousValue = await Promise.resolve(getValue());

  while(true) {
    await new Promise((resolve) => setTimeout(resolve, gap));
    const currentValue = await Promise.resolve(getValue());

    if (equals(previousValue, currentValue)) {
      return;
    }

    if (timeout !== undefined && Date.now() - startAt > timeout) {
      return;
    }

    previousValue = currentValue;
  }
}
