import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Select } from './Select/Select';
import { SelectAsync } from './SelectAsync/SelectAsync';
import { SelectCreatable } from './SelectCreatable/SelectCreatable';

// react-select is replaced by a stub that exposes its props: these specs cover the
// wrappers' own logic (limits, debouncing, labels), not react-select itself.
const mockProps: Record<string, any> = {};
jest.mock('react-select', () => {
  const passthrough = ({ children }: any) => <span>{children}</span>;
  return {
    __esModule: true,
    default: (props: any) => {
      mockProps.select = props;
      return <div data-testid="stub-select" />;
    },
    components: {
      DropdownIndicator: passthrough,
      ClearIndicator: passthrough,
      MultiValueRemove: passthrough,
    },
  };
});
jest.mock('react-select/async', () => ({
  __esModule: true,
  default: (props: any) => {
    mockProps.async = props;
    return <div data-testid="stub-async" />;
  },
}));
jest.mock('react-select/async-creatable', () => ({
  __esModule: true,
  default: (props: any) => {
    mockProps.creatable = props;
    return <div data-testid="stub-creatable" />;
  },
}));

const options = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
];

describe('Select', () => {
  const base = {
    id: 'sel',
    name: 'sel',
    title: 'Titre',
    value: null as any,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when hidden', () => {
    const { container } = render(<Select {...base} options={options} hidden />);

    expect(container).toBeEmptyDOMElement();
  });

  it('uses the title as placeholder unless the label is shown', () => {
    const { unmount } = render(<Select {...base} options={options} />);
    expect(mockProps.select.placeholder).toBe('Titre');
    unmount();

    render(
      <Select {...base} options={options} showLabel placeholder="Choisir" />
    );
    expect(screen.getByText('Titre')).toBeInTheDocument();
    expect(mockProps.select.placeholder).toBe('Choisir');
  });

  it('falls back on a default placeholder without title nor placeholder', () => {
    render(
      <Select {...base} title={undefined as any} options={options} showLabel />
    );

    expect(mockProps.select.placeholder).toBe('Sélectionnez dans la liste...');
    expect(mockProps.select.noOptionsMessage()).toBe('Aucun résultat');
  });

  it('forwards the selected value (single or multiple) to onChange', () => {
    const { unmount } = render(<Select {...base} options={options} />);
    mockProps.select.onChange(options[0]);
    expect(base.onChange).toHaveBeenCalledWith(options[0]);
    unmount();

    render(<Select {...base} options={options} isMulti />);
    mockProps.select.onChange(options);
    expect(base.onChange).toHaveBeenLastCalledWith(options);
  });

  it('passes a null value when empty and shows the error', () => {
    render(
      <Select
        {...base}
        options={options}
        error={{ type: 'required', message: 'Obligatoire' }}
        disabled
      />
    );

    expect(mockProps.select.value).toBeNull();
    expect(mockProps.select.isDisabled).toBe(true);
    expect(screen.getByText('Obligatoire')).toBeInTheDocument();
  });
});

describe('SelectAsync', () => {
  const onChange = jest.fn();
  const loadOptions = jest.fn();
  const base = {
    id: 'sa',
    name: 'sa',
    title: 'Async',
    value: null as any,
    onChange,
    loadOptions,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing when hidden', () => {
    const { container } = render(<SelectAsync {...base} hidden />);

    expect(container).toBeEmptyDOMElement();
  });

  it('loads the options on focus and uses them as default options', () => {
    loadOptions.mockImplementation((cb) => cb(options));
    render(<SelectAsync {...base} />);

    act(() => {
      mockProps.async.onFocus();
    });

    expect(loadOptions).toHaveBeenCalledWith(expect.any(Function), '');
    expect(mockProps.async.defaultOptions).toEqual(options);
    expect(mockProps.async.isLoading).toBe(false);
  });

  it('debounces the search by 500 ms and only answers the latest request', () => {
    loadOptions.mockImplementation((cb, input) =>
      cb([{ value: input, label: input }])
    );
    render(<SelectAsync {...base} />);
    const callback = jest.fn();

    act(() => {
      mockProps.async.loadOptions('a', callback);
      mockProps.async.loadOptions('ab', callback);
    });
    expect(mockProps.async.isLoading).toBe(true);
    expect(loadOptions).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(loadOptions).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([{ value: 'ab', label: 'ab' }]);
    expect(mockProps.async.isLoading).toBe(false);
  });

  it('ignores the answer of a request superseded by a focus', () => {
    let pending: ((o: any[]) => void) | undefined;
    loadOptions.mockImplementation((cb) => {
      pending = cb;
    });
    render(<SelectAsync {...base} />);
    const callback = jest.fn();

    act(() => {
      mockProps.async.loadOptions('a', callback);
      jest.advanceTimersByTime(500);
    });
    act(() => {
      mockProps.async.onFocus();
    });
    act(() => {
      pending?.(options);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('forwards single and multiple selections', () => {
    const { unmount } = render(<SelectAsync {...base} />);
    mockProps.async.onChange(options[0]);
    expect(onChange).toHaveBeenCalledWith(options[0]);
    unmount();

    render(<SelectAsync {...base} isMulti />);
    mockProps.async.onChange(options);
    expect(onChange).toHaveBeenLastCalledWith(options);
    expect(mockProps.async.noOptionsMessage()).toBe('Aucun résultat');
    expect(mockProps.async.loadingMessage()).toBe('Chargement...');
  });

  it('shows the label and the error', () => {
    render(
      <SelectAsync
        {...base}
        showLabel
        error={{ type: 'required', message: 'Erreur' }}
      />
    );

    expect(screen.getByText('Async')).toBeInTheDocument();
    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(mockProps.async.value).toBeNull();
  });
});

describe('SelectCreatable', () => {
  const onChange = jest.fn();
  const base = {
    id: 'sc',
    name: 'sc',
    title: 'Créer',
    value: null as any,
    onChange,
    options,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing when hidden', () => {
    const { container } = render(<SelectCreatable {...base} hidden />);

    expect(container).toBeEmptyDOMElement();
  });

  it('answers searches with the static options when there is no loader', () => {
    render(<SelectCreatable {...base} />);
    const callback = jest.fn();

    mockProps.creatable.loadOptions('x', callback);

    expect(callback).toHaveBeenCalledWith(options);
  });

  it('loads the default options through the loader, then debounces searches', () => {
    const loadOptions = jest.fn((cb, input) =>
      cb([{ value: `r-${input}`, label: input }])
    );
    render(<SelectCreatable {...base} loadOptions={loadOptions} />);

    expect(loadOptions).toHaveBeenCalledWith(expect.any(Function), '');
    expect(mockProps.creatable.defaultOptions).toEqual([
      { value: 'r-', label: '' },
    ]);

    const callback = jest.fn();
    act(() => {
      mockProps.creatable.loadOptions('ab', callback);
    });
    expect(mockProps.creatable.isLoading).toBe(true);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledWith([{ value: 'r-ab', label: 'ab' }]);
    expect(mockProps.creatable.isLoading).toBe(false);
  });

  it('drops the answer of a superseded search', () => {
    const resolvers: ((o: any[]) => void)[] = [];
    const loadOptions = jest.fn((cb, input) => {
      if (input !== '') {
        resolvers.push(cb);
      } else {
        cb([]);
      }
    });
    render(<SelectCreatable {...base} loadOptions={loadOptions} />);
    const first = jest.fn();
    const second = jest.fn();

    act(() => {
      mockProps.creatable.loadOptions('a', first);
      jest.advanceTimersByTime(500);
    });
    act(() => {
      mockProps.creatable.loadOptions('ab', second);
      jest.advanceTimersByTime(500);
    });
    act(() => {
      resolvers[0]([{ value: '1', label: '1' }]);
      resolvers[1]([{ value: '2', label: '2' }]);
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith([{ value: '2', label: '2' }]);
  });

  describe('item limit', () => {
    it('shows the remaining items and accepts selections within the limit', () => {
      render(
        <SelectCreatable
          {...base}
          isMulti
          maxItems={3}
          value={[options[0]] as any}
        />
      );

      expect(screen.getByText('2 éléments restants')).toBeInTheDocument();
      mockProps.creatable.onChange([options[0], options[1]]);
      expect(onChange).toHaveBeenCalledWith([options[0], options[1]]);
    });

    it('uses the singular for one remaining item', () => {
      render(
        <SelectCreatable
          {...base}
          isMulti
          maxItems={2}
          value={[options[0]] as any}
        />
      );

      expect(screen.getByText('1 élément restant')).toBeInTheDocument();
    });

    it('refuses a selection beyond the limit but accepts removals', () => {
      const three = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
      ];
      render(
        <SelectCreatable
          {...base}
          isMulti
          maxItems={2}
          value={three.slice(0, 2) as any}
        />
      );

      mockProps.creatable.onChange(three);
      expect(onChange).not.toHaveBeenCalled();

      mockProps.creatable.onChange(three.slice(0, 1));
      expect(onChange).toHaveBeenCalledWith(three.slice(0, 1));
    });

    it('reports when the limit is exceeded and says so', () => {
      const setIsMaxItemsReached = jest.fn();
      render(
        <SelectCreatable
          {...base}
          isMulti
          maxItems={1}
          setIsMaxItemsReached={setIsMaxItemsReached}
          value={options as any}
        />
      );

      expect(
        screen.getByText('Limite dépassée de 1 élément(s)')
      ).toBeInTheDocument();
      expect(setIsMaxItemsReached).toHaveBeenLastCalledWith(true);
    });

    it('reports that the limit is not reached otherwise', () => {
      const setIsMaxItemsReached = jest.fn();
      render(
        <SelectCreatable
          {...base}
          isMulti
          maxItems={5}
          setIsMaxItemsReached={setIsMaxItemsReached}
          value={[options[0]] as any}
        />
      );

      expect(setIsMaxItemsReached).toHaveBeenLastCalledWith(false);
    });

    it('offers to create only while below the limit', () => {
      const { unmount } = render(
        <SelectCreatable
          {...base}
          isMulti
          maxItems={2}
          value={[options[0]] as any}
        />
      );
      expect(mockProps.creatable.formatCreateLabel('xyz')).toBe('Créer "xyz"');
      unmount();

      render(
        <SelectCreatable
          {...base}
          isMulti
          maxItems={1}
          value={[options[0]] as any}
        />
      );
      expect(mockProps.creatable.formatCreateLabel('xyz')).toBe(
        'Vous avez atteint le maximum'
      );
    });
  });

  describe('new option validation', () => {
    it('rejects blank input', () => {
      render(<SelectCreatable {...base} />);

      expect(mockProps.creatable.isValidNewOption('   ')).toBe(false);
      expect(mockProps.creatable.isValidNewOption('ok')).toBe(true);
    });

    it('enforces the maximum number of characters', () => {
      render(<SelectCreatable {...base} maxChar={5} />);

      expect(
        screen.getByText('Chaque élément ne doit pas dépasser 5 caractères.')
      ).toBeInTheDocument();
      expect(mockProps.creatable.isValidNewOption('abcd')).toBe(true);
      expect(mockProps.creatable.isValidNewOption('abcde')).toBe(false);
    });
  });

  it('forwards any selection when there is no limit, and shows the error', () => {
    render(
      <SelectCreatable
        {...base}
        error={{ type: 'required', message: 'Oups' }}
        showLabel
      />
    );

    mockProps.creatable.onChange(options);
    expect(onChange).toHaveBeenCalledWith(options);
    expect(screen.getByText('Créer')).toBeInTheDocument();
    expect(screen.getByText('Oups')).toBeInTheDocument();
    expect(mockProps.creatable.noOptionsMessage()).toBe('Aucun résultat');
  });

  it('falls back on a default placeholder', () => {
    render(<SelectCreatable {...base} title={undefined as any} showLabel />);

    expect(mockProps.creatable.placeholder).toBe(
      'Selectionnez dans la liste...'
    );
  });
});
